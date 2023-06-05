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
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css'],
  providers: [MessageService],
})
export class GestionCitasComponent implements OnInit {
  editar = false;
  @ViewChild('dataTable', { static: true }) dataTable: any;
  @ViewChild('formulario') formulario: any;

  fechaMinima = new Date();
  citas: Cita[] = [];
  odontologos: Doctor[] = [];
  pacientes: Paciente[] = [];
  usuarios: Usuario[] = [];
  horas: any[] = [
    {hora:'08:00', enable:true},
    {hora:'09:00', enable:true},
    {hora:'10:00', enable:true},
    {hora:'11:00', enable:true},
    {hora:'12:00', enable:true},
    {hora:'13:00', enable:true},
    {hora:'14:00', enable:true},
    {hora:'15:00', enable:true},
    {hora:'16:00', enable:true},
    {hora:'17:00', enable:true},
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
  formGroup: FormGroup;
  cita: Cita = {
    id: 0,
    fecha_hora: '',
    estatus: 0,
    paciente_id: 0,
    doctor_id: 0,
    usuarios_id: 0,
  };

  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.formGroup = new FormGroup({
      id: new FormControl(0),
      fecha: new FormControl('', [Validators.required]),
      hora: new FormControl('', [Validators.required]),
      estatus: new FormControl(1, [Validators.required]),
      paciente_id: new FormControl('', [Validators.required]),
      doctor_id: new FormControl('', [Validators.required]),
      usuarios_id: new FormControl(this.usuario.id, [Validators.required]),
    });
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
  public refreshTable(): void {
    this.dataTable.reset();
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

  editarCita(citaE: Cita) {
    this.cita = citaE;
    this.editar = true;
    this.formGroup.get('id')?.setValue(citaE.id);
    this.formGroup
      .get('fecha')
      ?.setValue(this.normalizeDate(this.cita.fecha_hora));
    this.formGroup.get('hora')?.setValue(citaE.fecha_hora.substring(11, 16));
    this.formGroup.get('estatus')?.setValue(citaE.estatus);
    this.formGroup.get('paciente_id')?.setValue(citaE.paciente_id);
    this.formGroup.get('doctor_id')?.setValue(citaE.doctor_id);
    this.formGroup.get('usuarios_id')?.setValue(citaE.usuarios_id);
    console.log(this.formGroup.value);
  }

  guardar() {
    this.asignarDatosCita(this.formGroup);
    if (this.formGroup.valid && !this.existeFechaHora(this.cita)) {
      if (this.editar) {
        this.updateCita(this.cita);
        this.messageService.add({
          severity: 'info',
          summary: 'Se modifico la cita!',
          detail: 'ID: CT-'+this.cita.id,
        });
      } else {
        this.crearCita();
      }
      this.dataTable.reset();
    } else {
      alert(`La fecha: ${this.cita.fecha_hora} no esta disponible`);
    }
  }

  cancelar() {
    this.editar = false;
    this.horas.forEach(
      h => {
        h.enable = true;
      }
    );
    this.formGroup.reset();
    this.formulario.reset();
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

  normalizeDate(date: any): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0);
    return normalizedDate;
  }

  crearCita() {
    this.apiService.createCita(this.cita).subscribe((res) => {
      this.citas.push(res);

      this.messageService.add({
        severity: 'success',
        summary: 'Se agrego una nueva cita!',
        detail: 'ID: CT-'+res.id,
      });
    });
  }

  // Actualizar un usuario existente
  updateCita(cita: Cita): void {
    this.apiService.updateCita(cita.id, cita).subscribe((updateCita) => {
      const index = this.citas.findIndex((u) => u.id === updateCita.id);
      this.citas[index] = updateCita;
    });
  }

  deleteCita(cita: Cita) {
    if (confirm(`Desea cancelar la cita ${cita.fecha_hora}?`)) {
      cita.estatus = 3;
      this.updateCita(cita);
        this.messageService.add({
          severity: 'error',
          summary: 'Se cancelo la cita!',
          detail: 'ID: CT-'+cita.id,
        });
    }
  }

  confirmarCita(cita: Cita) {
    if (confirm(`Desea confirmar la cita con id: CT-${cita.id}?`)) {
      cita.estatus = 2;
      this.updateCita(cita);
        this.messageService.add({
          severity: 'success',
          summary: 'Se confirmo la cita!',
          detail: 'ID: CT-'+cita.id,
        });
    }
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

  existeFechaHora(citaN: Cita): boolean {
    return this.citas.some((cita) => cita.fecha_hora === citaN.fecha_hora);
  }

  onFechaSeleccionada(event: any){
    const fecha = this.obtenerFechaF(this.formGroup.get('fecha')?.value);
    const citas = this.citas.filter( (ct) => fecha === this.obtenerFechaF(ct.fecha_hora));
    this.horas.forEach(
      h => {
        h.enable = !citas.some(ct => ct.fecha_hora.substring(11, 16) == h.hora);
      }
    );
  }
}
