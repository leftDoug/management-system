import { Component } from '@angular/core';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
})
export class AgreementComponent {
  number: number = 25;
  date: string = '2024-05-10';
  area: string = 'human resources';
  createdBy: string = 'doug';
  solution: string = 'no solution';
  completed: boolean = false;
}
