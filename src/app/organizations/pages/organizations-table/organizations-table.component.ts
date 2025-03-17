import { Component, OnInit } from '@angular/core';
import {
  Organization,
  OrganizationView,
} from '../../interfaces/organization.interface';
import { OrganizationsService } from '../../services/organizations.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerResponse } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StandardResponse } from '../../../shared/interfaces/standard.interface';

@Component({
  selector: 'app-organizations-table',
  templateUrl: './organizations-table.component.html',
  styleUrls: ['./organizations-table.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class OrganizationsTableComponent implements OnInit {
  organizations!: OrganizationView[];
  organizationDialog: boolean = false;
  organizationForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    idLeader: ['', Validators.required],
  });
  submitted: boolean = false;
  workers: WorkerResponse[] = [];
  workersSource: WorkerResponse[] = [];
  workersSelected: WorkerResponse[] = [];
  newOrganization: Organization = {
    id: '',
    name: '',
    idLeader: '',
    state: true,
  };

  constructor(
    private organizationsService: OrganizationsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.organizationsService
      .getAll()
      .subscribe((resp) => (this.organizations = resp));
    this.authService.getWorkers().subscribe((resp) => {
      this.workers = resp;
      // this.workersSource = [...resp];
    });
  }

  get id() {
    return this.organizationForm.get('id')!;
  }

  get name() {
    return this.organizationForm.get('name')!;
  }

  get leader() {
    return this.organizationForm.get('idLeader')!;
  }

  getNameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.hasError('required')) {
      return 'El nombre es requerido.';
    } else if (this.name.hasError('minlength')) {
      return 'El nombre debe tener al menos 3 caracteres.';
    }

    return '';
  }

  getLeaderErrorMsg(): string {
    this.leader.markAsDirty();

    if (this.leader.hasError('required')) {
      return 'El Líder es requerido.';
    }

    return '';
  }

  findOrganization(id: string): Promise<Organization> {
    return new Promise((resolve, reject) => {
      this.organizationsService.getById(id).subscribe((resp) => {
        if (resp.ok) {
          resolve(resp.arg as Organization);
        } else {
          reject(
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: resp.msg,
              life: 3000,
            })
          );
        }
      });
    });
  }

  openNew(id: string | null) {
    if (id) {
      this.findOrganization(id!).then((organization) => {
        this.submitted = false;
        this.organizationDialog = true;

        this.organizationForm.patchValue(organization);
      });
    } else {
      this.submitted = false;
      this.organizationDialog = true;
    }
  }

  hideDialog() {
    this.organizationDialog = false;
    this.submitted = false;

    this.organizationForm.reset({
      id: '',
      name: '',
      idLeader: '',
    });

    this.workersSource = [...this.workers];
    this.workersSelected = [];
  }

  submit() {
    this.submitted = true;

    this.organizationForm.valid && this.setWorkersList();
  }

  setWorkersList() {
    if (this.id.value) {
      this.organizationsService.getWorkers(this.id.value).subscribe((resp) => {
        this.workersSelected = resp.filter(
          (worker) => worker.id.toString() !== this.leader.value
        );
        this.workersSource = this.workers.filter(
          (worker) =>
            !this.workersSelected.some((w) => worker.id === w.id) &&
            worker.id !== this.leader.value
        );
      });
    } else {
      this.workersSource = this.workers.filter(
        (worker) => worker.id !== this.leader.value
      );
    }
  }

  clearSelectedWorkers() {
    this.workersSelected = [];
  }

  saveOrganization() {
    // this.submitted = true;

    if (this.workersSelected.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'No se ha seleccionado ningún Trabajador.',
        detail: 'Por favor, seleccione al menos un Trabajador.',
        key: 'selected',
      });
    } else {
      this.newOrganization = {
        id: this.id.value,
        name: this.name.value.trim(),
        idLeader: this.leader.value,
        state: true,
      };

      // FIXME: se llama a messageService 2 veces con la misma estructura
      if (this.id.value) {
        this.organizationsService
          .update(this.newOrganization)
          // XXX llama al k lanza error
          // .subscribe({
          //   next: (resp) => {
          //     this.messageService.add({
          //       severity: resp.ok ? 'success' : 'error',
          //       summary: resp.ok
          //         ? 'Organización guardada'
          //         : 'Error al guardar la Organización',
          //       detail: resp.msg,
          //       life: 3000,
          //     });
          //     if (resp.ok) {
          //       this.organizationDialog = false;

          //       this.organizationsService
          //         .getAll()
          //         .subscribe((resp) => (this.organizations = resp));

          //       this.organizationForm.reset({
          //         id: '',
          //         name: '',
          //         idLeader: '',
          //       });
          //     }
          //   },
          //   error: (err) => {
          //     this.messageService.add({
          //       severity: err.ok ? 'success' : 'error',
          //       summary: err.ok
          //         ? 'Organización guardada'
          //         : 'Error al guardar la Organización',
          //       detail: err.msg,
          //       life: 3000,
          //     });
          //   },
          // });
          // XXX llama al k no lanza error
          .subscribe((resp) => {
            if (!resp.ok) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al guardar la Organización',
                detail: resp.msg,
                life: 3000,
              });
            } else {
              const msg: string = resp.msg!;
              const workersId: string[] = this.workersSelected.map(
                (worker) => worker.id
              );
              this.organizationsService
                .updateWorkers(this.id.value, workersId)
                .subscribe((resp) => {
                  this.messageService.add({
                    severity: resp.ok ? 'success' : 'error',
                    summary: resp.ok
                      ? 'Organización guardada'
                      : 'Error al guardar la Organización',
                    detail: resp.ok ? msg : resp.msg,
                    life: 3000,
                  });
                  if (resp.ok) {
                    this.organizationDialog = false;

                    this.organizationsService
                      .getAll()
                      .subscribe((resp) => (this.organizations = resp));

                    this.organizationForm.reset({
                      id: '',
                      name: '',
                      idLeader: '',
                    });
                  }
                });
            }

            // this.messageService.add({
            //   severity: resp.ok ? 'success' : 'error',
            //   summary: resp.ok
            //     ? 'Organización guardada'
            //     : 'Error al guardar la Organización',
            //   detail: resp.msg,
            //   life: 3000,
            // });
            // if (resp.ok) {
            //   this.organizationDialog = false;

            //   this.organizationsService
            //     .getAll()
            //     .subscribe((resp) => (this.organizations = resp));

            //   this.organizationForm.reset({
            //     id: '',
            //     name: '',
            //     idLeader: '',
            //   });
            // }
          });
      } else {
        this.organizationsService
          .add(this.newOrganization)
          .subscribe((resp) => {
            if (!resp.ok) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al guardar la Organización',
                detail: resp.msg,
                life: 3000,
              });
            } else {
              const id: number = resp.id!;
              const msg: string = resp.msg!;
              const workersId: string[] = this.workersSelected.map(
                (worker) => worker.id
              );
              this.organizationsService
                .addWorkers(id, workersId)
                .subscribe((resp) => {
                  this.messageService.add({
                    severity: resp.ok ? 'success' : 'error',
                    summary: resp.ok
                      ? 'Organización guardada'
                      : 'Error al guardar la Organización',
                    detail: resp.ok ? msg : resp.msg,
                    life: 3000,
                  });
                  if (resp.ok) {
                    this.organizationDialog = false;

                    this.organizationsService
                      .getAll()
                      .subscribe((resp) => (this.organizations = resp));

                    this.organizationForm.reset({
                      id: '',
                      name: '',
                      idLeader: '',
                    });
                  } else {
                    this.organizationsService.erase(id).subscribe();
                  }
                });
            }
            // this.messageService.add({
            //   severity: resp.ok ? 'success' : 'error',
            //   summary: resp.ok
            //     ? 'Organización guardada'
            //     : 'Error al guardar la Organización',
            //   detail: resp.msg,
            //   life: 3000,
            // });

            // if (resp.ok) {
            //   this.organizationDialog = false;

            //   this.organizationsService
            //     .getAll()
            //     .subscribe((resp) => (this.organizations = resp));

            //   this.organizationForm.reset({
            //     id: '',
            //     name: '',
            //     idLeader: '',
            //   });
            // }
          });
      }
    }

    // if (this.organizationForm.valid) {
    //   this.newOrganization = {
    //     id: this.id.value,
    //     name: this.name.value.trim(),
    //     idLeader: this.leader.value,
    //     state: true,
    //   };
    //   // FIXME: se llama a messageService 2 veces con la misma estructura
    //   if (this.id.value) {
    //     this.organizationsService
    //       .update(this.newOrganization)
    //       // XXX llama al k lanza error
    //       // .subscribe({
    //       //   next: (resp) => {
    //       //     this.messageService.add({
    //       //       severity: resp.ok ? 'success' : 'error',
    //       //       summary: resp.ok
    //       //         ? 'Organización guardada'
    //       //         : 'Error al guardar la Organización',
    //       //       detail: resp.msg,
    //       //       life: 3000,
    //       //     });
    //       //     if (resp.ok) {
    //       //       this.organizationDialog = false;

    //       //       this.organizationsService
    //       //         .getAll()
    //       //         .subscribe((resp) => (this.organizations = resp));

    //       //       this.organizationForm.reset({
    //       //         id: '',
    //       //         name: '',
    //       //         idLeader: '',
    //       //       });
    //       //     }
    //       //   },
    //       //   error: (err) => {
    //       //     this.messageService.add({
    //       //       severity: err.ok ? 'success' : 'error',
    //       //       summary: err.ok
    //       //         ? 'Organización guardada'
    //       //         : 'Error al guardar la Organización',
    //       //       detail: err.msg,
    //       //       life: 3000,
    //       //     });
    //       //   },
    //       // });
    //       // XXX llama al k no lanza error
    //       .subscribe((resp) => {
    //         this.messageService.add({
    //           severity: resp.ok ? 'success' : 'error',
    //           summary: resp.ok
    //             ? 'Organización guardada'
    //             : 'Error al guardar la Organización',
    //           detail: resp.msg,
    //           life: 3000,
    //         });
    //         if (resp.ok) {
    //           this.organizationDialog = false;

    //           this.organizationsService
    //             .getAll()
    //             .subscribe((resp) => (this.organizations = resp));

    //           this.organizationForm.reset({
    //             id: '',
    //             name: '',
    //             idLeader: '',
    //           });
    //         }
    //       });
    //   } else {
    //     this.organizationsService
    //       .add(this.newOrganization)
    //       .subscribe((resp) => {
    //         if (!resp.ok) {
    //           this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error al guardar la Organización',
    //             detail: resp.msg,
    //             life: 3000,
    //           });
    //         } else {
    //           const id: number = resp.id!;
    //           const msg: string = resp.msg!;
    //           const workersId: string[] = this.workersSelected.map(
    //             (worker) => worker.id
    //           );
    //           console.log(workersId);
    //           this.organizationsService
    //             .addWorkers(resp.id!, workersId)
    //             .subscribe((resp) => {
    //               this.messageService.add({
    //                 severity: resp.ok ? 'success' : 'error',
    //                 summary: resp.ok
    //                   ? 'Organización guardada'
    //                   : 'Error al guardar la Organización',
    //                 detail: resp.ok ? msg : resp.msg,
    //                 life: 3000,
    //               });
    //               if (resp.ok) {
    //                 this.organizationDialog = false;

    //                 this.organizationsService
    //                   .getAll()
    //                   .subscribe((resp) => (this.organizations = resp));

    //                 this.organizationForm.reset({
    //                   id: '',
    //                   name: '',
    //                   idLeader: '',
    //                 });
    //               } else {
    //                 this.organizationsService.erase(id).subscribe(console.log);
    //               }
    //             });
    //         }
    //         // this.messageService.add({
    //         //   severity: resp.ok ? 'success' : 'error',
    //         //   summary: resp.ok
    //         //     ? 'Organización guardada'
    //         //     : 'Error al guardar la Organización',
    //         //   detail: resp.msg,
    //         //   life: 3000,
    //         // });

    //         // if (resp.ok) {
    //         //   this.organizationDialog = false;

    //         //   this.organizationsService
    //         //     .getAll()
    //         //     .subscribe((resp) => (this.organizations = resp));

    //         //   this.organizationForm.reset({
    //         //     id: '',
    //         //     name: '',
    //         //     idLeader: '',
    //         //   });
    //         // }
    //       });
    //   }
    // }
  }

  remove(event: Event, id: string): void {
    this.findOrganization(id).then((organization) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Está seguro de que desea eliminar esta organización?',
        header: 'Eliminar Organización',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger p-button-text',
        acceptLabel: 'Sí',
        rejectButtonStyleClass: 'p-button-text p-button-text',
        accept: () => {
          this.organizationsService.remove(organization).subscribe((resp) => {
            this.messageService.add({
              severity: resp.ok ? 'info' : 'error',
              summary: resp.ok ? 'Organización eliminada' : 'Error',
              detail: resp.msg,
            });

            if (resp.ok) {
              this.organizations = this.organizations.filter(
                (org) => org.id !== id
              );
            }
          });
        },
        reject: () => {},
      });
    });
  }
}
