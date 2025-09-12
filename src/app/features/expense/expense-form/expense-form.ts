import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ExpenseService } from '../../../core/services/expense-service';
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api';
import { Expense, ExpenseCatagory, PaymentMethod} from '../../../core/models/expense.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-expense-form',
  imports: [CardModule,ReactiveFormsModule,InputNumberModule,DatePickerModule,SelectModule,InputTextModule,ChipModule,TextareaModule,ButtonModule,RouterLink,ToastModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
  providers: [MessageService]
})
export class ExpenseForm implements OnInit{
  
  isEditMode=signal(false);
  id=signal<string|null>(null);
  expenseForm!:FormGroup;
  #formBUilder=inject(FormBuilder)
  #router=inject(ActivatedRoute);
  #expenseService=inject(ExpenseService);
  #messageService=inject(MessageService);
  #routes=inject(Router);
  categories=Object.values(ExpenseCatagory).map((category)=>({
    name:category,
    code:category,
  }));
  paymentMethods=Object.values(PaymentMethod).map((method)=>({
    name:method,
    code:method,
  }));
  tags=signal<string[]>([]);

  ngOnInit(): void {
    this.initExpenseForm();

   const id= this.#router.snapshot.paramMap.get('id');
   if(id){
    this.isEditMode.set(true);
    this.id.set(id)
    this.loadExpense(id);

   }
  }

 private initExpenseForm(){
    this.expenseForm=this.#formBUilder.group({
      amount:[null,[Validators.required,Validators.min(0)]],
      date:[new Date(),Validators.required],
      category:[null,Validators.required],
      paymentMethod:[null,Validators.required],
      description:[null,[Validators.required,Validators.minLength(3)]],
      tags:[[]],
      notes:[''],
    })
  }

  

  private loadExpense(id:string){
    this.#expenseService.getExpensesById(id).subscribe({
      next:(expense)=>{
        // ...expense
        // this.expenseForm.patchValue({
        // amount:expense.amount,
        // date:new Date(expense.date),
        // category:expense.category,
        // paymentMethod:expense.paymentMethod,
        // description:expense.description
        // })
        this.expenseForm.patchValue({
          ...expense,
          date:new Date(expense.date),
          
        })
        this.tags.update(()=>expense.tax || [])
      },
      error:(error)=>{
        console.log(error);
        this.#messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });

        
      }
    });
    


  }
  onSubmit(){
    if(this.expenseForm.valid){
      
      // if(this.isEditMode()){
      //   this.#expenseService.updateExpense(expenseData.id,expenseData);
      //   this.isEditMode.set(false);
      // }else{
      //   this.#expenseService.createExpense(expenseData);
      // }

        const expenseData:Expense={
          ...this.expenseForm.value,
          date:this.expenseForm.value.date.toISOString().split('T')[0],
        };

        const request$=this.isEditMode()?this.#expenseService.updateExpense(this.id()!,expenseData)
        :this.#expenseService.createExpense(expenseData);


        request$.subscribe({
          next:()=>{
            this.#messageService.add({
               severity: 'success', 
               summary: 'Success',
               detail: `Expense ${this.isEditMode()? 'updated':'created'} Successfully!`
               });

                this.expenseForm.reset();
              //  this.isEditMode.set(false);
              //  this.id.set(null);
              setTimeout(()=>{
                this.#routes.navigate(['/expenses']);
              },2000)
          },

          error:(error)=>{
              this.#messageService.add({ 
                severity: 'error',
                 summary: 'Error', 
                 detail: `Failed to ${this.isEditMode()?'update!':'create!' }` 
                });
          }
        })

    }else{
      this.#messageService.add({ severity: 'error', summary: 'Error', detail: 'Please All required Fields!' });

    }
  }

  addTag(tag:string){
    if(tag && !this.tags().includes(tag)){
      this.tags.update((preveTags)=>[...preveTags,tag]);
      
    }

  }
  removeTag(tag:string){
    this.tags.update((prevTags)=>prevTags.filter((t)=>t!==tag));

  }
  isInvalid(formControlName:string){
    const control=this.expenseForm.get(formControlName);
    return control?.invalid && control?.touched;
  }

}
