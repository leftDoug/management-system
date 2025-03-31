import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeOfMeeting } from '../../interfaces/type-of-meeting.interface';
import { MessageService } from 'primeng/api';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';
import { StandardResponse } from 'src/app/shared/interfaces/standard.interface';
import { getNotification } from 'src/app/shared/notifications';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';

@Component({
  selector: 'app-type-of-meeting-form',
  templateUrl: './type-of-meeting-form.component.html',
  styleUrls: ['./type-of-meeting-form.component.css'],
})
export class TypeOfMeetingFormComponent implements OnInit {
  tomForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(5)]],
  });

  newToM: TypeOfMeeting = {
    id: '',
    name: '',
    idOrganization: '',
  };

  submitted: boolean = false;
  visible: boolean = true;

  @Input() tom?: TypeOfMeeting;
  @Input() organization!: Organization;

  @Output() onHide = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private tomsService: TypesOfMeetingsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.tom) {
      // this.tomsService.getById(this.idToM).subscribe((resp) => {
      //   if (resp.ok) {
      //     const tom: TypeOfMeeting = resp.arg as TypeOfMeeting;

      this.tomForm.patchValue({
        id: this.tom.id,
        name: this.tom.name,
      });
      //   }
      // });
    }
  }

  get id() {
    return this.tomForm.get('id')!;
  }

  get name() {
    return this.tomForm.get('name')!;
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.errors!['required']) {
      return 'El nombre es requerido';
    } else if (this.name.errors!['minlength']) {
      return 'El nombre debe tener al menos 5 caracteres';
    }

    return '';
  }

  save(): void {
    this.submitted = true;

    if (this.tomForm.valid) {
      this.newToM = {
        id: this.id.value,
        name: this.name.value.trim(),
        idOrganization: this.organization.id,
      };

      if (!this.id.value) {
        this.tomsService.add(this.newToM).subscribe((resp) => {
          this.messageService.add(getNotification(resp.msg!, resp.ok));

          if (resp.ok) {
            this.onSubmit.emit(true);

            this.tomForm.reset({
              id: '',
              name: '',
            });

            this.hideDialog();
          }
        });
      } else {
        this.tomsService.update(this.newToM).subscribe((resp) => {
          this.messageService.add(getNotification(resp.msg!, resp.ok));

          if (resp.ok) {
            this.onSubmit.emit(true);

            this.tomForm.reset({
              id: '',
              name: '',
            });

            this.hideDialog();
          }
        });
      }
    }
  }

  hideDialog() {
    this.visible = false;
    this.onHide.emit(true);
  }
}
