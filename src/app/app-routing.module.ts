import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementsTableComponent } from './agreements/pages/agreements-table/agreements-table.component';
import { AgreementComponent } from './agreements/pages/agreement/agreement.component';
import { AgreementFormComponent } from './agreements/pages/agreement-form/agreement-form.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementsTableComponent,
    pathMatch: 'full',
  },
  { path: 'details/:id', component: AgreementComponent },
  { path: 'create', component: AgreementFormComponent },
  { path: 'update/:id', component: AgreementFormComponent },
  { path: '**', redirectTo: 'agreements' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
