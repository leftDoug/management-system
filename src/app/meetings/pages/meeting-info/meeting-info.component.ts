import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';

import { Worker } from 'src/app/auth/interfaces/user.interface';
import { getNotification } from 'src/app/shared/notifications';
import { Meeting } from '../../interfaces/meeting.interface';
import { MeetingsService } from '../../services/meetings.service';

@Component({
  selector: 'app-meeting-info',
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class MeetingInfoComponent implements OnInit {
  meeting!: Meeting;

  members: Worker[] = [];
  guests: Worker[] = [];
  participants: Worker[] = [];
  attendants: Worker[] = [];
  missing: Worker[] = [];

  formVisible: boolean = false;
  attendanceVisible: boolean = false;

  constructor(
    private meetingsService: MeetingsService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.meetingsService.getInfo(id)))
      .subscribe((resp3) => {
        if (resp3.ok) {
          this.meeting = resp3.arg as Meeting;

          const workers = [...(this.meeting.participants as Worker[])];

          this.members = [...workers].filter(
            (worker) => (worker as Worker).member!
          );

          this.guests = [...workers].filter(
            (worker) => !(worker as Worker).member!
          );

          this.missing = [...workers].filter(
            (worker) => (worker as Worker).status === 'ausente'
          );

          this.participants = [...workers].filter(
            (worker) => (worker as Worker).status !== 'presente'
          );

          this.attendants = [...workers].filter(
            (worker) => (worker as Worker).status === 'presente'
          );
        }
      });
  }

  showAttendanceDialog() {
    this.attendanceVisible = true;
  }

  showFormDialog() {
    this.formVisible = true;
  }

  hideDialog() {
    this.formVisible = false;
    this.attendanceVisible = false;
  }

  hideFormDialog() {
    this.formVisible = false;
  }

  hideAttendanceDialog() {
    this.attendanceVisible = false;
  }

  reloadInfo(ok: boolean) {
    if (ok) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.meetingsService.getInfo(id)))
        .subscribe((resp3) => {
          if (resp3.ok) {
            this.meeting = resp3.arg as Meeting;
            this.members = (this.meeting.participants as Worker[]).filter(
              (worker) => worker.member
            );
            this.guests = (this.meeting.participants as Worker[]).filter(
              (worker) => !worker.member
            );
            this.missing = (this.meeting.participants as Worker[]).filter(
              (worker) => worker.status === 'ausente'
            );
          }
        });

      this.hideDialog();
    }
  }

  saveAttendance() {
    this.meetingsService
      .setAttendance(this.meeting.id, {
        attendants: [...this.attendants.map((worker) => worker.id)],
      })
      .subscribe((resp) => {
        this.messageService.add(getNotification(resp.msg!, resp.ok));

        if (resp.ok) {
          this.reloadInfo(true);
        }
      });
  }

  openMeeting() {
    this.meetingsService.setOpen(this.meeting.id).subscribe((resp) => {
      this.messageService.add(getNotification(resp.msg!, resp.ok));

      if (resp.ok) {
        this.showAttendanceDialog();
      }
    });
  }

  closeMeeting() {
    this.meetingsService.setClose(this.meeting.id).subscribe((resp) => {
      this.messageService.add(getNotification(resp.msg!, resp.ok));

      if (resp.ok) {
        this.reloadInfo(true);
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'pendiente':
        return 'info';
      case 'en proceso':
        return 'warning';
      case 'completada':
        return 'success';
      default:
        return 'danger';
    }
  }
}
