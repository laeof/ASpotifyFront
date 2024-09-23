import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsettingsComponent } from './artistsettings.component';

describe('ArtistsettingsComponent', () => {
  let component: ArtistsettingsComponent;
  let fixture: ComponentFixture<ArtistsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
