import { Component, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Cita } from 'src/app/services/models/cita';
import { Doctor } from 'src/app/services/models/doctor';
import { Paciente } from 'src/app/services/models/paciente';
import { Usuario } from 'src/app/services/models/usuario';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  providers: [MessageService],
})
export class HistorialComponent implements OnInit {
  citas: Cita[] = [];
  Allcitas: Cita[] = [];
  citasPX: Cita[] = [];
  odontologos: Doctor[] = [];
  pacientes: Paciente[] = [];
  misPacientes: Paciente[] = [];
  usuarios: Usuario[] = [];
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
  cita: Cita = {
    id: 0,
    fecha_hora: '',
    estatus: 0,
    paciente_id: 0,
    doctor_id: 0,
    usuarios_id: 0,
  };

  proximaCita: Cita = {
    id: 0,
    fecha_hora: '',
    estatus: 0,
    paciente_id: 0,
    doctor_id: 0,
    usuarios_id: 0,
  };

  citasConfirmadas = 0;
  citasPendientes = 0;
  id_doc = 0;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    setTimeout(() => {
      apiService.getProfile().subscribe((res) => {
        this.usuario = res;
        this.obternerIdDoc(this.usuario);
        this.misPacientes = this.obtenerPacientes();
        this.citas = this.citas.filter(ct => ct.doctor_id === this.id_doc);
        this.proximaCita = this.citas[0];
      });
    }, 200);
  }

  ngOnInit(): void {
    const fechaActual = new Date();

    const getCitas$ = this.apiService.getAllCitas();
    const getAllPacientes$ = this.apiService.getAllPacientes();
    const getAllDoctors$ = this.apiService.getAllDoctors();
    const getUsuarios$ = this.apiService.getUsuarios();

    forkJoin([
      getCitas$,
      getAllPacientes$,
      getAllDoctors$,
      getUsuarios$,
    ]).subscribe(([citas, pacientes, odontologos, usuarios]) => {
      this.pacientes = pacientes;
      this.odontologos = odontologos;
      this.usuarios = usuarios;
      this.Allcitas = citas;
      this.citas = this.ordenarCitasPorFecha(citas.filter((cita) => {
        const fechaCita = new Date(cita.fecha_hora);
        return fechaCita > fechaActual;
      }));
    });
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
    return `${item?.nombre} ${item?.apellidop} ${item?.apellidom}`;
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

  obtenerPacienteCita(id: number): any {
    let px;
    this.pacientes.forEach((element) => {
      if (id === element.id) {
        px = element;
      }
    });
    return px;
  }

  obtenerOdonCita(id: number): any {
    let doc;
    this.odontologos.forEach((element) => {
      if (id === element.id) {
        doc = this.optenerUserDeOdontologo(element);
      }
    });
    return doc;
  }

  obtenerFechaF(fecha: any): string {
    const fechaTemp = new Date(fecha);
    return format(fechaTemp, 'yyyy-MM-dd');
  }

  ordenarCitasPorFecha(citas: Cita[]): Cita[] {
    return citas.sort((a, b) => {
      const fechaA = new Date(a.fecha_hora);
      const fechaB = new Date(b.fecha_hora);
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  verHistorial(px: Paciente) {
    this.filtrarCitas(px.id)
    console.log(this.citasPX);
  }

  obtenerPacientes():Paciente[]{
    let px:Paciente[] = [];
    this.Allcitas.forEach(ct => {
      if (ct.doctor_id === this.id_doc) {
        px.push(this.obtenerPacienteCita(ct.paciente_id))
      }
    });
    px = px.filter((item, index) => {
      return px.indexOf(item) === index;
    });
    return px;
  }

  obternerIdDoc(usr:Usuario){
    this.odontologos.forEach(res => {
      if (res.usuarios_id === this.usuario.id) {
        this.id_doc = res.id
      }
    });
    console.log(this.id_doc);
  }

  calcularEdad(fechaNacimiento: string) {
    const hoy = moment();
    const edad = hoy.diff(fechaNacimiento, 'years');
    return edad;
  }

  filtrarCitas(id:number){
    this.citasPX = this.Allcitas.filter(ct => ct.paciente_id == id);
  }
}
