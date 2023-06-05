import { Component, OnInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { Cita } from 'src/app/services/models/cita';
import { Paciente } from 'src/app/services/models/paciente';
import { forkJoin } from 'rxjs';
import { CitaObj } from 'src/app/services/models/citaObj';
import { Usuario } from 'src/app/services/models/usuario';
import { Doctor } from 'src/app/services/models/doctor';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  pacientes: Paciente[] = [];
  selectedPacientes: Paciente[] = [];

  citas: Cita[] = [];
  citaObj: CitaObj[] = [];
  selectedCitas: CitaObj[] = [];

  constructor(private apiService: ApiService) {}

  colsPacientes: any[] = [];
  exportColumnsPacientes: any[] = [];

  colsCitas: any[] = [];
  exportColumnsCitas: any[] = [];
  usuarios: Usuario[] = [];
  odontologos: Doctor[] = [];

  ngOnInit() {
    const getCitas$ = this.apiService.getAllCitas();
    const getAllPacientes$ = this.apiService.getAllPacientes();
    const getAllDoctors$ = this.apiService.getAllDoctors();
    const getUsuarios$ = this.apiService.getUsuarios();

    forkJoin([getCitas$, getAllPacientes$, getAllDoctors$, getUsuarios$]).subscribe(
      ([citas, pacientes, odontologos, usuarios]) => {
        this.citas = citas;
        this.pacientes = pacientes;
        this.odontologos = odontologos;
        this.usuarios = usuarios;
      }
    );

    this.colsPacientes = [
      { field: 'id', header: 'ID', customExportHeader: 'Pacientes' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellidop', header: 'Apellido 1' },
      { field: 'apellidom', header: 'Apellido 2' },
      { field: 'genero', header: 'Genero' },
      { field: 'fecha_nacimiento', header: 'Fecha Nacimiento' },
      { field: 'correo', header: 'Correo' },
      { field: 'telefono', header: 'Telefono' },
    ];

    this.exportColumnsPacientes = this.colsPacientes.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.colsCitas = [
      { field: 'id', header: 'ID', customExportHeader: 'Pacientes' },
      { field: 'fecha_hora', header: 'Fecha Hora' },
      { field: 'estatus', header: 'Estatus' },
      { field: 'paciente', header: 'Paciente' },
      { field: 'odontologo', header: 'Odontólogo' },
    ];

    this.exportColumnsCitas = this.colsCitas.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    setTimeout(() => {
      this.asignarDatos();
    }, 300);
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumnsPacientes, this.pacientes);
        doc.save('pacientes.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.pacientes);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'pacientes');
    });
  }

  exportPdfCT() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumnsCitas, this.citaObj);
        doc.save('citas.pdf');
      });
    });
  }

  exportExcelCT() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.citaObj);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'citas');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  nombreFormato(item: any): string {
    return `${item.nombre} ${item.apellidop} ${item.apellidom}`;
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
        doc = element;
      }
    });
    return doc;
  }


  @ViewChild('dt2', { static: true }) dataTable: any;
  asignarDatos() {
    this.citas.forEach(
      ct => {
        console.log();
        console.log();
        const cit:CitaObj = {
          id:'CT-'+ct.id,
          fecha_hora:ct.fecha_hora,
          paciente: this.nombreFormato(this.obtenerPacienteCita(ct.paciente_id)),
          odontologo: this.nombreFormato(this.obtenerPacienteCita(this.optenerID(ct.doctor_id))),
          estatus: this.getEstatus(''+ct.estatus)
         };
         this.citaObj.push(cit);
      });
      this.dataTable.reset();
  }

  optenerID(id:number): number {
    let idN = 0;
    this.odontologos.forEach(odo =>{
      if(id === odo.id){
        idN = odo.usuarios_id;
      }
    });
    return idN;
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
        return 'Pendiente';
    }
  }
}
