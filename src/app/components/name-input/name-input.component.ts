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

  nameForm: FormGroup = this.fb.group({});
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
    this.nameForm = this.fb.group({
      mainPerson: ['', Validators.required],
      borrowFrom: [''],
      LentTo: [''],
      returnMoneyTo: [''],

      borrowFromAmount: null,
      LentToAmount: null,
      returnMoneyToAmount: null,
    });
  }

  findPerson() {
    this.person = this.nameForm.value.mainPerson;
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

    //!make new object in list of people who borrowed money to the person
    this.person.owes.amountToOnePerson.push({
      amount: this.nameForm.value.borrowFromAmount,
      name: this.nameForm.value.borrowFrom.name,
    });

    //total amount of money to lent
    this.nameForm.value.borrowFrom.lent.totalAmount =
      this.nameForm.value.borrowFrom.lent.totalAmount +
      +this.nameForm.value.borrowFromAmount;

    //!make new object in the list of people a person borrowed money to
    this.nameForm.value.borrowFrom.lent.amountToOnePerson.push({
      amount: this.nameForm.value.borrowFromAmount,
      name: this.person.name,
    });

    //!esli hothat odolzhitj vtoroj raz?????????????????????????????????????????????????????

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
    this.nameForm.reset();
    localStorage.setItem('people', JSON.stringify(this.people));
  }
  lentMoneyTo() {
    //total amount of money to owe
    this.person.owes.totalAmount =
      this.person.owes.totalAmount + +this.nameForm.value.borrowFromAmount;

    //!make new object in list of people who borrowed money to the person
    this.person.owes.amountToOnePerson.push({
      amount: this.nameForm.value.borrowFromAmount,
      name: this.nameForm.value.borrowFrom.name,
    });

    //total amount of money to lent
    this.nameForm.value.borrowFrom.lent.totalAmount =
      this.nameForm.value.borrowFrom.lent.totalAmount +
      +this.nameForm.value.borrowFromAmount;

    //!make new object in the list of people a person borrowed money to
    this.nameForm.value.borrowFrom.lent.amountToOnePerson.push({
      amount: this.nameForm.value.borrowFromAmount,
      name: this.person.name,
    });

    //!esli hothat odolzhitj vtoroj raz?????????????????????????????????????????????????????

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
    this.nameForm.reset();
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

    let lentDataToExactPerson =
      this.nameForm.value.returnMoneyTo.lent.amountToOnePerson.find(
        (lentData: { name: string }) => lentData.name === this.person.name
      );

    //summa kotoruju ja emu dolzhna minus summa iz inputa
    if (owesDataToExactPerson)
      if (
        this.nameForm.value.returnMoneyToAmount <= +owesDataToExactPerson.amount
      ) {
        //dolg = dolg - summa iz inputa
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount -
          this.nameForm.value.returnMoneyToAmount;

        //iz obschej summa dolga vichitaem summu inputa
        this.person.owes.totalAmount =
          this.person.owes.totalAmount -
          this.nameForm.value.returnMoneyToAmount;

        //!ubriraem nulevoj objekt
        this.person.owes.amountToOnePerson =
          this.person.owes.amountToOnePerson.filter(
            (owesData) => owesData.amount !== 0
          );

        //cheloveku, kotoromu vernuli dolg,
        //v razdele odolzhennie ubiraem etu summu i udaljaem pustoj objekt////////////

        // let lentDataToExactPerson =
        //   this.nameForm.value.returnMoneyTo.lent.amountToOnePerson.find(
        //     (lentData: { name: string }) => lentData.name === this.person.name
        //   );
        // console.log('lent', lentDataToExactPerson);

        //odolzhennie = odolzhennie - summa iz inputa
        lentDataToExactPerson.amount =
          lentDataToExactPerson.amount -
          this.nameForm.value.returnMoneyToAmount;

        //odolzhennie(obschaja summa) = odolzhennie(objschaja summa) - summa iz inputa
        this.nameForm.value.returnMoneyTo.lent.totalAmount =
          this.nameForm.value.returnMoneyTo.lent.totalAmount -
          this.nameForm.value.returnMoneyToAmount;

        //!ubriraem nulevoj objekt
        this.nameForm.value.returnMoneyTo.lent.amountToOnePerson =
          this.nameForm.value.returnMoneyTo.lent.amountToOnePerson.filter(
            (lentData: { amount: number }) => lentData.amount !== 0
          );
      } else {
        //dolg stiraetsa, a raznica dobavljaetsa v odolzhennie i v dolg drugomu
        //vichisljaem raznicu (polozhiteljnoe chislo)

        const overpay =
          this.nameForm.value.returnMoneyToAmount -
          owesDataToExactPerson.amount;

        //dobavljaem raznicu v odolzhennie
        this.person.lent.totalAmount = this.person.lent.totalAmount + overpay;

        //!generiruem novij objekt v spiske dolzhnikov
        this.person.lent.amountToOnePerson.push({
          amount: overpay,
          name: this.nameForm.value.returnMoneyTo.name,
        });

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
        }

        //zapisivaem pereplatu v obschij dolg
        this.nameForm.value.returnMoneyTo.owes.totalAmount =
          this.nameForm.value.returnMoneyTo.owes.totalAmount + overpay;

        //generiruem object dolga
        this.nameForm.value.returnMoneyTo.owes.amountToOnePerson.push({
          amount: overpay,
          name: this.person.name,
        });
        //esli mi emu odalzhivali
        if (owesDataToExactPerson) {
          this.nameForm.value.returnMoneyTo.lent.totalAmount =
            this.nameForm.value.returnMoneyTo.lent.totalAmount - overpay;
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

    //!ubriraem nulevoj objekt
    this.nameForm.value.returnMoneyTo.lent.amountToOnePerson =
      this.nameForm.value.returnMoneyTo.lent.amountToOnePerson.filter(
        (lentData: { amount: number }) => lentData.amount !== 0
      );
    this.nameForm.reset();
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
