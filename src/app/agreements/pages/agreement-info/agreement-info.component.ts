import { Component, OnInit } from '@angular/core';
import {
  Agreement,
  Response,
  Status,
} from '../../interfaces/agreement.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import { switchMap, tap } from 'rxjs';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { AreasService } from 'src/app/areas/services/areas.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { getSeverity, getStatus } from 'src/app/shared/severity-status';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getNotification } from 'src/app/shared/notifications';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement-info.component.html',
  styleUrls: ['./agreement-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgreementInfoComponent implements OnInit {
  responseForm: FormGroup = this.fb.group({
    content: ['', Validators.required],
  });

  responses: Response[] = [];

  agreement: Agreement = {
    id: '',
    content: '',
    compilanceDate: new Date(),
    state: true,
  };
  createdBy: string = '';
  meeting: string = '';
  responsible: string = '';

  formDialog: boolean = false;
  responseDialog: boolean = false;
  loading: boolean = true;

  // TODO: poner un delay para k no se vea el estado inicial al abrir la pagina

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
    private confirmationService: ConfirmationService,
    private meetingsService: MeetingsService,
    private messageService: MessageService,
    private workersService: WorkersService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        tap(({ id }) => {
          this.agreementsService
            .getResponses(id)
            .subscribe((resp) => (this.responses = resp.arg as Response[]));
        }),
        switchMap(({ id }) => this.agreementsService.getInfo(id))
      )
      .subscribe({
        next: (resp2) => {
          this.agreement = resp2.arg as Agreement;
          this.loading = false;
        },
        error: (err) => {
          this.messageService.add(getNotification(err.msg, false));
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  get content() {
    return this.responseForm.get('content')!;
  }

  get severity(): string {
    return getSeverity(this.agreement, null);
  }

  setSeverity(status: Status) {
    return getSeverity(null, status);
  }

  get status(): Status {
    return getStatus(this.agreement);
  }

  showForm() {
    this.formDialog = true;
  }

  hideForm(event: boolean) {
    if (event) {
      this.formDialog = false;
    }
  }

  showResponseDialog() {
    this.responseDialog = true;
  }

  hideResponseDialog() {
    this.responseDialog = false;
  }

  reloadInfo(event: boolean) {
    if (event) {
      this.activatedRoute.params
        .pipe(
          tap(({ id }) => {
            this.agreementsService
              .getResponses(id)
              .subscribe((resp) => (this.responses = resp.arg as Response[]));
          }),
          switchMap(({ id }) => this.agreementsService.getInfo(id))
        )
        .subscribe((resp) => (this.agreement = resp.arg as Agreement));
    }
  }

  save() {
    if (this.responseForm.valid) {
      this.agreementsService
        .addResponse({
          idAgreement: this.agreement.id,
          content: this.content.value,
        })
        .subscribe((resp) => {
          this.messageService.add(getNotification(resp.msg!, resp.ok));

          if (resp.ok) {
            this.reloadInfo(true);
            this.hideResponseDialog();
          }
        });
    }
  }

  setCompleted() {
    this.agreementsService.setCompleted(this.agreement.id).subscribe((resp) => {
      this.messageService.add(getNotification(resp.msg!, resp.ok));

      if (resp.ok) {
        this.reloadInfo(true);
      }
    });
  }

  cancel(): void {
    this.confirmationService.confirm({
      message: 'Está seguro de que desea anular este acuerdo?',
      header: 'Anular Acuerdo',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'El acuerdo ha sido anulado',
          summary: 'Acuerdo Anulado',
        });
        this.agreement.state = false;
        this.agreementsService.update(this.agreement).subscribe();
      },
      reject: () => {},
      rejectButtonStyleClass: 'mx-3',
    });
  }
}
