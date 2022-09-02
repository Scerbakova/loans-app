import {
  Amount,
  AmountAndPerson,
  Deal,
  Person,
} from 'src/app/person-credit-history';

export class PersonCreditHistoryService {
  private People: Person[] = [
    new Person(
      'John',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/John.png'
    ),
    new Person(
      'Jack',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Jack.png'
    ),
    new Person(
      'Mary',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Mary.png'
    ),
    new Person(
      'Peter',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Peter.png'
    ),
    new Person(
      'Paul',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Paul.png'
    ),
    new Person(
      'Joseph',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Joseph.png'
    ),
    new Person(
      'Kate',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Kate.png'
    ),
    new Person(
      'Rachel',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Rachel.png'
    ),
    new Person(
      'Edward',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      '/assets/Edward.png'
    ),
    new Person(
      'Elizabeth',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      1000,
      [],
      'assets/Elizabeth.png'
    ),
  ];

  recordDeal(
    person: Person,
    deal: string,
    formPerson: Person,
    formNumber: number
  ): Deal {
    return new Deal(
      person.name,
      deal,
      formPerson.name,
      formNumber
    );
  }

  getData() {
    localStorage.setItem('people', JSON.stringify(this.People));
    localStorage.setItem('isChosen', JSON.stringify(false));
    return this.People;

  }

  makeNewEntryInListOfAmountAndPerson(
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
    formPersonAmount: Amount,
    formPerson: Person
  ) {
    if (formNumber <= 0) {
      alert('PLEASE, SPECIFY VALID AMOUNT')
    } else {
    //if there is not enough money give
    if (formPerson.balance < formNumber) {
      alert('NOT ENOUGH MONEY');
    } else {
      //total amount of money to owe
      person.owes.totalAmount = person.owes.totalAmount + formNumber;

      //main person balance change
      person.balance = person.balance + formNumber;

      //balance of formPerson change
      formPerson.balance = formPerson.balance - formNumber;

      //make a new entry in the owes list
      this.makeNewEntryInListOfAmountAndPerson(
        person.owes.amountToOnePerson,
        formNumber,
        formName
      );

      //make new entry in the lent list
      this.makeNewEntryInListOfAmountAndPerson(
        formPersonAmount.amountToOnePerson,
        formNumber,
        person.name
      );

      const dealTypeForMainPerson = 'borrowed money from';
      const dealTypeForFormPerson = 'lent money to';

      const mainPersonDeal = this.recordDeal(
        person,
        dealTypeForMainPerson,
        formPerson,
        formNumber
      );
      const formPersonDeal = this.recordDeal(
        formPerson,
        dealTypeForFormPerson,
        person,
        formNumber
      );

      person.deals.push(mainPersonDeal);
      formPerson.deals.push(formPersonDeal);
      }
    }
  }

  lendMoneyTo(
    person: Person,
    formNumber: number,
    formName: string,
    formPersonAmount: Amount,
    formPerson: Person
  ) {
    if (formNumber <= 0) {
      alert('PLEASE, SPECIFY VALID AMOUNT')
    } else {
      if (person.balance < formNumber) {
        alert('NOT ENOUGH MONEY');
      } else {
        //total amount of money to lent
        person.lent.totalAmount = person.lent.totalAmount + formNumber;

        //person balance change
        person.balance = person.balance - formNumber;

        //formPerson balance change
        formPerson.balance = formPerson.balance + formNumber;

        //make a new entry in the list of people who the person borrowed money to
        this.makeNewEntryInListOfAmountAndPerson(
          person.lent.amountToOnePerson,
          formNumber,
          formName
        );

        //total amount of money to owe
        formPersonAmount.totalAmount = formPersonAmount.totalAmount + formNumber;

        //make new entry in the list of people a person owes money from
        this.makeNewEntryInListOfAmountAndPerson(
          formPersonAmount.amountToOnePerson,
          formNumber,
          person.name
        );

        const dealTypeForMainPerson = 'lent money to';
        const dealTypeForFormPerson = 'borrowed money from';

        const mainPersonDeal = this.recordDeal(
          person,
          dealTypeForMainPerson,
          formPerson,
          formNumber
        );
        const formPersonDeal = this.recordDeal(
          formPerson,
          dealTypeForFormPerson,
          person,
          formNumber
        );

        person.deals.push(mainPersonDeal);
        formPerson.deals.push(formPersonDeal);
      }
    }
  }

