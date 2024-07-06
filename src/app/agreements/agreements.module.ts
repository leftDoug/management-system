import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementFormComponent } from './pages/agreement-form/agreement-form.component';
import { AgreementInfoComponent } from './pages/agreement-info/agreement-info.component';
import { AgreementsTableComponent } from './pages/agreements-table/agreements-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule({
  declarations: [
    AgreementInfoComponent,
    AgreementFormComponent,
    AgreementsTableComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AgreementsModule {}
