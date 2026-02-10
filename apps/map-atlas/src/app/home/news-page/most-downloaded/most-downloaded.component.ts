import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FIELDS_BRIEF, SearchFacade } from '@geonetwork-ui/feature/search'
import { CatalogRecord } from '@geonetwork-ui/common/domain/model/record'
import { Observable } from 'rxjs'
import { RouterFacade } from '@geonetwork-ui/feature/router'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'map-atlas-most-downloaded',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './most-downloaded.component.html',
  styleUrl: './most-downloaded.component.css',
})
export class MostDownloadedComponent implements OnInit {
  records$: Observable<CatalogRecord[]>

  constructor(
    private searchFacade: SearchFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit(): void {
    this.searchFacade
      .setConfigRequestFields([...FIELDS_BRIEF, 'creationDateForResource'])
      .setPageSize(8)
      .setSortBy(['desc', 'creationDateForResource'])
      .setResultsLayout('FEED')
      .setConfigFilters({
        'th_custom.default': {
          SPRC: true,
        },
      })
    this.records$ = this.searchFacade.results$
  }

  onMapClick(metadata: CatalogRecord): void {
    this.routerFacade.goToMetadata(metadata)
  }
}
