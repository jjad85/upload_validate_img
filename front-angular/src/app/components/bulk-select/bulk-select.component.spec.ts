import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkSelectComponent } from './bulk-select.component';

describe('BulkSelectComponent', () => {
  let component: BulkSelectComponent;
  let fixture: ComponentFixture<BulkSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkSelectComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
