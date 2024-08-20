import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Area } from '../../interfaces/area.interface';
import { AreasService } from '../../services/areas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css'],
  providers: [MessageService],
})
export class AreaFormComponent implements OnInit {
  areaForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
  });
  newArea: Area = { id: '', name: '' };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private areasService: AreasService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.areasService.getById(id)))
        .subscribe((resp) => {
          this.newArea = resp;
          this.areaForm.reset({
            name: this.newArea.name,
          });
        });
    }
  }

  get areaErrorMsg(): string {
    if (this.areaForm.get('name')?.errors!['required']) {
      return 'El nombre del área es requerido';
    } else if (this.areaForm.get('name')?.errors!['minlength']) {
      return 'El nombre del área debe tener al menos 5 caracteres';
    }

    return '';
  }

  // FIXME: validate implementado varias veces
  validate(): boolean {
    if (
      this.areaForm.get('name')?.pristine &&
      this.areaForm.get('name')?.touched &&
      this.areaForm.get('name')?.errors!['required']
    ) {
      this.areaForm.controls['name'].markAsDirty();
    }

    return (
      this.areaForm.get('name')?.errors! &&
      this.areaForm.controls['name'].touched
    );
  }

  create(): void {
    this.newArea.name = this.areaForm.get('name')?.value.trim();

    if (!this.newArea.id) {
      this.newArea.id = this.areaForm.get('name')?.value.trim().slice(0, 2);

      this.areasService.add(this.newArea).subscribe(console.log);

      this.newArea.id = '';

      this.areaForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Área Creada',
        detail: 'El área ha sido creada.',
      });
    } else {
      this.areasService.update(this.newArea).subscribe(console.log);

      this.messageService.add({
        severity: 'success',
        summary: 'Área Actualizada',
        detail: 'El área ha sido actualizada.',
      });

      this.areaForm.reset(this.areaForm.value);
    }
  }
}
