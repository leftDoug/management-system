import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementFormComponent } from './pages/agreement-form/agreement-form.component';
import { AgreementComponent } from './pages/agreement/agreement.component';
import { AgreementsTableComponent } from './pages/agreements-table/agreements-table.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { RouterModule } from '@angular/router';
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
  declarations: [
    AgreementComponent,
    AgreementFormComponent,
    AgreementsTableComponent,
    SearchComponent,
  ],
  exports: [AgreementsTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
export class AgreementsModule {}
