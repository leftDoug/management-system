import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Status } from '../interfaces/agreement.interface';

@Directive({
  selector: '[badge-cfg]',
})
export class BadgeDirective implements OnInit {
  htmlElement: ElementRef<HTMLElement>;
  today: Date = new Date();
  private _date!: Date;
  @Input() completed: boolean | null = null;
  @Input() compilanceDate: Date | null = null;
  @Input() isTable: boolean = false;
  @Input() status: Status | null = null;
  @Input() statusArr: Status[] | null = null;

  @Input() set canceled(value: boolean | null) {
    if (value && !this.isTable) {
      this.htmlElement.nativeElement.classList.add('text-bg-secondary');
      this.htmlElement.nativeElement.innerText = 'ANULADO';
    }
  }

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }
  ngOnInit(): void {
    this._date = this.compilanceDate
      ? new Date(this.compilanceDate)
      : new Date();
    if (this.isTable) {
      this.setRowColor();
    } else if (this.completed !== null || this.status) {
      this.setSeverity(null);
    } else if (this.statusArr) {
      this.statusArr.forEach((s) => this.setSeverity(s));
    }
  }

  setSeverity(s: Status | null): void {
    if (
      this.completed ||
      this.status === Status.fulfilled ||
      s === Status.fulfilled
    ) {
      this.htmlElement.nativeElement.classList.add('text-bg-success');
      this.htmlElement.nativeElement.innerText = 'CUMPLIDO';
    } else if (
      (this.today.getTime() < this._date.getTime() && this.compilanceDate) ||
      this.status === Status.inProcess ||
      s === Status.inProcess
    ) {
      this.htmlElement.nativeElement.classList.add('text-bg-primary');
      this.htmlElement.nativeElement.innerText = 'EN PROCESO';
    } else if (
      (this.today.getTime() > this._date.getTime() && this.compilanceDate) ||
      this.status === Status.unfulfilled ||
      s === Status.unfulfilled
    ) {
      this.htmlElement.nativeElement.classList.add('text-bg-danger');
      this.htmlElement.nativeElement.innerText = 'INCUMPLIDO';
    } else if (this.status === Status.canceled || s === Status.canceled) {
      this.htmlElement.nativeElement.classList.add('text-bg-secondary');
      this.htmlElement.nativeElement.innerText = 'ANULADO';
    }
  }

  setRowColor(): void {
    // if (agreement.status === 'cumplido') return 'completed';
    // if (agreement.status === 'anulado') return 'removed';
    // if (agreement.status === 'incumplido') return 'incomplete';

    if (this.completed || this.status === Status.fulfilled) {
      this.htmlElement.nativeElement.classList.add('completed');
    } else if (this.canceled || this.status === Status.canceled) {
      this.htmlElement.nativeElement.classList.add('removed');
    } else if (
      (this.today.getTime() > this._date.getTime() && this.compilanceDate) ||
      this.status === Status.unfulfilled
    ) {
      this.htmlElement.nativeElement.classList.add('incomplete');
    }
  }
}
