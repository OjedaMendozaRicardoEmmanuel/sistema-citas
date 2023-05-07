import { Injectable } from '@angular/core';
import { Personal } from './models/Personal';
import { Odontologo } from './models/Odontologo';
import { Paciente } from './models/Paciente';

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
      email: 'juan.perez@example.com',
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
      email: 'maria.garcia@example.com',
      estatus: true,
    },];

    private pacientes: Paciente[] = [
      {
        id: 'pac-001',
        nombre: 'Ana',
        apellidos: 'López',
        fecha_nacimiento: '1995-02-15',
        sexo: 'Femenino',
        telefono: '555-1111',
        email: 'ana.lopez@example.com',
        estatus: true,
      },
      {
        id: 'pac-002',
        nombre: 'Pedro',
        apellidos: 'Gómez',
        fecha_nacimiento: '1988-08-20',
        sexo: 'Masculino',
        telefono: '555-2222',
        email: 'pedro.gomez@example.com',
        estatus: true,
      },
    ];



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


}
