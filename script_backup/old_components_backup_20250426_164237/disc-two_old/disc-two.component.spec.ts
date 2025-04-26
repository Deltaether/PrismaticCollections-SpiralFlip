import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscTwoComponent } from './disc-two.component';

describe('DiscTwoComponent', () => {
  let component: DiscTwoComponent;
  let fixture: ComponentFixture<DiscTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
