import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesOfMeetingsRoutingModule } from './types-of-meetings-routing.module';
import { TypesOfMeetingsTableComponent } from './pages/types-of-meetings-table/types-of-meetings-table.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { TypeOfMeetingFormComponent } from './pages/type-of-meeting-form/type-of-meeting-form.component';

@NgModule({
  declarations: [TypesOfMeetingsTableComponent, TypeOfMeetingFormComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PrimengModule,
    FormsModule,
    // TypesOfMeetingsRoutingModule,
  ],
})
export class TypesOfMeetingsModule {}
