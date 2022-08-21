import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoansComponent } from './components/name-input/loans.component';
import { PersonCreditHistoryService } from './person-credit-history.service';

@NgModule({
  declarations: [
    AppComponent,
    LoansComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [PersonCreditHistoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
