import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { OrganizationsService } from '../../services/organizations.service';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Organization } from '../../interfaces/organization.interface';
import { Worker } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class OrganizationInfoComponent {
  id: string = '';
  organization!: Organization;
  workers: Worker[] = [];
  typesOfMeetings: TypeOfMeeting[] = [];
  tomDialog: boolean = false;
  tomForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
  });
  newToM: TypeOfMeeting = {
    id: '',
    name: '',
    idOrganization: '',
  };
  submitted: boolean = false;

  showToMTable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private organizationsService: OrganizationsService,
    private tomsService: TypesOfMeetingsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) {
    // this.organization = {
    //   id: '',
    //   name: '',
    //   leader: '',
    // };
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        tap(({ id }) => {
          this.organizationsService.getWorkers(id).subscribe((resp) => {
            this.workers = resp.arg as Worker[];
          });
        }),
        switchMap(({ id }) => this.organizationsService.getInfo(id))
      )
      .subscribe((resp) => {
        if (resp.ok) {
          this.organization = resp.arg as Organization;
          this.showToMTable = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: resp.msg,
            life: 3000,
          });
        }
      });
    //   this.activatedRoute.params
    //     .pipe(
    //       switchMap(({ id }) => {
    //         this.id = id;

    //         return this.organizationsService.getToMs(id);
    //       })
    //     )
    //     .subscribe((resp) => (this.typesOfMeetings = resp));
  }

  // get name() {
  //   return this.tomForm.get('name')!;
  // }

  // get nameErrorMsg(): string {
  //   if (this.name.errors!['required']) {
  //     return 'El tipo de reunión es requerido';
  //   } else if (this.name.errors!['minlength']) {
  //     return 'El tipo de reunión debe tener al menos 5 caracteres';
  //   }

  //   return '';
  // }

  // hideDialog() {}

  // openNew(id: string | null) {
  //   if (id) {
  //     this.findToM(id!).then((tom) => {
  //       this.submitted = false;
  //       this.tomDialog = true;

  //       this.tomForm.patchValue(tom);
  //     });
  //   } else {
  //     this.submitted = false;
  //     this.tomDialog = true;
  //   }
  // }

  // save(): void {
  //   this.submitted = true;

  //   if (this.tomForm.valid) {
  //     this.newToM.name = this.name.value.trim();

  //     if (!this.newToM.id) {
  //       this.tomsService.add(this.newToM).subscribe((resp) => {
  //         this.messageService.add({
  //           severity: resp.ok ? 'success' : 'error',
  //           summary: resp.ok
  //             ? 'Tipo de Reunión guardado.'
  //             : 'Error al guardar el Tipo de Reunión.',
  //           detail: resp.msg,
  //           life: 3000,
  //         });

  //         if (resp.ok) {
  //           this.tomForm.reset({
  //             name: '',
  //           });
  //         }
  //       });
  //     } else {
  //       this.tomsService.update(this.newToM).subscribe((resp) => {
  //         this.messageService.add({
  //           severity: resp.ok ? 'success' : 'error',
  //           summary: resp.ok
  //             ? 'Tipo de Reunión guardado.'
  //             : 'Error al guardar el Tipo de Reunión.',
  //           detail: resp.msg,
  //           life: 3000,
  //         });

  //         if (resp.ok) {
  //           this.tomForm.reset({
  //             name: '',
  //           });
  //         }
  //       });
  //     }
  //   }
  // }

  // findToM(id: string): Promise<TypeOfMeeting> {
  //   return new Promise((resolve, reject) => {
  //     this.tomsService.getById(id).subscribe((resp) => {
  //       if (resp.ok) {
  //         resolve(resp.arg as TypeOfMeeting);
  //       } else {
  //         reject(
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: resp.msg,
  //             life: 3000,
  //           })
  //         );
  //       }
  //     });
  //   });
  // }

  // remove(event: Event, id: string): void {
  //   this.findToM(id).then((typeOfMeeting) => {
  //     this.confirmationService.confirm({
  //       target: event.target as EventTarget,
  //       message: 'Está seguro de que desea eliminar este Tipo de Reunión?',
  //       header: 'Eliminar Tipo de Reunión',
  //       icon: 'pi pi-exclamation-triangle',
  //       acceptButtonStyleClass: 'p-button-danger p-button-text',
  //       acceptLabel: 'Sí',
  //       rejectButtonStyleClass: 'p-button-text p-button-text',
  //       accept: () => {
  //         this.tomsService.remove(typeOfMeeting).subscribe((resp) => {
  //           this.messageService.add({
  //             severity: resp.ok ? 'info' : 'error',
  //             summary: resp.ok ? 'Tipo de Reunión eliminado.' : 'Error',
  //             detail: resp.msg,
  //           });

  //           if (resp.ok) {
  //             this.typesOfMeetings = this.typesOfMeetings.filter(
  //               (tom) => tom.id !== id
  //             );
  //           }
  //         });
  //       },
  //       reject: () => {},
  //     });
  //   });
  // }
}
