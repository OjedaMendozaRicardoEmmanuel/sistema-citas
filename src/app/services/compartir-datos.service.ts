import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CompartirDatosService {
  private datos=[];
  private user=[{usuario:'',contrasenia:'',rol:''}];
  constructor() { }
  setDatos(datos: any) {
    this.datos = datos;
  }

  getDatos() {
    return this.datos;
  }
  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
