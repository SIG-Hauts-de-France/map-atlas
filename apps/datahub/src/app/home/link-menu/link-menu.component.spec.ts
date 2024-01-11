import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LinkMenuComponent } from './link-menu.component'
import { NO_ERRORS_SCHEMA } from '@angular/core'

describe('LinkMenuComponent', () => {
  let component: LinkMenuComponent
  let fixture: ComponentFixture<LinkMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkMenuComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(LinkMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})