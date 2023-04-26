import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit{
  modulo = '<app-inicio></app-inicio>';
  imgPerfil = '../assets/img/perfil.png';
  user = 'Ricardo';
  tipoUsuario:string = 'admin'

  modulosAdmin= [
    {nombre:'Inicio',icon:'bi bi-house-door-fill',estado:'activado'},
    {nombre:'Personal',icon:'bi bi-person-fill',estado:'desactivado'},
    {nombre:'Odontologos',icon:'bi bi-person-badge-fill',estado:'desactivado'},
    {nombre:'Pacientes',icon:'bi bi-people-fill',estado:'desactivado'},
    {nombre:'Ajustes',icon:'bi bi-gear-fill',estado:'desactivado'},
  ];

  modulosPersonal= [
    {nombre:'Inicio',icon:'bi bi-house-door-fill',estado:'activado'},
    {nombre:'Gestionar Citas',icon:'bi bi-calendar-date-fill',estado:'desactivado'},
    {nombre:'Reportes',icon:'bi bi-file-earmark-arrow-down-fill',estado:'desactivado'},
    {nombre:'Ajustes',icon:'bi bi-gear-fill',estado:'desactivado'},
  ];

  modulosPaciente= [
    {nombre:'Inicio',icon:'bi bi-house-door-fill',estado:'activado'},
    {nombre:'Citas',icon:'bi bi-calendar-date-fill',estado:'desactivado'},
    {nombre:'Historial',icon:'bi bi-clock-fill',estado:'desactivado'},
    {nombre:'Pagos',icon:'bi bi-credit-card-2-back-fill',estado:'desactivado'},
    {nombre:'Ajustes',icon:'bi bi-gear-fill',estado:'desactivado'},
  ];



  ngOnInit(): void {

  }


}
