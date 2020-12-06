import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAdComponent } from './store-ad.component';

describe('StoreAdComponent', () => {
  let component: StoreAdComponent;
  let fixture: ComponentFixture<StoreAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
