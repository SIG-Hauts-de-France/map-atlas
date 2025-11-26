import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core'
import {
  DatasetRecord,
  Keyword,
} from '@geonetwork-ui/common/domain/model/record'
import { DateService, getTemporalRangeUnion } from '@geonetwork-ui/util/shared'
import { MarkdownParserComponent } from '../../markdown-parser/markdown-parser.component'
import {
  ExpandablePanelComponent,
  MaxLinesComponent,
} from '@geonetwork-ui/ui/layout'
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core'
import {
  BadgeHDFComponent,
  CopyTextButtonComponent,
} from '@geonetwork-ui/ui/inputs'
import { ContentGhostComponent } from '../../content-ghost/content-ghost.component'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { matOpenInNew } from '@ng-icons/material-icons/baseline'
import { matMailOutline } from '@ng-icons/material-icons/outline'
import { ThumbnailComponent } from '../../thumbnail/thumbnail.component'
import { GnUiLinkifyDirectiveHDF } from './linkify-hdf.directive'

import { CommonModule } from '@angular/common'
import { SpatialExtentComponent } from '@geonetwork-ui/ui/map'

@Component({
  selector: 'gn-ui-metadata-info-hdf',
  templateUrl: './metadata-info-hdf.component.html',
  styleUrls: ['./metadata-info-hdf.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TranslateDirective,
    TranslatePipe,
    MarkdownParserComponent,
    ExpandablePanelComponent,
    BadgeHDFComponent,
    ContentGhostComponent,
    ThumbnailComponent,
    MaxLinesComponent,
    CopyTextButtonComponent,
    NgIcon,
    GnUiLinkifyDirectiveHDF,
    SpatialExtentComponent,
  ],
  viewProviders: [
    provideIcons({
      matOpenInNew,
      matMailOutline,
    }),
  ],
})
export class MetadataInfoHDFComponent {
  @Input() metadata: Partial<DatasetRecord>
  @Input() incomplete: boolean
  @Output() keyword = new EventEmitter<Keyword>()
  updatedTimes: number
  otherKeywords: Keyword[] = [];
  placeKeywords: Keyword[] = [];
  collectionKeywords: Keyword[] = [];
  themeSIGKeywords: Keyword[] = [];

  constructor(private dateService: DateService) {}

  private filterKeywords(type:string) {
    return this.metadata.keywords?.filter(k => !this.thesaurusContains(k, 'theme') &&  k?.type === type) || [];
  }

  private thesaurusContains(keyword:Keyword, value: string) {
    return (keyword?.thesaurus?.id && keyword?.thesaurus?.id?.indexOf(value) !== -1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['metadata']) {
      console.log(this.metadata);
      this.otherKeywords = this.filterKeywords('other');
      // this.placeKeywords = this.filterKeywords('place');
      this.placeKeywords = this.metadata.keywords?.filter(k => this.thesaurusContains(k, 'emprise_geographique')) || [];
      this.collectionKeywords = this.metadata.keywords?.filter(k => this.thesaurusContains(k, 'collections')) || [];
      this.themeSIGKeywords = this.metadata.keywords?.filter(k => this.thesaurusContains(k, 'themes_sig')) || [];
    }

    // console.log("Other keywords:", this.otherKeywords);
    // console.log("Place keywords:", this.placeKeywords);
    // console.log("Collection keywords:", this.collectionKeywords);
    // console.log("Theme SIG keywords:", this.themeSIGKeywords);
    
    
    
    
  }

  get hasUsage() {
    return (
      this.metadata.extras?.isOpenData === true ||
      (this.metadata.legalConstraints?.length > 0 &&
        this.legalConstraints.length > 0) ||
      (this.metadata.otherConstraints?.length > 0 &&
        this.otherConstraints.length > 0) ||
      (this.metadata.licenses?.length > 0 && this.licenses.length > 0)
    )
  }


  get legalConstraints() {
    let array = []
    if (this.metadata.legalConstraints?.length) {
      array = array.concat(
        this.metadata.legalConstraints.filter((c) => c.text).map((c) => c.text)
      )
    }
    return array
  }

  get otherConstraints() {
    let array = []
    if (this.metadata.otherConstraints?.length) {
      array = array.concat(
        this.metadata.otherConstraints.filter((c) => c.text).map((c) => c.text)
      )
    }
    return array
  }

  get licenses(): { text: string; url: string }[] {
    let array = []
    if (this.metadata.licenses?.length) {
      array = array.concat(
        this.metadata.licenses
          .filter((c) => c.text)
          .map((c) => ({ text: c.text, url: c.url }))
      )
    }
    return array
  }

  get updateFrequency(): string {
    if (this.metadata.updateFrequency instanceof Object) {
      this.updatedTimes = this.metadata.updateFrequency.updatedTimes
      return `domain.record.updateFrequency.${this.metadata.updateFrequency.per}`
    } else if (typeof this.metadata.updateFrequency === 'string') {
      return `domain.record.updateFrequency.${this.metadata.updateFrequency}`
    } else {
      return undefined
    }
  }

  get temporalExtent(): { start: string; end: string } {
    const temporalExtents =
      this.metadata.kind === 'dataset' ? this.metadata.temporalExtents : []
    return getTemporalRangeUnion(temporalExtents, this.dateService)
  }

  get shownOrganization() {
    return this.metadata.ownerOrganization
  }

  get resourceContact() {
    return this.metadata.contactsForResource?.[0]
  }

  fieldReady(propName: string) {
    return !this.incomplete || propName in this.metadata
  }

  onKeywordClick(keyword: Keyword) {
    this.keyword.emit(keyword)
  }

  formatDate(date: Date): string {
    return this.dateService.formatDate(date)
  }

  formatDateTime(date: Date): string {
    return this.dateService.formatDateTime(date)
  }
}
