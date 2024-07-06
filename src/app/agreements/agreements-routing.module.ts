import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementsTableComponent } from './pages/agreements-table/agreements-table.component';
import { AgreementFormComponent } from './pages/agreement-form/agreement-form.component';
import { AgreementInfoComponent } from './pages/agreement-info/agreement-info.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listado',
        component: AgreementsTableComponent,
      },
      {
        path: 'agregar',
        component: AgreementFormComponent,
      },
      {
        path: 'editar/:id',
        component: AgreementFormComponent,
      },
      {
        path: 'detalles/:id',
        component: AgreementInfoComponent,
      },
      {
        path: '**',
        redirectTo: 'listado',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementsRoutingModule {}
