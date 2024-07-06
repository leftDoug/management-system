import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  // dayBeginning(control: FormControl): ValidationErrors | null {
  //   const beginning: Date = new Date(control.value);
  //   beginning.setHours(9);
  //   beginning.setMinutes(0);

  //   if (beginning.getTime() > control.value.getTime()) {
  //     return { tooEarlyError: true };
  //   }

  //   return null;
  // }

  // dayEnd(control: FormControl): ValidationErrors | null {
  //   const end: Date = new Date(control.value);
  //   end.setHours(17);
  //   end.setMinutes(0);

  //   if (end.getTime() < control.value.getTime()) {
  //     return { tooLateError: true };
  //   }

  //   return null;
  // }

  timeLimits(control: FormControl): ValidationErrors | null {
    const time: Date = new Date(control.value);
    const beginning: Date = new Date(time);
    const end: Date = new Date(time);

    beginning.setHours(9);
    beginning.setMinutes(0);
    end.setHours(17);
    end.setMinutes(0);

    if (time.getTime() < beginning.getTime()) {
      return { tooEarlyError: true };
    }
    if (time.getTime() > end.getTime()) {
      return { tooLateError: true };
    }

    return null;
  }

  compareBeginningAndEnd(b: string, e: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const beginning: Date = new Date(formGroup.get(b)?.value);
      const end: Date = new Date(formGroup.get(e)?.value);

      if (beginning.getTime() > end.getTime()) {
        if (!formGroup.get(e)?.errors) {
          formGroup.get(e)?.setErrors({ endBeginningError: true });
        }

        return {
          endBeginningError: true,
        };
      }

      return null;
    };
  }

  compareMeetingAndCompilance(m: string, c: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const meeting: Date = new Date(formGroup.get(m)?.value);
      const compilance: Date = new Date(formGroup.get(c)?.value);

      if (meeting.getTime() > compilance.getTime()) {
        formGroup.get(c)?.setErrors({ meetingCompilanceError: true });
        return {
          meetingCompilanceError: true,
        };
      } else {
        formGroup.get(c)?.setErrors(null);
      }
      // else {
      //   return this.compilanceDate(formGroup.get(c) as FormControl);
      // }

      return null;
    };
  }

  meetingDate(control: FormControl): ValidationErrors | null {
    const meetingDate: Date = new Date(control.value);
    const today: Date = new Date();

    if (today.getTime() < meetingDate.getTime()) {
      return { meetingDateError: true };
    }

    return null;
  }

  // compilanceDate(control: FormControl): ValidationErrors | null {
  //   const compilanceDate: Date = new Date(control.value);
  //   const today: Date = new Date();

  //   if (today.getTime() > compilanceDate.getTime()) {
  //     return {
  //       compilanceDateError: true,
  //     };
  //   }

  //   return null;
  // }
}
