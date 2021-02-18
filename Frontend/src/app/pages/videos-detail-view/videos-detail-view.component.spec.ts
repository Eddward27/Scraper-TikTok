import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosDetailViewComponent } from './videos-detail-view.component';

describe('VideosDetailViewComponent', () => {
  let component: VideosDetailViewComponent;
  let fixture: ComponentFixture<VideosDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
