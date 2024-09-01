import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meeting, Session } from '../../interfaces/meeting.interface';
import { Worker, WorkerX } from '../../../workers/interfaces/worker.interface';
import { ValidatorService } from 'src/app/validator/validator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from '../../services/meetings.service';
import { MessageService } from 'primeng/api';
import { switchMap, tap } from 'rxjs';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { AreasService } from 'src/app/areas/services/areas.service';
import { WorkersAreasService } from 'src/app/shared/services/workers-areas.service';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.css'],
  providers: [MessageService],
})
export class MeetingFormComponent implements OnInit {
  meetingForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      typeOfMeeting: ['', Validators.required],
      date: [
        new Date(),
        [Validators.required, this.validatorService.meetingDate],
      ],
      endTime: [
        new Date(),
        [Validators.required, this.validatorService.timeLimits],
      ],
      startTime: [
        new Date(),
        [Validators.required, this.validatorService.timeLimits],
      ],
      responsible: [{ value: '', disabled: true }, Validators.required],
      session: ['', Validators.required],
    },
    {
      validators: [
        this.validatorService.compareBeginningAndEnd('startTime', 'endTime'),
      ],
    }
  );

  newMeeting: Meeting = {
    id: '',
    FK_idResponsible: '',
    FK_idTypeOfMeeting: '',
    name: '',
    date: new Date(),
    endTime: new Date(),
    startTime: new Date(),
    session: Session.ordinary,
  };
  sessions: Session[] = [Session.ordinary, Session.extraordinary];
  today: Date = new Date();
  workers: WorkerX[] = [];
  typesOfMeetings: TypeOfMeeting[] = [];
  area: string = '';

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meetingsService: MeetingsService,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private workersService: WorkersService,
    private workersAreasService: WorkersAreasService,
    private areasService: AreasService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.meetingsService.getById(id)))
        .subscribe((resp) => {
          this.newMeeting = resp;
          this.meetingForm.reset({
            name: this.newMeeting.name,
            responsible: this.newMeeting.FK_idResponsible,
            typeOfMeeting: this.newMeeting.FK_idTypeOfMeeting,
            date: new Date(this.newMeeting.date),
            endTime: new Date(this.newMeeting.endTime),
            startTime: new Date(this.newMeeting.startTime),
            session: this.newMeeting.session,
          });
        });
    }

    this.typesOfMeetingsService
      .getAll()
      .subscribe((resp) => (this.typesOfMeetings = resp));

    // FIXME: buscar la manere de resetear sin haacer request
    this.meetingForm
      .get('typeOfMeeting')
      ?.valueChanges.pipe(
        tap((value) => {
          this.meetingForm.get('responsible')?.reset('');
          this.meetingForm.get('responsible')?.enable();
        }),
        switchMap((id) => this.typesOfMeetingsService.getById(id)),
        switchMap((typeOfMeeting) =>
          this.workersAreasService.getByIdArea(typeOfMeeting.FK_idWorkArea)
        )
      )
      .subscribe((wa) => {
        this.workersService.xgetAll().subscribe((w) => {
          let responsibles: WorkerX[] = [];

          wa.forEach((value) => {
            responsibles.push(w.find((item) => item.id === value.FK_idWorker)!);
          });

          this.workers = responsibles;
        });
      });

    // FIXME: buscar la manere de resetear sin haacer request
    this.meetingForm
      .get('typeOfMeeting')
      ?.valueChanges.pipe(
        switchMap((value) => this.typesOfMeetingsService.getById(value)),
        switchMap((value) => this.areasService.getById(value.FK_idWorkArea))
      )
      .subscribe((resp) => (this.area = resp.name));

    // this.areasService.getById(this.workers[0].FK_idWorkArea).subscribe(resp=>this.area=resp.name)
  }

  get typeOfMeetingErrorMsg(): string {
    if (this.meetingForm.get('typeOfMeeting')?.errors!['required']) {
      return 'El tipo de reunión es requerido';
    }

    return '';
  }

  get nameErrorMsg(): string {
    if (this.meetingForm.get('name')?.errors!['required']) {
      return 'El nombre de la reunión es requerido';
    }

    return '';
  }

  get dateErrorMsg(): string {
    if (this.meetingForm.get('date')?.errors!['required']) {
      return 'La fecha es requerida';
    } else if (this.meetingForm.get('date')?.errors!['meetingDateError']) {
      return 'La fecha no puede ser posterior a hoy';
    }

    return '';
  }

  get endTimeErrorMsg(): string {
    if (this.meetingForm.get('endTime')?.errors!['required']) {
      return 'La hora de fin es requerida';
    } else if (this.meetingForm.get('endTime')?.errors!['tooEarlyError']) {
      return 'La hora de fin no puede ser anterior a las 07:00';
    } else if (this.meetingForm.get('endTime')?.errors!['tooLateError']) {
      return 'La hora de fin no puede ser posterior a las 17:00';
    } else if (this.meetingForm.get('endTime')?.errors!['endBeginningError']) {
      return 'La hora de fin no puede ser anterior a la hora de inicio';
    }

    return '';
  }

  get startTimeErrorMsg(): string {
    if (this.meetingForm.get('startTime')?.errors!['required']) {
      return 'La hora de inicio es requerida';
    } else if (this.meetingForm.get('startTime')?.errors!['tooEarlyError']) {
      return 'La hora de inicio no puede ser anterior a las 07:00';
    } else if (this.meetingForm.get('startTime')?.errors!['tooLateError']) {
      return 'La hora de inicio no puede ser posterior a las 17:00';
    }

    return '';
  }

  get responsibleErrorMsg(): string {
    if (this.meetingForm.get('responsible')?.errors!['required']) {
      return 'El responsable es requerido';
    }

    return '';
  }

  get sessionErrorMsg(): string {
    if (this.meetingForm.get('session')?.errors!['required']) {
      return 'La sesión es requerida';
    }

    return '';
  }

  create(): void {
    this.newMeeting.FK_idResponsible =
      this.meetingForm.get('responsible')?.value;
    this.newMeeting.FK_idTypeOfMeeting =
      this.meetingForm.get('typeOfMeeting')?.value;
    switch (this.meetingForm.get('session')?.value) {
      case 'Ordinaria':
        this.newMeeting.session = Session.ordinary;
        break;
      case 'Extraordinaria':
        this.newMeeting.session = Session.extraordinary;
        break;
      default:
        break;
    }
    this.newMeeting.name = this.meetingForm.get('name')?.value;
    this.newMeeting.date = new Date(this.meetingForm.get('date')?.value);

    this.setTime();

    if (!this.newMeeting.id) {
      this.newMeeting.id = this.meetingForm
        .get('name')
        ?.value.trim()
        .slice(0, 2);

      this.meetingsService.add(this.newMeeting).subscribe(console.log);

      this.newMeeting.id = '';

      // FIXME: esta dando palo aqui xk no se vuelven a crear las fechas en el reset
      this.meetingForm.reset({
        date: new Date(this.newMeeting.date),
        endTime: new Date(),
        startTime: new Date(),
        responsible: this.newMeeting.FK_idResponsible,
        typeOfMeeting: this.newMeeting.FK_idTypeOfMeeting,
      });

      this.area = '';

      this.messageService.add({
        severity: 'success',
        summary: 'Reunión Creada',
        detail: 'La reunión ha sido creada.',
      });
    } else {
      this.meetingsService.update(this.newMeeting).subscribe(console.log);

      this.messageService.add({
        severity: 'success',
        summary: 'Reunión Actualizada',
        detail: 'La reunión ha sido actualizada.',
      });

      this.meetingForm.reset(this.meetingForm.value);
    }
  }

  setTime(): void {
    let hours: number = this.meetingForm.get('startTime')?.value.getHours();
    let minutes: number = this.meetingForm.get('startTime')?.value.getMinutes();

    this.newMeeting.startTime = new Date(this.meetingForm.get('date')?.value);

    this.newMeeting.startTime.setHours(hours);
    this.newMeeting.startTime.setMinutes(minutes);

    hours = this.meetingForm.get('endTime')?.value.getHours();
    minutes = this.meetingForm.get('endTime')?.value.getMinutes();

    this.newMeeting.endTime = new Date(this.meetingForm.get('date')?.value);

    this.newMeeting.endTime.setHours(hours);
    this.newMeeting.endTime.setMinutes(minutes);
  }

  validate(control: string): boolean {
    if (
      control === 'name' &&
      this.meetingForm.get(control)?.pristine &&
      this.meetingForm.get(control)?.touched &&
      this.meetingForm.get(control)?.errors!['required']
    ) {
      this.meetingForm.controls[control].markAsDirty();
    }

    if (control === 'endTime') {
      if (this.meetingForm.get(control)?.errors!) return true;
    }

    return (
      this.meetingForm.get(control)?.errors! &&
      this.meetingForm.controls[control].touched
    );
  }
}
