import { Component, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Person } from 'src/app/person-credit-history';

@Component({
  selector: 'app-person-select',
  template: `<div [formGroup]="parentForm">
    <select [formControlName]="formControlName" [id]="id">
      <option *ngFor="let person of people" [ngValue]="person">
        {{ person.name }}
      </option>
    </select>
  </div>`,
  styleUrls: ['./person-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PersonSelectComponent,
    },
  ],
})
export class PersonSelectComponent implements ControlValueAccessor {
  writeValue(person: Person): Person {
    return person;
  }
  registerOnChange(person: Person): Person {
    return person;
  }
  registerOnTouched(): void {}

  @Input()
  people!: Person[];

  @Input()
  parentForm!: FormGroup;

  @Input()
  formControlName!: string;

  @Input()
  id!: string;
}
