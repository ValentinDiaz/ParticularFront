import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BucasProfesorPage } from './buscar-profesor.page';

describe('BucasProfesorPage', () => {
  let component: BucasProfesorPage;
  let fixture: ComponentFixture<BucasProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BucasProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