  payBackTheDeptToPerson(
    person: Person,
    formName: string,
    formNumber: number,
    formPersonLent: Amount,
    formPersonOwes: Amount,
    formPerson: Person
  ) {
    //person's name, who was selected to return money to and initial dept amount to him
    let owesDataToExactPerson = person.owes.amountToOnePerson.find(
      (owesData: { name: string }) => owesData.name === formName
    );

    //main person name and his/her initial dept amount to the person which was selected to return money to
    let lentDataToExactPerson = formPersonLent.amountToOnePerson.find(
      (lentData: { name: string }) => lentData.name === person.name
    );

    if (formNumber <= 0) {
      alert('PLEASE, SPECIFY VALID AMOUNT')
    } else {
      if (person.balance < formNumber) {
        alert('NOT ENOUGH MONEY');
      } else {
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
              formPersonLent.totalAmount =
                formPersonLent.totalAmount - formNumber;

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
            this.makeNewEntryInListOfAmountAndPerson(
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
            this.makeNewEntryInListOfAmountAndPerson(
              formPersonOwes.amountToOnePerson,
              overpay,
              person.name
            );

            //calculating total selected person's lent amount
            formPersonLent.totalAmount <= formNumber
              ? (formPersonLent.totalAmount = 0)
              : (formPersonLent.totalAmount =
                formPersonLent.totalAmount - overpay);

            //remove empty entry
            this.removeEmptyEntry(formPersonLent);
          }
          //person balance change
          person.balance = person.balance - formNumber;

          //formPerson balance change
          formPerson.balance = formPerson.balance + formNumber;
        }

        const dealTypeForMainPerson = 'returned money to';
        const dealTypeForFormPerson = 'received money from';

        const mainPersonDeal = this.recordDeal(
          person,
          dealTypeForMainPerson,
          formPerson,
          formNumber
        );
        const formPersonDeal = this.recordDeal(
          formPerson,
          dealTypeForFormPerson,
          person,
          formNumber
        );

        person.deals.push(mainPersonDeal);
        formPerson.deals.push(formPersonDeal);
      }
    }
  }

  receiveDeptFromPerson(
    person: Person,
    formPersonOwes: Amount,
    formName: string,
    formNumber: number,
    formPersonLent: Amount,
    formPerson: Person
  ) {
    //main person name and the initial amount of money he/she lent to the selected person
    let lentDataToExactPerson = formPersonOwes.amountToOnePerson.find(
      (lentData: { name: string }) => lentData.name === person.name
    );

    //selected person name and the amount he/she owes to the main person
    let owesDataToExactPerson = person.lent.amountToOnePerson.find(
      (owesData) => owesData.name === formName
    );

    if (formNumber <= 0) {
      alert('PLEASE, SPECIFY VALID AMOUNT')
    } else {
      if (formPerson.balance < formNumber) {
        alert('NOT ENOUGH MONEY');
      } else {
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
            this.makeNewEntryInListOfAmountAndPerson(
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
            this.makeNewEntryInListOfAmountAndPerson(
              formPersonLent.amountToOnePerson,
              overpay,
              person.name
            );

            //calculating total selected person's owes amount
            formPersonOwes.totalAmount <= formNumber
              ? (formPersonOwes.totalAmount = 0)
              : (formPersonOwes.totalAmount =
                formPersonOwes.totalAmount - overpay);

            //remove empty entry
            this.removeEmptyEntry(formPersonOwes);
          }
          //person balance change
          person.balance = person.balance + formNumber;

          //formPerson balance change
          formPerson.balance = formPerson.balance - formNumber;
        }

        const dealTypeForMainPerson = 'received money from';
        const dealTypeForFormPerson = 'returned money to';

        const mainPersonDeal = this.recordDeal(
          person,
          dealTypeForMainPerson,
          formPerson,
          formNumber
        );
        const formPersonDeal = this.recordDeal(
          formPerson,
          dealTypeForFormPerson,
          person,
          formNumber
        );

        person.deals.push(mainPersonDeal);
        formPerson.deals.push(formPersonDeal);
      }
    }
  }
}
