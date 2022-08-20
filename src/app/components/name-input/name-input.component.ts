import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmountAndPerson, Person } from 'src/app/person-credit-history';
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
  peopleToSelectToReturnMoney!: Person[];
  person!: Person;
  isChosen = false;
  personHasDept = false;

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
      LentTo: [''],
      returnMoneyTo: [''],

      borrowFromAmount: null,
      LentToAmount: null,
      returnMoneyToAmount: null,
    });
  }

  onSubmit() {
    this.loansForm.reset();
  }

  findPerson() {
    this.person = this.loansForm.value.mainPerson;
    // this.makeAListOfPeople(this.people, this.person ,this.peopleToBorrowMoneyFrom)
    this.peopleToBorrowMoneyFrom = this.people.filter(
      (human) => human.name != this.person.name
    );
    this.peopleToLentMoneyTo = this.people.filter(
      (human) => human.name != this.person.name
    );
    this.isChosen = true;
    this.checkIfThereIsADept();
    this.findPeopleToReturnMoneyTo();
  }

  //   makeAListOfPeople(
  //   people: Person[],
  //   mainPerson: Person,
  //   nameOFList: Person[]
  // ): Person[] {
  //   return nameOFList = people.filter((person) => person.name != mainPerson.name);
  // }

  // findPerson() {
  //   this.personCreditHistoryService.findMainPerson(
  //     this.person,
  //     this.loansForm.value.mainPerson,
  //     this.peopleToSelectToReturnMoney,
  //     this.people,
  //     this.isChosen,
  //     this.peopleToBorrowMoneyFrom,
  //     this.peopleToLentMoneyTo
  //   )
  // }

  borrowFromPerson() {
    //total amount of money to owe
    this.person.owes.totalAmount =
      this.person.owes.totalAmount + +this.loansForm.value.borrowFromAmount;

    if (
      //entry with this name already exists in the list
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
      //make a new entry in the list of people who borrowed money to the person
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
      //entry with this name already exists in the list
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
      //make new entry in the list of people a person borrowed money to
      this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
        this.loansForm.value.borrowFrom.lent.amountToOnePerson,
        this.loansForm.value.borrowFromAmount,
        this.person.name
      );
    }

    //!esli hothat odolzhitj vtoroj raz?????????????????????????????????????????????????????

    // this.personCreditHistoryService.calculations(
    //   this.people,
    //   this.person,
    //   this.loansForm.value.borrowFrom,
    //   this.loansForm.value.borrowFromAmount,
    //   this.loansForm.value.borrowFrom.lent,
    //   this.person.owes
    // );
    this.checkIfThereIsADept();
    this.findPeopleToReturnMoneyTo();
    this.loansForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
  }
  lentMoneyTo() {
    //total amount of money to owe
    this.person.owes.totalAmount =
      this.person.owes.totalAmount + this.loansForm.value.borrowFromAmount;

    //!make new object in list of people who borrowed money to the person
    this.person.owes.amountToOnePerson.push({
      amount: this.loansForm.value.borrowFromAmount,
      name: this.loansForm.value.borrowFrom.name,
    });

    //total amount of money to lent
    this.loansForm.value.borrowFrom.lent.totalAmount =
      this.loansForm.value.borrowFrom.lent.totalAmount +
      +this.loansForm.value.borrowFromAmount;

    //!make new object in the list of people a person borrowed money to
    this.loansForm.value.borrowFrom.lent.amountToOnePerson.push({
      amount: this.loansForm.value.borrowFromAmount,
      name: this.person.name,
    });

    //!esli hothat odolzhitj vtoroj raz?????????????????????????????????????????????????????

    // this.personCreditHistoryService.calculations(
    //   this.people,
    //   this.person,
    //   this.loansForm.value.borrowFrom,
    //   this.loansForm.value.borrowFromAmount,
    //   this.loansForm.value.borrowFrom.lent,
    //   this.person.owes
    // );
    this.checkIfThereIsADept();
    this.findPeopleToReturnMoneyTo();
    this.loansForm.reset();
  }

  payBackTheDeptToPerson() {
    // this.personCreditHistoryService.calculations(
    //   this.people,
    //   this.person,
    //   this.loansForm.value.returnMoneyTo,
    //   this.loansForm.value.returnMoneyToAmount,
    //   this.loansForm.value.returnMoneyTo.owes,
    //   this.person.lent
    // );
    //informacija po konkretnomu cheloveku, kotorogo ja selektnula na vozvrat - skoljko ja emu dolzhna i ego imja
    let owesDataToExactPerson = this.person.owes.amountToOnePerson.find(
      (owesData) => owesData.name === this.loansForm.value.returnMoneyTo.name
    );

    let lentDataToExactPerson =
      this.loansForm.value.returnMoneyTo.lent.amountToOnePerson.find(
        (lentData: { name: string }) => lentData.name === this.person.name
      );

    //summa kotoruju ja emu dolzhna minus summa iz inputa
    if (owesDataToExactPerson)
      if (
        this.loansForm.value.returnMoneyToAmount <=
        +owesDataToExactPerson.amount
      ) {
        //dolg = dolg - summa iz inputa
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount -
          this.loansForm.value.returnMoneyToAmount;

        //iz obschej summa dolga vichitaem summu inputa
        this.person.owes.totalAmount =
          this.person.owes.totalAmount -
          this.loansForm.value.returnMoneyToAmount;

        //remove empty entry
        this.personCreditHistoryService.removeEmptyEntry(this.person.owes);

        //cheloveku, kotoromu vernuli dolg,
        //v razdele odolzhennie ubiraem etu summu i udaljaem pustoj objekt////////////

        // let lentDataToExactPerson =
        //   this.loansForm.value.returnMoneyTo.lent.amountToOnePerson.find(
        //     (lentData: { name: string }) => lentData.name === this.person.name
        //   );
        // console.log('lent', lentDataToExactPerson);

        //odolzhennie = odolzhennie - summa iz inputa
        lentDataToExactPerson.amount =
          lentDataToExactPerson.amount -
          this.loansForm.value.returnMoneyToAmount;

        //odolzhennie(obschaja summa) = odolzhennie(objschaja summa) - summa iz inputa
        this.loansForm.value.returnMoneyTo.lent.totalAmount =
          this.loansForm.value.returnMoneyTo.lent.totalAmount -
          this.loansForm.value.returnMoneyToAmount;

        //remove empty entry
        this.personCreditHistoryService.removeEmptyEntry(
          this.loansForm.value.returnMoneyTo.lent
        );
      } else {
        //dolg stiraetsa, a raznica dobavljaetsa v odolzhennie i v dolg drugomu
        //vichisljaem raznicu (polozhiteljnoe chislo)

        const overpay =
          this.loansForm.value.returnMoneyToAmount -
          owesDataToExactPerson.amount;

        //dobavljaem raznicu v odolzhennie
        this.person.lent.totalAmount = this.person.lent.totalAmount + overpay;

        //make new entry in the list of people a person borrowed money to
        this.personCreditHistoryService.makeNewEntryInListOfAmountAndOerson(
          this.person.lent.amountToOnePerson,
          overpay,
          this.loansForm.value.returnMoneyTo.name
        );

        //umenjshaem obschij dolg na summu dolga tomu cheloveku
        this.person.owes.totalAmount =
          this.person.owes.totalAmount - owesDataToExactPerson.amount;

        // udaljaem amount kotorij on dolzhen tomu cheloveku
        owesDataToExactPerson.amount = 0;

        //esli tot chelovek nam odalzhival
        if (lentDataToExactPerson) {
          //esli summa dolga boljshe pereplati, to
          if (lentDataToExactPerson.amount > overpay) {
            lentDataToExactPerson.amount =
              lentDataToExactPerson.amount - overpay;
          } else {
            //to summi dolga ne suschestvuet bolee
            lentDataToExactPerson.amount = 0;
          }
        } //!NADO LI IF?

        //zapisivaem pereplatu v obschij dolg
        this.loansForm.value.returnMoneyTo.owes.totalAmount =
          this.loansForm.value.returnMoneyTo.owes.totalAmount + overpay;

        //generiruem object dolga
        this.loansForm.value.returnMoneyTo.owes.amountToOnePerson.push({
          amount: overpay,
          name: this.person.name,
        });
        //esli mi emu odalzhivali
        if (owesDataToExactPerson) {
          this.loansForm.value.returnMoneyTo.lent.totalAmount =
            this.loansForm.value.returnMoneyTo.lent.totalAmount - overpay;
          //esli summa odolzhennih deneg boljshe pereplati, to
          if (owesDataToExactPerson.amount > overpay) {
            owesDataToExactPerson.amount =
              owesDataToExactPerson.amount - overpay;
          } else {
            //to summi dolga ne suschestvuet bolee
            owesDataToExactPerson.amount = 0;
          }
        }
      }
    //remove empty entry
    this.personCreditHistoryService.removeEmptyEntry(
      this.loansForm.value.returnMoneyTo.lent
    );

    // //ubriraem nulevoj objekt
    // this.loansForm.value.returnMoneyTo.lent.amountToOnePerson =
    //   this.loansForm.value.returnMoneyTo.lent.amountToOnePerson.filter(
    //     (lentData: { amount: number }) => lentData.amount !== 0
    //   );

    this.loansForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
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
