import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreasRoutingModule } from './areas-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AreaFormComponent } from './pages/area-form/area-form.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AreasTableComponent } from './pages/areas-table/areas-table.component';

@NgModule({
  declarations: [AreaFormComponent, AreasTableComponent],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule,
    ReactiveFormsModule,
    // FormsModule,
  ],
})
export class AreasModule {}
