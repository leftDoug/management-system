import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { PrimengModule } from './primeng/primeng.module';
import localeES from '@angular/common/locales/es-CU';
import { registerLocaleData } from '@angular/common';

import { AgreementsModule } from './agreements/agreements.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';
import { MeetingsModule } from './meetings/meetings.module';
import { TypesOfMeetingsModule } from './types-of-meetings/types-of-meetings.module';
import { WorkersModule } from './workers/workers.module';
import { AgendaModule } from './agenda/agenda.module';
import { OrganizationsModule } from './organizations/organizations.module';

registerLocaleData(localeES);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // CommonModule,
    HttpClientModule,
    // PrimengModule,
    AgreementsModule,
    AreasModule,
    MeetingsModule,
    TypesOfMeetingsModule,
    WorkersModule,
    AuthModule,
    AppRoutingModule,
    SharedModule,
    AgendaModule,
    OrganizationsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CU' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
