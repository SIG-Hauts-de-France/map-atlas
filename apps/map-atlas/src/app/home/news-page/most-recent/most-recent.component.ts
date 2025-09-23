import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FIELDS_BRIEF, SearchFacade } from '@geonetwork-ui/feature/search'
import { CatalogRecord } from '@geonetwork-ui/common/domain/model/record'
import { Observable } from 'rxjs';
import { RouterFacade } from '@geonetwork-ui/feature/router';

@Component({
  selector: 'map-atlas-most-recent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-recent.component.html',
  styleUrl: './most-recent.component.css',
})
export class MostRecentComponent implements OnInit {
  records$: Observable<CatalogRecord[]>
  constructor(
    private searchFacade: SearchFacade,
    private routerFacade: RouterFacade
  ) {}
  ngOnInit(): void {
    this.searchFacade
      .setConfigRequestFields([...FIELDS_BRIEF, 'dateStamp'])
      .setPageSize(8)
      .setSortBy(['desc', 'dateStamp'])
      .setResultsLayout('FEED')

    this.records$ = this.searchFacade.results$; 

  }

  onMapClick(metadata: CatalogRecord): void {
    this.routerFacade.goToMetadata(metadata)
  }
  
}


