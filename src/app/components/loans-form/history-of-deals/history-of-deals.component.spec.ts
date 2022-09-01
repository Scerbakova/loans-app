import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOfDealsComponent } from './history-of-deals.component';

describe('HistoryOfDealsComponent', () => {
  let component: HistoryOfDealsComponent;
  let fixture: ComponentFixture<HistoryOfDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryOfDealsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryOfDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
