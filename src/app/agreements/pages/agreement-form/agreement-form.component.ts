import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/validator/validator.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { Worker, WorkerX } from 'src/app/workers/interfaces/worker.interface';
import { AreasService } from 'src/app/areas/services/areas.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { Session } from 'src/app/sessions/interfaces/session.interface';
import { SessionsService } from 'src/app/sessions/services/sessions.service';
import { WorkersAreasService } from 'src/app/shared/services/workers-areas.service';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { WorkerArea } from 'src/app/shared/navbar/worker-area.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';

@Component({
  selector: 'app-agreement-form',
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css'],
  providers: [MessageService],
})
export class AgreementFormComponent implements OnInit {
  agreementForm: FormGroup = this.fb.group(
    {
      answer: [''],
      completed: [false],
      content: ['', [Validators.required, Validators.minLength(10)]],
      meeting: ['', Validators.required],
      meetingDate: [new Date(), Validators.required],
      compilanceDate: [{ value: '', disabled: true }, Validators.required],
      createdBy: [{ value: '', disabled: true }, Validators.required],
      responsible: [{ value: '', disabled: true }, Validators.required],
    },
    {
      validators: [
        this.validatorService.compareMeetingAndCompilance(
          'meetingDate',
          'compilanceDate'
        ),
      ],
    }
  );

  meetings: Meeting[] = [];
  newAgreement: Agreement = {
    id: '',
    FK_idCreatedBy: '',
    FK_idMeeting: '',
    FK_idResponsible: '',
    answer: '',
    canceled: false,
    compilanceDate: new Date(),
    completed: false,
    content: '',
    number: 0,
  };
  workers: WorkerX[] = [];
  secretaries: WorkerX[] = [];
  workersArea: WorkerArea[] = [];
  typeOfMeeting: TypeOfMeeting | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
    private fb: FormBuilder,
    private meetingsService: MeetingsService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private validatorService: ValidatorService,
    private workersService: WorkersService,
    private workersAreasService: WorkersAreasService,
    private typesOfMeetingsService: TypesOfMeetingsService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // this.messages = [
    //   { severity: 'success', detail: 'Agreement created successfully' },
    // ];

    this.meetingsService.getAll().subscribe((resp) => (this.meetings = resp));

