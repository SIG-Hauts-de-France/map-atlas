import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core'
import {
  DEFAULT_RESULTS_HDF_LAYOUT_CONFIG,
  ResultsHdFLayoutConfigItem,
} from './results-hdf-layout.config'
import { CatalogRecord } from '@geonetwork-ui/common/domain/model/record'
import { ResultsListItemComponent } from '../../results-list-item/results-list-item.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'gn-ui-results-list-hdf',
  templateUrl: './results-list-hdf.component.html',
  styleUrls: ['./results-list-hdf.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ResultsListItemComponent],
})
export class ResultsListHdFComponent {
  @Input() records: CatalogRecord[]
  @Input() layoutConfig: ResultsHdFLayoutConfigItem =
  DEFAULT_RESULTS_HDF_LAYOUT_CONFIG['CARD']
  @Input() favoriteTemplate: TemplateRef<{ $implicit: CatalogRecord }>
  @Input() recordUrlGetter: (record: CatalogRecord) => string
  @Input() metadataQualityDisplay: boolean
  @Output() mdSelect = new EventEmitter<CatalogRecord>()
}
