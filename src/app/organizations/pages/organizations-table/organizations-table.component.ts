import { Component, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../../interfaces/organization.interface';
import { OrganizationsService } from '../../services/organizations.service';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Worker } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StandardResponse } from '../../../shared/interfaces/standard.interface';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-organizations-table',
  templateUrl: './organizations-table.component.html',
  styleUrls: ['./organizations-table.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class OrganizationsTableComponent implements OnInit {
  organizations!: Organization[];
  organizationDialog: boolean = false;
  organizationForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    idLeader: ['', Validators.required],
  });
  submitted: boolean = false;
  workers: Worker[] = [];
  workersSource: Worker[] = [];
  workersSelected: Worker[] = [];
  newOrganization: Organization = {
    id: '',
    name: '',
    idLeader: '',
  };

  constructor(
    private organizationsService: OrganizationsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.organizationsService.getAll().subscribe((resp) => {
      this.organizations = resp.arg as Organization[];

      // XXX para quitar el ordenamiento
      this.initialValue = [...(resp.arg as Organization[])];
      // fin
    });
    this.authService.getWorkers().subscribe((resp) => {
      this.workers = resp.arg as Worker[];
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
      this.findOrganization(id!)
        .then((organization) => {
          this.submitted = false;
          this.organizationDialog = true;

          this.organizationForm.patchValue(organization);
        })
        .catch((error) => (error ? console.error(error) : null));
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
        this.workersSelected = (resp.arg as Worker[]).filter(
          (worker) => worker.id !== this.leader.value
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
                      .subscribe(
                        (resp) =>
                          (this.organizations = resp.arg as Organization[])
                      );

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
              const id: number = parseInt((resp.arg as Organization).id);
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
                      .subscribe(
                        (resp) =>
                          (this.organizations = resp.arg as Organization[])
                      );

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
        message: 'Está seguro de que desea eliminar esta Organización?',
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

  // XXX esto es para quitar el ordenamiento
  @ViewChild('tOrganizations') tOrganizations: Table | undefined;
  isSorted: boolean | undefined | null;
  initialValue: Organization[] | undefined;

  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.organizations = [...this.initialValue!];
      this.tOrganizations!.reset();
    }
  }

  sortTableData(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order! * result;
    });
  }
  // fin
}
