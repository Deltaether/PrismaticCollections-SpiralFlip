import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhantasiaProjectComponent } from './phantasia-project.component';

describe('PhantasiaProjectComponent', () => {
  let component: PhantasiaProjectComponent;
  let fixture: ComponentFixture<PhantasiaProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhantasiaProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhantasiaProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
