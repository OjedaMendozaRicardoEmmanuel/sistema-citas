import { Component } from '@angular/core';

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
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  displayedColumns: string[] = ['id', 'nombre', 'email', 'editar', 'eliminar'];
  dataSource = USUARIOS_DATA;

  editarUsuario(id: number) {
    console.log('Editar usuario con id:', id);
  }

  eliminarUsuario(id: number) {
    console.log('Eliminar usuario con id:', id);
  }
}
