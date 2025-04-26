import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscOneComponent } from './disc-one.component';

describe('DiscOneComponent', () => {
  let component: DiscOneComponent;
  let fixture: ComponentFixture<DiscOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
