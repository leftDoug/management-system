import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendasTableComponent } from './agendas-table/agendas-table.component';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';
import { AgendaInfoComponent } from './agenda-info/agenda-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule({
  declarations: [
    AgendasTableComponent,
    AgendaFormComponent,
    AgendaInfoComponent,
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
  ],
})
export class AgendaModule {}
