import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Paciente } from 'src/app/services/models/paciente';
import { ViewChild } from '@angular/core';

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

  @ViewChild('dataTable') dataTable: any;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.apiService.getAllPacientes().subscribe((res) => {
      this.pacientes = res;
    });
    this.formGroup = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      apellidop: new FormControl('', [Validators.required]),
      apellidom: new FormControl(' '),
      genero: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required]),
      estado: new FormControl(''),
    });
  }

  mostrarAgregar() {
    this.formGroup.reset();
    this.agregarDialog = true;
    console.log('dialog');
  }

  // Método para refrescar la tabla
  public refreshTable(): void {
    this.dataTable.reset();
  }

  agregar() {
    // Verificar si ya existe un usuario con el mismo correo
    const usuarioExistente = this.pacientes.find(
      (usuario) => usuario.correo === this.formGroup.get('correo')?.value
    );
    if (usuarioExistente) {
      alert(
        `El correo ${this.formGroup.get('correo')?.value} ya esta registrado`
      );
    }

    this.formGroup.get('estado')?.setValue(1);
    if (this.formGroup.valid && !usuarioExistente) {
      this.apiService.createPaciente(this.formGroup.value).subscribe((res) => {
        this.pacientes.push(res);
        this.refreshTable()
        this.agregarDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Se agrego un nuevo registro',
          detail: 'PX-'+res.id,
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Por favor ingrese todos los datos!',
      });
    }
  }

  mostrarModificar(paciente: Paciente) {
    this.formGroup.setValue(paciente);
    console.log(this.formGroup.value);
    this.modificarDialog = true;
    console.log('dialog');
  }

  modificar() {
    if (this.formGroup.valid) {
      this.updatePX(this.formGroup.value);
      this.modificarDialog = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Por favor ingrese todos los datos!',
      });
    }
  }

  eliminarPaciente(paciente: Paciente) {
    if (confirm(`Desea eliminar al paciente ${paciente.nombre}?`)) {
      this.eliminarPX(paciente);
    }
  }

  calcularEdad(fechaNacimiento: string) {
    const hoy = moment();
    const edad = hoy.diff(fechaNacimiento, 'years');
    return edad;
  }

  btnCancelar() {
    this.formGroup.reset();
    this.agregarDialog = false;
  }

  btnCancelarM() {
    this.formGroup.reset();
    this.modificarDialog = false;
  }

  // Actualizar un usuario existente
  updatePX(px: Paciente): void {
    this.apiService.updatePaciente(px.id, px).subscribe((updatedUser) => {
      const index = this.pacientes.findIndex((u) => u.id === updatedUser.id);
      this.pacientes[index] = updatedUser;
      this.messageService.add({
        severity: 'success',
        summary: 'Se actualizaron los datos',
        detail: 'PX-'+updatedUser.id,
      });
    });
  }

  eliminarPX(px: Paciente) {
    this.apiService.deletePaciente(px.id).subscribe(() => {
      this.pacientes = this.pacientes.filter((u) => u.id !== px.id);
      this.messageService.add({
        severity: 'error',
        summary: 'Eliminado correctamente',
        detail: 'PX-'+px.id,
      });
    });
  }

}
