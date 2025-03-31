import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Agenda } from '../interfaces/agenda.interface';
import { AgendasService } from '../services/agendas.service';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { getNotification } from 'src/app/shared/notifications';
import { StandardResponse } from 'src/app/shared/interfaces/standard.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';

@Component({
  selector: 'app-agendas-table',
  templateUrl: './agendas-table.component.html',
  styleUrls: ['./agendas-table.component.css'],
  providers: [ConfirmationService],
})
export class AgendasTableComponent implements OnInit {
  agendas: Agenda[] = [];
  // agenda: Agenda | undefined;

  sortOptions: SelectItem[] = [
    { label: 'Año Descendente', value: '!year' },
    { label: 'Año Ascendente', value: 'year' },
  ];
  sortOrder!: number;
  sortField!: string;
  sortKey?: string;

  createVisible: boolean = false;
  infoMode: boolean = false;

  agenda?: Agenda;

  visible: boolean = true;
  @Input() tom!: TypeOfMeeting;

  @Output() onHide = new EventEmitter<boolean>();

  constructor(
    private agendasService: AgendasService,
    private messageService: MessageService,
    private tomsService: TypesOfMeetingsService
  ) {}

  ngOnInit(): void {
    this.tomsService.getAgendas(this.tom.id).subscribe((resp) => {
      if (!resp.ok) {
        this.messageService.add(getNotification(resp.msg!, resp.ok));
      } else {
        this.agendas = (resp.arg as Agenda[]).sort((a, b) => b.year - a.year);
      }
    });

    // this.agendasService.getAll().subscribe((a) => {
    //   let tempAgendas: Agenda[] = [];
    //   a.forEach((item) => {
    //     let tempAgenda: Agenda = item;
    //     this.typesOfMeetingsService
    //       .getById(item.idTypeOfMeeting)
    //       .pipe(
    //         switchMap((tom) => {
    //           tempAgenda.idTypeOfMeeting = tom.name;
    //           return this.areasService.getById(tom.idArea!);
    //         })
    //       )
    //       .subscribe(
    //         (rArea) =>
    //           (tempAgenda.idTypeOfMeeting =
    //             tempAgenda.idTypeOfMeeting + ' (' + rArea.name + ')')
    //       );
    //     tempAgendas.push(tempAgenda);
    //   });
    //   this.agendas = tempAgendas;
    // });
  }

  onSortChange(event: DropdownChangeEvent) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  createAgenda() {
    // this.visible = false;
    this.createVisible = true;
  }

  showInfo(a: Agenda) {
    this.agenda = a;
    this.createVisible = true;
    this.infoMode = true;
  }

  reloadTable(ok: boolean) {
    if (ok) {
      this.tomsService
        .getAgendas(this.tom!.id)
        .subscribe(
          (resp) =>
            (this.agendas = (resp.arg as Agenda[]).sort(
              (a, b) => b.year - a.year
            ))
        );
    }
  }

  changeView(change: boolean) {
    if (change) {
      this.createVisible = false;
      this.agenda = undefined;
    }
  }

  hideDialog() {
    this.visible = false;
    this.onHide.emit(true);
  }
}
