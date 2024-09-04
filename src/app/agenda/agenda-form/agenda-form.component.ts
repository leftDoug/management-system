import { Component, OnInit } from '@angular/core';
import { AgendasService } from '../services/agendas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Agenda,
  MonthName,
  MonthWithId,
  Topic,
} from '../interfaces/agenda.interface';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { switchMap, tap } from 'rxjs';
import { AreasService } from 'src/app/areas/services/areas.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css'],
})
export class AgendaFormComponent implements OnInit {
  agendaForm: FormGroup = this.fb.group({
    year: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(2000), Validators.max(2070)],
    ],
    typeOfMeeting: ['', Validators.required],
  });

  topicForm: FormGroup = this.fb.group({
    id: '',
    name: ['', Validators.required],
    month: ['', Validators.required],
  });

  previousAgenda: Agenda = {
    id: '',
    FK_idTypeOfMeeting: '',
    year: new Date().getFullYear(),
    topics: [],
  };

  newAgenda: Agenda = {
    id: '',
    FK_idTypeOfMeeting: '',
    year: new Date().getFullYear(),
    topics: [],
  };
  typeOfMeeting: string = '';
  agendaCreated: boolean = false;
  topics: Topic[] = [];
  typesOfMeetings: TypeOfMeeting[] = [];
  agendaDialog: boolean = true;
  topicDialog: boolean = false;
  months: MonthWithId[] = [
    { id: 1, name: MonthName.january },
    { id: 2, name: MonthName.february },
    { id: 3, name: MonthName.march },
    { id: 4, name: MonthName.april },
    { id: 5, name: MonthName.may },
    { id: 6, name: MonthName.june },
    { id: 7, name: MonthName.july },
    { id: 8, name: MonthName.august },
    { id: 9, name: MonthName.september },
    { id: 10, name: MonthName.october },
    { id: 11, name: MonthName.november },
    { id: 12, name: MonthName.december },
  ];
  filteredMonths: MonthWithId[] = [];
  agendas: Agenda[] = [];
  areas: Area[] = [];

  constructor(
    private agendasService: AgendasService,
    private fb: FormBuilder,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private areasService: AreasService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agendasService.getAll().subscribe((a) => (this.agendas = a));

    this.areasService.getAll().subscribe((a) => (this.areas = a));

    this.typesOfMeetingsService.getAll().subscribe((tom) => {
      let tempTOM = tom;

      tempTOM.map((t) => {
        t.name =
          t.name +
          ' (' +
          this.areas.find((a) => a.id === t.FK_idWorkArea)?.name +
          ')';
      });

      this.typesOfMeetings = tempTOM;
    });

    if (this.router.url.includes('editar')) {
      this.hideAgendaDialog();
      this.agendaCreated = true;

      this.activatedRoute.params
        .pipe(
          switchMap(({ id }) => this.agendasService.getById(id)),
          switchMap((a) => {
            this.previousAgenda = a;
            this.newAgenda = a;
            this.topics = a.topics;

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
  }

  showTopicDialog() {
    this.topicDialog = true;
  }

  hideTopicDialog() {
    this.topicDialog = false;
  }

  showAgendaDialog() {
    this.agendaDialog = true;
  }

  hideAgendaDialog() {
    this.agendaDialog = false;
  }

  addTopic() {
    let tempTopics: Topic[] = [...this.topics];
    let tempTopic: Topic = {
      id: this.topicForm.get('id')?.value,
      name: this.topicForm.get('name')?.value,
      month: this.topicForm.get('month')?.value,
    };

    if (tempTopic.id !== '') {
      let index: number = this.findById(tempTopic.id);

      tempTopics[index] = tempTopic;
    } else {
      tempTopic.id = this.createId();

      tempTopics.push(tempTopic);
    }

    this.topics = tempTopics;

    this.topicForm.reset({
      id: '',
      name: '',
      month: '',
    });

    this.hideTopicDialog();
  }

  filterMonth(event: AutoCompleteCompleteEvent) {
    this.filteredMonths = [];

    this.months.forEach((month) => {
      if (
        month.name.toLowerCase().startsWith(event.query.toLocaleLowerCase())
      ) {
        this.filteredMonths.push(month);
      }
    });
  }

  createId(): string {
    let id: string = '';
    var chars: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  }

  editTopic(topic: Topic) {
    this.showTopicDialog();

    this.topicForm.setValue({
      id: topic.id,
      name: topic.name,
      month: topic.month,
    });
  }

  findById(id: string): number {
    for (let i = 0; i < this.topics.length; i++) {
      const t = this.topics[i];

      if (t.id === id) {
        return i;
      }
    }

    return -1;
  }

  monthTotalTopics(month: string): number {
    let total = 0;

    this.topics.forEach((t) => {
      if (t.month.name === month) {
        total++;
      }
    });

    return total;
  }

  setAgenda() {
    this.newAgenda.FK_idTypeOfMeeting =
      this.agendaForm.get('typeOfMeeting')?.value;
    this.newAgenda.year = this.agendaForm.get('year')?.value;

    this.typeOfMeeting = this.agendaForm.get('typeOfMeeting')?.value.name;

    this.agendaCreated = true;

    this.hideAgendaDialog();
  }

  cancel(dialog: string) {
    if (dialog === 'agenda') {
      this.agendaForm.reset({
        year: new Date().getFullYear(),
        typeOfMeeting: '',
      });

      this.hideAgendaDialog();
    } else {
      this.topicForm.reset({
        id: '',
        name: '',
        month: '',
      });

      this.hideTopicDialog();
    }
  }

  remove(id: string) {
    this.topics = this.topics.filter((t) => t.id !== id);
  }

  create() {
    this.newAgenda.topics = this.topics;

    if (!this.newAgenda.id) {
      this.newAgenda.id = this.createId();

      this.agendasService.add(this.newAgenda).subscribe(console.log);
    } else {
      this.agendasService.update(this.newAgenda).subscribe(console.log);
    }
  }
}
