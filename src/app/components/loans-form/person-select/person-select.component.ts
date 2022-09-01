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
  // styles: [
  //   `
  //     select {
  //       border-radius: 6px;
  //       border: none;
  //       outline: none;
  //       margin-bottom: 20px;
  //       padding: 8px 10px;
  //       background-color: inherit;
  //       margin-left: 10px;
  //     }
  //     select:focus {
  //       box-shadow: 0px 0px 5px 2px rgb(3, 158, 158);
  //     }
  //   `,
  // ],
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
