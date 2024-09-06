import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  userForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  msgsLogin: Message[] = [];
  msgsUsername: Message[] = [];
  msgsPassword: Message[] = [];
  users: User[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.getAll().subscribe((u) => (this.users = u));
  }

  get username() {
    return this.userForm.get('username')!;
  }

  get password() {
    return this.userForm.get('password')!;
  }

  showLoginErrorMsg(): void {
    this.msgsLogin = [];

    this.msgsLogin.push({
      severity: 'error',
      detail: 'Usuario o contraseña incorrecta',
    });
  }

  showUsernameErrorMsg(): Message[] {
    if (this.username.errors?.['required']) {
      if (this.msgsUsername.length === 0) {
        this.msgsUsername.push({
          severity: 'error',
          detail: 'El usuario es requerido',
        });
      }

      this.username.markAsDirty();
    } else {
      this.msgsUsername = [];
    }

    return this.msgsUsername;
  }

  showPasswordErrorMsg(): Message[] {
    if (this.password.errors?.['required']) {
      if (this.msgsPassword.length === 0) {
        this.msgsPassword.push({
          severity: 'error',
          detail: 'La contraseña es requerida',
        });
      }
      this.password.markAsDirty();
    } else {
      this.msgsPassword = [];
    }

    return this.msgsPassword;
  }

  // FIXME: este es una MIERDA
  login() {
    let tempUser: User | undefined = this.users.find(
      (u) =>
        u.username === this.username.value && u.password === this.password.value
    );

    // this.authService.getByUsername(this.username.value).subscribe((u) => {
    //   this.user = u[0];
    // });
    // console.log(this.user);

    if (tempUser) {
      this.authService
        .login(this.username.value, this.password.value)
        .subscribe(console.log);
      this.router.navigate(['/acuerdos']);
    } else {
      this.showLoginErrorMsg();
    }
  }
}
