import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNewPrivateComponent } from './vehicle-new-private.component';

describe('VehicleNewPrivateComponent', () => {
  let component: VehicleNewPrivateComponent;
  let fixture: ComponentFixture<VehicleNewPrivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleNewPrivateComponent]
    });
    fixture = TestBed.createComponent(VehicleNewPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
