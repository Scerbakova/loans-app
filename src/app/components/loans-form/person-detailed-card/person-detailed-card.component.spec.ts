import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailedCardComponent } from './person-detailed-card.component';

describe('PersonDetailedCardComponent', () => {
  let component: PersonDetailedCardComponent;
  let fixture: ComponentFixture<PersonDetailedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonDetailedCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonDetailedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
