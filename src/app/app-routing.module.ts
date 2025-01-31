import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementsTableComponent } from './agreements/pages/agreements-table/agreements-table.component';
import { AgreementInfoComponent } from './agreements/pages/agreement-info/agreement-info.component';
import { AgreementFormComponent } from './agreements/pages/agreement-form/agreement-form.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { AreasTableComponent } from './areas/pages/areas-table/areas-table.component';
import { AreaFormComponent } from './areas/pages/area-form/area-form.component';
import { TypesOfMeetingsTableComponent } from './types-of-meetings/pages/types-of-meetings-table/types-of-meetings-table.component';
import { MeetingsTableComponent } from './meetings/pages/meetings-table/meetings-table.component';
import { TypeOfMeetingFormComponent } from './types-of-meetings/pages/type-of-meeting-form/type-of-meeting-form.component';
import { MeetingFormComponent } from './meetings/pages/meeting-form/meeting-form.component';
import { MeetingInfoComponent } from './meetings/pages/meeting-info/meeting-info.component';
import { WorkersTableComponent } from './workers/pages/workers-table/workers-table.component';
import { WorkerFormComponent } from './workers/pages/worker-form/worker-form.component';
import { WorkerInfoComponent } from './workers/pages/worker-info/worker-info.component';
import { AgendasTableComponent } from './agenda/agendas-table/agendas-table.component';
import { AgendaFormComponent } from './agenda/agenda-form/agenda-form.component';
import { AgendaInfoComponent } from './agenda/agenda-info/agenda-info.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { authGuard } from './auth/guards/auth.guard';
import { AdminTableComponent } from './auth/pages/admin-table/admin-table.component';

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
    path: '',
    pathMatch: 'full',
    redirectTo: 'iniciar-sesion',
  },
  {
    path: 'iniciar-sesion',
    component: LoginComponent,
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    component: AdminTableComponent,
  },
  {
    path: 'acuerdos',
    // canActivate: [authGuard],
    component: AgreementsTableComponent,
  },
  {
    path: 'acuerdos/detalles/:id',
    canActivate: [authGuard],
    component: AgreementInfoComponent,
  },
  {
    path: 'acuerdos/agregar',
    canActivate: [authGuard],
    component: AgreementFormComponent,
  },
  {
    path: 'acuerdos/editar/:id',
    canActivate: [authGuard],
    component: AgreementFormComponent,
  },
  {
    path: 'areas',
    //  canActivate: [authGuard],
    component: AreasTableComponent,
  },
  {
    path: 'areas/agregar',
    canActivate: [authGuard],
    component: AreaFormComponent,
  },
  {
    path: 'areas/editar/:id',
    canActivate: [authGuard],
    component: AreaFormComponent,
  },
  {
    path: 'reuniones',
    canActivate: [authGuard],
    component: MeetingsTableComponent,
  },
  {
    path: 'reuniones/agregar',
    canActivate: [authGuard],
    component: MeetingFormComponent,
  },
  {
    path: 'reuniones/detalles/:id',
    canActivate: [authGuard],
    component: MeetingInfoComponent,
  },
  {
    path: 'reuniones/editar/:id',
    canActivate: [authGuard],
    component: MeetingFormComponent,
  },
  {
    path: 'tipos-de-reuniones',
    canActivate: [authGuard],
    component: TypesOfMeetingsTableComponent,
  },
  {
    path: 'tipos-de-reuniones/agregar',
    canActivate: [authGuard],
    component: TypeOfMeetingFormComponent,
  },
  {
    path: 'trabajadores',
    canActivate: [authGuard],
    component: WorkersTableComponent,
  },
  {
    path: 'trabajadores/agregar',
    canActivate: [authGuard],
    component: WorkerFormComponent,
  },
  {
    path: 'trabajadores/detalles/:id',
    canActivate: [authGuard],
    component: WorkerInfoComponent,
  },
  {
    path: 'trabajadores/editar/:id',
    canActivate: [authGuard],
    component: WorkerFormComponent,
  },
  {
    path: 'agendas',
    canActivate: [authGuard],
    component: AgendasTableComponent,
  },
  {
    path: 'agendas/agregar',
    canActivate: [authGuard],
    component: AgendaFormComponent,
  },
  {
    path: 'agendas/detalles/:id',
    canActivate: [authGuard],
    component: AgendaInfoComponent,
  },
  {
    path: 'agendas/editar/:id',
    canActivate: [authGuard],
    component: AgendaFormComponent,
  },
  {
    path: 'tipos-de-reuniones/editar/:id',
    canActivate: [authGuard],
    component: TypeOfMeetingFormComponent,
  },
  { path: '**', redirectTo: 'iniciar-sesion' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
