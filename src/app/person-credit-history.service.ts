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

}
