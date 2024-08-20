import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/validator/validator.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { Worker } from 'src/app/workers/interfaces/worker.interface';
import { AreasService } from 'src/app/areas/services/areas.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { Session } from 'src/app/sessions/interfaces/session.interface';
import { SessionsService } from 'src/app/sessions/services/sessions.service';

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
      area: ['', Validators.required],
      compilanceDate: [new Date(), Validators.required],
      completed: [false],
      content: ['', [Validators.required, Validators.minLength(10)]],
      createdBy: ['', Validators.required],
      meeting: ['', Validators.required],
      meetingDate: [
        new Date(),
        [Validators.required, this.validatorService.meetingDate],
      ],
      meetingEndTime: [
        new Date(),
        [Validators.required, this.validatorService.timeLimits],
      ],
      meetingStartTime: [
        new Date(),
        [Validators.required, this.validatorService.timeLimits],
      ],
      responsible: [{ value: '', disabled: true }, Validators.required],
      session: ['', Validators.required],
    },
    {
      validators: [
        this.validatorService.compareBeginningAndEnd(
          'meetingStartTime',
          'meetingEndTime'
        ),
        this.validatorService.compareMeetingAndCompilance(
          'meetingDate',
          'compilanceDate'
        ),
      ],
    }
  );

  areas: Area[] = [];
  meetings: Meeting[] = [];
  newAgreement: Agreement = {
    id: '',
    FK_idArea: '',
    FK_idCreatedBy: '',
    FK_idMeeting: '',
    FK_idResponsible: '',
    FK_idSession: '',
    answer: '',
    canceled: false,
    compilanceDate: new Date(),
    completed: false,
    content: '',
    meetingDate: new Date(),
    meetingEndTime: new Date(),
    meetingStartTime: new Date(),
    number: 0,
  };
  sessions: Session[] = [];
  today: Date = new Date();
  workers: Worker[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
    private areasService: AreasService,
    private fb: FormBuilder,
    private meetingsService: MeetingsService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private sessionsService: SessionsService,
    private validatorService: ValidatorService,
    private workersService: WorkersService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // this.messages = [
    //   { severity: 'success', detail: 'Agreement created successfully' },
    // ];
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.agreementsService.getById(id)))
        .subscribe((resp) => {
          this.newAgreement = resp;
          this.agreementForm.reset({
            answer: this.newAgreement.answer,
            area: this.newAgreement.FK_idArea,
            compilanceDate: new Date(this.newAgreement.compilanceDate),
            completed: this.newAgreement.completed,
            content: this.newAgreement.content,
            createdBy: this.newAgreement.FK_idCreatedBy,
            meeting: this.newAgreement.FK_idMeeting,
            meetingDate: new Date(this.newAgreement.meetingDate),
            meetingEndTime: new Date(this.newAgreement.meetingEndTime),
            meetingStartTime: new Date(this.newAgreement.meetingStartTime),
            responsible: this.newAgreement.FK_idResponsible,
            session: this.newAgreement.FK_idSession,
          });
        });
    } else {
      this.agreementsService
        .getAll()
        .subscribe(
          (resp) => (this.newAgreement.number = resp.at(-1)?.number! + 1)
        );
    }
    this.areasService.getAll().subscribe((resp) => (this.areas = resp));
    this.meetingsService.getAll().subscribe((resp) => (this.meetings = resp));
    this.sessionsService.getAll().subscribe((resp) => (this.sessions = resp));

    this.agreementForm
      .get('area')
      ?.valueChanges.pipe(
        tap(() => {
          this.agreementForm.get('responsible')?.reset('');
          this.agreementForm.get('responsible')?.enable();
        }),
        switchMap((area) => this.workersService.getByArea(area))
      )
      .subscribe((resp) => (this.workers = resp));
  }

  get areaErrorMsg(): string {
    if (this.agreementForm.get('area')?.errors!['required']) {
      return 'El área es requerida';
    }

    return '';
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

  get meetingEndTimeErrorMsg(): string {
    if (this.agreementForm.get('meetingEndTime')?.errors!['required']) {
      return 'La hora de fin es requerida';
    } else if (
      this.agreementForm.get('meetingEndTime')?.errors!['tooEarlyError']
    ) {
      return 'La hora de fin no puede ser anterior a las 09:00';
    } else if (
      this.agreementForm.get('meetingEndTime')?.errors!['tooLateError']
    ) {
      return 'La hora de fin no puede ser posterior a las 17:00';
    } else if (
      this.agreementForm.get('meetingEndTime')?.errors!['endBeginningError']
    ) {
      return 'La hora de fin no puede ser anterior a la hora de inicio';
    }

    return '';
  }

  get meetingStartTimeErrorMsg(): string {
    if (this.agreementForm.get('meetingStartTime')?.errors!['required']) {
      return 'La hora de inicio es requerida';
    } else if (
      this.agreementForm.get('meetingStartTime')?.errors!['tooEarlyError']
    ) {
      return 'La hora de inicio no puede ser anterior a las 09:00';
    } else if (
      this.agreementForm.get('meetingStartTime')?.errors!['tooLateError']
    ) {
      return 'La hora de inicio no puede ser posterior a las 17:00';
    }

    return '';
  }

  get responsibleErrorMsg(): string {
    if (this.agreementForm.get('responsible')?.errors!['required']) {
      return 'El responsable es requerido';
    }

    return '';
  }

  get sessionErrorMsg(): string {
    if (this.agreementForm.get('session')?.errors!['required']) {
      return 'La sesión es requerida';
    }

    return '';
  }

  create(): void {
    this.newAgreement.FK_idArea = this.agreementForm.get('area')?.value;
    this.newAgreement.FK_idCreatedBy =
      this.agreementForm.get('createdBy')?.value;
    this.newAgreement.FK_idMeeting = this.agreementForm.get('meeting')?.value;
    this.newAgreement.FK_idResponsible =
      this.agreementForm.get('responsible')?.value;
    this.newAgreement.FK_idSession = this.agreementForm.get('session')?.value;
    this.newAgreement.answer = this.agreementForm.get('answer')?.value;
    this.newAgreement.completed = this.agreementForm.get('completed')?.value;
    this.newAgreement.content = this.agreementForm.get('content')?.value;
    this.newAgreement.meetingDate = new Date(
      this.agreementForm.get('meetingDate')?.value
    );

    this.setTime();

    if (!this.newAgreement.id) {
      this.generateId();

      this.agreementsService.add(this.newAgreement).subscribe();

      this.newAgreement.id = '';
      this.newAgreement.number = this.newAgreement.number + 1;

      // FIXME: esta dando palo aqui xk no se vuelven a crear las fechas en el reset
      this.agreementForm.reset({
        compilanceDate: new Date(this.newAgreement.compilanceDate),
        meetingDate: new Date(this.newAgreement.meetingDate),
        meetingEndTime: new Date(this.newAgreement.meetingEndTime),
        meetingStartTime: new Date(this.newAgreement.meetingStartTime),
        responsible: { value: '', disabled: true },
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
      this.newAgreement.FK_idArea + this.newAgreement.number;
  }

  setTime(): void {
    let hours: number = this.agreementForm
      .get('meetingStartTime')
      ?.value.getHours();
    let minutes: number = this.agreementForm
      .get('meetingStartTime')
      ?.value.getMinutes();

    this.newAgreement.meetingStartTime = new Date(
      this.agreementForm.get('meetingDate')?.value
    );

    this.newAgreement.meetingStartTime.setHours(hours);
    this.newAgreement.meetingStartTime.setMinutes(minutes);

    hours = this.agreementForm.get('meetingEndTime')?.value.getHours();
    minutes = this.agreementForm.get('meetingEndTime')?.value.getMinutes();

    this.newAgreement.meetingEndTime = new Date(
      this.agreementForm.get('meetingDate')?.value
    );

    this.newAgreement.meetingEndTime.setHours(hours);
    this.newAgreement.meetingEndTime.setMinutes(minutes);

    this.newAgreement.compilanceDate = new Date(
      this.agreementForm.get('compilanceDate')?.value
    );

    this.newAgreement.compilanceDate.setHours(23);
    this.newAgreement.compilanceDate.setMinutes(59);
    this.newAgreement.compilanceDate.setSeconds(59);
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

    if (control === 'meetingEndTime') {
      if (this.agreementForm.get(control)?.errors!) return true;
    }

    return (
      this.agreementForm.get(control)?.errors! &&
      this.agreementForm.controls[control].touched
    );
  }
}
