import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  template: `<label [for]="for"
    ><span>{{ spanText }} </span> {{ labelText }}
  </label>`,
  styles: [
    `
      :host-context(.main__person--label) label {
        font-size: 24px;
      }
      :host-context(.main__person--label) {
        margin: 24px;
      }
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
