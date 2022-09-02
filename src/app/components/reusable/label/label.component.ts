import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  template: `<label [for]="for"
    ><span>{{ spanText }} </span> {{ labelText }}
  </label>`,
  styles: [
    `
      span {
        font-weight: 700;
        font-size: 18px;
      }
    `,
  ],
})
export class LabelComponent {
  @Input()
  for!: string;

  @Input()
  spanText: string | undefined;

  @Input()
  labelText!: string;
}
