import { Component, Input } from '@angular/core';
import { Deal } from 'src/app/person-credit-history';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.scss']
})
export class DealCardComponent {
  @Input()
  deal!: Deal

}
