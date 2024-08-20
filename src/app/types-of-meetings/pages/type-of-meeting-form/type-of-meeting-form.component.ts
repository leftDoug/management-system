import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area } from 'src/app/areas/interfaces/area.interface';
import {
  Frequency,
  TypeOfMeeting,
} from '../../interfaces/type-of-meeting.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AreasService } from 'src/app/areas/services/areas.service';
import { switchMap } from 'rxjs';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';

@Component({
  selector: 'app-type-of-meeting-form',
  templateUrl: './type-of-meeting-form.component.html',
  styleUrls: ['./type-of-meeting-form.component.css'],
  providers: [MessageService],
})
export class TypeOfMeetingFormComponent implements OnInit {
  typeOfMeetingForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    area: ['', Validators.required],
    frequency: ['', Validators.required],
  });

  areas: Area[] = [];
  newTypeOfMeeting: TypeOfMeeting = {
    id: '',
    name: '',
    FK_idWorkArea: '',
    frequency: Frequency.daily,
  };
  frequencies: Frequency[] = [
    Frequency.daily,
    Frequency.weekly,
    Frequency.fortnightly,
    Frequency.monthly,
    Frequency.yearly,
  ];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private areasService: AreasService,
    private messageService: MessageService,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.typesOfMeetingsService.getById(id)))
        .subscribe((resp) => {
          this.newTypeOfMeeting = resp;
          this.typeOfMeetingForm.reset({
            name: this.newTypeOfMeeting.name,
            area: this.newTypeOfMeeting.FK_idWorkArea,
            frequency: this.newTypeOfMeeting.frequency,
          });
        });
    }

    this.areasService.getAll().subscribe((resp) => (this.areas = resp));
  }

  get areaErrorMsg(): string {
    if (this.typeOfMeetingForm.get('area')?.errors!['required']) {
      return 'El área es requerida';
    }

    return '';
  }

  get frequencyErrorMsg(): string {
    if (this.typeOfMeetingForm.get('frequency')?.errors!['required']) {
      return 'La frecuencia es requerida';
    }

    return '';
  }

  get nameErrorMsg(): string {
    if (this.typeOfMeetingForm.get('name')?.errors!['required']) {
      return 'El tipo de reunión es requerido';
    } else if (this.typeOfMeetingForm.get('name')?.errors!['minlength']) {
      return 'El tipo de reunión debe tener al menos 5 caracteres';
    }

    return '';
  }

  create(): void {
    this.newTypeOfMeeting.FK_idWorkArea =
      this.typeOfMeetingForm.get('area')?.value;
    this.newTypeOfMeeting.name = this.typeOfMeetingForm
      .get('name')
      ?.value.trim();
    switch (this.typeOfMeetingForm.get('frequency')?.value) {
      case 'Diaria':
        this.newTypeOfMeeting.frequency = Frequency.daily;
        break;
      case 'Semanal':
        this.newTypeOfMeeting.frequency = Frequency.weekly;
        break;
      case 'Quincenal':
        this.newTypeOfMeeting.frequency = Frequency.fortnightly;
        break;
      case 'Mensual':
        this.newTypeOfMeeting.frequency = Frequency.monthly;
        break;
      case 'Anual':
        this.newTypeOfMeeting.frequency = Frequency.yearly;
        break;
      default:
        break;
    }

    if (!this.newTypeOfMeeting.id) {
      this.newTypeOfMeeting.id = this.typeOfMeetingForm
        .get('name')
        ?.value.trim()
        .slice(0, 2);

      this.typesOfMeetingsService
        .add(this.newTypeOfMeeting)
        .subscribe(console.log);

      this.newTypeOfMeeting.id = '';

      this.typeOfMeetingForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Tipo de Reunión Creado',
        detail: 'El tipo de reunión ha sido creado.',
      });
    } else {
      this.typesOfMeetingsService
        .update(this.newTypeOfMeeting)
        .subscribe(console.log);

      this.messageService.add({
        severity: 'success',
        summary: 'Tipo de Reunión Actualizado',
        detail: 'El tipo de reunión ha sido actualizado.',
      });

      this.typeOfMeetingForm.reset(this.typeOfMeetingForm.value);
    }
  }

  // FIXME: validate implementado varias veces
  validate(control: string): boolean {
    if (
      control === 'name' &&
      this.typeOfMeetingForm.get(control)?.pristine &&
      this.typeOfMeetingForm.get(control)?.touched &&
      this.typeOfMeetingForm.get(control)?.errors!['required']
    ) {
      this.typeOfMeetingForm.controls['name'].markAsDirty();
    }

    return (
      this.typeOfMeetingForm.get(control)?.errors! &&
      this.typeOfMeetingForm.controls[control].touched
    );
  }
}
