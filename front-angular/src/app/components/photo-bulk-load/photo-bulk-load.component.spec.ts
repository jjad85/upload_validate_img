import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoBulkLoadComponent } from './photo-bulk-load.component';

describe('PhotoBulkLoadComponent', () => {
  let component: PhotoBulkLoadComponent;
  let fixture: ComponentFixture<PhotoBulkLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoBulkLoadComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoBulkLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
