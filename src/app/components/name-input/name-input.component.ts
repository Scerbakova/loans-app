import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from 'src/app/person-credit-history';
import { PersonCreditHistoryService } from 'src/app/person-credit-history.service';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
  styleUrls: ['./name-input.component.css'],
  providers: [PersonCreditHistoryService],
})
export class NameInputComponent implements OnInit {
  @ViewChild('inputQuestion') inputQuestion: ElementRef | undefined;

  @Output()
  findPersonEvent = new EventEmitter();

  loansForm: FormGroup = this.fb.group({});
  people!: Person[];
  peopleToBorrowMoneyFrom!: Person[];
  peopleToLentMoneyTo!: Person[];
  peopleToReturnMoneyTo!: Person[];
  peopleToReceiveMoneyFrom!: Person[];
  person!: Person;
  isChosen = false;
  personHasDept = false;
  personHasDebtors = false;

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
      lentTo: [''],
      returnMoneyTo: [''],
      receiveMoneyBack: [''],

      borrowFromAmount: null,
      lentToAmount: null,
      returnMoneyToAmount: null,
      receiveMoneyBackAmount: null,
    });
  }

  onSubmit() {
    this.loansForm.reset();
  }

  findPerson() {
    this.person = this.loansForm.value.mainPerson;
    this.onConfirm();
    this.isChosen = true;
  }

  borrowFromPerson() {
    this.personCreditHistoryService.borrowFromPerson(
      this.person,
      this.loansForm.value.borrowFromAmount,
      this.loansForm.value.borrowFrom.name,
      this.loansForm.value.borrowFrom.lent.totalAmount,
      this.loansForm.value.borrowFrom.lent.amountToOnePerson
    );

    this.onConfirm();
  }

  lentMoneyTo() {
    this.personCreditHistoryService.lentMoneyTo(
      this.person,
      this.loansForm.value.lentToAmount,
      this.loansForm.value.lentTo.name,
      this.loansForm.value.lentTo.owes.totalAmount,
      this.loansForm.value.lentTo.owes.amountToOnePerson
    );

    this.onConfirm();
  }

  payBackTheDeptToPerson() {
    this.personCreditHistoryService.payBackTheDeptToPerson(
      this.person,
      this.loansForm.value.returnMoneyTo.name,
      this.loansForm.value.returnMoneyTo.lent.amountToOnePerson,
      this.loansForm.value.returnMoneyToAmount,
      this.loansForm.value.returnMoneyTo.lent.totalAmount,
      this.loansForm.value.returnMoneyTo.lent,
      this.loansForm.value.returnMoneyTo.name,
      this.loansForm.value.returnMoneyTo.owes,
      this.loansForm.value.returnMoneyTo.owes.amountToOnePerson
    );

    this.onConfirm();
  }

  receiveDeptFromPerson() {
    this.personCreditHistoryService.receiveDeptFromPerson(
      this.person,
      this.loansForm.value.receiveMoneyBack.owes,
      this.loansForm.value.receiveMoneyBack.name,
      this.loansForm.value.receiveMoneyBack.owes.totalAmount,
      this.loansForm.value.receiveMoneyBack.owes.amountToOnePerson,
      this.loansForm.value.receiveMoneyBackAmount,
      this.loansForm.value.receiveMoneyBack.lent.totalAmount,
      this.loansForm.value.receiveMoneyBack.lent.amountToOnePerson
    );

    this.onConfirm();
  }

  onConfirm() {
    this.findPeopleToBorrowMoneyFrom();
    this.findPeopleToLentMoneyTo();
    this.checkIfThereIsADept();
    this.checkIfThereAreAnyDebtors();
    this.findPeopleToReturnMoneyTo();
    this.findPeopleToReceiveMoneyFrom();
    this.loansForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
  }

  checkIfThereIsADept() {
    if (this.person.owes.totalAmount > 0) {
      this.personHasDept = true;
    }
  }

  checkIfThereAreAnyDebtors() {
    if (this.person.lent.totalAmount > 0) {
      this.personHasDebtors = true;
    }
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

  findPeopleToBorrowMoneyFrom() {
    //find debtors' names
    let debtors = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.lent.amountToOnePerson
    );

    //find people who will be present in 'borrowFrom' select options
    this.peopleToBorrowMoneyFrom = this.people.filter(
      (human) => !debtors.includes(human.name) && human.name != this.person.name
    );
  }

  findPeopleToLentMoneyTo() {
    //find lenders' names
    let lenders = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.owes.amountToOnePerson
    );
    //find debtors' names
    let debtors = this.personCreditHistoryService.findNamesFromOwesOrLentList(
      this.person.lent.amountToOnePerson
    );

    //find people who will be present in 'lentMoneyTo' select options
    this.peopleToLentMoneyTo = this.people.filter(
      (human) =>
        !lenders.includes(human.name) &&
        !debtors.includes(human.name) &&
        human.name != this.person.name
    );
  }
}
