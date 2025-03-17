import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, UserResponse } from '../../interfaces/user.interface';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { Worker } from 'src/app/workers/interfaces/worker.interface';
import { Role } from '../../interfaces/role.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ValidatorService } from 'src/app/validator/validator.service';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
  providers: [MessageService],
})
export class AdminTableComponent implements OnInit {
  users!: UserResponse[];
  workers!: Worker[];
  roles!: Role[];
  userForm: FormGroup = this.fb.group(
    {
      idWorker: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      idRole: ['d4bcafe0-7068-11ef-9c31-852f134d58cb'],
      checkPassword: '',
    },
    {
      validators: [
        this.validatorService.differentPasswords('password', 'checkPassword'),
      ],
    }
  );

  newUser: User = {
    id: '',
    idWorker: '',
    idRole: '',
    username: '',
    password: '',
    state: true,
  };

  checkPasswordTouched: boolean = false;
  dropdownTouched: boolean = false;
  msgRegister: Message[] = [];
  passwordTouched: boolean = false;
  registerDialog: boolean = false;

  constructor(
    private authService: AuthService,
    private workersService: WorkersService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.workersService.getAll().subscribe((resp) => (this.workers = resp));
    this.authService.getRoles().subscribe((resp) => (this.roles = resp));
    this.authService.getUsers().subscribe((resp) => (this.users = resp));
  }

  showDialog(): void {
    this.registerDialog = true;
  }

  get checkPassword() {
    return this.userForm.get('checkPassword')!;
  }

  get password() {
    return this.userForm.get('password')!;
  }

  get username() {
    return this.userForm.get('username')!;
  }

  get worker() {
    return this.userForm.get('idWorker')!;
  }

  get role() {
    return this.userForm.get('idRole')!;
  }

  hideRegisterDialog(): void {
    this.registerDialog = false;
  }

  getUsernameErrorMsg(): string {
    this.username.markAsDirty();

    if (this.username.hasError('required')) {
      return 'El usuario es requerido';
    } else if (this.username.hasError('minlength')) {
      return 'El usuario debe tener al menos 5 caracteres';
    }

    return '';
  }

  getPasswordErrorMsg(): string {
    if (this.password.hasError('required')) {
      return 'La contraseña es requerida';
    } else if (this.password.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    return '';
  }

  getCheckPasswordErrorMsg(): string {
    if (this.checkPassword.hasError('differentPasswords')) {
      return 'Las contraseñas deben ser iguales';
    }

    return '';
  }

  register() {
    this.newUser = {
      id: '',
      idWorker: this.worker.value,
      idRole: this.role.value,
      username: this.username.value,
      password: this.password.value,
      state: true,
    };
    this.authService.register(this.newUser).subscribe((ok) => {
      if (ok === true) {
        this.hideRegisterDialog();

        this.messageService.add({
          severity: 'success',
          summary: 'Acuerdo Creado',
          detail: 'El acuerdo ha sido creado.',
        });
        this.authService.getUsers().subscribe((resp) => (this.users = resp));
      } else {
        this.showRegistrationErrorMsg(ok);
      }
    });
  }

  showRegistrationErrorMsg(error: any): void {
    this.msgRegister = [];

    this.msgRegister.push({
      severity: 'error',
      detail: error,
    });
  }

  touchDropdown(): void {
    this.dropdownTouched = true;

    if (this.worker.errors) {
      this.worker.markAsDirty();
    }
  }

  touchPassword(): void {
    this.passwordTouched = true;

    if (this.password.errors) {
      this.password.markAsDirty();
    }
  }

  touchCheckPassword(): void {
    this.checkPasswordTouched = true;

    if (this.checkPassword.errors) {
      this.checkPassword.markAsDirty();
    }
  }
}
