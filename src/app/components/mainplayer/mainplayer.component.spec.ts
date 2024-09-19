import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainplayerComponent } from './mainplayer.component';

describe('MainplayerComponent', () => {
  let component: MainplayerComponent;
  let fixture: ComponentFixture<MainplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
