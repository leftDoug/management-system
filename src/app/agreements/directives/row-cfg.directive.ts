import { Directive, ElementRef, Input } from '@angular/core';
import { Status } from '../interfaces/agreement.interface';

@Directive({
  selector: '[row-cfg]',
})
export class RowCfgDirective {
  @Input() status: Status = Status.inProcess;
  htmlElement: ElementRef<HTMLElement>;

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }

  ngOnInit(): void {
    this.setRowColor();
  }

  setRowColor(): void {
    switch (this.status) {
      case Status.canceled:
        this.htmlElement.nativeElement.classList.add('removed');
        break;
      case Status.fulfilled:
        this.htmlElement.nativeElement.classList.add('completed');
        break;
      case Status.unfulfilled:
        this.htmlElement.nativeElement.classList.add('incomplete');
        break;
      default:
        break;
    }
  }
}
