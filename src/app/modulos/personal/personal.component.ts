import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

const USUARIOS_DATA: Usuario[] = [
  { id: 1, nombre: 'Juan', email: 'juan@gmail.com' },
  { id: 2, nombre: 'María', email: 'maria@hotmail.com' },
  { id: 3, nombre: 'Pedro', email: 'pedro@yahoo.com' },
  { id: 4, nombre: 'Jose', email: 'jose@@hotmail.com' },
  { id: 5, nombre: 'Ricardo', email: 'ricardo@gmail.com' },
];

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
  providers: [MessageService],
})
export class PersonalComponent {
  displayedColumns: string[] = ['id', 'nombre', 'email', 'editar', 'eliminar'];
  dataSource = [
    { id: 1, nombre: 'Juan', email: 'juan@gmail.com' },
    { id: 2, nombre: 'María', email: 'maria@hotmail.com' },
    { id: 3, nombre: 'Pedro', email: 'pedro@yahoo.com' },
    { id: 4, nombre: 'Jose', email: 'jose@@hotmail.com' },
    { id: 5, nombre: 'Ricardo', email: 'ricardo@gmail.com' },
  ];

  agregarDialog : boolean = false;
  modificarDialog : boolean = false;

  constructor(private messageService: MessageService) {}

  agregarUsuario() {
    this.agregarDialog = true;
    console.log('dialog');
  }

  editarUsuario(usuario: Usuario) {
    this.modificarDialog = true;
    console.log('dialog');
    /*this.messageService.add({
      severity: 'success',
      summary: 'Se guardo correctamente ',
      detail: usuario.nombre,
    });*/
  }

  eliminarUsuario(usuario: Usuario) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminado correctamente',
      detail: usuario.nombre,
    });
  }
}
