import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingsRoutingModule } from './meetings-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MeetingsTableComponent } from './pages/meetings-table/meetings-table.component';

@NgModule({
  declarations: [MeetingsTableComponent],
  imports: [
    CommonModule,
    PrimengModule,
    // MeetingsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class MeetingsModule {}
