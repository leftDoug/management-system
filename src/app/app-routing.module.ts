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
  { path: 'reuniones', component: MeetingsTableComponent },
  { path: 'reuniones/agregar', component: MeetingFormComponent },
  { path: 'reuniones/detalles/:id', component: MeetingInfoComponent },
  { path: 'reuniones/editar/:id', component: MeetingFormComponent },
  { path: 'tipos-de-reuniones', component: TypesOfMeetingsTableComponent },
  { path: 'tipos-de-reuniones/agregar', component: TypeOfMeetingFormComponent },
  { path: 'trabajadores', component: WorkersTableComponent },
  { path: 'trabajadores/agregar', component: WorkerFormComponent },
  { path: 'trabajadores/detalles/:id', component: WorkerInfoComponent },
  { path: 'trabajadores/editar/:id', component: WorkerFormComponent },
  { path: 'agendas', component: AgendasTableComponent },
  { path: 'agendas/agregar', component: AgendaFormComponent },
  { path: 'agendas/detalles/:id', component: AgendaInfoComponent },
  { path: 'agendas/editar/:id', component: AgendaFormComponent },
  {
    path: 'tipos-de-reuniones/editar/:id',
    component: TypeOfMeetingFormComponent,
  },
  { path: '**', redirectTo: 'acuerdos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
