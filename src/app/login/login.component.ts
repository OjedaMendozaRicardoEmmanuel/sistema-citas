import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  masterkey = {
    usuario: 'sysdba',
    contrasenia: 'masterkey',
    rol:'admin'
  };
  usuario = {
    usuario: '',
    contrasenia: '',
    rol:''
  };

  constructor() {
    this.form = new FormGroup({
      usuario: new FormControl(this.usuario.usuario, [Validators.required]),
      contrasenia: new FormControl(this.usuario.contrasenia, [
        Validators.required,
      ]),
    });
  }
  ngOnInit(): void {}

  login() {
    if (this.form.valid) {
      console.log(this.form.value);
      if (
        this.masterkey.usuario === this.form.value.usuario &&
        this.masterkey.contrasenia === this.form.value.contrasenia
      ) {
        console.log('Usuario admin');
        window.location.href='panel';
      }
    }
  }
}