    this.agreementForm
      .get('meeting')
      ?.valueChanges.pipe(
        tap(() => {
          this.agreementForm.get('createdBy')?.reset('');
          this.agreementForm.get('createdBy')?.enable();

          this.agreementForm.get('compilanceDate')?.reset('');
          this.agreementForm.get('compilanceDate')?.enable();

          this.agreementForm.get('responsible')?.reset('');
          this.agreementForm.get('responsible')?.enable();
        }),
        // switchMap((im) => this.meetingsService.getById(im)),
        switchMap((im) => {
          const m = this.meetings.find((m) => im === m.id)!;
          console.log(m);
          const date = new Date(m.date);

          date.setDate(date.getDate() + 7);

          this.agreementForm.get('meetingDate')?.setValue(new Date(m.date));
          this.agreementForm.get('compilanceDate')?.setValue(new Date(date));

          return this.typesOfMeetingsService.getById(m.FK_idTypeOfMeeting);
        })
      )
      .subscribe((t) => {
        this.typeOfMeeting = t;

        this.workersAreasService
          .getByIdArea(this.typeOfMeeting.FK_idWorkArea)
          .subscribe((wa) => (this.workersArea = wa));

        this.workersService.xgetAll().subscribe((w) => {
          const responsibles: WorkerX[] = [];
          const s: WorkerX[] = [];

          w.forEach((worker) => {
            if (this.workersArea.find((wa) => worker.id === wa.FK_idWorker)) {
              responsibles.push(worker);

              if (worker.secretary) {
                s.push(worker);
              }
            }
          });

          this.workers = responsibles;
          this.secretaries = s;
        });
      });

    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.agreementsService.getById(id)))
        .subscribe((resp) => {
          this.newAgreement = resp;
          this.agreementForm.patchValue({
            answer: this.newAgreement.answer,
            completed: this.newAgreement.completed,
            content: this.newAgreement.content,
            meeting: this.newAgreement.FK_idMeeting,
            compilanceDate: new Date(this.newAgreement.compilanceDate),
            createdBy: this.newAgreement.FK_idCreatedBy,
            responsible: this.newAgreement.FK_idResponsible,
          });
        });
    } else {
      this.agreementsService
        .getAll()
        .subscribe(
          (resp) => (this.newAgreement.number = resp.at(-1)?.number! + 1)
        );
    }
  }

  get compilanceDateErrorMsg(): string {
    if (this.agreementForm.get('compilanceDate')?.errors!['required']) {
      return 'La fecha de cumplimiento es requerida';
    } else if (
      this.agreementForm.get('compilanceDate')?.errors![
        'meetingCompilanceError'
      ]
    ) {
      return 'La fecha de cumplimiento no puede ser anterior a la de la reunión';
    }

    return '';
  }

  get contentErrorMsg(): string {
    if (this.agreementForm.get('content')?.errors!['required']) {
      return 'El contenido es requerido';
    } else if (this.agreementForm.get('content')?.errors!['minlength']) {
      return 'El contenido debe tener al menos 10 caracteres';
    }

    return '';
  }

  get createdByErrorMsg(): string {
    if (this.agreementForm.get('createdBy')?.errors!['required']) {
      return 'El creador es requerido';
    }

    return '';
  }

  get meetingErrorMsg(): string {
    if (this.agreementForm.get('meeting')?.errors!['required']) {
      return 'La reunión es requerida';
    }

    return '';
  }

  get meetingDateErrorMsg(): string {
    if (this.agreementForm.get('meetingDate')?.errors!['required']) {
      return 'La fecha de la reunión es requerida';
    } else if (
      this.agreementForm.get('meetingDate')?.errors!['meetingDateError']
    ) {
      return 'La fecha de la reunión no puede ser posterior a hoy';
    }

    return '';
  }

  get responsibleErrorMsg(): string {
    if (this.agreementForm.get('responsible')?.errors!['required']) {
      return 'El responsable es requerido';
    }

    return '';
  }

  create(): void {
    this.newAgreement.FK_idCreatedBy =
      this.agreementForm.get('createdBy')?.value;
    this.newAgreement.FK_idMeeting = this.agreementForm.get('meeting')?.value;
    this.newAgreement.FK_idResponsible =
      this.agreementForm.get('responsible')?.value;
    this.newAgreement.answer = this.agreementForm.get('answer')?.value;
    this.newAgreement.completed = this.agreementForm.get('completed')?.value;
    this.newAgreement.content = this.agreementForm.get('content')?.value;
    this.newAgreement.compilanceDate =
      this.agreementForm.get('compilanceDate')?.value;

    if (!this.newAgreement.id) {
      this.generateId();

      this.agreementsService.add(this.newAgreement).subscribe(console.log);

      this.newAgreement.id = '';
      this.newAgreement.number = this.newAgreement.number + 1;

      // FIXME: esta dando palo aqui xk no se vuelven a crear las fechas en el reset
      this.agreementForm.reset({
        answer: '',
        completed: false,
        compilanceDate: this.newAgreement.compilanceDate,
        createdBy: this.newAgreement.FK_idCreatedBy,
        meeting: this.newAgreement.FK_idMeeting,
        responsible: this.newAgreement.FK_idResponsible,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Acuerdo Creado',
        detail: 'El acuerdo ha sido creado.',
      });
    } else {
      this.agreementsService.update(this.newAgreement).subscribe(console.log);

      this.messageService.add({
        severity: 'success',
        summary: 'Acuerdo Actualizado',
        detail: 'El acuerdo ha sido actualizado.',
      });

      this.agreementForm.reset(this.agreementForm.value);
    }
  }

  generateId(): void {
    this.newAgreement.id =
      this.newAgreement.FK_idMeeting + this.newAgreement.number;
  }

  validate(control: string): boolean {
    if (
      control === 'content' &&
      this.agreementForm.get(control)?.pristine &&
      this.agreementForm.get(control)?.touched &&
      this.agreementForm.get(control)?.errors!['required']
    ) {
      this.agreementForm.controls[control].markAsDirty();
    }

    return (
      this.agreementForm.get(control)?.errors! &&
      this.agreementForm.controls[control].touched
    );
  }
}
