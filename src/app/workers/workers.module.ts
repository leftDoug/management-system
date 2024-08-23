import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkerFormComponent } from './pages/worker-form/worker-form.component';
import { WorkersTableComponent } from './pages/workers-table/workers-table.component';
import { WorkerInfoComponent } from './pages/worker-info/worker-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WorkersTableComponent,
    WorkerFormComponent,
    WorkerInfoComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class WorkersModule {}
