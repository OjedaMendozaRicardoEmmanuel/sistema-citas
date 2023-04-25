import { NgModule } from '@angular/core';

//NGPrime
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

//AngularMaterial
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MatButtonModule,
  ],
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MatButtonModule,
  ],
})
export class MaterialModule {}
