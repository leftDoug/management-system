import { Component, OnInit } from '@angular/core';
import { Agenda } from '../interfaces/agenda.interface';
import { AgendasService } from '../services/agendas.service';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-agendas-table',
  templateUrl: './agendas-table.component.html',
  styleUrls: ['./agendas-table.component.css'],
})
export class AgendasTableComponent implements OnInit {
  agendas: Agenda[] = [];

  constructor(
    private agendasService: AgendasService,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private areasService: AreasService
  ) {}

  ngOnInit(): void {
    this.agendasService.getAll().subscribe((a) => {
      let tempAgendas: Agenda[] = [];

      a.forEach((item) => {
        let tempAgenda: Agenda = item;

        this.typesOfMeetingsService
          .getById(item.idTypeOfMeeting)
          .pipe(
            switchMap((tom) => {
              tempAgenda.idTypeOfMeeting = tom.name;

              return this.areasService.getById(tom.idArea!);
            })
          )
          .subscribe(
            (rArea) =>
              (tempAgenda.idTypeOfMeeting =
                tempAgenda.idTypeOfMeeting + ' (' + rArea.name + ')')
          );

        tempAgendas.push(tempAgenda);
      });

      this.agendas = tempAgendas;
    });
  }
}
