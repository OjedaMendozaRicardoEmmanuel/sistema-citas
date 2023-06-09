import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/services/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { Doctor } from 'src/app/services/models/doctor';

@Component({
  selector: 'app-odontologos',
  templateUrl: './odontologos.component.html',
  styleUrls: ['./odontologos.component.css'],
  providers: [MessageService],
})
export class OdontologosComponent {
  hide = true;
  agregarDialog: boolean = false;
  modificarDialog: boolean = false;

  odontologos: Usuario[] = [];
  formGroup: FormGroup;
  rol: any = { roles_id: 5 };

  isEmailDisabled: boolean = true;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.apiService.getUsersByRoleId(5).subscribe((res) => {
      this.odontologos = res;
    });

    this.formGroup = new FormGroup({
      id: new FormControl(0),
      nombre: new FormControl('', [Validators.required]),
      apellidop: new FormControl('', [Validators.required]),
      apellidom: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      genero: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)]),
      estado: new FormControl(1),
    });
  }

  agregarUsuario() {
    this.formGroup.reset();
    this.agregarDialog = true;
    console.log('dialog');
  }

  agregar() {
    // Verificar si ya existe un usuario con el mismo correo
    const usuarioExistente = this.odontologos.find(
      (usuario) => usuario.email === this.formGroup.get('email')?.value
    );
    if (usuarioExistente) {
      alert(
        `El correo ${this.formGroup.get('email')?.value} ya esta registrado`
      );
    }

    this.formGroup.get('estado')?.setValue(1);
    if (this.formGroup.valid && !usuarioExistente) {
      this.apiService.createUsuario(this.formGroup.value).subscribe((res) => {
        this.odontologos.push(res);
        this.agregarRol(res.id, this.rol);
        this.agregarOdo(res.id)
        this.agregarDialog = false;
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Por favor ingrese todos los datos!',
      });
    }
  }

  modificar() {
    if (this.formGroup.valid) {
      this.updateUser(this.formGroup.value);
      this.modificarDialog = false;
    }  else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Por favor ingrese todos los datos!',
      });
    }
  }

  editarUsuario(personal: Usuario) {
    this.formGroup.setValue(personal);
    this.modificarDialog = true;
  }

  eliminarUsuario(personal: Usuario) {
    if (confirm(`Desea eliminar al odontólogo ${personal.nombre}?`)) {
      this.apiService.deleteUsuario(personal.id).subscribe((res) => {
        this.odontologos = this.odontologos.filter((u) => u.id !== personal.id);
        this.messageService.add({
          severity: 'error',
          summary: 'Eliminado correctamente',
          detail: 'ID: ODT-' + res.id,
        });
      });
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

  agregarRol(id: number, rol: any) {
    this.apiService.addRolToUsuario(id, rol).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => console.log(err)
    );
  }

  // Actualizar un usuario existente
  updateUser(user: Usuario): void {
    this.apiService.updateUsuario(user.id, user).subscribe((updatedUser) => {
      const index = this.odontologos.findIndex((u) => u.id === updatedUser.id);
      this.odontologos[index] = updatedUser;
      this.messageService.add({
        severity: 'success',
        summary: 'Se actualizaron los datos',
        detail: 'ID: ODT-' + updatedUser.id,
      });
    });
  }

  agregarOdo(id_user:number){
    const odo:Doctor = {id:0, cedula:'',usuarios_id:id_user};
    this.apiService.createDoctor(odo).subscribe(res => {
      console.log(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Se agrego un nuevo registro',
        detail: 'ID: ODT-' + res.id,
      });
    });
  }

  emailExiste:boolean = false;
  existeEmail() {
    const email = this.formGroup.get('email')?.value;
    const emailRegistrado = this.odontologos.some(odo => odo.email === email);
    this.emailExiste = emailRegistrado;
  }
}
