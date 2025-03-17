import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Organization } from '../../interfaces/organization.interface';
import { OrganizationsService } from '../../services/organizations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WorkerResponse } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css'],
  providers: [MessageService],
})
export class OrganizationFormComponent {
  // organizationForm: FormGroup = this.fb.group({
  //   name: ['', [Validators.required, Validators.minLength(5)]],
  //   idLeader: ['', Validators.required],
  // });
  // newOrganization!: Organization;
  // workers: WorkerResponse[] = [];
  // dropdownTouched: boolean = false;
  // constructor(
  //   private fb: FormBuilder,
  //   private messageService: MessageService,
  //   private primengConfig: PrimeNGConfig,
  //   private organizationsService: OrganizationsService,
  //   private router: Router,
  //   private activatedRoute: ActivatedRoute,
  //   private authService: AuthService
  // ) {
  //   this.newOrganization = {
  //     id: '',
  //     idLeader: '',
  //     name: '',
  //     state: true,
  //   };
  // }
  // ngOnInit(): void {
  //   this.authService.getWorkers().subscribe((resp) => (this.workers = resp));
  //   if (this.router.url.includes('editar')) {
  //     this.activatedRoute.params
  //       .pipe(switchMap(({ id }) => this.organizationsService.getById(id)))
  //       .subscribe((resp) => {
  //         this.newOrganization = resp;
  //         this.organizationForm.reset({
  //           name: this.newOrganization.name,
  //         });
  //       });
  //   }
  // }
  // get idLeader() {
  //   return this.organizationForm.get('idLeader')!;
  // }
  // get organizationErrorMsg(): string {
  //   if (this.organizationForm.get('name')?.errors!['required']) {
  //     return 'El nombre de la organización es requerido';
  //   } else if (this.organizationForm.get('name')?.errors!['minlength']) {
  //     return 'El nombre de la organización debe tener al menos 5 caracteres';
  //   }
  //   return '';
  // }
  // // FIXME: validate implementado varias veces
  // validate(): boolean {
  //   if (
  //     this.organizationForm.get('name')?.pristine &&
  //     this.organizationForm.get('name')?.touched &&
  //     this.organizationForm.get('name')?.errors!['required']
  //   ) {
  //     this.organizationForm.controls['name'].markAsDirty();
  //   }
  //   return (
  //     this.organizationForm.get('name')?.errors! &&
  //     this.organizationForm.controls['name'].touched
  //   );
  // }
  // create(): void {
  //   this.newOrganization = {
  //     id: '',
  //     name: this.organizationForm.get('name')?.value.trim(),
  //     idLeader: this.idLeader.value,
  //     state: true,
  //   };
  //   if (!this.newOrganization.id) {
  //     this.organizationsService
  //       .add(this.newOrganization)
  //       .subscribe(console.log);
  //     this.newOrganization.id = '';
  //     this.organizationForm.reset();
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Organización creada',
  //       detail: 'La Organización ha sido creada.',
  //     });
  //   } else {
  //     this.organizationsService
  //       .update(this.newOrganization)
  //       .subscribe(console.log);
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Organización actualizada',
  //       detail: 'La Organización ha sido actualizada.',
  //     });
  //     this.organizationForm.reset();
  //   }
  // }
  // touchDropdown(): void {
  //   this.dropdownTouched = true;
  //   if (this.idLeader.errors) {
  //     this.idLeader.markAsDirty();
  //   }
  // }
}
