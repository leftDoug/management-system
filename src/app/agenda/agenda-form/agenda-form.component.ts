import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AgendasService } from '../services/agendas.service';
import {
  Agenda,
  MonthName,
  MonthWithId,
  Topic,
} from '../interfaces/agenda.interface';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { AreasService } from 'src/app/areas/services/areas.service';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgendaFormComponent implements OnInit {
  agendaForm: FormGroup = this.fb.group({
    typeOfMeeting: ['', Validators.required],
    year: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(2000), Validators.max(2070)],
    ],
  });

  topicForm: FormGroup = this.fb.group({
    id: '',
    month: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(10)]],
  });

  newAgenda: Agenda = {
    id: '',
    FK_idTypeOfMeeting: '',
    topics: [],
    year: new Date().getFullYear(),
  };

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

  msgErrorNoData: Message[] = [
    {
      severity: 'error',
      detail: 'La Agenda debe los datos para poder añadirle Temas',
    },
  ];

  msgErrorExistentAgenda: Message[] = [
    {
      severity: 'error',
      detail: 'Ya existe una Agenda para este Tipo de Reunion este Año',
    },
  ];

  agendaCreated: boolean = false;
  agendaDialog: boolean = true;
  agendas: Agenda[] = [];
  areas: Area[] = [];
  canceledData: boolean = false;
  changed: boolean = false;
  existentAgenda: boolean = false;
  filteredMonths: MonthWithId[] = [];
  title: string = '';
  topicDialog: boolean = false;
  typeOfMeeting: string = '';
  typesOfMeetings: TypeOfMeeting[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private agendasService: AgendasService,
    private areasService: AreasService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private typesOfMeetingsService: TypesOfMeetingsService
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
      this.title = 'Actualizar Agenda';
      this.agendaCreated = true;

      this.hideAgendaDialog();

      this.activatedRoute.params
        .pipe(
          switchMap(({ id }) => this.agendasService.getById(id)),
          switchMap((a) => {
            this.newAgenda = a;

            this.agendaForm.setValue({
              typeOfMeeting: a.FK_idTypeOfMeeting,
              year: a.year,
            });

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
    } else {
      this.title = 'Crear Agenda';
    }
  }

  get monthErrorMsg(): string {
    if (this.topicForm.get('month')?.errors!['required']) {
      return 'El mes es requerido';
    }

    return '';
  }

  get topicErrorMsg(): string {
    if (this.topicForm.get('name')?.errors!['required']) {
      return 'El tema es requerido';
    } else if (this.topicForm.get('name')?.errors!['minlength']) {
      return 'El tema debe tener al menos 10 caracteres';
    }

    return '';
  }

  get typeOfMeetingErrorMsg(): string {
    if (this.agendaForm.get('typeOfMeeting')?.errors!['required']) {
      return 'El tipo de reunión es requerido';
    }

    return '';
  }

  get yearErrorMsg(): string {
    if (this.agendaForm.get('year')?.errors!['required']) {
      return 'El año es requerido';
    } else if (this.agendaForm.get('year')?.errors!['min']) {
      return 'El año debe ser igual o posterior al 2000';
    } else if (this.agendaForm.get('year')?.errors!['max']) {
      return 'El año debe ser igual o anterior al 2070';
    }

    return '';
  }

  addTopic() {
    let tempTopics: Topic[] = [...this.newAgenda.topics];
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

    this.newAgenda.topics = tempTopics;
    this.changed = true;

    this.topicForm.reset({
      id: '',
      name: '',
      month: '',
    });

    this.hideTopicDialog();
  }

  cancel(dialog: string) {
    if (dialog === 'agenda') {
      this.agendaForm.reset({
        year: new Date().getFullYear(),
        typeOfMeeting: '',
      });

      this.hideAgendaDialog();

      this.canceledData = true;
    } else {
      this.topicForm.reset({
        id: '',
        name: '',
        month: '',
      });

      this.hideTopicDialog();
    }
  }

  cancelChanges(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de que desea cancelar los cambios?',
      header: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.router.navigate(
          this.newAgenda.id
            ? ['agendas/detalles/', this.newAgenda.id]
            : ['/agendas']
        );
      },
      reject: () => {},
    });
  }

  create() {
    if (!this.newAgenda.id) {
      this.newAgenda.id = this.createId();

      this.agendasService.add(this.newAgenda).subscribe(console.log);
    } else {
      this.agendasService.update(this.newAgenda).subscribe(console.log);
    }

    this.changed = false;
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

  findById(id: string): number {
    for (let i = 0; i < this.newAgenda.topics.length; i++) {
      const t = this.newAgenda.topics[i];

      if (t.id === id) {
        return i;
      }
    }

    return -1;
  }

  hideAgendaDialog() {
    this.agendaDialog = false;
  }

  hideTopicDialog() {
    this.topicDialog = false;
  }

  monthTotalTopics(month: string): number {
    let total = 0;

    this.newAgenda.topics.forEach((t) => {
      if (t.month.name === month) {
        total++;
      }
    });

    return total;
  }

  remove(id: string) {
    this.confirmationService.confirm({
      message: 'Está seguro de que desea eliminar este tema?',
      header: 'Eliminar Tema',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'El tema ha sido eliminado',
          summary: 'Tema Eliminado',
        });
        this.newAgenda.topics = this.newAgenda.topics.filter(
          (t) => t.id !== id
        );
      },
      reject: () => {},
    });
  }

  setAgenda() {
    if (
      this.agendas.find(
        (a) =>
          a.FK_idTypeOfMeeting ===
            this.agendaForm.get('typeOfMeeting')?.value &&
          a.year === this.agendaForm.get('year')?.value
      )
    ) {
      this.existentAgenda = true;
    } else {
      this.newAgenda.FK_idTypeOfMeeting =
        this.agendaForm.get('typeOfMeeting')?.value;
      this.newAgenda.year = this.agendaForm.get('year')?.value;

      this.typeOfMeeting = this.typesOfMeetings.find(
        (tom) => tom.id === this.newAgenda.FK_idTypeOfMeeting
      )?.name!;

      this.agendaCreated = true;
      this.changed = true;
      this.canceledData = false;
      this.existentAgenda = false;

      this.hideAgendaDialog();
    }
  }

  showAgendaDialog() {
    this.agendaDialog = true;
  }

  showTopicDialog() {
    this.topicDialog = true;
  }

  validate(control: string, form: string): boolean {
    if (form === 'topic') {
      return (
        this.topicForm.get(control)?.errors! &&
        this.topicForm.controls[control].touched
      );
    } else {
      return (
        this.agendaForm.get(control)?.errors! &&
        this.agendaForm.controls[control].touched
      );
    }
  }
}
