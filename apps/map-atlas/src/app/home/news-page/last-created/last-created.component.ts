import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { RouterFacade } from '@geonetwork-ui/feature/router'
import {
  FeatureSearchModule,
  FIELDS_BRIEF,
  ResultsListContainerComponent,
  ResultsListHdFContainerComponent,
  SearchFacade,
} from '@geonetwork-ui/feature/search'
import { CatalogRecord } from '@geonetwork-ui/common/domain/model/record'
import { getOptionalSearchConfig } from '@geonetwork-ui/util/app-config'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'map-atlas-last-created',
  templateUrl: './last-created.component.html',
  styleUrls: ['./last-created.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FeatureSearchModule, ResultsListHdFContainerComponent],
  standalone: true,
})
export class LastCreatedComponent implements OnInit {
  constructor(
    private searchFacade: SearchFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit() {
    this.searchFacade
      .setConfigRequestFields([...FIELDS_BRIEF, 'createDate'])
      .setPageSize(3)
      .setSortBy(['desc', 'createDate'])
      .setResultsLayout('FEED')
      .setConfigFilters({
        'th_otherKeywords-.default': {
            CALU: true
        } 
      })
    
  }

  onMetadataSelection(metadata: CatalogRecord): void {
    this.routerFacade.goToMetadata(metadata)
  }
}