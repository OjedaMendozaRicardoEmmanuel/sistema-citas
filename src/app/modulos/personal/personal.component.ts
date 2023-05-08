import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompartirDatosService } from 'src/app/services/compartir-datos.service';
import { Personal } from 'src/app/services/models/Personal';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
  providers: [MessageService],
})
export class PersonalComponent {

  agregarDialog: boolean = false;
  modificarDialog: boolean = false;

  personal: Personal[] = [];
  formGroup: FormGroup;

  constructor(
    private messageService: MessageService,
    private compartirDatos: CompartirDatosService
  ) {
    this.personal = compartirDatos.getPersonal();
    this.formGroup = new FormGroup({
      id:new FormControl('', [Validators.required]),
      nombre:new FormControl('', [Validators.required]),
      apellidos:new FormControl('', [Validators.required]),
      fecha_nacimiento:new FormControl('', [Validators.required]),
      sexo:new FormControl('', [Validators.required]),
      telefono:new FormControl('', [Validators.required]),
      correo:new FormControl('', [Validators.required]),
      cargo:new FormControl('', [Validators.required]),
      estatus:new FormControl('', [Validators.required]),
    });
  }

  agregarUsuario() {
    this.agregarDialog = true;
    console.log('dialog');
  }

  agregar() {
    this.formGroup.get('id')?.setValue(this.getNextId(this.personal[this.personal.length-1].id));
    console.log(this.formGroup.value);
    this.compartirDatos.agregarPersonal(this.formGroup.value);
    this.agregarDialog = false;
    this.formGroup.reset();
  }

  modificar(){
    this.compartirDatos.modificarPersonal(this.formGroup.get('id')?.value, this.formGroup.value);
    this.formGroup.reset();
    this.modificarDialog = false;
  }

  getNextId(lastId: string): string {
    const lastNum = parseInt(lastId.split('-')[1]);
    const nextNum = lastNum + 1;
    return `PER-${nextNum.toString().padStart(3, '0')}`;
  }

  editarUsuario(personal: Personal) {
    this.formGroup.setValue(personal);
    console.log(this.formGroup.value);
    this.modificarDialog = true;
    console.log('dialog');
  }

  eliminarUsuario(personal: Personal) {
    this.compartirDatos.eliminarPersonal(personal.id);
    this.personal = this.compartirDatos.getPersonal();
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminado correctamente',
      detail: personal.nombre,
    });
  }

  calcularEdad(fechaNacimiento: string) {
    const hoy = moment();
    const edad = hoy.diff(fechaNacimiento, 'years');
    return edad;
  }
}
