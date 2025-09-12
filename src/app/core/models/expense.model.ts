  export interface Expense{
    id?:string;
    amount:number;
    description:string;
    category:ExpenseCatagory;
    date:string;
    paymentMethod:PaymentMethod;
    tax?:string[];
    notes?:string;
  }

  export enum ExpenseCatagory{
    FOOD='Food',
    TRANSPORT='Transport',
    UTILITIES='Utilities',
    ENTERTAINMENT='Entertainment',
    SHOPPING='Shopping',
    HEALTH='Health',
    OTHER='Other'

  }

  export enum PaymentMethod{
    CASH='Cash',
    CREDIT_CARD='Credit Card',
    DEBIT_CARD='Debit card',
    BANK_TRANSFER='Bank Transfer',
    PAYPAL='PayPal',
    OTHER='Other',
  }
