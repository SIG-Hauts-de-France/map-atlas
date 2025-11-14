import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { RouterFacade } from '@geonetwork-ui/feature/router'
import {
  FeatureSearchModule,
  ResultsHitsHdFContainerComponent,
  ResultsListHdFContainerComponent,
  SearchFacade,
  FIELDS_BRIEF,
} from '@geonetwork-ui/feature/search'
import { CatalogRecord } from '@geonetwork-ui/common/domain/model/record'
import {
  getMetadataQualityConfig,
  getOptionalSearchConfig,
  MetadataQualityConfig,
  SearchConfig,
} from '@geonetwork-ui/util/app-config'
import { SearchFiltersComponent } from '../search-filters/search-filters.component'
import {
  DEFAULT_RESULTS_LAYOUT_CONFIG,
  RESULTS_LAYOUT_CONFIG,
} from '@geonetwork-ui/ui/search'

@Component({
  selector: 'map-atlas-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FeatureSearchModule,
    SearchFiltersComponent,
    ResultsHitsHdFContainerComponent,
    ResultsListHdFContainerComponent,
  ],
  providers: [
    { provide: RESULTS_LAYOUT_CONFIG, useValue: DEFAULT_RESULTS_LAYOUT_CONFIG },
  ],
})
export class SearchPageComponent implements OnInit {
  metadataQualityDisplay: boolean
  displayRecordKindFilter

  constructor(
    private searchRouter: RouterFacade,
    public searchFacade: SearchFacade
  ) {}

  ngOnInit() {
    this.searchFacade
      .setConfigRequestFields([...FIELDS_BRIEF, 'createDate', 'resoucreCreated', 'resourceIdentifier', 'resolutionScaleDenominator'])
      .setSortBy(['desc', 'createDate'])
      .setResultsLayout('ROW')
      

    const metadataQualityConfig: MetadataQualityConfig =
      getMetadataQualityConfig() || ({} as MetadataQualityConfig)
    this.metadataQualityDisplay = metadataQualityConfig.ENABLED

    const searchConfig: SearchConfig = getOptionalSearchConfig()
    this.displayRecordKindFilter =
      searchConfig?.RECORD_KIND_QUICK_FILTER !== false
  }

  onMetadataSelection(metadata: CatalogRecord): void {
    this.searchRouter.goToMetadata(metadata)
  }
}