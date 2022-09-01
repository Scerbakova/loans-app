import { Component, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  template: `<div [formGroup]="parentForm">
    <input [formControlName]="formControlName" type="number" />
  </div>`,
    styleUrls: ['./amount-input.component.scss'],
  // styles: [
  //   `
  //     input {
  //       border-radius: 6px;
  //       border: none;
  //       outline: none;
  //       margin-bottom: 20px;
  //       padding: 8px 10px;
  //       background-color: rgb(213, 238, 243);
  //       margin-left: 10px;
  //     }
  //     input:focus {
  //       box-shadow: 0px 0px 5px 2px rgb(3, 158, 158);
  //     }
  //   `,
  // ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AmountInputComponent,
    },
  ],
})
export class AmountInputComponent implements ControlValueAccessor {
  writeValue(amount: number): number {
    return amount;
  }
  registerOnChange(amount: number): number {
    return amount;
  }
  registerOnTouched(): void {}

  @Input()
  parentForm!: FormGroup;

  @Input()
  formControlName!: string;
}
