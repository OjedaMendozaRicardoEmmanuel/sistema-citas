import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  {path: '',redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component:LoginComponent},
  {path: 'login/paciente', component:LoginComponent},
  {path: 'login/personal', component:LoginComponent},
  {path: 'registro', component:RegistroComponent},
  {path: 'registro/paciente', component:RegistroComponent},
  {path: 'registro/personal', component:RegistroComponent},
  {path: '**',redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
