import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit{
  modulo = '<app-inicio></app-inicio>';
  imgPerfil = '../assets/login/perfil.png';
  user = 'Ricardo';
  tipoUsuario:string = 'admin'

  modulosAdmin= [
    {nombre:'Inicio',icon:'bi bi-house-door-fill'},
    {nombre:'Personal',icon:'bi bi-person-fill'},
    {nombre:'Odontologos',icon:'bi bi-person-badge-fill'},
    {nombre:'Pacientes',icon:'bi bi-people-fill'},
    {nombre:'Ajustes',icon:'bi bi-gear-fill'},
  ];

  modulosPersonal= [
    {nombre:'Inicio',icon:'bi bi-house-door-fill'},
    {nombre:'Gestionar Citas',icon:'bi bi-calendar-date-fill'},
    {nombre:'Reportes',icon:'bi bi-file-earmark-arrow-down-fill'},
    {nombre:'Ajustes',icon:'bi bi-gear-fill'},
  ];

  modulosPaciente= [
    {nombre:'Inicio',icon:'bi bi-house-door-fill'},
    {nombre:'Citas',icon:'bi bi-calendar-date-fill'},
    {nombre:'Historial',icon:'bi bi-clock-fill'},
    {nombre:'Pagos',icon:'bi bi-credit-card-2-back-fill'},
    {nombre:'Ajustes',icon:'bi bi-gear-fill'},
  ];



  ngOnInit(): void {

  }

}
