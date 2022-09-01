import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button
    [disabled]="disabled"
    [ngClass]="classes"
    [ngStyle]="{ backgroundColor: backgroundColor }"
    class="button"
    type="button"
  >
    {{ buttonLabel }}
    <ng-content></ng-content>
  </button>`,
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  disabled!: boolean;

  @Input()
  buttonLabel!: string;

  @Input()
  backgroundColor = 'color';

  @Input()
  round = false;

  @Input()
  size: 'large' | 'small' | 'extra-small' | '' = '';

  public get classes(): string[] {

    const shape = this.round ? 'button--round' : 'button--rectangle';

    return ['button', `button--${this.size}`, shape]
  }
}
