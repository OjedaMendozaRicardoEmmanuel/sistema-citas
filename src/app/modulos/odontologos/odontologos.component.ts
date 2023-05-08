import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompartirDatosService } from 'src/app/services/compartir-datos.service';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Odontologo } from 'src/app/services/models/Odontologo';

@Component({
  selector: 'app-odontologos',
  templateUrl: './odontologos.component.html',
  styleUrls: ['./odontologos.component.css'],
  providers: [MessageService],
})
export class OdontologosComponent {
  agregarDialog: boolean = false;
  modificarDialog: boolean = false;

  odontologos: Odontologo[] = [];
  formGroup: FormGroup;

  constructor(
    private messageService: MessageService,
    private compartirDatos: CompartirDatosService
  ) {
    this.odontologos = compartirDatos.getOdontologos();
    this.formGroup = new FormGroup({
      id:new FormControl('', [Validators.required]),
      nombre:new FormControl('', [Validators.required]),
      apellidos:new FormControl('', [Validators.required]),
      fecha_nacimiento:new FormControl('', [Validators.required]),
      sexo:new FormControl('', [Validators.required]),
      especialidad:new FormControl('', [Validators.required]),
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
    this.formGroup.get('id')?.setValue(this.getNextId(this.odontologos[this.odontologos.length-1].id));
    console.log(this.formGroup.value);
    this.compartirDatos.agregarOdontologo(this.formGroup.value);
    this.agregarDialog = false;
    this.formGroup.reset();
  }

  mostrarModificar(odontologo: Odontologo) {
    this.formGroup.setValue(odontologo);
    console.log(this.formGroup.value);
    this.modificarDialog = true;
    console.log('dialog');
  }

  modificar(){
    this.compartirDatos.modificarOdontologo(this.formGroup.get('id')?.value, this.formGroup.value);
    this.formGroup.reset();
    this.modificarDialog = false;
  }

  eliminarOdontologo(odontologo: Odontologo) {
    this.compartirDatos.eliminarOdontologo(odontologo.id);
    this.odontologos = this.compartirDatos.getOdontologos();
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminado correctamente',
      detail: odontologo.nombre,
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
    return `ODT-${nextNum.toString().padStart(3, '0')}`;
  }

}
