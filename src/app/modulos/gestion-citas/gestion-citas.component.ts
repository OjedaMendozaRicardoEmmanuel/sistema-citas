import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Odontologo } from 'src/app/services/models/Odontologo';
import { Cita } from 'src/app/services/models/cita';
import { Doctor } from 'src/app/services/models/doctor';
import { Paciente } from 'src/app/services/models/paciente';
import { Usuario } from 'src/app/services/models/usuario';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css'],
})
export class GestionCitasComponent implements OnInit {
  fechaMinima = new Date();
  citas: Cita[] = [];
  odontologos: Doctor[] = [];
  pacientes: any[] = [];
  usuarios: Usuario[] = [];
  horas: string[] = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];
  horaSeleccionada: string = '';
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const getCitas$ = this.apiService.getAllCitas();
    const getAllPacientes$ = this.apiService.getAllPacientes();
    const getAllDoctors$ = this.apiService.getAllDoctors();
    const getUsuarios$ = this.apiService.getUsuarios();
    const getProfile$ = this.apiService.getProfile();

    forkJoin([
      getCitas$,
      getAllPacientes$,
      getAllDoctors$,
      getUsuarios$,
      getProfile$,
    ]).subscribe(([citas, pacientes, odontologos, usuarios, profile]) => {
      this.citas = citas;
      this.pacientes = pacientes;
      this.odontologos = odontologos;
      this.usuarios = usuarios;
      this.usuario = profile;
    });
  }

  getCitas(): void {
    this.apiService.getAllCitas().subscribe((citas) => (this.citas = citas));
  }

  optenerUserOdontologo(docs: Doctor[]): Usuario[] {
    const userDocs: Usuario[] = [];
    docs.forEach((doc) => {
      this.apiService.getUserByDoctorId(doc.id).subscribe((res) => {
        userDocs.push(res);
      });
    });
    return userDocs;
  }

  nombreFormato(item: any): string {
    return `${item.nombre} ${item.apellidop} ${item.apellidom}`;
  }

  optenerUserDeOdontologo(doc: Doctor): any {
    let user;
    this.usuarios.forEach((element) => {
      if (doc.usuarios_id === element.id) {
        user = element;
      }
    });
    return user;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  getEstatus(id:number){
    switch (id) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Confirmada';
      case 3:
        return 'Finalizada';
      default:
        return 'Pendiente';
    }
  }

  obtenerPacienteCita(id:number):any{
    let px;
    this.pacientes.forEach((element) => {
      if (id === element.id) {
        px = element;
      }
    });
    return px;
  }

  obtenerOdonCita(id:number):any{
    let doc;
    this.odontologos.forEach((element) => {
      if (id === element.id) {
        doc = this.optenerUserDeOdontologo(element);
      }
    });
    return doc;
  }
}
