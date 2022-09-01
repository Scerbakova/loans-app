import { Component, Input } from '@angular/core';
import { Person } from 'src/app/person-credit-history';

@Component({
  selector: 'app-person-detailed-card',
  templateUrl: './person-detailed-card.component.html',
  styleUrls: ['./person-detailed-card.component.scss']
})
export class PersonDetailedCardComponent {
  @Input()
  person!: Person;
}
