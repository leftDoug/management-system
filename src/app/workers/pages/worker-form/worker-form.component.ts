import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Worker } from '../../interfaces/worker.interface';
import { WorkersService } from '../../services/workers.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { MessageService } from 'primeng/api';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { WorkersAreasService } from 'src/app/shared/services/workers-areas.service';
import { WorkerArea } from 'src/app/shared/navbar/worker-area.interface';

@Component({
  selector: 'app-worker-form',
  templateUrl: './worker-form.component.html',
  styleUrls: ['./worker-form.component.css'],
  // providers: [MessageService],
})
export class WorkerFormComponent {
  // emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // namePattern: RegExp = /^[a-zA-Z]+([\s]?[a-zA-Z]+[\s]?)*$/;
  // areas: Area[] = [];
  // oldAreas: string[] = [];
  // workerAreas: WorkerArea[] = [];
  // wa: WorkerArea[] = [];
  // workerForm: FormGroup = this.fb.group({
  //   name: ['', [Validators.required, Validators.minLength(10)]],
  //   occupation: ['', [Validators.required, Validators.minLength(5)]],
  //   email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
  //   wAreas: [[], Validators.required],
  // });
  // newWorker: Worker = {
  //   id: '',
  //   name: '',
  //   occupation: '',
  //   email: '',
  //   state: true,
  // };
  // constructor(
  //   private fb: FormBuilder,
  //   private workersService: WorkersService,
  //   private areasService: AreasService,
  //   private messageService: MessageService,
  //   private workersAreasService: WorkersAreasService,
  //   private router: Router,
  //   private activatedRoute: ActivatedRoute
  // ) {}
  // ngOnInit(): void {
  //   this.areasService.getAll().subscribe((resp) => {
  //     this.areas = resp;
  //     this.areas.sort((newAreas, b) => newAreas.name.localeCompare(b.name));
  //   });
  //   if (this.router.url.includes('editar')) {
  //     this.activatedRoute.params
  //       .pipe(
  //         tap(({ id }) =>
  //           this.workersService.getAreas(id).subscribe((resp) => {
  //             let newAreas: string[] = [];
  //             resp.forEach((area) => {
  //               newAreas.push(area.id);
  //             });
  //             this.oldAreas = newAreas;
  //             this.wAreas.setValue(newAreas);
  //           })
  //         ),
  //         switchMap(({ id }) => this.workersService.getById(id))
  //       )
  //       .subscribe((resp) => {
  //         this.newWorker = resp;
  //         this.workerForm.patchValue({
  //           name: this.newWorker.name,
  //           occupation: this.newWorker.occupation,
  //           email: this.newWorker.email,
  //           // wAreas: this.workerAreas,
  //         });
  //       });
  //     this.wAreas.setValue(this.workerAreas);
  //   }
  // }
  // get email(): AbstractControl {
  //   return this.workerForm.get('email')!;
  // }
  // get name(): AbstractControl {
  //   return this.workerForm.get('name')!;
  // }
  // get occupation(): AbstractControl {
  //   return this.workerForm.get('occupation')!;
  // }
  // get wAreas(): AbstractControl {
  //   return this.workerForm.get('wAreas')!;
  // }
  // get areasErrorMsg(): string {
  //   if (this.workerForm.get('areas')?.errors!['required']) {
  //     return 'El área es requerida';
  //   }
  //   return '';
  // }
  // get nameErrorMsg(): string {
  //   if (this.workerForm.get('name')?.errors!['required']) {
  //     return 'El nombre es requerido';
  //   } else if (this.workerForm.get('name')?.errors!['minlength']) {
  //     return 'El nombre debe tener al menos 10 caracteres';
  //   }
  //   return '';
  // }
  // get occupationErrorMsg(): string {
  //   if (this.workerForm.get('occupation')?.errors!['required']) {
  //     return 'El cargo es requerido';
  //   } else if (this.workerForm.get('occupation')?.errors!['minlength']) {
  //     return 'El cargo debe tener al menos 5 caracteres';
  //   }
  //   return '';
  // }
  // get emailErrorMsg(): string {
  //   if (this.workerForm.get('email')?.errors!['required']) {
  //     return 'El email es requerido';
  //   } else if (this.workerForm.get('email')?.errors!['pattern']) {
  //     return 'El formato del email dede ser "ejemplo@ejemplo.com"';
  //   }
  //   return '';
  // }
  // create(): void {
  //   this.newWorker.name = this.name.value;
  //   this.newWorker.occupation = this.occupation.value;
  //   this.newWorker.email = this.email.value;
  //   if (!this.newWorker.id) {
  //     this.workersService
  //       .create(this.newWorker, this.wAreas.value)
  //       .subscribe(console.log);
  //     this.newWorker.id = '';
  //     this.workerForm.reset({
  //       name: '',
  //       occupation: '',
  //       email: '',
  //       wAreas: [],
  //     });
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Trabajador Creado',
  //       detail: 'El trabajador ha sido creado.',
  //     });
  //   } else {
  //     let areasChanged: boolean = false;
  //     if (
  //       this.newWorker.email === this.email.value &&
  //       this.newWorker.name === this.name.value &&
  //       this.newWorker.occupation === this.occupation.value
  //     ) {
  //       this.workersService.update(this.newWorker).subscribe(console.log);
  //     }
  //     this.wAreas.value.forEach((newArea: string) => {
  //       if (
  //         !this.oldAreas.find((oldArea) => oldArea === newArea) ||
  //         this.wAreas.value.length !== this.oldAreas.length
  //       ) {
  //         areasChanged = true;
  //       }
  //     });
  //     if (areasChanged) {
  //       this.checkAreas();
  //     }
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Trabajador Actualizado',
  //       detail: 'El trabajador ha sido actualizado.',
  //     });
  //   }
  // }
  // checkAreas(): void {
  //   this.oldAreas.forEach((oldArea) => {
  //     if (!this.wAreas.value.find((newArea: string) => newArea === oldArea)) {
  //       this.workersService
  //         .removeArea(this.newWorker.id, oldArea)
  //         .subscribe(console.log);
  //     }
  //   });
  //   // FIXME: arreglar los nobres de las variables en la interface xk esta como FK
  //   this.wAreas.value.forEach((newArea: string) => {
  //     if (!this.oldAreas.find((oldArea) => oldArea === newArea)) {
  //       this.workersService
  //         .addArea(this.newWorker.id, newArea)
  //         .subscribe(console.log);
  //     }
  //   });
  // }
  // validate(control: string): boolean {
  //   if (
  //     (control === 'name' || control === 'occupation' || control === 'email') &&
  //     this.workerForm.get(control)?.pristine &&
  //     this.workerForm.get(control)?.touched &&
  //     this.workerForm.get(control)?.errors!['required']
  //   ) {
  //     this.workerForm.controls[control].markAsDirty();
  //   }
  //   return (
  //     this.workerForm.get(control)?.errors! &&
  //     this.workerForm.controls[control].touched
  //   );
  // }
}
