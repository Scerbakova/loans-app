import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from 'src/app/person-credit-history';
import { PersonCreditHistoryService } from 'src/app/person-credit-history.service';

@Component({
  selector: 'loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
  providers: [PersonCreditHistoryService],
})
export class LoansComponent implements OnInit {
  loansForm: FormGroup = this.fb.group({});
  people!: Person[];
  peopleToBorrowMoneyFrom!: Person[];
  peopleToLendMoneyTo!: Person[];
  peopleToReturnMoneyTo!: Person[];
  peopleToReceiveMoneyFrom!: Person[];
  person!: Person;
  isChosen = false;
  personHasDebt = false;
  personHasDebtors = false;
  showDealHistory = false;
  dealHistoryButton = "Show all deals"

  constructor(
    private fb: FormBuilder,
    private personCreditHistoryService: PersonCreditHistoryService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('people') === null) {
      this.people = this.personCreditHistoryService.getData();
    } else {
      this.people = JSON.parse(
        localStorage.getItem('people') || '[]'
      ) as Person[];
    }
    this.buidForm();
  }

  buidForm(): void {
    this.loansForm = this.fb.group({
      mainPerson: ['', Validators.required],
      borrowFrom: [''],
      lendTo: [''],
      returnMoneyTo: [''],
      receiveMoneyBack: [''],

      borrowFromAmount: null,
      lendToAmount: null,
      returnMoneyToAmount: null,
      receiveMoneyBackAmount: null,
    });
  }

  onToggleDealHistory() {
    this.showDealHistory = !this.showDealHistory
    if (!this.showDealHistory) {
      this.dealHistoryButton = "Show all deals"
    } else {
      this.dealHistoryButton = "Hide deals"
    }
  }

  findPerson() {
    this.person = this.loansForm.value.mainPerson;
    this.onConfirm();
    this.isChosen = true;
    this.dealHistoryButton = "Show all deals"
    this.showDealHistory = false

  }

  borrowFromPerson() {
    this.personCreditHistoryService.borrowFromPerson(
      this.person,
      this.loansForm.value.borrowFromAmount,
      this.loansForm.value.borrowFrom.name,
      this.loansForm.value.borrowFrom.lent,
      this.loansForm.value.borrowFrom
    );
    this.onConfirm();
  }

  lentMoneyTo() {
    this.personCreditHistoryService.lentMoneyTo(
      this.person,
      this.loansForm.value.lendToAmount,
      this.loansForm.value.lendTo.name,
      this.loansForm.value.lendTo.owes,
      this.loansForm.value.lendTo
    );
    this.onConfirm();
  }

  payBackTheDeptToPerson() {
    this.personCreditHistoryService.payBackTheDeptToPerson(
      this.person,
      this.loansForm.value.returnMoneyTo.name,
      this.loansForm.value.returnMoneyToAmount,
      this.loansForm.value.returnMoneyTo.lent,
      this.loansForm.value.returnMoneyTo.owes,
      this.loansForm.value.returnMoneyTo
    );
    this.onConfirm();
  }

  receiveDeptFromPerson() {
    this.personCreditHistoryService.receiveDeptFromPerson(
      this.person,
      this.loansForm.value.receiveMoneyBack.owes,
      this.loansForm.value.receiveMoneyBack.name,
      this.loansForm.value.receiveMoneyBackAmount,
      this.loansForm.value.receiveMoneyBack.lent,
      this.loansForm.value.receiveMoneyBack
    );

    this.onConfirm();
  }

  onConfirm() {
    this.findPeopleToLentMoneyToOrBorrowFrom();
    this.findPeopleToReturnMoneyTo();
    this.findPeopleToReceiveMoneyFrom();
    localStorage.setItem('people', JSON.stringify(this.people));
    this.loansForm.reset();
  }

  findPeopleToReturnMoneyTo() {
    //find lenders' names
    let lenders = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.owes.amountToOnePerson
    );
    //find people who will be present in 'returnMoneyTo' select options
    this.peopleToReturnMoneyTo = this.people.filter(
      (human) => lenders.includes(human.name) && human.name != this.person.name
    );
  }

  findPeopleToReceiveMoneyFrom() {
    //find debtors' names
    let deptors = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.lent.amountToOnePerson
    );
    //find people who will be present in 'receiveMoneyFrom' select options
    this.peopleToReceiveMoneyFrom = this.people.filter(
      (human) => deptors.includes(human.name) && human.name != this.person.name
    );
  }

  findPeopleToLentMoneyToOrBorrowFrom() {
    //find lenders' names
    let lenders = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.owes.amountToOnePerson
    );
    //find debtors' names
    let debtors = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.lent.amountToOnePerson
    );

    //find people who will be present in 'lendMoneyTo' select options
    this.peopleToLendMoneyTo = this.people.filter(
      (human) =>
        !lenders.includes(human.name) &&
        !debtors.includes(human.name) &&
        human.name != this.person.name
    );
    //find people who will be present in 'borrowMoneyFrom' select options
    this.peopleToBorrowMoneyFrom = this.people.filter(
      (human) =>
        !lenders.includes(human.name) &&
        !debtors.includes(human.name) &&
        human.name != this.person.name
    );
  }
}
