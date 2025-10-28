import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImageOverlayPreviewHDFComponent } from './image-overlay-preview-hdf.component'

describe('ImageOverlayPreviewComponent', () => {
  let component: ImageOverlayPreviewHDFComponent
  let fixture: ComponentFixture<ImageOverlayPreviewHDFComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImageOverlayPreviewHDFComponent],
    })
    fixture = TestBed.createComponent(ImageOverlayPreviewHDFComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
