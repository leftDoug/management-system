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

  workerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(10)]],
    occupation: ['', [Validators.required, Validators.minLength(5)]],
    areas: [[], Validators.required],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    secretary: [false],
  });

  areas: Area[] = [];
  workersAreas: WorkerArea[] = [];
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
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.workersService.xgetById(id)))
        .subscribe((resp) => {
          this.newWorker = resp;
          this.workersAreasService
            .getByIdWorker(this.newWorker.id)
            .subscribe((resp) => (this.workersAreas = resp));
          this.workerForm.reset({
            name: this.newWorker.name,
            occupation: this.newWorker.occupation,
            area: this.workersAreas,
            email: this.newWorker.email,
            secretary: this.newWorker.secretary,
          });
        });
    }

    this.areasService.getAll().subscribe((resp) => {
      this.areas = resp;
      this.areas.sort((a, b) => a.name.localeCompare(b.name));
    });
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

      this.workerForm.get('areas')?.value.forEach((area: string) => {
        const workerArea: WorkerArea = {
          id: this.newWorker.id + area,
          FK_idWorker: this.newWorker.id,
          FK_idWorkArea: area,
        };

        this.workersAreasService.add(workerArea).subscribe(console.log);
      });

      this.newWorker.id = '';

      this.workerForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Trabajador Creado',
        detail: 'El trabajador ha sido creado.',
      });
    } else {
      this.workersService.update(this.newWorker).subscribe(console.log);

      this.messageService.add({
        severity: 'success',
        summary: 'Trabajador Actualizado',
        detail: 'El trabajador ha sido actualizado.',
      });

      this.workerForm.reset({
        name: this.newWorker.name,
        occupation: this.newWorker.occupation,
        email: this.newWorker.email,
        secretary: this.newWorker.secretary,
        areas: this.areas,
      });
    }
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
