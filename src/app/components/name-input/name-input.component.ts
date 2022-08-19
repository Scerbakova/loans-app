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
  people!: Person[];
  peopleToSelect!: Person[];
  peopleToSelectToReturnMoney!: Person[];
  person!: Person;
  isChosen = false;
  personHasDept = false;

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
      returnMoneyTo: [''],
      borrowFromAmount: 0,
      returnMoneyToAmount: 0,
    });
  }

  findPerson() {
    this.person = this.nameForm.value.mainPerson;
    this.peopleToSelect = this.people.filter(
      (human) => human.name != this.person.name
    );
    this.isChosen = true;
    this.checkIfThereIsADept();
    this.findPeopleToReturnMoneyTo();
  }

  // findPerson() {
  //   this.personCreditHistoryService.findPerson(
  //     this.person,
  //     this.nameForm.value.mainPerson,
  //     this.peopleToSelect,
  //     this.people,
  //     this.isChosen
  //   );
  // }

  borrowFromPerson() {
    //total amount of money to owe
    this.person.owes.totalAmount =
      this.person.owes.totalAmount + +this.nameForm.value.borrowFromAmount;

    //make new object in list of people who borrowed money to the person
    this.person.owes.amountToOnePerson.push({
      amount: this.nameForm.value.borrowFromAmount,
      name: this.nameForm.value.borrowFrom.name,
    });

    //total amount of money to lent
    this.nameForm.value.borrowFrom.lent.totalAmount =
      this.nameForm.value.borrowFrom.lent.totalAmount +
      +this.nameForm.value.borrowFromAmount;

    //make new object in list of people whom a person borrowed money
    this.nameForm.value.borrowFrom.lent.amountToOnePerson.push({
      amount: this.nameForm.value.borrowFromAmount,
      name: this.person.name,
    });

    // this.personCreditHistoryService.calculations(
    //   this.people,
    //   this.person,
    //   this.nameForm.value.borrowFrom,
    //   this.nameForm.value.borrowFromAmount,
    //   this.nameForm.value.borrowFrom.lent,
    //   this.person.owes
    // );
    this.checkIfThereIsADept();
    this.findPeopleToReturnMoneyTo();
  }

  payBackTheDeptToPerson() {
    // this.personCreditHistoryService.calculations(
    //   this.people,
    //   this.person,
    //   this.nameForm.value.returnMoneyTo,
    //   this.nameForm.value.returnMoneyToAmount,
    //   this.nameForm.value.returnMoneyTo.owes,
    //   this.person.lent
    // );
    //informacija po konkretnomu cheloveku, kotorogo ja selektnula na vozvrat - skoljko ja emu dolzhna i ego imja
    let owesDataToExactPerson = this.person.owes.amountToOnePerson.find(
      (owesData) => owesData.name === this.nameForm.value.returnMoneyTo.name
    );
    let lentDataToExactPerson = this.person.lent.amountToOnePerson.find(
      (owesData) => owesData.name === this.nameForm.value.returnMoneyTo.name
    );

    //summa kotoruju ja emu dolzhna minus summa iz inputa
    if (owesDataToExactPerson)
      if (
        this.nameForm.value.returnMoneyToAmount <= owesDataToExactPerson.amount
      ) {
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount -
          this.nameForm.value.returnMoneyToAmount;
        this.person.owes.totalAmount =
          this.person.owes.totalAmount -
          this.nameForm.value.returnMoneyToAmount;
      } else {
        //dolg stiraetsa, a raznica dobavljaetsa v odolzhennie i v dolg drugomu
        const overpay =
          this.nameForm.value.returnMoneyToAmount -
          owesDataToExactPerson.amount;
        if (lentDataToExactPerson) {
          lentDataToExactPerson.amount = lentDataToExactPerson.amount - overpay;
          this.person.lent.totalAmount = this.person.lent.totalAmount - overpay;
        }
      }
    console.log(lentDataToExactPerson);

    //ubratj nulevoj objekt
    this.person.owes.amountToOnePerson =
      this.person.owes.amountToOnePerson.filter(
        (owesData) => owesData.amount !== 0
      );

    // const listOfPeopleMoneyWereTakenFrom = this.person.owes.amountToOnePerson.map(owesData => owesData.name)
    // const listOfPeopleMoneyWereReturnedTo = this.person.paysDept.amountToOnePerson.map(paysDeptData => paysDeptData.name)
    // const matchingName = listOfPeopleMoneyWereTakenFrom.filter(name => listOfPeopleMoneyWereReturnedTo.includes(name)).toString()
    // let owesData = this.person.owes.amountToOnePerson.find(owesData => owesData.name === matchingName)
    // let paysDeptData = this.person.paysDept.amountToOnePerson.find(paysDeptData => paysDeptData.name === matchingName)
    // if(owesData && paysDeptData)
    // if (owesData.amount > paysDeptData.amount) {
    //   owesData.amount = owesData.amount - paysDeptData.amount
    //   this.person.owes.totalAmount = this.person.owes.totalAmount - owesData?.amount
    //  }

    //probezhatjsa i posmotretj estj li dolg s takim imenem, esli estj,
    //to dolg < vozvrata ? dolg = vozvrat - dolg, dolg = vozvratu ? vesj objekt ubiraem,
    //dolg > vozvrata ? dolg ubiraem, a raznicu pishem v dolg tomu, komu vozvraschali
  }

  checkIfThereIsADept() {
    if (this.person.owes.totalAmount > 0) {
      this.personHasDept = true;
    }
  }

  findPeopleToReturnMoneyTo() {
    this.peopleToSelectToReturnMoney = this.people.filter(
      (human) => human.lent.totalAmount > 0 && human.name !== this.person.name
    );
  }
}
