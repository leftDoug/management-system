import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesOfMeetingsRoutingModule } from './types-of-meetings-routing.module';
import { TypesOfMeetingsTableComponent } from './pages/types-of-meetings-table/types-of-meetings-table.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { TypeOfMeetingFormComponent } from './pages/type-of-meeting-form/type-of-meeting-form.component';
import { TypeOfMeetingInfoComponent } from './pages/type-of-meeting-info/type-of-meeting-info.component';
import { AgendaModule } from '../agenda/agenda.module';
import { MeetingsModule } from '../meetings/meetings.module';

@NgModule({
  declarations: [
    TypesOfMeetingsTableComponent,
    TypeOfMeetingFormComponent,
    TypeOfMeetingInfoComponent,
  ],
  imports: [
    AgendaModule,
    MeetingsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PrimengModule,
    FormsModule,
    // TypesOfMeetingsRoutingModule,
  ],
  exports: [TypesOfMeetingsTableComponent],
})
export class TypesOfMeetingsModule {}
