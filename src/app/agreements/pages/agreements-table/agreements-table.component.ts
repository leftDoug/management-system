import { Component, OnInit } from '@angular/core';
import {
  Agreement,
  AgreementWithStatus,
  Status,
} from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { Worker } from 'src/app/workers/interfaces/worker.interface';
import { getSeverity } from 'src/app/shared/severity-status';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserLogged } from 'src/app/auth/interfaces/user.interface';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent implements OnInit {
  agreements: Agreement[] = [];
  meetings: Meeting[] = [];
  status: Status[] = [
    Status.canceled,
    Status.fulfilled,
    Status.inProcess,
    Status.unfulfilled,
  ];
  statuses = [
    { label: 'ANULADO', value: 'anulado' },
    { label: 'CUMPLIDO', value: 'cumplido' },
    { label: 'EN PROCESO', value: 'en proceso' },
    { label: 'INCUMPLIDO', value: 'incumplido' },
  ];
  // today: Date = new Date();
  workers: Worker[] = [];
  role!: string;
  user!: UserLogged;
  directorArea: boolean = false;
  // worker!: testWorker;

  agreementsWS: AgreementWithStatus[] = [];

  constructor(
    private agreementsService: AgreementsService,
    private workersService: WorkersService,
    private meetingsService: MeetingsService,
    private authService: AuthService,
    private areasService: AreasService,
    private typesOfMeetingsService: TypesOfMeetingsService
  ) {}

  ngOnInit(): void {
    // this.workersService
    //   .testgetById(this.authService.testUser.id)
    //   .subscribe((w) => (this.worker = w));
    // this.user = this.authService.user;
    // this.authService.getRole(this.user.id).subscribe((r) => (this.role = r));

    // let tempAgreements: Agreement[] = [];
    // let tempMeetings: Meeting[] = [];
    // let tempWorkers: Worker[] = [];
    // if (this.role === 'Director de Área') {
    //   console.log('hey');
    // }
    // switch (this.role) {
    //   case 'Director de Área':
    //     this.directorArea = true;
    //     this.workersService.getAreas(this.user.id).subscribe((resp) => {
    //       resp.forEach((a) => {
    //         this.areasService
    //           .getWorkers(a.id)
    //           .subscribe((w) => (tempWorkers = tempWorkers.concat(w)));
    //         this.areasService.getToM(a.id).subscribe((resp) => {
    //           resp.forEach((tom) => {
    //             this.typesOfMeetingsService
    //               .getMeetings(tom.id)
    //               .subscribe((resp) => {
    //                 tempMeetings = tempMeetings.concat(resp);

    //                 resp.forEach((m) => {
    //                   this.meetingsService
    //                     .getAgreements(m.id)
    //                     .subscribe(
    //                       (resp) =>
    //                         (tempAgreements = tempAgreements.concat(resp))
    //                     );
    //                 });
    //               });
    //           });
    //         });
    //       });
    //     });
    //     break;
    //   case 'Trabajador':
    //     this.workersService
    //       .getAgreements(this.user.idWorker)
    //       .subscribe((resp) => (tempAgreements = tempAgreements.concat(resp)));
    //     break;
    //   case 'Director General':
    //     this.agreementsService
    //       .getAll()
    //       .subscribe((resp) => (tempAgreements = resp));
    //     break;
    //   default:
    //     break;
    // }

    // if (this.role === 'Director de Área') {
    //   this.directorArea = true;
    // }

    // if (this.directorArea) {
    //   this.areasService.getToM(this.user.idArea).subscribe((resp) => {
    //     resp.forEach((tom) => {
    //       this.typesOfMeetingsService.getMeetings(tom.id).subscribe((resp) => {
    //         resp.forEach((m) => {
    //           this.meetingsService.getAgreements(m.id).subscribe(resp=>tempAgreements=tempAgreements.concat(resp));
    //         });
    //       });
    //     });
    //   });
    // }

    // let aws: AgreementWithStatus[] = [];

    // tempAgreements.forEach((value) => {
    //   const agreement: AgreementWithStatus = {
    //     id: value.id,
    //     number: value.number,
    //     content: value.content,
    //     responsible: value.idResponsible,
    //     meeting: value.idMeeting,
    //     status: this.getStatus(value),
    //   };

    //   aws.push(agreement);
    // });

    // if (this.role === 'Director de Área' || this.role === 'Director General') {
    //   this.workersService.getAll().subscribe((resp) => {
    //     this.workers = resp;
    //     this.workers.sort((a, b) => a.name.localeCompare(b.name));
    //   });

    //   this.meetingsService.getAll().subscribe((resp) => {
    //     this.meetings = resp;
    //     this.meetings.sort((a, b) => a.name.localeCompare(b.name));
    //   });
    // }

    // this.agreementsService.getAll().subscribe((resp) => {
    //   let a: AgreementWithStatus[] = [];

    //   resp.forEach((value) => {
    //     const agreement: AgreementWithStatus = {
    //       id: value.id,
    //       number: value.number,
    //       content: value.content,
    //       responsible: this.workers.find(
    //         (worker) => worker.id === value.idResponsible
    //       )?.name!,
    //       meeting: this.meetings.find(
    //         (meeting) => meeting.id === value.idMeeting
    //       )?.name!,
    //       status: this.getStatus(value),
    //     };

    //     a.push(agreement);
    //   });

    //   this.agreements = aws;
    // });

    // let tempAg: Agreement[] = [];

    this.agreementsService
      .getAll()
      .subscribe((resp) => (this.agreements = resp));

    this.workersService.getAll().subscribe((resp) => (this.workers = resp));
    this.meetingsService.getAll().subscribe((resp) => (this.meetings = resp));

    this.agreementsService.getAll().subscribe((resp) => {
      let a: AgreementWithStatus[] = [];
      console.log(resp);

      resp.forEach((value) => {
        const agreement: AgreementWithStatus = {
          id: value.id,
          number: value.number,
          content: value.content,
          responsible: value.responsible!,
          meeting: value.meeting!,
          status: this.getStatus(value),
        };

        a.push(agreement);
      });

      this.agreementsWS = a;
    });
  }

  // get user() {
  //   return this.authService.testUser;
  // }

  get fulfilledAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (this.getStatus(agreement) === Status.fulfilled) amount++;
    });

    return amount;
  }

  get unfulfilledAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (this.getStatus(agreement) === Status.unfulfilled) amount++;
    });

    return amount;
  }

  get inProcessAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (this.getStatus(agreement) === Status.inProcess) amount++;
    });

    return amount;
  }

  get canceledAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (this.getStatus(agreement) === Status.canceled) amount++;
    });

    return amount;
  }

  getStatus(agreement: Agreement): Status {
    const date: Date = new Date(agreement.compilance_date);
    const today: Date = new Date();

    if (agreement.completed) {
      return Status.fulfilled;
    } else if (!agreement.state) {
      return Status.canceled;
    } else if (today.getTime() < date.getTime()) {
      return Status.inProcess;
    } else {
      return Status.unfulfilled;
    }
  }

  setSeverity(status: Status) {
    return getSeverity(null, status);
  }

  getResponsible(id: string): string {
    return this.workers.find((worker) => worker.id === id)?.name!;
  }

  getMeeting(id: string): string {
    return this.meetings.find((meeting) => meeting.id === id)?.name!;
  }

  getSeverityX(status: string) {
    switch (status) {
      case 'anulado':
        return 'secondary';
      case 'cumplido':
        return 'success';
      case 'en proceso':
        return 'info';
      case 'incumplido':
        return 'danger';
      default:
        return 'warning';
    }
  }
}
