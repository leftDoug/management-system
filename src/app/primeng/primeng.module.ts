import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
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
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MenubarModule } from 'primeng/menubar';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
  exports: [
    ButtonModule,
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
    CardModule,
    MessagesModule,
    MenubarModule,
    DividerModule,
    MultiSelectModule,
    KeyFilterModule,
    ToolbarModule,
    DialogModule,
    AutoCompleteModule,
    FieldsetModule,
  ],
})
export class PrimengModule {}
