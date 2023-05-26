import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Cita } from 'src/app/services/models/cita';
import { Doctor } from 'src/app/services/models/doctor';
import { Paciente } from 'src/app/services/models/paciente';
import { Usuario } from 'src/app/services/models/usuario';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css']
})
export class GestionCitasComponent implements OnInit {
  citas: Cita[] = [];
  odontologos: Usuario[] = [];
  pacientes: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const getCitas$ = this.apiService.getAllCitas();
    const getAllPacientes$ = this.apiService.getAllPacientes();
    const getAllDoctors$ = this.apiService.getAllDoctors();

    forkJoin([getCitas$, getAllPacientes$, getAllDoctors$]).subscribe(([citas, pacientes, odontologos]) => {
      this.citas = citas;
      this.pacientes = pacientes;
      this.odontologos = this.optenerUserOdontologo(odontologos);
    });
  }

  getCitas(): void {
    this.apiService.getAllCitas()
      .subscribe(citas => this.citas = citas);
  }

  optenerUserOdontologo(docs:Doctor[]):Usuario[]{
    const userDocs:Usuario[]=[];
    docs.forEach(doc => {
      this.apiService.getUserByDoctorId(doc.id).subscribe(res => {userDocs.push(res)});
    });
    return userDocs;
  }

  nombreFormato(item:any):string{
    return `${item.nombre} ${item.apellidop} ${item.apellidom}`;
  }
}
