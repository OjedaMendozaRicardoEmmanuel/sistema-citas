import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
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
})
export class GestionCitasComponent implements OnInit {

  editar = false;
  @ViewChild('dataTable') dataTable: any;

  fechaMinima = new Date();
  citas: Cita[] = [];
  odontologos: Doctor[] = [];
  pacientes: Paciente[] = [];
  usuarios: Usuario[] = [];
  horas: string[] = [
    '08:00',
    '09:00',
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
  formGroup: FormGroup;
  cita: Cita = {
    id: 0,
    fecha_hora: '',
    estatus: 0,
    paciente_id: 0,
    doctor_id: 0,
    usuarios_id: 0,
  };

  constructor(private apiService: ApiService) {
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
      apiService.getProfile().subscribe( res => {
        this.usuario = res;
        console.log(this.usuario);
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

  getEstatus(id: number) {
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
    this.formGroup.get('fecha')?.setValue(citaE.fecha_hora.substring(0, 10));
    this.formGroup.get('hora')?.setValue(citaE.fecha_hora.substring(11, 16));
    this.formGroup.get('estatus')?.setValue(citaE.estatus);
    this.formGroup.get('paciente_id')?.setValue(citaE.paciente_id);
    this.formGroup.get('doctor_id')?.setValue(citaE.doctor_id);
    this.formGroup.get('usuarios_id')?.setValue(citaE.usuarios_id);
    console.log(this.formGroup.value);
  }

  guardar() {
    if (this.formGroup.valid) {
      if (this.editar) {
        this.asignarDatosCita(this.formGroup);
        console.log(this.cita);
        this.updateCita(this.cita);
      } else {
        this.asignarDatosCita(this.formGroup);
        this.crearCita();
      }
      this.dataTable.reset();
    }
  }

  cancelar() {
    this.formGroup.reset();
    this.editar = false;
  }

  asignarDatosCita(form: FormGroup) {
    this.cita = {
      id: form.get('id')?.value,
      fecha_hora: this.obtenerFechaF(form.get('fecha')?.value) + ' ' + form.get('hora')?.value,
      estatus: form.get('estatus')?.value,
      paciente_id: form.get('paciente_id')?.value,
      doctor_id: form.get('doctor_id')?.value,
      usuarios_id: this.usuario.id
    };
  }

  obtenerFechaF(fecha: any): string {
    const fechaTemp = new Date(fecha);
    return format(fechaTemp, 'yyyy-MM-dd');
  }

  crearCita(){
    this.apiService.createCita(this.cita).subscribe(res => {
      this.citas.push(res)
    });
  }

  // Actualizar un usuario existente
  updateCita(cita: Cita): void {
    this.apiService.updateCita(cita.id, cita).subscribe(updateCita => {
      const index = this.citas.findIndex(u => u.id === updateCita.id);
      this.citas[index] = updateCita;
    });
  }

  eliminarUsuario(cita: Cita) {
    if (confirm(`Desea eliminar la cita ${cita.fecha_hora}?`)) {
      this.apiService.deleteUsuario(cita.id).subscribe(() => {
        this.citas = this.citas.filter((u) => u.id !== cita.id);
      });
    }
  }
}
