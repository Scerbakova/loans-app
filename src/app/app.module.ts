import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoansComponent } from './components/loans-form/loans.component';
import { PersonCreditHistoryService } from './person-credit-history.service';
import { PersonSelectComponent } from './components/person-select/person-select.component';
import { AmountInputComponent } from './components/amount-input/amount-input.component';

@NgModule({
  declarations: [AppComponent, LoansComponent, PersonSelectComponent, AmountInputComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [PersonCreditHistoryService],
  bootstrap: [AppComponent],
})
export class AppModule {}
