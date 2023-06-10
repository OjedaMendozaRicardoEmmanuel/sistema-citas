import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/services/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import { concat} from 'rxjs';
import { Rol } from 'src/app/services/models/rol';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
  providers: [MessageService],
})
export class PersonalComponent implements OnInit {
  hide = true;
  agregarDialog: boolean = false;
  modificarDialog: boolean = false;

  personal: Usuario[] = [];
  formGroup: FormGroup;
  rol: any = { roles_id: 2 };

  isEmailDisabled: boolean = true;


  valCorreo: any =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {

    this.formGroup = new FormGroup({
      id: new FormControl(0),
      nombre: new FormControl('', [Validators.required]),
      apellidop: new FormControl('', [Validators.required]),
      apellidom: new FormControl(' '),
      email: new FormControl('', [Validators.required, Validators.email]),
      genero: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)]),
      estado: new FormControl(1),
    });
  }
  ngOnInit(): void {
    const getUsersByRoleId1$ = this.apiService.getUsersByRoleId(1);
    const getUsersByRoleId2$ = this.apiService.getUsersByRoleId(2);

    concat(getUsersByRoleId1$, getUsersByRoleId2$).subscribe((usuarios) => {
      usuarios.forEach((element) => {
        this.personal.push(element);
      });
    });
  }

  agregarUsuario() {
    this.formGroup.reset();
    this.agregarDialog = true;
    console.log('dialog');
  }

  agregar() {
    // Verificar si ya existe un usuario con el mismo correo
    const usuarioExistente = this.personal.find(
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
        this.personal.push(res);
        this.agregarRol(res.id,this.rol);
        this.agregarDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Se realizo un nuevo registro',
          detail: 'ID: PER-'+res.id,
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

  modificar() {
    if (this.formGroup.valid) {
      this.updateUser(this.formGroup.value);
      this.modificarDialog = false;
    } else {
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
    if (confirm(`Desea eliminar al personal ${personal.nombre}?`)) {
      this.apiService.deleteUsuario(personal.id).subscribe(() => {
        this.personal = this.personal.filter((u) => u.id !== personal.id);
        this.messageService.add({
          severity: 'error',
          summary: 'Eliminado correctamente',
          detail: 'ID: PER-'+personal.id,
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

  agregarRol(id:number, rol:any){
    this.apiService.addRolToUsuario(id,rol).subscribe(
      res => {console.log(res);
      }, err => console.log(err));
  }

   // Actualizar un usuario existente
   updateUser(user: Usuario): void {
    this.apiService.updateUsuario(user.id, user).subscribe(updatedUser => {
      const index = this.personal.findIndex(u => u.id === updatedUser.id);
      this.personal[index] = updatedUser;
      this.messageService.add({
        severity: 'success',
        summary: 'Se actualizaron los datos',
        detail: 'ID: PER-'+updatedUser.id,
      });
    });
  }

  emailExiste:boolean = false;
  existeEmail() {
    const email = this.formGroup.get('email')?.value;
    const emailRegistrado = this.personal.some(persona => persona.email === email);
    this.emailExiste = emailRegistrado;
  }

  contraValida:boolean = true;
  validarContra(){
    if (this.formGroup.get('password')?.valid) {
      this.contraValida = false;
    }
  }



}
