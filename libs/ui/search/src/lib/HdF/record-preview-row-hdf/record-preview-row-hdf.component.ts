import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core'
import { RecordPreviewComponent } from '../../record-preview/record-preview.component'
import { InternalLinkCardHDFComponent } from '@geonetwork-ui/ui/elements'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'gn-ui-record-preview-row-hdf',
  templateUrl: './record-preview-row-hdf.component.html',
  styleUrls: ['./record-preview-row-hdf.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RecordPreviewComponent, InternalLinkCardHDFComponent],
})
export class RecordPreviewRowHDFComponent extends RecordPreviewComponent {
  size = 'L'
  constructor(protected elementRef: ElementRef) {
    super(elementRef)
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 768) this.size = 'S'
    else this.size = 'L'
  }
}
