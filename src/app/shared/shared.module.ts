import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [NavbarComponent, LoadingComponent],
  imports: [CommonModule, PrimengModule, FormsModule, AppRoutingModule],
  exports: [NavbarComponent, LoadingComponent],
})
export class SharedModule {}
