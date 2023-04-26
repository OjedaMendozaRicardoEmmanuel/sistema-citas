import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistroComponent } from './registro/registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './modulos/inicio/inicio.component';
import { PacientesComponent } from './modulos/pacientes/pacientes.component';
import { OdontologosComponent } from './modulos/odontologos/odontologos.component';
import { CitasComponent } from './modulos/citas/citas.component';
import { PagosComponent } from './pagos/pagos.component';
import { HistorialComponent } from './historial/historial.component';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    PacientesComponent,
    OdontologosComponent,
    CitasComponent,
    PagosComponent,
    HistorialComponent,
    PanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
