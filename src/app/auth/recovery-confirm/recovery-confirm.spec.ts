import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryConfirm } from './recovery-confirm';

describe('RecoveryConfirm', () => {
  let component: RecoveryConfirm;
  let fixture: ComponentFixture<RecoveryConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
