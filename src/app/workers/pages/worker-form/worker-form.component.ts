import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WorkerX } from '../../interfaces/worker.interface';
import { WorkersService } from '../../services/workers.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { MessageService } from 'primeng/api';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { WorkersAreasService } from 'src/app/shared/services/workers-areas.service';
import { WorkerArea } from 'src/app/shared/navbar/worker-area.interface';

@Component({
  selector: 'app-worker-form',
  templateUrl: './worker-form.component.html',
  styleUrls: ['./worker-form.component.css'],
  providers: [MessageService],
})
export class WorkerFormComponent implements OnInit {
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  namePattern: RegExp = /^[a-zA-Z]+([\s]?[a-zA-Z]+[\s]?)*$/;

  areas: Area[] = [];
  workerAreas: WorkerArea[] = [];
  wa: WorkerArea[] = [];

  workerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(10)]],
    occupation: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    secretary: [false],
    wAreas: [[], Validators.required],
  });

  newWorker: WorkerX = {
    id: '',
    name: '',
    occupation: '',
    email: '',
    secretary: false,
  };

  constructor(
    private fb: FormBuilder,
    private workersService: WorkersService,
    private areasService: AreasService,
    private messageService: MessageService,
    private workersAreasService: WorkersAreasService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.areasService.getAll().subscribe((resp) => {
      this.areas = resp;
      this.areas.sort((a, b) => a.name.localeCompare(b.name));
    });

    if (this.router.url.includes('editar')) {
      // this.workersAreasService
      //   .getAll()
      //   .subscribe((resp) => (this.workerAreas = resp));

      // console.log(this.workerAreas);

      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.workersService.xgetById(id)))
        .subscribe((resp) => {
          this.newWorker = resp;

          let workerAreas: string[] = [];

          this.workersAreasService
            .getByIdWorker(this.newWorker.id)
            .subscribe((resp) => {
              this.workerAreas = resp;
              let areas: Area[] = [];

              resp.forEach((wa) => {
                areas.push(this.areas.find((a) => a.id === wa.FK_idWorkArea)!);
              });

              this.workerForm.get('wAreas')?.setValue(areas);
            });

          // console.log(workerAreas);

          this.workerForm.patchValue({
            name: this.newWorker.name,
            occupation: this.newWorker.occupation,
            email: this.newWorker.email,
            secretary: this.newWorker.secretary,
            wAreas: this.workerAreas,
          });
        });

      this.workerForm.get('wAreas')?.setValue(this.workerAreas);
    }
  }

  get areasErrorMsg(): string {
    if (this.workerForm.get('areas')?.errors!['required']) {
      return 'El área es requerida';
    }

    return '';
  }

  get nameErrorMsg(): string {
    if (this.workerForm.get('name')?.errors!['required']) {
      return 'El nombre es requerido';
    } else if (this.workerForm.get('name')?.errors!['minlength']) {
      return 'El nombre debe tener al menos 10 caracteres';
    }

    return '';
  }

  get occupationErrorMsg(): string {
    if (this.workerForm.get('occupation')?.errors!['required']) {
      return 'El cargo es requerido';
    } else if (this.workerForm.get('occupation')?.errors!['minlength']) {
      return 'El cargo debe tener al menos 5 caracteres';
    }

    return '';
  }

  get emailErrorMsg(): string {
    if (this.workerForm.get('email')?.errors!['required']) {
      return 'El email es requerido';
    } else if (this.workerForm.get('email')?.errors!['pattern']) {
      return 'El formato del email dede ser "ejemplo@ejemplo.com"';
    }

    return '';
  }

  create(): void {
    this.newWorker.name = this.workerForm.get('name')?.value;
    this.newWorker.occupation = this.workerForm.get('occupation')?.value;
    this.newWorker.email = this.workerForm.get('email')?.value;
    this.newWorker.secretary = this.workerForm.get('secretary')?.value;

    if (!this.newWorker.id) {
      this.newWorker.id = this.workerForm.get('name')?.value.trim().slice(0, 2);

      this.workersService.add(this.newWorker).subscribe(console.log);

      this.createWorkerArea();

      this.newWorker.id = '';

      this.workerForm.reset({
        name: '',
        occupation: '',
        email: '',
        secretary: false,
        wAreas: [],
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Trabajador Creado',
        detail: 'El trabajador ha sido creado.',
      });
    } else {
      this.workersService.update(this.newWorker).subscribe(console.log);

      this.checkWorkerAreas();

      this.messageService.add({
        severity: 'success',
        summary: 'Trabajador Actualizado',
        detail: 'El trabajador ha sido actualizado.',
      });

      // this.workerForm.reset({
      //   name: this.newWorker.name,
      //   occupation: this.newWorker.occupation,
      //   email: this.newWorker.email,
      //   secretary: this.newWorker.secretary,
      //   areas: this.areas,
      // });
    }
  }

  checkWorkerAreas(): void {
    const workerWa: Area[] = this.workerForm.get('wAreas')?.value;
    this.workerAreas.forEach((wa) => {
      if (!workerWa.find((area) => area.id === wa.FK_idWorkArea)) {
        this.workersAreasService.remove(wa.id).subscribe(console.log);
      }
    });

    workerWa.forEach((area) => {
      if (!this.workerAreas.find((wa) => wa.FK_idWorkArea === area.id)) {
        this.createWorkerArea(area.id);
      }
    });
  }

  createWorkerArea(idWorkArea?: string): void {
    if (idWorkArea) {
      const workerArea: WorkerArea = {
        id: this.newWorker.id + idWorkArea,
        FK_idWorker: this.newWorker.id,
        FK_idWorkArea: idWorkArea,
      };

      this.workersAreasService.add(workerArea).subscribe(console.log);
    } else {
      this.workerForm.get('wAreas')?.value.forEach((area: Area) => {
        const workerArea: WorkerArea = {
          id: this.newWorker.id + area.id,
          FK_idWorker: this.newWorker.id,
          FK_idWorkArea: area.id,
        };

        this.workersAreasService.add(workerArea).subscribe(console.log);
      });
    }

    this.workersAreasService
      .getByIdWorker(this.newWorker.id)
      .subscribe((wa) => (this.workerAreas = wa));
  }

  validate(control: string): boolean {
    if (
      (control === 'name' || control === 'occupation' || control === 'email') &&
      this.workerForm.get(control)?.pristine &&
      this.workerForm.get(control)?.touched &&
      this.workerForm.get(control)?.errors!['required']
    ) {
      this.workerForm.controls[control].markAsDirty();
    }

    return (
      this.workerForm.get(control)?.errors! &&
      this.workerForm.controls[control].touched
    );
  }
}
