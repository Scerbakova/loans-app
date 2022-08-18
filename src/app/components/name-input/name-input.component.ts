import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmountAndPerson, Person } from 'src/app/person-credit-history';
import { PersonCreditHistoryService } from 'src/app/person-credit-history.service';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
  styleUrls: ['./name-input.component.css'],
  providers: [PersonCreditHistoryService],
})
export class NameInputComponent implements OnInit {
  @Output()
  findPersonEvent = new EventEmitter();

  nameForm: FormGroup = this.fb.group({});
  people: Person[] | undefined;
  person!: Person;
  personToBorrowFrom!: Person;

  constructor(
    private fb: FormBuilder,
    private personCreditHistoryService: PersonCreditHistoryService
  ) {}

  ngOnInit(): void {
    this.personCreditHistoryService.getData();

    this.people = JSON.parse(
      localStorage.getItem('people') || '[]'
    ) as Person[];

    this.buidForm();
  }

  buidForm(): void {
    this.nameForm = this.fb.group({
      mainPerson: ['', Validators.required],
      borrowFrom: [''],
      borrowFromAmount: 0,
    });
  }

  findPerson() {
    this.person = this.nameForm.value.mainPerson;
  }

  borrowFromPerson() {
    // this.personToBorrowFrom = this.nameForm.value.borrowFrom;

    // let newLentData = {
    //   amount: this.nameForm.value.borrowFromAmount,
    //   name: this.person.name,
    // };

    // let newAmountForOnePerson: AmountAndPerson[] =
    //   this.nameForm.value.borrowFrom.lent.amountToOnePerson;

    // newAmountForOnePerson.push(newLentData);

    // this.personToBorrowFrom.lent.amountToOnePerson = newAmountForOnePerson;

    // this.personToBorrowFrom.lent.totalAmount = newLentData.amount;
    this.personCreditHistoryService.setData(
      this.personToBorrowFrom,
      this.nameForm.value.borrowFrom,
      this.nameForm.value.borrowFromAmount
    );
    // this.personToBorrowFrom.lent.totalAmount =
    //   this.personCreditHistoryService.setTotalLentAmount(
    //     this.personToBorrowFrom.lent.totalAmount,
    //     newAmountForOnePerson
    //   );

    return localStorage.setItem('people', JSON.stringify(this.people));
  }
}
