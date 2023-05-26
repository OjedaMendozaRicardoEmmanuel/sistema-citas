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

  valCorreo: any = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

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
      correo:new FormControl('', [Validators.required, Validators.pattern(this.valCorreo)]),
      estatus:new FormControl('', [Validators.required]),
    });
  }

  mostrarAgregar() {
    this.agregarDialog = true;
    console.log('dialog');
  }

  agregar() {

    this.formGroup.get('id')?.setValue(this.getNextId(this.pacientes[this.pacientes.length-1].id));
    this.formGroup.get('estatus')?.setValue('true');

    if(this.formGroup.invalid){
      console.log(this.formGroup.value);
      return Object.values(this.formGroup.controls).forEach(control=>{
        control.markAllAsTouched();
      })
      
    }

    if(this.formGroup.valid){
      console.log(this.formGroup.value);
      this.compartirDatos.agregarPaciente(this.formGroup.value);
      this.agregarDialog = false;
      this.formGroup.reset();
      
    }

  }

  mostrarModificar(paciente: Paciente) {
    this.formGroup.setValue(paciente);
    console.log(this.formGroup.value);
    this.modificarDialog = true;
    console.log('dialog');
  }

  modificar(){

    if(this.formGroup.invalid){
      console.log(this.formGroup.value);
      return Object.values(this.formGroup.controls).forEach(control=>{
        control.markAllAsTouched();
      })
      
    }else{

      this.compartirDatos.modificarPaciente(this.formGroup.get('id')?.value, this.formGroup.value);
      this.formGroup.reset();
      this.modificarDialog = false;
    }
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

  btnCancelar(){
    this.formGroup.reset();
    this.agregarDialog = false;
  }

  btnCancelarM(){
    this.formGroup.reset();
    this.modificarDialog = false;
  }

  get nombreNoValido(){
    return this.formGroup.get('nombre')?.invalid && this.formGroup.get('nombre')?.touched;
  }
  get apellidosNoValido(){
    return this.formGroup.get('apellidos')?.invalid && this.formGroup.get('apellidos')?.touched;
  }
  get fechaNoValido(){
    return this.formGroup.get('fecha_nacimiento')?.invalid && this.formGroup.get('fecha_nacimiento')?.touched;
  }
  get sexoNoValido(){
    return this.formGroup.get('sexo')?.invalid && this.formGroup.get('sexo')?.touched;
  }
  get telefonoNoValido(){
    return this.formGroup.get('telefono')?.invalid && this.formGroup.get('telefono')?.touched;
  }
  get correoNoValido(){
    return this.formGroup.get('correo')?.invalid && this.formGroup.get('correo')?.touched;
  }
  
  /*get estatusNoValido(){
    return this.formGroup.get('estatus')?.invalid && this.formGroup.get('estatus')?.touched;
  }*/
}
