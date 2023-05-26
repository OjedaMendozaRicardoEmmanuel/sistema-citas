import { Injectable } from '@angular/core';
import { Personal } from './models/Personal';
import { Odontologo } from './models/Odontologo';
import { Paciente } from './models/Pacientes';

@Injectable({
  providedIn: 'root'
})

export class CompartirDatosService {
  private datos=[];

  private user=[{usuario:'',contrasenia:'',rol:''}];

  private personal:Personal[] = [
    {
      id: "PER-001",
      nombre: "Juan",
      apellidos: "Pérez González",
      fecha_nacimiento: "1990-06-15",
      sexo: "Masculino",
      telefono: "555-1234",
      correo: "juan.perez@gmail.com",
      cargo: "Contador",
      estatus: true
    },
    {
      id: "PER-002",
      nombre: "María",
      apellidos: "Sánchez Gutiérrez",
      fecha_nacimiento: "1985-02-10",
      sexo: "Femenino",
      telefono: "555-5678",
      correo: "maria.sanchez@hotmail.com",
      cargo: "Recepcionista",
      estatus: true
    }];

  private odontologos: Odontologo[] = [
    {
      id: 'ODT-001',
      nombre: 'Juan',
      apellidos: 'Pérez Hernandez',
      fecha_nacimiento: '1990-01-01',
      sexo: 'Masculino',
      especialidad: 'Ortodoncia',
      telefono: '555-1234',
      correo: 'juan.perez@example.com',
      estatus: true,
    },
    {
      id: 'ODT-002',
      nombre: 'María',
      apellidos: 'García Cruz',
      fecha_nacimiento: '1985-05-05',
      sexo: 'Femenino',
      especialidad: 'Endodoncia',
      telefono: '555-5678',
      correo: 'maria.garcia@example.com',
      estatus: true,
    },];

    private pacientes: Paciente[] = [
      {
        id: 'PX-001',
        nombre: 'Ana',
        apellidos: 'López Perez',
        fecha_nacimiento: '1995-02-15',
        sexo: 'Femenino',
        telefono: '555-1111',
        correo: 'ana.lopez@example.com',
        estatus: true,
      },
      {
        id: 'PX-002',
        nombre: 'Pedro',
        apellidos: 'Gómez Lopez',
        fecha_nacimiento: '1988-08-20',
        sexo: 'Masculino',
        telefono: '555-2222',
        correo: 'pedro.gomez@example.com',
        estatus: true,
      },];



  constructor() { }

  setDatos(datos: any) {
    this.datos = datos;
  }

  getDatos() {
    return this.datos;
  }
  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }


  getPersonal(): Personal[] {
    return this.personal;
  }

  // Método para agregar personal
  agregarPersonal(nuevoPersonal: Personal): void {
    this.personal.push(nuevoPersonal);
  }

  // Método para modificar personal
  modificarPersonal(id: string, datos: Partial<Personal>): void {
    const index = this.personal.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.personal[index] = { ...this.personal[index], ...datos };
    }
  }

  // Método para eliminar personal
  eliminarPersonal(id: string): void {
    this.personal = this.personal.filter((p) => p.id !== id);
  }

  getOdontologos(): Odontologo[] {
    return this.odontologos;
  }

  // Método para agregar odontólogo
  agregarOdontologo(nuevoOdontologo: Odontologo): void {
    this.odontologos.push(nuevoOdontologo);
  }

  // Método para modificar odontólogo
  modificarOdontologo(id: string, datos: Partial<Odontologo>): void {
    const index = this.odontologos.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.odontologos[index] = { ...this.odontologos[index], ...datos };
    }
  }

  // Método para eliminar odontólogo
  eliminarOdontologo(id: string): void {
    this.odontologos = this.odontologos.filter((o) => o.id !== id);
  }

  getPacientes(): Paciente[] {
    return this.pacientes;
  }

  // Método para agregar paciente
  agregarPaciente(nuevoPaciente: Paciente): void {
    this.pacientes.push(nuevoPaciente);
  }

  // Método para modificar paciente
  modificarPaciente(id: string, datos: Partial<Paciente>): void {
    const index = this.pacientes.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.pacientes[index] = { ...this.pacientes[index], ...datos };
    }
  }

  // Método para eliminar paciente
  eliminarPaciente(id: string): void {
    this.pacientes = this.pacientes.filter((p) => p.id !== id);
  }
}
