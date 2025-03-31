import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meeting, Session } from '../../interfaces/meeting.interface';
import { ValidatorService } from 'src/app/validator/validator.service';
import { MeetingsService } from '../../services/meetings.service';
import { MessageService } from 'primeng/api';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { Worker } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { OrganizationsService } from 'src/app/organizations/services/organizations.service';
import { getNotification } from 'src/app/shared/notifications';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.css'],
})
export class MeetingFormComponent implements OnInit {
  meetingForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      secretary: ['', Validators.required],
      date: [new Date(), Validators.required],
      startTime: [new Date(), Validators.required],
      endTime: [new Date(), Validators.required],
      session: ['', Validators.required],
    },
    {
      validators: [
        this.validatorService.compareBeginningAndEnd('startTime', 'endTime'),
      ],
    }
  );

  newMeeting!: Meeting;

  sessions: Session[] = [Session.ordinary, Session.extraordinary];

  organizationMembers: Worker[] = [];
  availableMembers: Worker[] = [];
  availableWorkers: Worker[] = [];
  members: Worker[] = [];
  guests: Worker[] = [];

  dataSubmitted: boolean = false;

  @Input() typeOfMeeting!: TypeOfMeeting;
  @Input() organization!: Organization;
  @Input() meeting?: Meeting;

  @Output() onSave = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private meetingsService: MeetingsService,
    private authService: AuthService,
    private organizationsService: OrganizationsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.organizationsService
      .getWorkers(this.organization.id)
      .subscribe((resp) => {
        this.organizationMembers = resp.arg as Worker[];

        if (this.meeting) {
          this.members = (this.meeting.participants as Worker[]).filter(
            (worker) => worker.member
          );
          this.guests = (this.meeting.participants as Worker[]).filter(
            (worker) => !worker.member
          );
        }

        this.organizationsService
          .getById(this.organization.id)
          .subscribe((resp2) => {
            this.authService.getWorkers().subscribe((resp3) => {
              this.availableWorkers = (resp3.arg as Worker[]).filter(
                (worker) =>
                  worker.id !== (resp2.arg as Organization).idLeader &&
                  !this.organizationMembers.some(
                    (worker2) => worker2.id === worker.id
                  )
              );
            });
          });
      });

    if (this.meeting) {
      this.meetingForm.patchValue({
        name: this.meeting.name,
        date: new Date(this.meeting.date),
        endTime: new Date(this.meeting.endTime!),
        startTime: new Date(this.meeting.startTime!),
        session: this.meeting.session,
        secretary: this.meeting.secretary!.id,
      });
    }
  }

  get name() {
    return this.meetingForm.get('name')!;
  }

  get secretary() {
    return this.meetingForm.get('secretary')!;
  }

  get date() {
    return this.meetingForm.get('date')!;
  }

  get startTime() {
    return this.meetingForm.get('startTime')!;
  }

  get endTime() {
    return this.meetingForm.get('endTime')!;
  }

  get session() {
    return this.meetingForm.get('session')!;
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.errors!['required']) {
      return 'El nombre es requerido';
    }

    return '';
  }

  get secretaryErrorMsg(): string {
    this.secretary.markAsDirty();

    if (this.secretary.errors!['required']) {
      return 'El secretario es requerido';
    }

    return '';
  }

  get dateErrorMsg(): string {
    this.date.markAsDirty();

    if (this.date.errors!['required']) {
      return 'La fecha es requerida';
    }

    return '';
  }

  get startTimeErrorMsg(): string {
    this.startTime.markAsDirty();

    if (this.startTime.errors!['required']) {
      return 'La hora de inicio es requerida';
    }

    return '';
  }

  get endTimeErrorMsg(): string {
    this.endTime.markAsDirty();

    if (this.endTime.errors!['required']) {
      return 'La hora de fin es requerida';
    } else if (this.meetingForm.get('endTime')?.errors!['endBeginningError']) {
      return 'La hora de fin no puede ser anterior a la hora de inicio';
    }

    return '';
  }

  get sessionErrorMsg(): string {
    this.session.markAsDirty();

    if (this.session.errors!['required']) {
      return 'La sesión es requerida';
    }

    return '';
  }

  setAvailableGuests() {
    if (this.meeting) {
      this.availableWorkers = this.availableWorkers.filter(
        (worker) => !this.guests.some((worker2) => worker2.id === worker.id)
      );
    }
  }

  submitData() {
    this.dataSubmitted = true;

    if (this.meetingForm.valid) {
      this.setAvailableMembers();
    }
  }

  setAvailableMembers() {
    if (this.meeting) {
      this.members = this.members.filter(
        (worker) => worker.id !== this.secretary.value
      );

      this.availableMembers = this.organizationMembers.filter(
        (worker) =>
          worker.id !== this.secretary.value &&
          !this.members.some((worker2) => worker2.id === worker.id)
      );
    } else {
      this.availableMembers = this.organizationMembers.filter(
        (worker) => worker.id !== this.secretary.value
      );
    }
  }

  checkParticipants() {
    if (this.members.length === 0) {
      this.messageService.add(
        getNotification('Debe haber al menos un miembro convocado', false)
      );
    }

    return this.members.length !== 0;
  }

  save(): void {
    this.newMeeting = {
      id: this.meeting ? this.meeting.id : '',
      name: this.name.value.trim(),
      date: this.date.value,
      startTime: this.startTime.value,
      endTime: this.endTime.value,
      session: this.session.value,
      idTypeOfMeeting: this.typeOfMeeting.id,
      idSecretary: this.secretary.value,
      members: this.members.map((member) => member.id),
      guests: this.guests.map((guest) => guest.id),
    };

    if (!this.meeting) {
      this.meetingsService.add(this.newMeeting).subscribe((resp) => {
        this.messageService.add(getNotification(resp.msg!, resp.ok));

        if (resp.ok) {
          this.meetingForm.reset({
            id: '',
            name: '',
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            session: '',
          });

          this.onSave.emit(true);
        }
      });
    } else {
      this.meetingsService.update(this.newMeeting).subscribe((resp) => {
        this.messageService.add(getNotification(resp.msg!, resp.ok));

        if (resp.ok) {
          this.meetingForm.reset({
            id: '',
            name: '',
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            session: '',
          });

          this.onSave.emit(true);
        }
      });
    }
  }
}
