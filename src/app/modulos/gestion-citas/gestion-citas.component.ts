import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Cita } from 'src/app/services/models/cita';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css']
})
export class GestionCitasComponent implements OnInit {
  citas: Cita[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCitas();
  }

  getCitas(): void {
    this.apiService.getAllCitas()
      .subscribe(citas => this.citas = citas);
  }

}
