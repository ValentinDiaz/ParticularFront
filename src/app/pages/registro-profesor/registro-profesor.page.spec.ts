import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroProfesorPage } from './registro-profesor.page';

describe('RegistroProfesorPage', () => {
  let component: RegistroProfesorPage;
  let fixture: ComponentFixture<RegistroProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
