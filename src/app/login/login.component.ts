import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompartirDatosService } from '../services/compartir-datos.service';
import { Router } from '@angular/router';
import { Usuario } from '../services/models/usuario';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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
    public compartirDatos: CompartirDatosService,
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
    this.usuarios = this.compartirDatos.getDatos();
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
          alert(`usuario o contraseña incorrectos`);
        }
      );
    }
  }
  registro() {
    this.router.navigate([`registro`]);
  }
}
