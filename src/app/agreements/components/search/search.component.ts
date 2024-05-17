import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  text: string = '';

  search() {
    console.log(this.text);
    this.text = '';
  }
}
