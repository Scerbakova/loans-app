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
