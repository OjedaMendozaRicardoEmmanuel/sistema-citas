import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  pacienteEnable = 'activado';
  personalEnable = 'desactivado';

  loginPaciente(){
    this.pacienteEnable = 'activado';
    this.personalEnable = 'desactivado';
  }

  loginPersonal(){
    this.pacienteEnable = 'desactivado';
    this.personalEnable = 'activado';
  }
}
