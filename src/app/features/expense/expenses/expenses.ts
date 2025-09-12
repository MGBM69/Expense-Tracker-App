import { Component, inject, OnInit, signal } from '@angular/core';
import { ExpenseService } from '../../../core/services/expense-service';
import { Expense } from '../../../core/models/expense.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expenses',
  imports: [ToastModule,CardModule,TableModule,DatePipe,CurrencyPipe,ButtonModule,RouterLink],
  providers: [MessageService],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses implements OnInit{
  

  private expenseService=inject(ExpenseService);
  private messageService=inject(MessageService)
  expenses=signal<Expense[]>([]);

  ngOnInit(): void {
   this.expenseService.getExpenses().subscribe({
    next:(expenses)=>{
      this.expenses.set(expenses);
    },
    error:(error)=>{
        console.log("Error fetching Expenses",error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Load to fail Expenses' });
        
    },
   })
  }

}
