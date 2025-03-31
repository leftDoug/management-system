import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgendasService } from '../services/agendas.service';
import { Agenda, Topic } from '../interfaces/agenda.interface';
import { getNotification } from 'src/app/shared/notifications';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css'],
  providers: [ConfirmationService],
})
export class AgendaFormComponent implements OnInit {
  agendaForm: FormGroup = this.fb.group({
    year: [
      new Date(),
      [Validators.required, Validators.min(2000), Validators.max(2070)],
    ],
  });

  topicForm: FormGroup = this.fb.group({
    id: undefined,
    month: [new Date(), Validators.required],
    name: ['', [Validators.required, Validators.minLength(10)]],
  });

  newAgenda: Agenda = {
    id: '',
    idTypeOfMeeting: '',
    topics: [],
    year: new Date().getFullYear(),
  };

  newTopic: Topic = {
    id: '',
    month: new Date(),
    name: '',
  };

  topicDialog: boolean = false;

  submitted: boolean = false;
  topicSubmitted: boolean = false;

  counter: number = 1;
  // visible: boolean = false;

  @Input() idToM: string = '';
  @Input() agenda?: Agenda;
  @Input() info: boolean = false;

  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<boolean>();
  @Output() infoChange = new EventEmitter<boolean>();

  constructor(
    private agendasService: AgendasService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.newAgenda.idTypeOfMeeting = this.idToM;

    if (this.agenda) {
      this.agendasService.getInfo(this.agenda.id).subscribe((resp) => {
        const a: Agenda = resp.arg as Agenda;
        this.newAgenda.id = a.id;
        this.newAgenda.topics = a.topics!;

        this.year.setValue(new Date(a.year));

        this.newAgenda.topics.forEach(
          (topic) => (topic.monthNumber = new Date(topic.month).getMonth())
        );
      });
    }
    // this.organizationsService.getToMs('26').subscribe((resp) => {
    //   this.typesOfMeetings = resp;
    //   this.agendaForm.patchValue({ year: 2024, typeOfMeeting: resp[0].id });
    //   this.newAgenda = {
    //     id: '',
    //     year: 2024,
    //     idTypeOfMeeting: resp[0].id,
    //     topics: [],
    //   };
    //   this.agendaCreated = true;
    //   this.changed = true;
    //   this.hideAgendaDialog();
    //   this.hideMessages();
    // });
    // this.agendasService.getAll().subscribe((a) => (this.agendas = a));
    // this.typesOfMeetingsService.getAll().subscribe((tom) => {
    //   let tempTOM = tom;
    //   this.typesOfMeetings = tempTOM;
    // });
    // if (this.router.url.includes('editar')) {
    //   this.title = 'Actualizar Agenda';
    //   this.agendaCreated = true;
    //   this.hideAgendaDialog();
    //   this.activatedRoute.params
    //     .pipe(
    //       switchMap(({ id }) => this.agendasService.getById(id)),
    //       switchMap((a) => {
    //         this.newAgenda = a;
    //         this.agendaForm.setValue({
    //           typeOfMeeting: a.idTypeOfMeeting,
    //           year: a.year,
    //         });
    //         return this.typesOfMeetingsService.getById(a.idTypeOfMeeting);
    //       }),
    //       switchMap((tom) => {
    //         this.typeOfMeeting = tom.name;
    //         return this.areasService.getById(tom.idArea!);
    //       })
    //     )
    //     .subscribe(
    //       (a) => (this.typeOfMeeting = this.typeOfMeeting + ' (' + a.name + ')')
    //     );
    // } else {
    //   this.title = 'Crear Agenda';
    // }

    // this.agendaForm.patchValue({idTypeOfMeeting:this.idToM})
  }

  get year() {
    return this.agendaForm.get('year')!;
  }

  get idTopic() {
    return this.topicForm.get('id')!;
  }

  get month() {
    return this.topicForm.get('month')!;
  }

  get name() {
    return this.topicForm.get('name')!;
  }

  get monthErrorMsg(): string {
    if (this.month.errors!['required']) {
      return 'El mes es requerido';
    }

    return '';
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.errors!['required']) {
      return 'El tema es requerido';
    } else if (this.name.errors!['minlength']) {
      return 'El tema debe tener al menos 10 caracteres';
    }

