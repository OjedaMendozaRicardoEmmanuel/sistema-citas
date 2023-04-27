import { Component, OnInit } from '@angular/core';
import { CompartirDatosService } from './services/compartir-datos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'sistema-citas';
  usuarios = [
    {
      usuario: 'sysdba',
      contrasenia: 'masterkey',
      rol:'admin'
    },
    {
      usuario: 'personal',
      contrasenia: '12345',
      rol:'personal'
    },
    {
      usuario: 'odontologo',
      contrasenia: '12345',
      rol:'odontologo'
    }
  ];
  constructor(public compartirDatos: CompartirDatosService){
  }

  ngOnInit(): void {
    this.compartirDatos.setDatos(this.usuarios);
  }
}
