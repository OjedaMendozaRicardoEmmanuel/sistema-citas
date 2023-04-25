import { NgModule } from '@angular/core';

//NGPrime
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

//AngularMaterial
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MatButtonModule,
    MatRadioModule,
    CalendarModule,
  ],
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MatButtonModule,
    MatRadioModule,
    CalendarModule,
  ],
})
export class MaterialModule {}
