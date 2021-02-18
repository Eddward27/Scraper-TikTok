import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScrapComponent } from './new-scrap.component';

describe('NewScrapComponent', () => {
  let component: NewScrapComponent;
  let fixture: ComponentFixture<NewScrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewScrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
