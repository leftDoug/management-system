import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementFormComponent } from './pages/agreement-form/agreement-form.component';
import { AgreementComponent } from './pages/agreement/agreement.component';
import { AgreementsTableComponent } from './pages/agreements-table/agreements-table.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AgreementComponent,
    AgreementFormComponent,
    AgreementsTableComponent,
    SearchComponent,
  ],
  exports: [AgreementsTableComponent],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AgreementsModule {}
