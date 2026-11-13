import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPromociones } from './admin-promociones';

describe('AdminPromociones', () => {
  let component: AdminPromociones;
  let fixture: ComponentFixture<AdminPromociones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPromociones],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPromociones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
