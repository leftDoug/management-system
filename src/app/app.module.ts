import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PrimengModule } from './primeng/primeng.module';

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
