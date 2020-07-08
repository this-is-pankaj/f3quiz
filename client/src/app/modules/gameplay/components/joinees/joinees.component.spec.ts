import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoineesComponent } from './joinees.component';

describe('JoineesComponent', () => {
  let component: JoineesComponent;
  let fixture: ComponentFixture<JoineesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoineesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoineesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
