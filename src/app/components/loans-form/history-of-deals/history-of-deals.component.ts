import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Deal, Person } from 'src/app/person-credit-history';

@Component({
  selector: 'app-history-of-deals',
  templateUrl: './history-of-deals.component.html',
  styleUrls: ['./history-of-deals.component.scss'],
})
export class HistoryOfDealsComponent implements OnInit {
  @Input()
  person!: Person;

  @Input()
  deals!: Deal[];

  @Input()
  formGroupName!: string;

  @Input()
  filteredDeals!: Deal[];

  form!: FormGroup;

  sort = [
    {
      label: 'date',
      options: ['oldest to newest', 'newest to oldest'],
    },
    {
      label: 'amount',
      options: ['largest to smallest', 'smallest to largest'],
    },
    {
      label: 'type',
      options: [
        'given first',
        'taken first',
        'returned first',
        'received first',
      ],
    },
  ];

  filter = ['all', 'given', 'taken', 'returned', 'received'];

  given() {
    return this.deals.filter((deal) => deal.type.includes('lent'));
  }
  taken() {
    return this.deals.filter((deal) => deal.type.includes('borrowed'));
  }
  returned() {
    return this.deals.filter((deal) => deal.type.includes('returned'));
  }
  received() {
    return this.deals.filter((deal) => deal.type.includes('received'));
  }

  oldestToNewest() {
    const b = this.deals.map((deal) => deal.time);
    return b.sort();
  }

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }

  onApply() {
    this.onFilterApplied();
    this.onSortApplied();
  }

  onSortApplied() {
    console.log(this.oldestToNewest())
  }

  onFilterApplied() {
    switch (this.form.value.filter) {
      case 'given':
        this.filteredDeals = this.deals;
        this.filteredDeals = this.given();
        break;
      case 'taken':
        this.filteredDeals = this.deals;
        this.filteredDeals = this.taken();
        break;
      case 'returned':
        this.filteredDeals = this.deals;
        this.filteredDeals = this.returned();
        break;
      case 'received':
        this.filteredDeals = this.deals;
        this.filteredDeals = this.received();
        break;
      default:
        this.filteredDeals = this.deals;
        break;
    }
  }
}
