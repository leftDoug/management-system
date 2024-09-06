import { Component, OnInit } from '@angular/core';
import { Agenda, MonthWithTopics } from '../interfaces/agenda.interface';
import { ActivatedRoute } from '@angular/router';
import { AgendasService } from '../services/agendas.service';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { switchMap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-agenda-info',
  templateUrl: './agenda-info.component.html',
  styleUrls: ['./agenda-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgendaInfoComponent implements OnInit {
  agenda: Agenda = {
    id: '',
    FK_idTypeOfMeeting: '',
    year: new Date().getFullYear(),
    topics: [],
  };
  typeOfMeeting: string = '';
  months: MonthWithTopics[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private agendasService: AgendasService,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private areasService: AreasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.agendasService.getById(id)),
        switchMap((a) => {
          this.agenda = a;

          let tempMonths: MonthWithTopics[] = [];
          let tempMonth: MonthWithTopics | undefined;

          a.topics.forEach((t) => {
            if (!tempMonths.find((tm) => tm.name === t.month.name)) {
              tempMonth = {
                name: t.month.name,
                topics: [t.name],
              };

              tempMonths.push(tempMonth);
            } else {
              tempMonths
                .find((tm) => tm.name === t.month.name)
                ?.topics.push(t.name);
            }
          });

          this.months = tempMonths;

          return this.typesOfMeetingsService.getById(a.FK_idTypeOfMeeting);
        }),
        switchMap((tom) => {
          this.typeOfMeeting = tom.name;

          return this.areasService.getById(tom.FK_idWorkArea);
        })
      )
      .subscribe(
        (a) => (this.typeOfMeeting = this.typeOfMeeting + ' (' + a.name + ')')
      );
  }

  remove(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de que desea eliminar esta agenda?',
      header: 'Eliminar Agenda',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'La agenda ha sido eliminada',
          summary: 'Agenda Eliminada',
        });
        this.agendasService.remove(this.agenda.id).subscribe(console.log);
      },
      reject: () => {},
    });
    // this.areasService.remove(id).subscribe(console.log);
  }
}
