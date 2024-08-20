import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementsTableComponent } from './agreements/pages/agreements-table/agreements-table.component';
import { AgreementInfoComponent } from './agreements/pages/agreement-info/agreement-info.component';
import { AgreementFormComponent } from './agreements/pages/agreement-form/agreement-form.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { AreasTableComponent } from './areas/pages/areas-table/areas-table.component';
import { AreaFormComponent } from './areas/pages/area-form/area-form.component';

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
    path: 'iniciar-sesion',
    component: LoginComponent,
  },
  {
    path: 'acuerdos',
    component: AgreementsTableComponent,
  },
  { path: 'acuerdos/detalles/:id', component: AgreementInfoComponent },
  { path: 'acuerdos/agregar', component: AgreementFormComponent },
  { path: 'acuerdos/editar/:id', component: AgreementFormComponent },
  { path: 'areas', component: AreasTableComponent },
  { path: 'areas/agregar', component: AreaFormComponent },
  { path: 'areas/editar/:id', component: AreaFormComponent },
  { path: '**', redirectTo: 'acuerdos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
