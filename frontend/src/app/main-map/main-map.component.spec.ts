import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMapComponent } from './main-map.component';

describe('MainMapComponent', () => {
  let component: MainMapComponent;
  let fixture: ComponentFixture<MainMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainMapComponent]
    });
    fixture = TestBed.createComponent(MainMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
