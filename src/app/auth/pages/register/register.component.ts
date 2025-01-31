import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { Worker } from 'src/app/workers/interfaces/worker.interface';
import { Message, MessageService } from 'primeng/api';
import { ValidatorService } from 'src/app/validator/validator.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../../interfaces/auth-response.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  // userForm: FormGroup = this.fb.group(
  //   {
  //     username: ['', [Validators.required, Validators.minLength(5)]],
  //     password: ['', [Validators.required, Validators.minLength(8)]],
  //     checkPassword: '',
  //   },
  //   {
  //     validators: [
  //       this.validatorService.differentPasswords('password', 'checkPassword'),
  //     ],
  //   }
  // );

  userForm: FormGroup = this.fb.group(
    {
      idWorker: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      idRole: [''],
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
  registerDialog: boolean = true;
  // users: User[] = [];
  workers: Worker[] = [];
  @Input() visible: boolean = false;
  @Output() onHideDialog = new EventEmitter<EventTarget>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private workersService: WorkersService,
    private validatorService: ValidatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.authService.getAll().subscribe((u) => (this.users = u));
    this.workersService.getAll().subscribe((w) => (this.workers = w));
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

  // createId(): string {
  //   let id: string = '';
  //   var chars: string =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  //   for (let i = 0; i < 5; i++) {
  //     id += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }

  //   return id;
  // }

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

  // register(): void {
  //   this.msgRegister = [];

  //   // this.authService.getByIdWorker(this.worker.value).pipe(
  //   //   tap((u) => {
  //   //     if (u) {
  //   //       this.msgRegister.push({
  //   //         severity: 'error',
  //   //         detail: 'Este trabajador ya tiene un usuario.',
  //   //       });
  //   //     }
  //   //   })
  //   // );

  //   // if (this.msgRegister.length === 0) {
  //   //   this.authService.getByUsername(this.username.value).pipe(
  //   //     tap((u) => {
  //   //       if (u) {
  //   //         this.msgRegister.push({
  //   //           severity: 'error',
  //   //           detail: 'Este nombre de usuario ya está en uso.',
  //   //         });
  //   //       }
  //   //     })
  //   //   );

  //   //   if (this.msgRegister.length === 0) {
  //   //     this.newUser = {
  //   //       id: this.createId(),
  //   //       FK_idWorker: this.worker.value,
  //   //       username: this.username.value,
  //   //       password: this.password.value,
  //   //       admin: false,
  //   //     };

  //   //     this.authService.registerUser(this.newUser).subscribe(console.log);

  //   //     this.msgRegister.push({
  //   //       severity: 'success',
  //   //       detail: 'Usuario creado correctamente',
  //   //     });

  //   //     this.userForm.reset({
  //   //       worker: '',
  //   //       username: '',
  //   //       password: '',
  //   //       checkPassword: '',
  //   //     });

  //   //     this.checkPasswordTouched = false;
  //   //     this.dropdownTouched = false;
  //   //     this.passwordTouched = false;
  //   //   }
  //   // }

  //   if (this.users.find((u) => u.FK_idWorker === this.worker.value)) {
  //     this.msgRegister.push({
  //       severity: 'error',
  //       detail: 'Este trabajador ya tiene un usuario.',
  //     });
  //   } else if (this.users.find((u) => u.username === this.username.value)) {
  //     this.msgRegister.push({
  //       severity: 'error',
  //       detail: 'Este nombre de usuario ya está en uso.',
  //     });
  //   } else {
  //     this.newUser = {
  //       id: this.createId(),
  //       FK_idWorker: this.worker.value,
  //       username: this.username.value,
  //       password: this.password.value,
  //       admin: false,
  //     };

  //     this.authService.registerUser(this.newUser).subscribe(console.log);

  //     this.msgRegister.push({
  //       severity: 'success',
  //       detail: 'Usuario creado correctamente',
  //     });

  //     this.userForm.reset({
  //       worker: '',
  //       username: '',
  //       password: '',
  //       checkPassword: '',
  //     });

  //     this.checkPasswordTouched = false;
  //     this.dropdownTouched = false;
  //     this.passwordTouched = false;
  //   }
  // }

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
        this.onHideDialog.emit();
      } else {
        this.showRegistrationErrorMsg(ok);
      }
    });
  }

  hideDialog() {
    this.visible = false;
    this.onHideDialog.emit();
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
