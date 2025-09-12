import { Component, inject, OnInit, signal } from '@angular/core';
import { ExpenseService } from '../../../core/services/expense-service';
import { Expense } from '../../../core/models/expense.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';


@Component({
  selector: 'app-expenses',
  imports: [ToastModule,CardModule,TableModule,DatePipe,CurrencyPipe,ButtonModule,RouterLink,ConfirmPopupModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses implements OnInit{
  

  private expenseService=inject(ExpenseService);
  private messageService=inject(MessageService)
  private confirmationService=inject(ConfirmationService);
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

  onDelete(id:string,event:Event){
      this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
                  this.expenseService.deleteExpense(id).subscribe({
                  next:()=>{
                    this.expenses.set(this.expenses().filter((expense)=>expense.id!==id));
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted Successfully!' });
                  },

                  error:(error)=>{
                    console.log("Error Deleting Expenses",error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong for Deleting!' })
                    

                  },

                });
            },
            reject: () => {
                
            }
        });

  }

}
