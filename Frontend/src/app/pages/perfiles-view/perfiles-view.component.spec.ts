import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesViewComponent } from './perfiles-view.component';

describe('PerfilesViewComponent', () => {
  let component: PerfilesViewComponent;
  let fixture: ComponentFixture<PerfilesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