    return '';
  }

  get yearErrorMsg(): string {
    if (this.year.errors!['required']) {
      return 'El año es requerido';
    } else if (this.year.errors!['min']) {
      return 'El año debe ser igual o posterior al 2000';
    } else if (this.year.errors!['max']) {
      return 'El año debe ser igual o anterior al 2070';
    }

    return '';
  }

  edit() {
    this.info = false;
    this.infoChange.emit(false);
  }

  hide() {
    this.onCancel.emit(true);
  }

  saveTopic() {
    this.topicSubmitted = true;

    if (this.topicForm.valid) {
      this.newTopic = {
        id: this.idTopic.value ?? 'temp' + this.counter,
        month: new Date(this.month.value.setHours(0, 0, 0, 0)),
        name: this.name.value.trim(),
        monthNumber: this.month.value.getMonth(),
      };
      const coincidence: boolean = this.newAgenda.topics!.some(
        (topic) =>
          new Date(topic.month).getMonth() ===
            new Date(this.newTopic.month).getMonth() &&
          topic.name.toLowerCase() === this.newTopic.name.toLowerCase()
      );

      if (coincidence) {
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Este Tema ya existe para este mes',
        });
      } else {
        if (this.idTopic.value) {
          const index = this.newAgenda.topics!.findIndex(
            (topic) => topic.id === this.idTopic.value
          );
          this.newAgenda.topics![index] = this.newTopic;

          this.messageService.add(getNotification('Tema actualizado', true));
        } else {
          this.newAgenda.topics!.push(this.newTopic);

          this.counter++;

          this.messageService.add(getNotification('Tema agregado', true));
        }

        this.hideTopicDialog();

        this.newAgenda.topics = [...this.newAgenda.topics!];
      }
    }

    // let tempTopics: Topic[] = [...this.newAgenda.topics!];
    // let tempTopic: Topic = {
    //   id: this.topicForm.get('id')?.value,
    //   name: this.topicForm.get('name')?.value,
    //   month: this.topicForm.get('month')?.value,
    // };

    // if (tempTopic.id !== '') {
    //   let index: number = this.findById(tempTopic.id);

    //   tempTopics[index] = tempTopic;
    // } else {
    //   // tempTopic.id = this.createId();

    //   tempTopics.push(tempTopic);
    // }

    // this.messageService.add({
    //   severity: 'success',
    //   detail: 'El tema ha sido agregado',
    //   summary: 'Tema Agregado',
    // });

    // this.newAgenda.topics = tempTopics;
    // // this.changed = true;

    // this.topicForm.reset({
    //   id: '',
    //   name: '',
    //   month: '',
    // });

    // this.hideTopicDialog();
  }

  // FIXME: cambiar el tipo de year a Date
  save() {
    this.submitted = true;

    if (this.agendaForm.valid) {
      this.newAgenda.year = this.year.value.getFullYear();

      if (this.agenda) {
        this.agendasService.update(this.newAgenda).subscribe((resp) => {
          this.messageService.add(getNotification(resp.msg!, resp.ok));

          if (resp.ok) {
            this.onSubmit.emit(true);

            this.hide();
          } else {
            this.agendasService
              .getInfo(this.agenda!.id)
              .subscribe(
                (resp2) =>
                  (this.newAgenda.topics = (resp2.arg as Agenda).topics)
              );
          }
        });
      } else {
        this.agendasService.add(this.newAgenda).subscribe((resp) => {
          this.messageService.add(getNotification(resp.msg!, resp.ok));

          if (resp.ok) {
            this.onSubmit.emit(true);

            this.hide();
          } else if (!resp.msg!.toLowerCase().includes('existe')) {
            this.agendasService.getAll().subscribe((resp) => {
              const found = (resp.arg as Agenda[]).find(
                (agenda) =>
                  agenda.idTypeOfMeeting === this.newAgenda.idTypeOfMeeting &&
                  agenda.year === this.newAgenda.year
              );

              if (found) {
                this.erase(found.id);
              }
            });
          }
        });
      }
    }

    // XXX así se hace para poner un mensaje fuera de un toast
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'ERROR',
    //     detail: 'La Agenda debe tener al menos un Tema',
    //     key: 'banner',
    //   });
  }

  // save() {
  //   this.submitted = true;

  //   if (this.agendaForm.valid && this.topics.length > 0) {
  //     this.newAgenda = {
  //       id: '',
  //       year: this.year.value,
  //       idTypeOfMeeting: this.idTypeOfMeeting.value,
  //     };

  //     this.agendasService.add(this.newAgenda).subscribe((resp) => {
  //       let anyError: boolean = false;
  //       if (resp.ok) {
  //         // this.topics.forEach((topic) => {
  //         // this.agendasService
  //         //   .addTopic(resp.arg as Agenda, topic)
  //         //   .subscribe((tResp) => {
  //         //     if (!tResp.ok) {
  //         //       this.showMessage(tResp.msg!);

  //         //       anyError = true;
  //         //     }
  //         //   });

  //         // this.addTopics(resp.arg as Agenda).catch((msg) => {
  //         //   this.showMessage(msg);

  //         //   this.erase((resp.arg as Agenda).id);
  //         // });

  //         this.addTopics(resp.arg as Agenda);

  //         // this.addTopic(resp.arg as Agenda, topic).catch(() => {
  //         //   anyError = true;
  //         // });
  //         // });
  //       } else {
  //         this.showMessage(resp.msg!);
  //       }
  //     });
  //   } else {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'ERROR',
  //       detail: 'La Agenda debe tener al menos un Tema',
  //       key: 'banner',
  //     });
  //   }

  //   // this.changed = false;
  // }

  // addTopics(agenda: Agenda) {
  //   return this.topics.some((topic) => {
  //     let counterx: number = 0;
  //     this.agendasService.addTopic(agenda.id, topic).subscribe((resp) => {
  //       if (!resp.ok) {
  //         counterx++;
  //         this.showMessage(resp.msg!);
  //       }
  //       return !resp.ok;
  //     });

  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'ERROR',
  //       detail: `No se pudieron agregar ${counterx} Temas a la Agenda`,
  //     });
  //   });
  // }

  erase(id: string) {
    this.agendasService.eraseTopics(id).subscribe(console.log);
    this.agendasService.erase(id).subscribe(console.log);
  }

  // create() {
  //   if (!this.newAgenda.id) {
  //     // this.newAgenda.id = this.createId();

  //     this.agendasService.add(this.newAgenda).subscribe(console.log);
  //   } else {
  //     this.agendasService.update(this.newAgenda).subscribe(console.log);
  //   }

  //   // this.changed = false;
  // }

  // createId(): string {
  //   let id: string = '';
  //   var chars: string =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  //   for (let i = 0; i < 5; i++) {
  //     id += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }

  //   return id;
  // }

  // editTopic(topic: Topic) {
  //   this.showTopicDialog();

  //   this.topicForm.setValue({
  //     id: topic.id,
  //     name: topic.name,
  //     month: topic.month,
  //   });
  // }

  // filterMonth(event: AutoCompleteCompleteEvent) {
  //   this.filteredMonths = [];

  //   this.months.forEach((month) => {
  //     if (
  //       month.name.toLowerCase().startsWith(event.query.toLocaleLowerCase())
  //     ) {
  //       this.filteredMonths.push(month);
  //     }
  //   });
  // }

  hideTopicDialog() {
    this.topicDialog = false;

    this.topicForm.reset({
      id: undefined,
      name: '',
      month: new Date(),
    });
  }

  // countTopics(month: number): number {
  //   let total = 0;

  //   this.newAgenda.topics!.forEach((topic) => {
  //     if (new Date(topic.month).getMonth() === month) {
  //       total++;
  //     }
  //   });

  //   return total;
  // }

  remove(id: string) {
    this.confirmationService.confirm({
      message: 'Está seguro de eliminar este Tema?',
      header: 'Eliminar Tema',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      // acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.newAgenda.topics = this.newAgenda.topics!.filter(
          (topic) => topic.id !== id
        );
        this.messageService.add(getNotification('El Tema ha sido eliminado'));
      },
      reject: () => {},
    });
  }

  showTopicDialog(topic?: Topic) {
    if (topic) {
      this.topicForm.patchValue({
        id: topic.id,
        month: new Date(topic.month),
        name: topic.name,
      });
    }

    this.topicDialog = true;
    this.topicSubmitted = false;
  }
}
