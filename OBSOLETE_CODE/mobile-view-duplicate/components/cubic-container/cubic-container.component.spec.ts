import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubicContainerComponent } from './cubic-container.component';

describe('CubicContainerComponent', () => {
  let component: CubicContainerComponent;
  let fixture: ComponentFixture<CubicContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CubicContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CubicContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
