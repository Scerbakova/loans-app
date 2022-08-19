import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output()
  findPersonEvent = new EventEmitter();

  nameForm: FormGroup = this.fb.group({});
  people!: Person[];
  peopleToSelect!: Person[];
  person!: Person;
  isChosen = false;

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
      borrowTo: [''],
      borrowFromAmount: 0,
      borrowToAmount: 0,
    });
  }

  findPerson() {
    this.person = this.nameForm.value.mainPerson;
    this.peopleToSelect = this.people.filter(human => human.name != this.person.name)
    this.isChosen = true;
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
    this.personCreditHistoryService.calculations(
      this.people,
      this.person,
      this.nameForm.value.borrowFrom,
      this.nameForm.value.borrowFromAmount,
      this.nameForm.value.borrowFrom.lent,
      this.person.owes
    );

    localStorage.setItem('people', JSON.stringify(this.people));
  }

  payBackTheDeptToPerson() {
    this.personCreditHistoryService.calculations(
      this.people,
      this.person,
      this.nameForm.value.borrowTo,
      this.nameForm.value.borrowToAmount,
      this.nameForm.value.borrowTo.owes,
      this.person.paysDept
    );

    localStorage.setItem('people', JSON.stringify(this.people));
  }
}
