import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Person } from 'src/app/person-credit-history';

@Component({
  selector: 'app-history-of-deals',
  templateUrl: './history-of-deals.component.html',
  styleUrls: ['./history-of-deals.component.scss'],
})
export class HistoryOfDealsComponent implements OnInit {
  @Input()
  person!: Person;

  @Input()
  formGroupName!: string;

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
      options: ['given first', 'taken first', 'returned first', 'received first'],
    },
  ];

  filter = ['given', 'taken', 'returned', 'received']

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
