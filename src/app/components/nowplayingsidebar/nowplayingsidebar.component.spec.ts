import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NowplayingsidebarComponent } from './nowplayingsidebar.component';

describe('NowplayingsidebarComponent', () => {
  let component: NowplayingsidebarComponent;
  let fixture: ComponentFixture<NowplayingsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowplayingsidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NowplayingsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
