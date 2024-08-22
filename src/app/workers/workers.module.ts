import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkersRoutingModule } from './workers-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { WorkerFormComponent } from './pages/worker-form/worker-form.component';
import { WorkersTableComponent } from './pages/workers-table/workers-table.component';
import { WorkerInfoComponent } from './pages/worker-info/worker-info.component';

@NgModule({
  declarations: [
    WorkerFormComponent,
    WorkersTableComponent,
    WorkerInfoComponent
  ],
  imports: [CommonModule, HttpClientModule, WorkersRoutingModule],
})
export class WorkersModule {}
