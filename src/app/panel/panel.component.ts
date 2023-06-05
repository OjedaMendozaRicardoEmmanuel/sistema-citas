import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../services/models/usuario';
import { ApiService } from '../services/api.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent implements OnInit {
  imgPerfil = '';
  user = 'Ricardo';
  tipoUsuario: string = 'admin';
  modulos: any = [];
  moduloEnable = 1;
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

  permisos = [
    {
      id: 1,
      nombre: 'Inicio',
      icon: 'bi bi-house-door-fill',
      estado: 'activado',
      rol: 'all',
    },
    {
      id: 2,
      nombre: 'Personal',
      icon: 'bi bi-person-fill',
      estado: 'desactivado',
      rol: 'Administrador',
    },
    {
      id: 3,
      nombre: 'Odontólogos',
      icon: 'bi bi-person-badge-fill',
      estado: 'desactivado',
      rol: 'Administrador',
    },
    {
      id: 4,
      nombre: 'Pacientes',
      icon: 'bi bi-people-fill',
      estado: 'desactivado',
      rol: 'Administrador',
    },
    {
      id: 5,
      nombre: 'Gestionar Citas',
      icon: 'bi bi-calendar-date-fill',
      estado: 'desactivado',
      rol: 'Personal',
    },
    {
      id: 6,
      nombre: 'Reportes',
      icon: 'bi bi-file-earmark-arrow-down-fill',
      estado: 'desactivado',
      rol: 'Personal',
    },
    {
      id: 7,
      nombre: 'Citas',
      icon: 'bi bi-calendar-date-fill',
      estado: 'desactivado',
      rol: 'Odontologo',
    },
    {
      id: 8,
      nombre: 'Historial',
      icon: 'bi bi-clock-fill',
      estado: 'desactivado',
      rol: 'Odontologo',
    },
    {
      id: 9,
      nombre: 'Expedientes',
      icon: 'bi bi-folder-fill',
      estado: 'desactivado',
      rol: 'Odontologo',
    },
  ];

  horaActual: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.apiService
    .getProfile()
    .pipe(
      switchMap((resultadoProfile) => {
        this.usuario = resultadoProfile;
        return this.apiService.getUsuarioRoles(this.usuario.id);
      })
    )
    .subscribe((resultado) => {
      this.tipoUsuario = resultado[0].nombre;
      this.user = this.usuario.nombre;
      this.modulosActivos();
      this.imgPerfil = `../assets/img/${this.tipoUsuario}.png`;
    });

    this.obtenerHoraActual();
    setInterval(() => {
      this.obtenerHoraActual();
    }, 1000);
  }

  botonPresionado(id: number) {
    this.permisos.forEach((element) => {
      if (element.id === id) {
        element.estado = 'activado';
        this.moduloEnable = element.id;
      } else {
        element.estado = 'desactivado';
      }
    });
  }

  modulosActivos() {
    this.permisos.forEach((element) => {
      if (element.nombre === 'Pacientes' && this.tipoUsuario === 'Personal') {
        this.modulos.push(element);
      } else if (element.rol === this.tipoUsuario) {
        this.modulos.push(element);
      } else if (element.rol === 'all') {
        this.modulos.push(element);
      }
    });
  }

  cerrarSesion() {
    this.apiService.logout();
    this.router.navigate(['login']);
  }

  obtenerHoraActual(): void {
    const fecha = new Date();
    this.horaActual = fecha.toLocaleTimeString();
  }
}
