import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsRoutingModule } from './organizations-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationFormComponent } from './pages/organization-form/organization-form.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrganizationsTableComponent } from './pages/organizations-table/organizations-table.component';
import { OrganizationInfoComponent } from './pages/organization-info/organization-info.component';
import { TypesOfMeetingsModule } from '../types-of-meetings/types-of-meetings.module';

@NgModule({
  declarations: [
    OrganizationFormComponent,
    OrganizationsTableComponent,
    OrganizationInfoComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule,
    ReactiveFormsModule,
    TypesOfMeetingsModule,
    // FormsModule,
  ],
})
export class OrganizationsModule {}
