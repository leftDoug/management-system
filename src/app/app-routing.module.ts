import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementsTableComponent } from './agreements/pages/agreements-table/agreements-table.component';
import { AgreementInfoComponent } from './agreements/pages/agreement-info/agreement-info.component';
import { AgreementFormComponent } from './agreements/pages/agreement-form/agreement-form.component';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  // },
  // {
  //   path: 'acuerdos',
  //   loadChildren: () =>
  //     import('./agreements/agreements.module').then((m) => m.AgreementsModule),
  // },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'acuerdos',
    component: AgreementsTableComponent,
  },
  { path: 'detalles/:id', component: AgreementInfoComponent },
  { path: 'agregar', component: AgreementFormComponent },
  { path: 'editar/:id', component: AgreementFormComponent },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
