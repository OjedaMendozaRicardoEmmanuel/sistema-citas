import { Component, OnInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { Cita } from 'src/app/services/models/cita';
import { Paciente } from 'src/app/services/models/paciente';
import { forkJoin } from 'rxjs';
import { CitaObj } from 'src/app/services/models/citaObj';
import { Usuario } from 'src/app/services/models/usuario';
import { Doctor } from 'src/app/services/models/doctor';
import { FormControl, FormGroup } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  pacientes: Paciente[] = [];
  selectedPacientes: Paciente[] = [];

  citas: Cita[] = [];
  citasAll: CitaObj[] = [];
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

        // Agregar el encabezado (fecha-hora y nombre del negocio)
        const fechaHora = new Date().toLocaleString();
        const nombreNegocio = 'Sistema De Citas';

        doc.setFontSize(14);
        doc.text('Fecha-Hora: ' + fechaHora, 20, 30); // Ajusta las coordenadas (x, y) según tus necesidades
        doc.text(nombreNegocio, 20, 50); // Ajusta las coordenadas (x, y) según tus necesidades

        // Agregar el logo del negocio
        const logo = new Image();
        logo.src = '../../../assets/img/logo.png'; // Reemplaza 'ruta/del/logo.png' con la ruta correcta de tu logo

        logo.onload = () => {
          doc.addImage(logo, 'PNG', 300, 10, 100, 40); // Ajusta las coordenadas (x, y, width, height) según tus necesidades

          // Generar la tabla utilizando autoTable
          (doc as any).autoTable(this.exportColumnsCitas, this.citaObj, { startY: 100 }); // Ajusta la coordenada y (100 en este ejemplo)

          // Guardar el archivo PDF
          doc.save('citas.pdf');
        };
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
    this.usuarios.forEach((element) => {
      if (id === element.id) {
        doc = element;
      }
    });
    return doc;
  }

  @ViewChild('dt2', { static: true }) dataTable: any;
  asignarDatos() {
    this.citas.forEach((ct) => {
      console.log();
      console.log();
      const cit: CitaObj = {
        id: 'CT-' + ct.id,
        fecha_hora: ct.fecha_hora,
        paciente: this.nombreFormato(this.obtenerPacienteCita(ct.paciente_id)),
        odontologo: this.nombreFormato(
          this.obtenerOdonCita(this.optenerID(ct.doctor_id))
        ),
        estatus: this.getEstatus('' + ct.estatus),
      };
      this.citaObj.push(cit);
    });
    this.citasAll = this.citaObj;
    this.dataTable.reset();
  }

  optenerID(id: number): number {
    let idN = 0;
    this.odontologos.forEach((odo) => {
      if (id === odo.id) {
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

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    paciente: new FormControl(null),
    doctor: new FormControl(null),
    estatus: new FormControl(null),
  });

  dateFilter: (date: Date | null) => boolean = (date: Date | null) => {
    if (!date) {
      return false;
    }
    const day = date.getDay();
    return day !== 0; // 1 means monday, 0 means sunday, etc.
  };

  optenerUserDeOdontologo(doc: Doctor): any {
    let user;
    this.usuarios.forEach((element) => {
      if (doc.usuarios_id === element.id) {
        user = element;
      }
    });
    return user;
  }

  filtroEstatus = [
    { estatus: 'Pendiente' },
    { estatus: 'Confirmada' },
    { estatus: 'Cancelada' },
  ];

  @ViewChild('dt2', { static: true }) tabla: any;


  filtrarCitas(){
    this.citaObj = this.citasAll;
    if ((this.range.get('start')?.value !== null) && (this.range.get('end')?.value !== null)) {
      this.citaObj = this.citaObj.filter(ct => {
        const dateStar = new Date(this.obtenerFechaF(this.range.get('start')?.value));
        const dateEnd = new Date(this.obtenerFechaF(this.range.get('end')?.value) + ' 23:59');
        const dateCT = new Date(ct.fecha_hora);
        return dateCT >= dateStar && dateCT <= dateEnd;
      });
    } else if (this.range.get('start')?.value !== null) {
      this.citaObj = this.citaObj.filter(ct => {
        const dateStar = new Date(this.obtenerFechaF(this.range.get('start')?.value ));
        const dateEnd = new Date(this.obtenerFechaF(this.range.get('start')?.value) + ' 23:59');
        const dateCT = new Date(ct.fecha_hora);
        return dateCT >= dateStar && dateCT <= dateEnd;
      });
    }
    if(this.range.get('paciente')?.value !== null){
      this.citaObj = this.citaObj.filter(ct => {
        const px:any = this.range.get('paciente')?.value;
        return px == ct.paciente;
    });
    }
    if(this.range.get('doctor')?.value !== null){
      this.citaObj = this.citaObj.filter(ct => {
        const doc:any = this.range.get('doctor')?.value;
        return doc == ct.odontologo;
    });
    }
    if(this.range.get('estatus')?.value !== null){
      this.citaObj = this.citaObj.filter(ct => {
        const est:any = this.range.get('estatus')?.value;
        return est == ct.estatus;
    });
    }
    this.tabla.reset();
  }

  borrarFiltros(){
    this.range.reset();
    this.citaObj = this.citasAll;
  }

  obtenerFechaF(fecha: any): string {
    const fechaTemp = new Date(fecha);
    return format(fechaTemp, 'yyyy-MM-dd');
  }
}
