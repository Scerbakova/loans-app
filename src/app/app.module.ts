import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NameInputComponent } from './components/name-input/name-input.component';
import { PersonCreditHistoryService } from './person-credit-history.service';

@NgModule({
  declarations: [
    AppComponent,
    NameInputComponent,
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
