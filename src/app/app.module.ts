import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AgreementsModule } from './agreements/agreements.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
// import { PrimengModule } from './primeng/primeng.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AgreementsModule,
    SharedModule,
    AppRoutingModule,
    // PrimengModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
