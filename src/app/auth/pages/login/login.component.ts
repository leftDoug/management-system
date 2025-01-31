import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  userForm: FormGroup = this.fb.group({
    username: ['dleft', Validators.required],
    password: ['12345678', Validators.required],
  });

  msgsLogin: Message[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  get username() {
    return this.userForm.get('username')!;
  }

  get password() {
    return this.userForm.get('password')!;
  }

  showLoginErrorMsg(): void {
    if (this.msgsLogin?.length == 0) {
      this.msgsLogin = [
        {
          severity: 'error',
          detail: 'Usuario o contraseña incorrecta',
        },
      ];
    }
  }

  login() {
    this.authService.login(this.userForm.value).subscribe((ok) => {
      if (ok) {
        this.router.navigateByUrl('/acuerdos');
      } else {
        this.userForm.reset();
        this.showLoginErrorMsg();
      }
    });

    // let tempUser: User | undefined = this.users.find(
    //   (u) =>
    //     u.username === this.username.value && u.password === this.password.value
    // );

    // this.authService.getByUsername(this.username.value).subscribe((u) => {
    //   this.user = u[0];
    // });
    // console.log(this.user);

    // if (tempUser) {
    //   this.authService
    //     .login(this.username.value, this.password.value)
    //     .subscribe(console.log);
    //   this.router.navigate(['/acuerdos']);
    // } else {
    //   this.showLoginErrorMsg();
    // }
  }

  validate(control: AbstractControl): boolean {
    if (control.errors?.['required'] && control.touched) {
      control.markAsDirty();

      return true;
    }

    return false;
  }
}
