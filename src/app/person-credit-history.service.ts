import { FormGroup } from '@angular/forms';
import { AmountAndPerson, Person } from 'src/app/person-credit-history';

export class PersonCreditHistoryService {
  private People: Person[] = [
    new Person(
      'John',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Jack',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Mary',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Kate',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Tom',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Peter',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'David',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Joseph',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
    new Person(
      'Ann',
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] },
      { totalAmount: 0, amountToOnePerson: [] }
    ),
  ];

  getData() {
    localStorage.setItem('people', JSON.stringify(this.People));
    return this.People;
  }

  setData(person: Person, updatedPerson: Person, borrowFromAmount: number, ) {
    person = updatedPerson;

    let newLentData = {
      amount: borrowFromAmount,
      name: person.name,
    };

    let newAmountForOnePerson: AmountAndPerson[] =
    updatedPerson.lent.amountToOnePerson;

    newAmountForOnePerson.push(newLentData);

    person.lent.amountToOnePerson = newAmountForOnePerson;

    const setTotalLentAmount = (): number => {
      return person.lent.totalAmount = newAmountForOnePerson
        .map((lentnInfo) => +lentnInfo.amount)
        .reduce((acc, val) => acc + val);
    }
    return setTotalLentAmount()
  }

  // setTotalLentAmount(total: number, amountForOnePerson: AmountAndPerson[]): number {
  //   total = amountForOnePerson
  //     .map((lentnInfo) => +lentnInfo.amount)
  //     .reduce((acc, val) => acc + val);
  //   return total
  // }
}
