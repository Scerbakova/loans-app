export class Person {
  constructor(
    public name: string,
    public owes: Amount,
    public lent: Amount,
    public balance: number,
    public deals: Deal[]
  ) {}
}

export class Amount {
  constructor(
    public totalAmount: number,
    public amountToOnePerson: AmountAndPerson[]
  ) {}
}

export class AmountAndPerson {
  constructor(public amount: number, public name: string) {}
}

export class Deal {
  constructor(
    public date: string,
    public time: string,
    public mainPerson: string,
    public type: string,
    public formPerson: string,
    public amount: number
  ) {}
}
