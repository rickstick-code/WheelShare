import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesListPrivateComponent } from './vehicles-list-private.component';

describe('VehiclesListPrivateComponent', () => {
  let component: VehiclesListPrivateComponent;
  let fixture: ComponentFixture<VehiclesListPrivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiclesListPrivateComponent]
    });
    fixture = TestBed.createComponent(VehiclesListPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
