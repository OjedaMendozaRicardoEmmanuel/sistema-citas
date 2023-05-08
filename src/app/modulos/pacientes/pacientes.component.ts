import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompartirDatosService } from 'src/app/services/compartir-datos.service';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Paciente } from 'src/app/services/models/Paciente';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
  providers: [MessageService],
})
export class PacientesComponent {
  agregarDialog: boolean = false;
  modificarDialog: boolean = false;

  pacientes: Paciente[] = [];
  formGroup: FormGroup;

  constructor(
    private messageService: MessageService,
    private compartirDatos: CompartirDatosService
  ) {
    this.pacientes = compartirDatos.getPacientes();
    this.formGroup = new FormGroup({
      id:new FormControl('', [Validators.required]),
      nombre:new FormControl('', [Validators.required]),
      apellidos:new FormControl('', [Validators.required]),
      fecha_nacimiento:new FormControl('', [Validators.required]),
      sexo:new FormControl('', [Validators.required]),
      telefono:new FormControl('', [Validators.required]),
      correo:new FormControl('', [Validators.required]),
      estatus:new FormControl('', [Validators.required]),
    });
  }

  mostrarAgregar() {
    this.agregarDialog = true;
    console.log('dialog');
  }

  agregar() {
    this.formGroup.get('id')?.setValue(this.getNextId(this.pacientes[this.pacientes.length-1].id));
    console.log(this.formGroup.value);
    this.compartirDatos.agregarPaciente(this.formGroup.value);
    this.agregarDialog = false;
    this.formGroup.reset();
  }

  mostrarModificar(paciente: Paciente) {
    this.formGroup.setValue(paciente);
    console.log(this.formGroup.value);
    this.modificarDialog = true;
    console.log('dialog');
  }

  modificar(){
    this.compartirDatos.modificarPaciente(this.formGroup.get('id')?.value, this.formGroup.value);
    this.formGroup.reset();
    this.modificarDialog = false;
  }

  eliminarPaciente(paciente: Paciente) {
    this.compartirDatos.eliminarPaciente(paciente.id);
    this.pacientes = this.compartirDatos.getPacientes();
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminado correctamente',
      detail: paciente.nombre,
    });
  }

  calcularEdad(fechaNacimiento: string) {
    const hoy = moment();
    const edad = hoy.diff(fechaNacimiento, 'years');
    return edad;
  }

  getNextId(lastId: string): string {
    const lastNum = parseInt(lastId.split('-')[1]);
    const nextNum = lastNum + 1;
    return `PX-${nextNum.toString().padStart(3, '0')}`;
  }
}
