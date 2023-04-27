import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompartirDatosService } from '../services/compartir-datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  usuarios = [{usuario:'',contrasenia:'',rol:''}];

  usuario = {
    usuario: '',
    contrasenia: ''
  };

  invalid = '';

  constructor(public compartirDatos: CompartirDatosService, private router: Router) {
    this.form = new FormGroup({
      usuario: new FormControl(this.usuario.usuario, [Validators.required]),
      contrasenia: new FormControl(this.usuario.contrasenia, [
        Validators.required,
      ]),
    });
  }
  ngOnInit(): void {
    this.usuarios = this.compartirDatos.getDatos();
  }

  login() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.usuarios.forEach(element => {
        if (element.usuario === this.form.value.usuario &&
          element.contrasenia === this.form.value.contrasenia) {
            this.compartirDatos.setUser(element);
            console.log('Usuario '+ element.rol);
            console.log(this.compartirDatos);
            this.router.navigate([`panel/${element.rol}`]);
            // window.location.href=`panel/${element.rol}`;
        }
      });
    } else {
      this.invalid = 'ng-invalid ng-dirty';
    }
  }

}
