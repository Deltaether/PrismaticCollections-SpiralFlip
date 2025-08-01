import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdJacketComponent } from './cd-jacket.component';

describe('CdJacketComponent', () => {
  let component: CdJacketComponent;
  let fixture: ComponentFixture<CdJacketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdJacketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdJacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
