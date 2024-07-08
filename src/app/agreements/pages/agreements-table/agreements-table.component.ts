import { Component, OnInit } from '@angular/core';
import {
  Agreement,
  AgreementWithStatus,
  Status,
} from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { Router } from '@angular/router';
import { AreasService } from 'src/app/areas/services/areas.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { SessionsService } from 'src/app/sessions/services/sessions.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { tap } from 'rxjs';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { Session } from 'src/app/sessions/interfaces/session.interface';
import { Worker } from 'src/app/workers/interfaces/worker.interface';

// interface Status {
//   label: string;
//   value: string;
// }

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent implements OnInit {
  // removedAgreement: Agreement | undefined;
  // statuses: Status[] = [
  //   { label: 'CUMPLIDO', value: true },
  //   { label: 'INCUMPLIDO', value: false },
  // ];
  agreements: AgreementWithStatus[] = [];
  areas: Area[] = [];
  workers: Worker[] = [];
  meetings: Meeting[] = [];
  sessions: Session[] = [];
  str_areas: string[] = [];
  str_meetings: string[] = [];
  str_sessions: string[] = [];
  status: Status[] = [
    Status.fulfilled,
    Status.unfulfilled,
    Status.canceled,
    Status.inProcess,
  ];
  // searchText: string = '';
  // loading: boolean = true;
  today: Date = new Date();

  // get agreements(): Agreement[] {
  //   this._agreements = this.agreementsService.agreements;
  //   return this._agreements;
  // }

  get fulfilledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.fulfilled) amount++;
    });
    return amount;
  }

  get unfulfilledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.unfulfilled) amount++;
    });
    return amount;
  }

  get inProcessAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.inProcess) amount++;
    });
    return amount;
  }

  get canceledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.canceled) amount++;
    });
    return amount;
  }

  constructor(
    private agreementsService: AgreementsService,
    private areasService: AreasService,
    private workersService: WorkersService,
    private meetingsService: MeetingsService,
    private sessionsService: SessionsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.agreements = this.agreementsService.agreements;
    this.areasService.getAll().subscribe((resp) => {
      this.areas = resp;
      this.areas.forEach((value) => this.str_areas.push(value.name));
    });
    this.workersService.getAll().subscribe((resp) => (this.workers = resp));
    this.meetingsService.getAll().subscribe((resp) => {
      this.meetings = resp;
      this.meetings.forEach((value) => this.str_meetings.push(value.name));
    });
    this.sessionsService.getAll().subscribe((resp) => {
      this.sessions = resp;
      this.sessions.forEach((value) => this.str_sessions.push(value.name));
    });
    this.agreementsService.getAll().subscribe((resp) => {
      resp.forEach((value) => {
        const agreement: AgreementWithStatus = {
          PK_id: value.PK_id,
          number: value.number,
          content: value.content,
          area: this.areas.find((area) => area.PK_id === value.FK_idArea)
            ?.name!,
          responsible: this.workers.find(
            (worker) => worker.PK_id === value.FK_idResponsible
          )?.name!,
          meeting: this.meetings.find(
            (meeting) => meeting.PK_id === value.FK_idMeeting
          )?.name!,
          session: this.sessions.find(
            (session) => session.PK_id === value.FK_idSession
          )?.name!,
          meetingDate: value.meetingDate,
          status: this.getStatus(value),
        };

        this.agreements.push(agreement);
      });
    });
  }

  // BUG: getSeverity esta implementado 2 veces
  getSeverity(status: string): string {
    switch (status) {
      case 'cumplido':
        return 'text-bg-success';
      case 'en proceso':
        return 'text-bg-primary';
      case 'anulado':
        return 'text-bg-secondary';
      default:
        return 'text-bg-danger';
    }
  }

  // BUG: getStatus esta implementado 2 veces (se pueden meter en el servicio)
  // FIXME: actualizar el estado de cada acuerdo cada vez k se muestre la tabla
  // getStatus(agreement: Agreement): string {
  //   if (agreement.agreementCompilanceDate.getTime() - new Date().getTime() >= 0)
  //     return 'en proceso';
  //   return 'incumplido';
  // }

  // BUG: la tabla se recarga cadavez k escribe
  // search(event: any): void {
  //   const value = event.target.value;
  //   this.agreements = [];
  //   this.agreementsService.getAll().subscribe((resp) =>
  //     resp.forEach((agreement) => {
  //       if (agreement.workArea.toLowerCase().includes(value)) {
  //         this.agreements.push(agreement);
  //       }
  //     })
  //   );
  //   // this.agreementsService.agreements.forEach((agreement) => {
  //   //   if (agreement.workArea.toLocaleLowerCase().includes(value))
  //   //     this.agreements.push(agreement);
  //   // });
  // }

  // navigate(): void {
  //   this.router.navigate(['./agregar']);
  // }

  // TODO: actualizar el metodo para cambiar el color del <tr> si no funciona lo de la directiva
  // setRowColor(agreement: Agreement): string {
  //   if (agreement.status === 'cumplido') return 'completed';
  //   if (agreement.status === 'anulado') return 'removed';
  //   if (agreement.status === 'incumplido') return 'incomplete';
  //   return '';
  // }

  // print(event: any): void {
  //   console.log(event);
  // }

  getArea(id: string): string {
    return this.areas.find((area) => area.PK_id === id)?.name || '';
  }
  getMeeting(id: string): string {
    return this.meetings.find((meeting) => meeting.PK_id === id)?.name || '';
  }
  getSession(id: string): string {
    return this.sessions.find((session) => session.PK_id === id)?.name || '';
  }
  getResponsible(id: string): string {
    return this.workers.find((worker) => worker.PK_id === id)?.name || '';
  }
  getStatus(a: Agreement): Status {
    const date: Date = new Date(a.compilanceDate);

    if (a.completed) {
      return Status.fulfilled;
    } else if (a.canceled) {
      return Status.canceled;
    } else if (this.today.getTime() < date.getTime()) {
      return Status.inProcess;
    } else {
      return Status.unfulfilled;
    }
  }
}
