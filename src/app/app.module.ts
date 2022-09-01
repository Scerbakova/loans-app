import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoansComponent } from './components/loans-form/loans.component';
import { PersonCreditHistoryService } from './person-credit-history.service';
import { PersonSelectComponent } from './components/loans-form/person-select/person-select.component';
import { AmountInputComponent } from './components/loans-form/amount-input/amount-input.component';
import { LabelComponent } from './components/reusable/label/label.component';
import { ButtonComponent } from './components/reusable/button/button.component';
import { DealSelectComponent } from './components/loans-form/deal-select/deal-select.component';
import { HistoryOfDealsComponent } from './components/loans-form/history-of-deals/history-of-deals.component';
import { DealCardComponent } from './components/loans-form/history-of-deals/deal-card/deal-card.component';
import { PersonCardComponent } from './components/loans-form/person-card/person-card.component';
import { PersonDetailedCardComponent } from './components/loans-form/person-detailed-card/person-detailed-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoansComponent,
    PersonSelectComponent,
    AmountInputComponent,
    LabelComponent,
    ButtonComponent,
    DealSelectComponent,
    HistoryOfDealsComponent,
    DealCardComponent,
    PersonCardComponent,
    PersonDetailedCardComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [PersonCreditHistoryService],
  bootstrap: [AppComponent],
})
export class AppModule {}
