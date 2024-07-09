import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
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
  // success: boolean = false;
  // messages: Message[] = [];
  // areas: Area[] = [
  //   { label: 'RRHH', value: 'RRHH', id: 'rh' },
  //   { label: 'Transporte', value: 'Transporte', id: 'tr' },
  //   { label: 'Contabilidad', value: 'Contabilidad', id: 'co' },
  //   { label: 'Logística', value: 'Logística', id: 'lo' },
  // ];
  areas: Area[] = [];
  meetings: Meeting[] = [];
  sessions: Session[] = [];
  today: Date = new Date();
  workers: Worker[] = [];
  // value: string = '';
  // checked: boolean = false;
  // num?: number;

  get contentErrorMsg(): string {
    if (this.agreementForm.get('content')?.errors!['required']) {
      return 'El contenido es requerido';
    } else if (this.agreementForm.get('content')?.errors!['minlength']) {
      return 'El contenido debe tener al menos 10 caracteres';
    }

    return '';
  }

  get responsibleErrorMsg(): string {
    if (this.agreementForm.get('responsible')?.errors!['required']) {
      return 'El responsable es requerido';
    }

    return '';
  }

  get areaErrorMsg(): string {
    if (this.agreementForm.get('area')?.errors!['required']) {
      return 'El área es requerida';
    }

    return '';
  }

  get createdByErrorMsg(): string {
    if (this.agreementForm.get('createdBy')?.errors!['required']) {
      return 'El creador es requerido';
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

  get meetingErrorMsg(): string {
    if (this.agreementForm.get('meeting')?.errors!['required']) {
      return 'La reunión es requerida';
    }

    return '';
  }

  get sessionErrorMsg(): string {
    if (this.agreementForm.get('session')?.errors!['required']) {
      return 'La sesión es requerida';
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

  constructor(
    private agreementsService: AgreementsService,
    private areasService: AreasService,
    private workersService: WorkersService,
    private meetingsService: MeetingsService,
    private sessionsService: SessionsService,
    private primengConfig: PrimeNGConfig,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router
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
    }
    // FIXME: ver x k no se puede devolver directamente resp aqui
    // this.agreementsService.getAll().subscribe((resp) => {
    //   this.getCurrentNumber(resp.at(-1)!.number!);
    // });
    this.areasService.getAll().subscribe((resp) => (this.areas = resp));
    this.meetingsService.getAll().subscribe((resp) => (this.meetings = resp));
    this.sessionsService.getAll().subscribe((resp) => (this.sessions = resp));

    // this.agreementForm.reset({
    //   answer: this.newAgreement.answer,
    //   area: this.newAgreement.FK_idArea,
    //   compilanceDate: this.newAgreement.compilanceDate,
    //   completed: this.newAgreement.completed,
    //   content: this.newAgreement.content,
    //   createdBy: this.newAgreement.FK_idCreatedBy,
    //   meeting: this.newAgreement.FK_idMeeting,
    //   meetingDate: this.newAgreement.meetingDate,
    //   meetingEndTime: this.newAgreement.meetingEndTime,
    //   meetingStartTime: this.newAgreement.meetingStartTime,
    //   responsible: this.newAgreement.FK_idResponsible,
    //   session: this.newAgreement.FK_idSession,
    // });

    // tap se usa para hacer acciones paralelas (resetear workers en este caso)
    // switchMap se usa para cambiar la respuesta k se da (en este caso llamar a otro servicio y asi usar solo 1 subscribe)
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

  // getCurrentNumber(n: number): void {
  //   this.num = n;
  //   console.log(this.num);
  // }

  // keyPressed(event: any) {
  //   this.value = event.target.value;
  //   console.log(this.value);
  // }

  create(): void {
    // TODO: descomentar
    // this.generateNumber();
    this.generateId();
    this.setTime();
    // this.setStatus();
    // this.agreementsService.insert(this.newAgreement);
    this.agreementsService.add(this.newAgreement).subscribe(console.log);
    console.log(this.newAgreement);
    this.messageService.add({
      severity: 'success',
      summary: 'Acuerdo Creado',
      detail: 'El acuerdo ha sido creado.',
    });
    this.agreementForm.reset();
  }

  setTime(): void {
    let hours: number = this.newAgreement.meetingStartTime.getHours();
    let minutes: number = this.newAgreement.meetingStartTime.getMinutes();
    this.newAgreement.meetingStartTime = new Date(
      this.newAgreement.meetingStartTime
    );
    this.newAgreement.meetingStartTime.setHours(hours);
    this.newAgreement.meetingStartTime.setMinutes(minutes);

    hours = this.newAgreement.meetingEndTime.getHours();
    minutes = this.newAgreement.meetingEndTime.getMinutes();
    this.newAgreement.meetingEndTime = new Date(
      this.newAgreement.meetingEndTime
    );
    this.newAgreement.meetingEndTime.setHours(hours);
    this.newAgreement.meetingEndTime.setMinutes(minutes);
  }

  // getDayBeginning(): Date {
  //   const beginning: Date = new Date(this.today);
  //   beginning.setHours(9);
  //   beginning.setMinutes(0);
  //   return beginning;
  // }

  // getDayEnd(): Date {
  //   const beginning: Date = new Date(this.today);
  //   beginning.setHours(17);
  //   beginning.setMinutes(0);
  //   return beginning;
  // }

  // getNotTodayEnd(): Date {
  //   return this.newAgreement.meetingDate.getTime() <=
  //     this.getDayBeginning().getTime()
  //     ? this.getDayEnd()
  //     : this.today;
  // }

  // FIXME: arreglar
  // generateNumber(): void {
  //   this.agreementsService.getAll().subscribe((resp) => {
  //     this.getCurrentNumber(resp.at(-1)!.number!);
  //   });
  //   // this.num = this.agreementsService.agreements.at(-1)?.number;
  //   // console.log(this.num);
  //   this.newAgreement.number = this.num ? this.num + 1 : 1;
  //   console.log(this.newAgreement.number);
  // }

  generateId(): void {
    this.newAgreement.id =
      this.newAgreement.FK_idArea + this.newAgreement.number;
  }

  // FIXME: actualizar el estado de cada acuerdo cada vez k se muestre la tabla
  // setStatus(): void {
  //   if (this.checked) this.newAgreement.status = Status.cumplido;
  //   else if (
  //     this.newAgreement.agreementCompilanceDate.getTime() -
  //       new Date().getTime() >=
  //     0
  //   )
  //     this.newAgreement.status = Status.en_proceso;
  // }

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
