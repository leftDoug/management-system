import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'management-system';
  num: number = 0;
  base: number = 5;

  sum(value: number) {
    this.num += value;
  }
}
