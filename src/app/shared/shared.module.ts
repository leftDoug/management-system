import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, PrimengModule, FormsModule, AppRoutingModule],
  exports: [NavbarComponent],
})
export class SharedModule {}
