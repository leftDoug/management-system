import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsRoutingModule } from './organizations-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationFormComponent } from './pages/organization-form/organization-form.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrganizationsTableComponent } from './pages/organizations-table/organizations-table.component';

@NgModule({
  declarations: [OrganizationFormComponent, OrganizationsTableComponent],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule,
    ReactiveFormsModule,
    // FormsModule,
  ],
})
export class OrganizationsModule {}
