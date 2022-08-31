import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button [disabled]="disabled" class="button" type="button">
    {{ buttonLabel }}
  </button>`,
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  disabled!: boolean;

  @Input()
  buttonLabel!: string;
}
