import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Cita } from 'src/app/services/models/cita';
import { Doctor } from 'src/app/services/models/doctor';
import { Paciente } from 'src/app/services/models/paciente';
import { Usuario } from 'src/app/services/models/usuario';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
  providers: [MessageService],
})
export class CitasComponent  implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: any;

  fechaMinima = new Date();
  citas: Cita[] = [];
  odontologos: Doctor[] = [];
  pacientes: Paciente[] = [];
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

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    setTimeout(() => {
      apiService.getProfile().subscribe((res) => {
        this.usuario = res;
      });
    }, 200);
  }

  ngOnInit(): void {
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
      this.citas = citas;
      this.pacientes = pacientes;
      this.odontologos = odontologos;
      this.usuarios = usuarios;
    });
  }

  // Método para refrescar la tabla
  refreshTable(): void {
    this.dataTable.reset();
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
      case '1':
        return 'info';
      case '2':
        return 'success';
      case '3':
        return 'danger';
      default:
        return 'info';
    }
  }

  getEstatus(status: string) {
    switch (status) {
      case '1':
        return 'Pendiente';
      case '2':
        return 'Confirmada';
      case '3':
        return 'Cancelada';
      default:
        return 'info';
    }
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

  asignarDatosCita(form: FormGroup) {
    this.cita = {
      id: form.get('id')?.value,
      fecha_hora:
        this.obtenerFechaF(form.get('fecha')?.value) +
        ' ' +
        form.get('hora')?.value +
        ':00',
      estatus: form.get('estatus')?.value,
      paciente_id: form.get('paciente_id')?.value,
      doctor_id: form.get('doctor_id')?.value,
      usuarios_id: this.usuario.id,
    };
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

  verCita(cita: Cita) {
    this.messageService.add({
      severity: 'error',
      summary: 'Se modifico la cita!',
      detail: '' + cita.id,
    });
  }

}
