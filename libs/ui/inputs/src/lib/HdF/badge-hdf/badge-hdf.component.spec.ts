import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BadgeHDFComponent } from './badge-hdf.component'

describe('BadgeHDFComponent', () => {
  let component: BadgeHDFComponent
  let fixture: ComponentFixture<BadgeHDFComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeHDFComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeHDFComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
