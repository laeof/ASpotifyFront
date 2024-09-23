import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemodifyComponent } from './profilemodify.component';

describe('ProfilemodifyComponent', () => {
  let component: ProfilemodifyComponent;
  let fixture: ComponentFixture<ProfilemodifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilemodifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilemodifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
