import { Component, EventEmitter, Input, Output } from '@angular/core'
import * as basicLightbox from 'basiclightbox'
import { ContentGhostComponent } from '../../content-ghost/content-ghost.component'
import { ThumbnailHDFComponent } from '../thumbnail-hdf/thumbnail-hdf.component'
import { ButtonComponent } from '@geonetwork-ui/ui/inputs'
import { NgIcon, provideIcons, provideNgIconsConfig } from '@ng-icons/core'
import { matZoomOutMap } from '@ng-icons/material-icons/baseline'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'gn-ui-image-overlay-preview-hdf',
  templateUrl: './image-overlay-preview-hdf.component.html',
  styleUrls: ['./image-overlay-preview-hdf.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ContentGhostComponent,
    ThumbnailHDFComponent,
    ButtonComponent,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({ matZoomOutMap }),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
})
export class ImageOverlayPreviewHDFComponent {
  @Input() imageUrl: string
  @Output() isPlaceholderShown = new EventEmitter<boolean>()
  openLightbox(src: string) {
    basicLightbox.create(`<img src="${src}"/>`).show()
  }
}
