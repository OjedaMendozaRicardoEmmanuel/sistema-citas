import { NgModule } from '@angular/core';

//NGPrime
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

//AngularMaterial
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MatButtonModule,
    MatRadioModule,
    CalendarModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ToolbarModule,
    TableModule,
    ToastModule,
    DialogModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MatButtonModule,
    MatRadioModule,
    CalendarModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ToolbarModule,
    TableModule,
    ToastModule,
    DialogModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class MaterialModule {}
