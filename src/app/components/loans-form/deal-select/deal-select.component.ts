import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-deal-select',
  template: `<div class="select" [formGroup]="parentForm">
    <select [formControlName]="formControlName" [id]="id">
      <option class="option" *ngFor="let deal of deals" [ngValue]="deal">
        {{ deal }}
      </option>
    </select>
  </div>`,
  styleUrls: ['./deal-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DealSelectComponent,
    },
  ],
})
export class DealSelectComponent implements ControlValueAccessor {
  writeValue(deals: string[]): string[] {
    return deals;
  }
  registerOnChange(deals: string[]): string[] {
    return deals;
  }
  registerOnTouched(): void {}

  @Input()
  deals!: string[];

  @Input()
  parentForm!: FormGroup;

  @Input()
  formControlName!: string;

  @Input()
  id!: string;
}
