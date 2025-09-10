import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule,Menubar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
items!:MenuItem[];

  ngOnInit(): void {
    this.items=[
      {
        label:'Dashboard',
        icon:'pi pi-chart-line',
        routerLink:['/'],
      },
      {
        label:'Expenses',
        icon:'pi pi-sparkles',
        routerLink:['/expenses'],
      },

      {
        label:'New_Expense ',
        icon:'pi pi-plus-circle',
        routerLink:['/expenses/new'],
      },
    ];



  }
  
}
