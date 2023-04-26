import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit{
  imgPerfil = '../assets/img/perfil.png';
  user = 'Ricardo';
  tipoUsuario:string = 'odontologo'
  modulos:any = [];
  moduloEnable = 1;

  permisos = [
    {id:1,nombre:'Inicio',icon:'bi bi-house-door-fill',estado:'activado',rol:'all'},
    {id:2,nombre:'Personal',icon:'bi bi-person-fill',estado:'desactivado',rol:'admin'},
    {id:3,nombre:'Odontologos',icon:'bi bi-person-badge-fill',estado:'desactivado',rol:'admin'},
    {id:4,nombre:'Pacientes',icon:'bi bi-people-fill',estado:'desactivado',rol:'admin'},
    {id:5,nombre:'Gestionar Citas',icon:'bi bi-calendar-date-fill',estado:'desactivado',rol:'personal'},
    {id:6,nombre:'Reportes',icon:'bi bi-file-earmark-arrow-down-fill',estado:'desactivado',rol:'personal'},
    {id:7,nombre:'Citas',icon:'bi bi-calendar-date-fill',estado:'desactivado',rol:'odontologo'},
    {id:8,nombre:'Historial',icon:'bi bi-clock-fill',estado:'desactivado',rol:'odontologo'},
    {id:9,nombre:'Pagos',icon:'bi bi-credit-card-2-back-fill',estado:'desactivado',rol:'odontologo'},
    {id:10,nombre:'Ajustes',icon:'bi bi-gear-fill',estado:'desactivado',rol:'all'},
  ];



  ngOnInit(): void {
    this.modulosActivos();
  }

  botonPresionado(id: number) {
    console.log('El botón con id ' + id + ' ha sido presionado.');
    this.permisos.forEach(element => {
      if (element.id === id) {
        element.estado = 'activado';
        this.moduloEnable = element.id;
      } else {
        element.estado = 'desactivado';
      }
    });
  }

  modulosActivos(){
    this.permisos.forEach(element => {
      if (element.rol === this.tipoUsuario) {
        this.modulos.push(element);
      } else if(element.rol === this.tipoUsuario) {
        this.modulos.push(element);
      } else if(element.rol === this.tipoUsuario) {
        this.modulos.push(element);
      } else if(element.rol === 'all'){
        this.modulos.push(element);
      }
    });
  }

  cerrarSesion(){
    window.location.href='login';
  }
}
