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
    loanFormValueNumber: number,
    loanFormValueName: string,
    loanFormValueTotalAmount: number,
    loanFormValueAmountToOnePerson: AmountAndPerson[]
  ) {
    //total amount of money to owe
    person.owes.totalAmount = person.owes.totalAmount + loanFormValueNumber;

    if (
      //entry with this name already exists in the owes list of this.person
      this.checkWhetherSuchEntryExistsInAList(
        person.owes.amountToOnePerson,
        loanFormValueName
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.increaseAmountInEntry(
        person.owes.amountToOnePerson,
        loanFormValueName,
        loanFormValueNumber
      );
    } else {
      //make a new entry in the owes list
      this.makeNewEntryInListOfAmountAndOerson(
        person.owes.amountToOnePerson,
        loanFormValueNumber,
        loanFormValueName
      );
    }
    //total amount of money to lent
    loanFormValueTotalAmount = loanFormValueTotalAmount + loanFormValueNumber;

    if (
      //entry with this name already exists in the lent list of another person
      this.checkWhetherSuchEntryExistsInAList(
        loanFormValueAmountToOnePerson,
        person.name
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.increaseAmountInEntry(
        loanFormValueAmountToOnePerson,
        person.name,
        loanFormValueNumber
      );
    } else {
      //make new entry in the lent list
      this.makeNewEntryInListOfAmountAndOerson(
        loanFormValueAmountToOnePerson,
        loanFormValueNumber,
        person.name
      );
    }
  }

  lentMoneyTo(
    person: Person,
    loanFormValueNumber: number,
    loanFormValueName: string,
    loanFormValueTotalAmount: number,
    loanFormValueAmountToOnePerson: AmountAndPerson[]
  ) {
    //total amount of money to lent
    person.lent.totalAmount = person.lent.totalAmount + loanFormValueNumber;

    if (
      //entry with this name already exists in the list
      this.checkWhetherSuchEntryExistsInAList(
        person.lent.amountToOnePerson,
        loanFormValueName
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.increaseAmountInEntry(
        person.lent.amountToOnePerson,
        loanFormValueName,
        loanFormValueNumber
      );
    } else {
      //make a new entry in the list of people who the person borrowed money to
      this.makeNewEntryInListOfAmountAndOerson(
        person.lent.amountToOnePerson,
        loanFormValueNumber,
        loanFormValueName
      );
    }
    //total amount of money to owe
    loanFormValueTotalAmount = loanFormValueTotalAmount + loanFormValueNumber;

    if (
      //entry with this name already exists in the list
      this.checkWhetherSuchEntryExistsInAList(
        loanFormValueAmountToOnePerson,
        person.name
      )
    ) {
      //amount of money for this entry increases by amount of money from input field
      this.increaseAmountInEntry(
        loanFormValueAmountToOnePerson,
        person.name,
        loanFormValueNumber
      );
    } else {
      //make new entry in the list of people a person owes money from
      this.makeNewEntryInListOfAmountAndOerson(
        loanFormValueAmountToOnePerson,
        loanFormValueNumber,
        person.name
      );
    }
  }

  payBackTheDeptToPerson(
    person: Person,
    loanFormValueName: string,
    loanFormValueAmountToOnePerson: AmountAndPerson[],
    loanFormValueReturnMoneyToAmount: number,
    loanFormValueTotalAmountToLent: number,
    loansFormValueReturnMoneyToLent: Amount,
    loansFormValueReturnMoneyToName: string,
    loansFormValueOwes: Amount,
    loansFormValueOwesAmountToOnePerson: AmountAndPerson[]
  ) {
    //person's name, who was selected to return money to and initial dept amount to him
    let owesDataToExactPerson = person.owes.amountToOnePerson.find(
      (owesData: { name: string }) => owesData.name === loanFormValueName
    );

    //main person name and his/her initial dept amount to the person which was selected to return money to
    let lentDataToExactPerson = loanFormValueAmountToOnePerson.find(
      (lentData: { name: string }) => lentData.name === person.name
    );

    //calculating the sum main person owes to the selected person after paying a dept
    if (owesDataToExactPerson)
      if (
        //the amount main person returns is less or equal to the amount he/she owes
        loanFormValueReturnMoneyToAmount <= +owesDataToExactPerson.amount
      ) {
        //selected person's loan amount minus amount main person returns
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount - loanFormValueReturnMoneyToAmount;

        //total amount of all loans minus amount main person returns
        person.owes.totalAmount =
          person.owes.totalAmount - loanFormValueReturnMoneyToAmount;

        //remove empty entry
        this.removeEmptyEntry(person.owes);

        //main person dept amount to the selected person minus returned amount
        if (lentDataToExactPerson)
          lentDataToExactPerson.amount =
            lentDataToExactPerson.amount - loanFormValueReturnMoneyToAmount;

        //calculating total dept amount
        loanFormValueTotalAmountToLent =
          loanFormValueTotalAmountToLent - loanFormValueReturnMoneyToAmount;

        //remove empty entry
        this.removeEmptyEntry(loansFormValueReturnMoneyToLent);
      } else {
        //amount to return is bigger than dept amount

        //calculating overpay
        const overpay =
          loanFormValueReturnMoneyToAmount - owesDataToExactPerson.amount;

        //overpay goes to total lent amount of main person
        person.lent.totalAmount = person.lent.totalAmount + overpay;

        //make new entry in the list of people a person borrowed money to
        this.makeNewEntryInListOfAmountAndOerson(
          person.lent.amountToOnePerson,
          overpay,
          loansFormValueReturnMoneyToName
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
        loansFormValueOwes.totalAmount = loansFormValueOwes.totalAmount + overpay;

        //make a new entry in the owes list of selected person
        this.makeNewEntryInListOfAmountAndOerson(
          loansFormValueOwesAmountToOnePerson,
          overpay,
          person.name
        );

        //calculating total selected person's lent amount
        loanFormValueTotalAmountToLent <= loanFormValueReturnMoneyToAmount
          ? (loanFormValueTotalAmountToLent = 0)
          : (loanFormValueTotalAmountToLent =
              loanFormValueTotalAmountToLent - overpay);

        //remove empty entry
        this.removeEmptyEntry(loansFormValueReturnMoneyToLent);
      }
  }

  receiveDeptFromPerson(
    person: Person,
    formPersonOwes: Amount,
    formName: string,
    formOwesTotalAmount: number,
    formOwesTotalAmoutToOnePerson: AmountAndPerson[],
    formAmount: number,
    formLentTotalAmount: number,
    formLentTotalAmoutToOnePerson: AmountAndPerson[]
  ) {
    //main person name and the initial amount of money he/she lent to the selected person
    let lentDataToExactPerson = formOwesTotalAmoutToOnePerson.find(
      (lentData: { name: string }) => lentData.name === person.name
    );
    console.log('owes', lentDataToExactPerson);

    //selected person name and the amount he/she owes to the main person
    let owesDataToExactPerson = person.lent.amountToOnePerson.find(
      (owesData) => owesData.name === formName
    );
    console.log('lent', owesDataToExactPerson);

    //calculating the selected person owes to the main person after he/she pays the dept
    if (owesDataToExactPerson)
      if (
        //the amount selected person returns is less or equal to the amount he/she owes
        formAmount <= owesDataToExactPerson.amount
      ) {
        //main person's loan amount minus amount selected person returns
        owesDataToExactPerson.amount =
          owesDataToExactPerson.amount - formAmount;

        //total amount of all loans minus amount selected person returns
        person.lent.totalAmount = person.lent.totalAmount - formAmount;

        //remove empty entry
        this.removeEmptyEntry(person.lent);

        //selected person's dept amount to the main person minus returned amount
        if (lentDataToExactPerson)
          lentDataToExactPerson.amount =
            lentDataToExactPerson.amount - formAmount;

        //calculating total dept amount
        formOwesTotalAmount = formOwesTotalAmount - formAmount;

        //remove empty entry
        this.removeEmptyEntry(formPersonOwes);
      } else {
        //amount to return is bigger than dept amount

        //calculating overpay
        const overpay = formAmount - owesDataToExactPerson.amount;

        //overpay goes to total owes amount of main person
        person.owes.totalAmount = person.owes.totalAmount + overpay;

        //make new entry in the list of people a person borrowed money from
        this.makeNewEntryInListOfAmountAndOerson(
          person.owes.amountToOnePerson,
          overpay,
          formName
        );

        //calculating total lent amount
        if (person.lent.totalAmount >= formAmount) {
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
        formLentTotalAmount = formLentTotalAmount + overpay;

        //make a new entry in the lent list of selected person
        this.makeNewEntryInListOfAmountAndOerson(
          formLentTotalAmoutToOnePerson,
          overpay,
          person.name
        );

        //calculating total selected person's owes amount
        formOwesTotalAmount <= formAmount
          ? (formOwesTotalAmount = 0)
          : (formOwesTotalAmount = formOwesTotalAmount - overpay);

        //remove empty entry
        this.removeEmptyEntry(formPersonOwes);
      }
  }
}
