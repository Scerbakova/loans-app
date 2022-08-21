import { Amount, AmountAndPerson, Person } from 'src/app/person-credit-history';

export class PersonCreditHistoryService {
  private People: Person[] = [
    new Person(
      'John',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Jack',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Mary',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Peter',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Paul',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Joseph',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Kate',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Rachel',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Edward',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Elizabeth',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
  ];

  getData() {
    localStorage.setItem('people', JSON.stringify(this.People));
    return this.People;
  }

  makeNewEntryInListOfAmountAndOerson(
    list: AmountAndPerson[],
    amount: number,
    name: string
  ) {
    list.push({
      amount: amount,
      name: name,
    });
  }

  removeEmptyEntry(amount: Amount) {
    amount.amountToOnePerson = amount.amountToOnePerson.filter(
      (owesData) => owesData.amount !== 0
    );
  }

  checkWhetherSuchEntryExistsInAList(
    list: AmountAndPerson[],
    name: string
  ): boolean {
    return list.some((data) => data.name === name);
  }

  increaseAmountInEntry(list: AmountAndPerson[], name: string, amount: number) {
    list.map((data) =>
      data.name === name ? (data.amount = data.amount + amount) : null
    );
  }

  decreaseAmountInEntry(list: AmountAndPerson[], name: string, amount: number) {
    list.map((data) =>
      data.name === name ? (data.amount = data.amount - amount) : null
    );
  }

  findNamesFromOwesOrLentList(list: AmountAndPerson[]): string[] {
    return list.map((data) => data.name);
  }

  borrowFromPerson(
    person: Person,
    formNumber: number,
    formName: string,
    formPerson: Amount
  ) {
    //total amount of money to owe
    person.owes.totalAmount = person.owes.totalAmount + formNumber;

    //make a new entry in the owes list
    this.makeNewEntryInListOfAmountAndOerson(
      person.owes.amountToOnePerson,
      formNumber,
      formName
    );
    // }
    //total amount of money to lent
    formPerson.totalAmount = formPerson.totalAmount + formNumber;

    //make new entry in the lent list
    this.makeNewEntryInListOfAmountAndOerson(
      formPerson.amountToOnePerson,
      formNumber,
      person.name
    );
  }

  lentMoneyTo(
    person: Person,
    formNumber: number,
    formName: string,
    formPerson: Amount
  ) {
    //total amount of money to lent
    person.lent.totalAmount = person.lent.totalAmount + formNumber;

    //make a new entry in the list of people who the person borrowed money to
    this.makeNewEntryInListOfAmountAndOerson(
      person.lent.amountToOnePerson,
      formNumber,
      formName
    );

    //total amount of money to owe
    formPerson.totalAmount = formPerson.totalAmount + formNumber;

    //make new entry in the list of people a person owes money from
    this.makeNewEntryInListOfAmountAndOerson(
      formPerson.amountToOnePerson,
      formNumber,
      person.name
    );
  }

  payBackTheDeptToPerson(
    person: Person,
    formName: string,
    formNumber: number,
    formPersonLent: Amount,
    formPersonOwes: Amount
  ) {
    //person's name, who was selected to return money to and initial dept amount to him
    let owesDataToExactPerson = person.owes.amountToOnePerson.find(
      (owesData: { name: string }) => owesData.name === formName
    );

    //main person name and his/her initial dept amount to the person which was selected to return money to
    let lentDataToExactPerson = formPersonLent.amountToOnePerson.find(
      (lentData: { name: string }) => lentData.name === person.name
    );

    //calculating the sum main person owes to the selected person after paying a dept
    if (owesDataToExactPerson) {
      if (
        //the amount main person returns is less or equal to the amount he/she owes
        formNumber <= owesDataToExactPerson.amount
      ) {
        //selected person's loan amount minus amount main person returns
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount - formNumber;

        //total amount of all loans minus amount main person returns
        person.owes.totalAmount = person.owes.totalAmount - formNumber;

        //remove empty entry
        this.removeEmptyEntry(person.owes);

        //selected person dept amount to the main person minus returned amount
        if (lentDataToExactPerson) {
          lentDataToExactPerson.amount =
            lentDataToExactPerson.amount - formNumber;

          //calculating total dept amount
          formPersonLent.totalAmount = formPersonLent.totalAmount - formNumber;

          //remove empty entry
          this.removeEmptyEntry(formPersonLent);
        }
      } else {
        //amount to return is bigger than dept amount

        //calculating overpay
        const overpay = formNumber - owesDataToExactPerson.amount;

        //overpay goes to total lent amount of main person
        person.lent.totalAmount = person.lent.totalAmount + overpay;

        //make new entry in the list of people a person borrowed money to
        this.makeNewEntryInListOfAmountAndOerson(
          person.lent.amountToOnePerson,
          overpay,
          formName
        );

        //calculating total owes amount
        person.owes.totalAmount =
          person.owes.totalAmount - owesDataToExactPerson.amount;

        //dept to the selected person is removed
        owesDataToExactPerson.amount = 0;

        if (lentDataToExactPerson) lentDataToExactPerson.amount = 0;
        //remove empty entry
        this.removeEmptyEntry(person.owes);

        //overpay goes to total owes amount of selected person
        formPersonOwes.totalAmount = formPersonOwes.totalAmount + overpay;

        //make a new entry in the owes list of selected person
        this.makeNewEntryInListOfAmountAndOerson(
          formPersonOwes.amountToOnePerson,
          overpay,
          person.name
        );

        //calculating total selected person's lent amount
        formPersonLent.totalAmount <= formNumber
          ? (formPersonLent.totalAmount = 0)
          : (formPersonLent.totalAmount = formPersonLent.totalAmount - overpay);

        //remove empty entry
        this.removeEmptyEntry(formPersonLent);
      }
    }
  }

  receiveDeptFromPerson(
    person: Person,
    formPersonOwes: Amount,
    formName: string,
    formNumber: number,
    formPersonLent: Amount
  ) {
    //main person name and the initial amount of money he/she lent to the selected person
    let lentDataToExactPerson = formPersonOwes.amountToOnePerson.find(
      (lentData: { name: string }) => lentData.name === person.name
    );

    //selected person name and the amount he/she owes to the main person
    let owesDataToExactPerson = person.lent.amountToOnePerson.find(
      (owesData) => owesData.name === formName
    );

    //calculating the selected person owes to the main person after he/she pays the dept
    if (owesDataToExactPerson) {
      if (
        //the amount selected person returns is less or equal to the amount he/she owes
        formNumber <= owesDataToExactPerson.amount
      ) {
        //main person's loan amount minus amount selected person returns
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount - formNumber;

        //total amount of all loans minus amount selected person returns
        person.lent.totalAmount = person.lent.totalAmount - formNumber;

        //remove empty entry
        this.removeEmptyEntry(person.lent);

        //selected person's dept amount to the main person minus returned amount
        if (lentDataToExactPerson)
          lentDataToExactPerson.amount =
            lentDataToExactPerson.amount - formNumber;

        //calculating total dept amount
        formPersonOwes.totalAmount = formPersonOwes.totalAmount - formNumber;

        //remove empty entry
        this.removeEmptyEntry(formPersonOwes);
      } else {
        //amount to return is bigger than dept amount

        //calculating overpay
        const overpay = formNumber - owesDataToExactPerson.amount;

        //overpay goes to total owes amount of main person
        person.owes.totalAmount = person.owes.totalAmount + overpay;

        //make new entry in the list of people a person borrowed money from
        this.makeNewEntryInListOfAmountAndOerson(
          person.owes.amountToOnePerson,
          overpay,
          formName
        );

        //calculating total lent amount
        if (person.lent.totalAmount >= formNumber) {
          person.lent.totalAmount =
            person.lent.totalAmount - owesDataToExactPerson.amount;
        } else {
          person.lent.totalAmount = 0;
        }

        //loan to the selected person is removed
        owesDataToExactPerson.amount = 0;

        //dept disappears
        if (lentDataToExactPerson) lentDataToExactPerson.amount = 0;
        //remove empty entry
        this.removeEmptyEntry(person.lent);

        //overpay goes to total lent amount of selected person
        formPersonLent.totalAmount = formPersonLent.totalAmount + overpay;

        //make a new entry in the lent list of selected person
        this.makeNewEntryInListOfAmountAndOerson(
          formPersonLent.amountToOnePerson,
          overpay,
          person.name
        );

        //calculating total selected person's owes amount
        formPersonOwes.totalAmount <= formNumber
          ? (formPersonOwes.totalAmount = 0)
          : (formPersonOwes.totalAmount = formPersonOwes.totalAmount - overpay);

        //remove empty entry
        this.removeEmptyEntry(formPersonOwes);
      }
    }
  }
}
