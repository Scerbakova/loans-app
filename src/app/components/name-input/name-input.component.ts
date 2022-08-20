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

//!NAMING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
    this.findPeopleToBorrowMoneyFrom();
    this.findPeopleToLentMoneyTo();
    this.checkIfThereIsADept();
    this.checkIfThereAreAnyDebtors();
    this.findPeopleToReturnMoneyTo();
    this.findPeopleToReceiveMoneyFrom();
    this.isChosen = true;
  }

  borrowFromPerson() {
    //total amount of money to owe
    this.person.owes.totalAmount =
      this.person.owes.totalAmount + this.loansForm.value.borrowFromAmount;

    if (
      //entry with this name already exists in the owes list of this.person
      this.personCreditHistoryService.checkWhetherSuchEntryExistsInAList(
        this.person.owes.amountToOnePerson,
        this.loansForm.value.borrowFrom.name
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.personCreditHistoryService.increaseAmountInEntry(
        this.person.owes.amountToOnePerson,
        this.loansForm.value.borrowFrom.name,
        this.loansForm.value.borrowFromAmount
      );
    } else {
      //make a new entry in the owes list
      this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
        this.person.owes.amountToOnePerson,
        this.loansForm.value.borrowFromAmount,
        this.loansForm.value.borrowFrom.name
      );
    }
    //total amount of money to lent
    this.loansForm.value.borrowFrom.lent.totalAmount =
      this.loansForm.value.borrowFrom.lent.totalAmount +
      +this.loansForm.value.borrowFromAmount;

    if (
      //entry with this name already exists in the lent list of another person
      this.personCreditHistoryService.checkWhetherSuchEntryExistsInAList(
        this.loansForm.value.borrowFrom.lent.amountToOnePerson,
        this.person.name
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.personCreditHistoryService.increaseAmountInEntry(
        this.loansForm.value.borrowFrom.lent.amountToOnePerson,
        this.person.name,
        this.loansForm.value.borrowFromAmount
      );
    } else {
      //make new entry in the lent list
      this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
        this.loansForm.value.borrowFrom.lent.amountToOnePerson,
        this.loansForm.value.borrowFromAmount,
        this.person.name
      );
    }

    this.checkIfThereIsADept();
    this.checkIfThereAreAnyDebtors();
    this.findPeopleToReturnMoneyTo();
    this.findPeopleToLentMoneyTo();
    this.checkIfThereAreAnyDebtors();
    this.loansForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
  }

  lentMoneyTo() {
    //total amount of money to lent
    this.person.lent.totalAmount =
      this.person.lent.totalAmount + this.loansForm.value.lentToAmount;

    if (
      //entry with this name already exists in the list
      this.personCreditHistoryService.checkWhetherSuchEntryExistsInAList(
        this.person.lent.amountToOnePerson,
        this.loansForm.value.lentTo.name
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.personCreditHistoryService.increaseAmountInEntry(
        this.person.lent.amountToOnePerson,
        this.loansForm.value.lentTo.name,
        this.loansForm.value.lentToAmount
      );
    } else {
      //make a new entry in the list of people who the person borrowed money to
      this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
        this.person.lent.amountToOnePerson,
        this.loansForm.value.lentToAmount,
        this.loansForm.value.lentTo.name
      );
    }
    //total amount of money to owe
    this.loansForm.value.lentTo.owes.totalAmount =
      this.loansForm.value.lentTo.owes.totalAmount +
      +this.loansForm.value.lentToAmount;

    if (
      //entry with this name already exists in the list
      this.personCreditHistoryService.checkWhetherSuchEntryExistsInAList(
        this.loansForm.value.lentTo.owes.amountToOnePerson,
        this.person.name
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.personCreditHistoryService.increaseAmountInEntry(
        this.loansForm.value.lentTo.owes.amountToOnePerson,
        this.person.name,
        this.loansForm.value.lentToAmount
      );
    } else {
      //make new entry in the list of people a person owes money from
      this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
        this.loansForm.value.lentTo.owes.amountToOnePerson,
        this.loansForm.value.lentToAmount,
        this.person.name
      );
    }
    this.checkIfThereIsADept();
    this.checkIfThereAreAnyDebtors();
    this.findPeopleToReturnMoneyTo();
    this.findPeopleToBorrowMoneyFrom();
    this.findPeopleToReceiveMoneyFrom();
    this.loansForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
  }

  payBackTheDeptToPerson() {
    //person's name, who was selected to return money to and initial dept amount to him
    let owesDataToExactPerson = this.person.owes.amountToOnePerson.find(
      (owesData) => owesData.name === this.loansForm.value.returnMoneyTo.name
    );

    //main person name and his/her initial dept amount to the person which was selected to return money to
    let lentDataToExactPerson =
      this.loansForm.value.returnMoneyTo.lent.amountToOnePerson.find(
        (lentData: { name: string }) => lentData.name === this.person.name
      );

    //calculating the sum main person owes to the selected person after paying a dept
    if (owesDataToExactPerson)
      if (
        //the amount main person returns is less or equal to the amount he/she owes
        this.loansForm.value.returnMoneyToAmount <=
        +owesDataToExactPerson.amount
      ) {
        //selected person's loan amount minus amount main person returns
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount -
          this.loansForm.value.returnMoneyToAmount;

        //total amount of all loans minus amount main person returns
        this.person.owes.totalAmount =
          this.person.owes.totalAmount -
          this.loansForm.value.returnMoneyToAmount;

        //remove empty entry
        this.personCreditHistoryService.removeEmptyEntry(this.person.owes);

        //main person dept amount to the selected person minus returned amount
        lentDataToExactPerson.amount =
          lentDataToExactPerson.amount -
          this.loansForm.value.returnMoneyToAmount;

        //calculating total dept amount
        this.loansForm.value.returnMoneyTo.lent.totalAmount =
          this.loansForm.value.returnMoneyTo.lent.totalAmount -
          this.loansForm.value.returnMoneyToAmount;

        //remove empty entry
        this.personCreditHistoryService.removeEmptyEntry(
          this.loansForm.value.returnMoneyTo.lent
        );
      } else {
        //amount to return is bigger than dept amount

        //calculating overpay
        const overpay =
          this.loansForm.value.returnMoneyToAmount -
          owesDataToExactPerson.amount;

        //overpay goes to total lent amount of main person
        this.person.lent.totalAmount = this.person.lent.totalAmount + overpay;

        //make new entry in the list of people a person borrowed money to
        this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
          this.person.lent.amountToOnePerson,
          overpay,
          this.loansForm.value.returnMoneyTo.name
        );

        //calculating total owes amount
        this.person.owes.totalAmount =
          this.person.owes.totalAmount - owesDataToExactPerson.amount;

        //dept to the selected person is removed
        owesDataToExactPerson.amount = 0;

        //calculating residual dept
        if (lentDataToExactPerson) {
          //main person's dept amount is bigger than overpay
          if (lentDataToExactPerson.amount > overpay) {
            //dept decreases
            lentDataToExactPerson.amount =
              lentDataToExactPerson.amount - overpay;
          } else {
            //dept disappears
            lentDataToExactPerson.amount = 0;
            //remove empty entry
            this.personCreditHistoryService.removeEmptyEntry(this.person.owes);
          }
        }
        //overpay goes to total owes amount of selected person
        this.loansForm.value.returnMoneyTo.owes.totalAmount =
          this.loansForm.value.returnMoneyTo.owes.totalAmount + overpay;

        //generating new owes entry
        this.loansForm.value.returnMoneyTo.owes.amountToOnePerson.push({
          amount: overpay,
          name: this.person.name,
        });

        //calculating total selected person's lent amount
        this.loansForm.value.returnMoneyTo.lent.totalAmount =
          this.loansForm.value.returnMoneyTo.lent.totalAmount -
          this.loansForm.value.returnMoneyToAmount;
        this.loansForm.value.returnMoneyTo.lent.totalAmount < 0
          ? (this.loansForm.value.returnMoneyTo.lent.totalAmount = 0)
          : (this.loansForm.value.returnMoneyTo.lent.totalAmount =
              this.loansForm.value.returnMoneyTo.lent.totalAmount - overpay);

        //remove empty entry
        this.personCreditHistoryService.removeEmptyEntry(
          this.loansForm.value.returnMoneyTo.lent
        );
      }
    this.findPeopleToBorrowMoneyFrom();
    this.findPeopleToLentMoneyTo();
    this.checkIfThereIsADept();
    this.checkIfThereAreAnyDebtors();
    this.findPeopleToReceiveMoneyFrom();
    this.loansForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
  }

  receiveDeptFromPerson() {}

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
