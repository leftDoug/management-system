import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { InputNumberModule } from 'primeng/inputnumber';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    ButtonModule,
    MessagesModule,
    BrowserAnimationsModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    InputTextareaModule,
    CalendarModule,
    TableModule,
    TagModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
})
export class PrimengModule {}
