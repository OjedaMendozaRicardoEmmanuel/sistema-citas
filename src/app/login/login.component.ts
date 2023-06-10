import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../services/models/usuario';
import { ApiService } from '../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {

  hide = true;
  form: FormGroup;
  usuarios = [{ usuario: '', contrasenia: '', rol: '' }];

  usuario: Usuario = {
    id: 0,
    nombre: '',
    apellidop: '',
    apellidom: '',
    email: '',
    genero: '',
    password: '',
    estado: 0,
  };

  invalid = '';

  constructor(
    private messageService: MessageService,
    private apiService:ApiService,
    private router: Router
  ) {
    this.form = new FormGroup({
      email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
      password: new FormControl(this.usuario.password, [
        Validators.required,
      ]),
    });
  }
  ngOnInit(): void {

  }

  login() {
    if (this.form.valid) {
      this.usuario = this.form.value;
      console.log(this.usuario);
      this.apiService.login(this.usuario).subscribe(
        (respose) => {

          this.router.navigate([`panel`]);
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al iniciar sesión',
            detail: 'usuario o contraseña incorrectos',
          });
        }
      );
    }  else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al iniciar sesión',
        detail: 'Por favor ingrese todos los datos!',
      });
    }
  }
  registro() {
    this.router.navigate([`registro`]);
  }
}
