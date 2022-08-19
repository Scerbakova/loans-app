import { Amount, AmountAndPerson, Person } from 'src/app/person-credit-history';

export class PersonCreditHistoryService {
  private People: Person[] = [
    new Person(
      'John',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      // { totalAmount: 0, amountToOnePerson: [] },
      // { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Jack',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      // { totalAmount: 0, amountToOnePerson: [] },
      // { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Mary',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      // { totalAmount: 0, amountToOnePerson: [] },
      // { totalAmount: 0, amountToOnePerson: [] }
    ),
  ];

  getData() {
    localStorage.setItem('people', JSON.stringify(this.People));
    return this.People;
  }

  findPerson(
    mainPerson: Person,
    personFromSelect: Person,
    listOfOtherPeople: Person[],
    people: Person[],
    isChosen: boolean
  ): void {
    mainPerson = personFromSelect;
    listOfOtherPeople = people.filter(
      (person) => person.name != mainPerson.name
    );
    isChosen = true;
    console.log(listOfOtherPeople);
  }

  calculations(
    allPeople: Person[],
    mainPerson: Person,
    secondaryPerson: Person,
    amount: number,
    to: Amount,
    from: Amount
  ) {
    let newLentData: AmountAndPerson = {
      amount: amount,
      name: mainPerson.name,
    };

    let newBorrowData: AmountAndPerson = {
      amount: amount,
      name: secondaryPerson.name,
    };

    let newAmountForOnePersontoLent: AmountAndPerson[] = to.amountToOnePerson;

    newAmountForOnePersontoLent.push(newLentData);

    to.amountToOnePerson = newAmountForOnePersontoLent;

    let newAmountForOnePersonToBorrow: AmountAndPerson[] =
      from.amountToOnePerson;

    newAmountForOnePersonToBorrow.push(newBorrowData);

    this.setTotalAmount(from, newAmountForOnePersonToBorrow);

    this.setTotalAmount(to, newAmountForOnePersontoLent);

    this.People = allPeople;

    localStorage.setItem('people', JSON.stringify(allPeople));


    // if (mainPerson.owes.amountToOnePerson.map((data) => data.name === newLentData.name)) {
    //   const personWhoLent = allPeople.find((person) => person.lent.amountToOnePerson.find((person) => person.name === newLentData.name))
    // console.log(personWhoLent)
    // const data = personWhoLent?.owes.amountToOnePerson.find((person) => person.name === mainPerson.name)
    // const data2 = mainPerson.owes.amountToOnePerson.find((data) => data.name === personWhoLent?.name)
    //   if (data) {
    //     if (data2)
    //       if (data.amount >= data2.amount) {
    //         data.amount = data.amount - data2.amount
    //         data.amount === 0 ? data.name = '' : data
    //       } else {
    //         data2.amount = data2.amount - data.amount
    //         data.amount === 0 ? data.name = '' : data
    //       }
    //     console.log(data, data2)
    //   }
    // }

    // console.log(secondaryPerson)
  }

  setTotalAmount(
    amount: Amount,
    newAmountForOnePerson: AmountAndPerson[]
  ): number {
    return (amount.totalAmount = newAmountForOnePerson
      .map((paymentInfo) => +paymentInfo.amount)
      .reduce((acc, val) => acc + val));
  }

}
