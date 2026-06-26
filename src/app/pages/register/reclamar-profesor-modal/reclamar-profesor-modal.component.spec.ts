import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReclamarProfesorModalComponent } from './reclamar-profesor-modal.component';

describe('ReclamarProfesorModalComponent', () => {
  let component: ReclamarProfesorModalComponent;
  let fixture: ComponentFixture<ReclamarProfesorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReclamarProfesorModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReclamarProfesorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
