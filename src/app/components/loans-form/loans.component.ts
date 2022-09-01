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
  activePeople!: Person[];
  peopleForCarousel!: Person[];

  person!: Person;

  isChosen = false;
  activePeopleBoolean = false;
  personHasDebt = false;
  personHasDebtors = false;
  showDealHistory = false;
  rightButtonDisabled = false;
  leftButtonDisabled = true;

  dealHistoryButton = 'Show all deals';
  activeDeal!: string;
  preposition!: string;

  deals = ['Give', 'Take', 'Receive', 'Return'];

  activeFunction!: () => void;

  offset = 0;
  length = 3;

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
    this.peopleForCarousel = this.people.slice(this.offset, this.length);
  }

  buidForm(): void {
    this.loansForm = this.fb.group({
      mainPerson: ['', Validators.required],
      deal: [''],
      formPerson: [''],
      amount: null,
      dealsInfo: this.fb.group({
        sort: [],
        filter: [],
      }),
    });
  }

  onToggleDealHistory() {
    this.showDealHistory = !this.showDealHistory;
    if (!this.showDealHistory) {
      this.dealHistoryButton = 'Show all deals';
    } else {
      this.dealHistoryButton = 'Hide deals';
    }
  }

  onReturnToCarousel() {
    this.isChosen = false;
    this.activePeopleBoolean = false
  }

  findPerson(person: Person) {
    this.person = person;
    this.onConfirm();
    this.isChosen = true;
    this.dealHistoryButton = 'Show all deals';
    this.showDealHistory = false;
  }

  onCarouselDirectionChange(direction: string) {
    if (direction === 'right') {
      this.leftButtonDisabled = false;
      this.offset += 1;
      this.length += 1;
      this.peopleForCarousel = this.people.slice(this.offset, this.length);
      if (this.length === this.people.length) {
        this.rightButtonDisabled = true;
      }
    } else {
      this.rightButtonDisabled = false;
      this.offset -= 1;
      this.length -= 1;
      this.peopleForCarousel = this.people.slice(this.offset, this.length);
      if (this.offset === 0) {
        this.leftButtonDisabled = true;
      }
    }
  }

  selectDeal() {
    this.activeDeal = this.loansForm.value.deal;

    if (this.loansForm.value.deal === 'Give') {
      this.findPeopleToLentMoneyToOrBorrowFrom();
      this.activeFunction = this.lendMoneyTo;
      this.preposition = 'to';
    } else if (this.loansForm.value.deal === 'Take') {
      this.findPeopleToLentMoneyToOrBorrowFrom();
      this.activeFunction = this.borrowFromPerson;
      this.preposition = 'from';
    } else if (this.loansForm.value.deal === 'Return') {
      this.findPeopleToReturnMoneyTo();
      this.preposition = 'to';
    } else {
      this.findPeopleToReceiveMoneyFrom();
      this.preposition = 'from';
    }
  }

  borrowFromPerson() {
    this.personCreditHistoryService.borrowFromPerson(
      this.person,
      this.loansForm.value.amount,
      this.loansForm.value.formPerson.name,
      this.loansForm.value.formPerson.lent,
      this.loansForm.value.formPerson
    );
    this.onConfirm();
  }

  lendMoneyTo() {
    this.personCreditHistoryService.lendMoneyTo(
      this.person,
      this.loansForm.value.amount,
      this.loansForm.value.formPerson.name,
      this.loansForm.value.formPerson.owes,
      this.loansForm.value.formPerson
    );
    this.onConfirm();
  }

  payBackTheDeptToPerson() {
    this.personCreditHistoryService.payBackTheDeptToPerson(
      this.person,
      this.loansForm.value.formPerson.name,
      this.loansForm.value.amount,
      this.loansForm.value.formPerson.lent,
      this.loansForm.value.formPerson.owes,
      this.loansForm.value.formPerson
    );
    this.onConfirm();
  }

  receiveDeptFromPerson() {
    this.personCreditHistoryService.receiveDeptFromPerson(
      this.person,
      this.loansForm.value.formPerson.owes,
      this.loansForm.value.formPerson.name,
      this.loansForm.value.amount,
      this.loansForm.value.formPerson.lent,
      this.loansForm.value.formPerson
    );

    this.onConfirm();
  }

  onConfirm() {
    localStorage.setItem('people', JSON.stringify(this.people));
    this.loansForm.reset();
  }

  findPeopleToReturnMoneyTo(): Person[] {
    this.activeFunction = this.payBackTheDeptToPerson;
    //find lenders' names
    let lenders = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.owes.amountToOnePerson
    );
    this.activePeopleBoolean = true
    //find people who will be present in 'returnMoneyTo' select options
    return (this.activePeople = this.people.filter(
      (human) => lenders.includes(human.name) && human.name != this.person.name
    ));
  }

  findPeopleToReceiveMoneyFrom(): Person[] {
    this.activeFunction = this.receiveDeptFromPerson;
    //find debtors' names
    let deptors = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.lent.amountToOnePerson
    );
    this.activePeopleBoolean = true
    //find people who will be present in 'receiveMoneyFrom' select options
    return (this.activePeople = this.people.filter(
      (human) => deptors.includes(human.name) && human.name != this.person.name
    ));
  }

  findPeopleToLentMoneyToOrBorrowFrom(): Person[] {
    //find lenders' names
    let lenders = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.owes.amountToOnePerson
    );
    //find debtors' names
    let debtors = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.lent.amountToOnePerson
    );
    this.activePeopleBoolean = true
    return (this.activePeople = this.people.filter(
      (human) =>
        !lenders.includes(human.name) &&
        !debtors.includes(human.name) &&
        human.name != this.person.name
    ));
  }
}
