import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditPrivateComponent } from './vehicle-edit-private.component';

describe('VehicleEditPrivateComponent', () => {
  let component: VehicleEditPrivateComponent;
  let fixture: ComponentFixture<VehicleEditPrivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleEditPrivateComponent]
    });
    fixture = TestBed.createComponent(VehicleEditPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
