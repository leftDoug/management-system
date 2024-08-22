import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingsRoutingModule } from './meetings-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MeetingsTableComponent } from './pages/meetings-table/meetings-table.component';
import { MeetingFormComponent } from './pages/meeting-form/meeting-form.component';
import { MeetingInfoComponent } from './pages/meeting-info/meeting-info.component';

@NgModule({
  declarations: [
    MeetingsTableComponent,
    MeetingFormComponent,
    MeetingInfoComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    // MeetingsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MeetingsModule {}
