import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ActivatedRoute, Router } from '@angular/router'
import { marker } from '@biesbjerg/ngx-translate-extract-marker'
import { PublicationVersionError } from '@geonetwork-ui/common/domain/model/error'
import {
  EditorFacade,
  MetadataQualityPanelComponent,
  MultilingualPanelComponent,
  RecordFormComponent,
} from '@geonetwork-ui/feature/editor'
import {
  NotificationsContainerComponent,
  NotificationsService,
} from '@geonetwork-ui/feature/notifications'
import { ButtonComponent } from '@geonetwork-ui/ui/inputs'
import {
  TranslateDirective,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core'
import { combineLatest, filter, firstValueFrom, Subscription, take } from 'rxjs'
import { map, skip } from 'rxjs/operators'
import { SidebarComponent } from '../dashboard/sidebar/sidebar.component'
import { PageSelectorComponent } from './components/page-selector/page-selector.component'
import { TopToolbarComponent } from './components/top-toolbar/top-toolbar.component'
import { SpinningLoaderComponent } from '@geonetwork-ui/ui/widgets'
import { SearchHeaderComponent } from '../dashboard/search-header/search-header.component'
import { PageErrorComponent } from './components/page-error/page-error.component'
import { DateService } from '@geonetwork-ui/util/shared'
import { RedmineService } from '../redmine.service'
import { FormsModule } from '@angular/forms'
import {
  CatalogRecord,
  Keyword,
} from '@geonetwork-ui/common/domain/model/record'

marker('editor.record.form.bottomButtons.comeBackLater')
marker('editor.record.form.bottomButtons.previous')
marker('editor.record.form.bottomButtons.next')

@Component({
  selector: 'md-editor-edit',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css'],
  standalone: true,
  imports: [
    RecordFormComponent,
    CommonModule,
    ButtonComponent,
    MatProgressSpinnerModule,
    TopToolbarComponent,
    NotificationsContainerComponent,
    PageSelectorComponent,
    TranslateDirective,
    TranslatePipe,
    SidebarComponent,
    SpinningLoaderComponent,
    SearchHeaderComponent,
    PageErrorComponent,
    MultilingualPanelComponent,
    MetadataQualityPanelComponent,
    FormsModule,
  ],
})
export class EditPageComponent implements OnInit, OnDestroy {
  subscription = new Subscription()

  currentPage$ = this.facade.currentPage$
  pagesLength$ = this.facade.editorConfig$.pipe(
    map((config) => config.pages.length)
  )
  isLastPage$ = combineLatest([this.currentPage$, this.pagesLength$]).pipe(
    map(([currentPage, pagesCount]) => currentPage >= pagesCount - 1)
  )
  hasRecordChanged$ = this.facade.hasRecordChanged$.pipe(skip(1))

  newRecord = false
  isLoading = true
  sidePanelOpen: 'multilingual' | 'metadataQuality' | null = null
  cardNumber = ''

  @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>

  constructor(
    private route: ActivatedRoute,
    protected facade: EditorFacade,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private router: Router,
    private dateService: DateService,
    private redmineService: RedmineService
  ) {}

  ngOnInit(): void {
    const [currentRecord, currentRecordSource] =
      this.route.snapshot.data['record']

    // Déplacer les mots-clés de type de carte, emprise et collection du tableau keywords vers leurs champs dédiés lors de l'init
    let recordToOpen = { ...currentRecord }
    if (Array.isArray(recordToOpen.keywords)) {
      const keywordsTypeCarte = recordToOpen.keywords.filter(
        (kw: any) =>
          kw.thesaurus &&
          kw.thesaurus.id === 'geonetwork.thesaurus.local.theme.type_de_carte'
      )
      const keywordsEmprise = recordToOpen.keywords.filter(
        (kw: any) =>
          kw.thesaurus &&
          kw.thesaurus.id ===
            'geonetwork.thesaurus.local.theme.emprise_geographique'
      )
      const keywordsCollection = recordToOpen.keywords.filter(
        (kw: any) =>
          kw.thesaurus &&
          kw.thesaurus.id === 'geonetwork.thesaurus.local.theme.collections'
      )
      const keywordsRegionHDF = recordToOpen.keywords.filter(
        (kw: any) =>
          kw.thesaurus &&
          kw.thesaurus.id === 'geonetwork.thesaurus.local.theme.themes_sig'
      )
      const keywordsSansTypeCarteEmpriseCollection =
        recordToOpen.keywords.filter(
          (kw: any) =>
            !kw.thesaurus ||
            (kw.thesaurus.id !==
              'geonetwork.thesaurus.local.theme.type_de_carte' &&
              kw.thesaurus.id !==
                'geonetwork.thesaurus.local.theme.emprise_geographique' &&
              kw.thesaurus.id !==
                'geonetwork.thesaurus.local.theme.collections' &&
              kw.thesaurus.id !== 'geonetwork.thesaurus.local.theme.themes_sig')
        )
      // console.log('recordToOpen.keywords:', recordToOpen.keywords)
      recordToOpen = {
        ...recordToOpen,
        keywords: keywordsSansTypeCarteEmpriseCollection,
        keywordsTypeCarte: keywordsTypeCarte,
        keywordsEmprise: keywordsEmprise,
        keywordsCollection: keywordsCollection,
        keywordsTheme: keywordsRegionHDF,
      }
    }

    // console.log('EditPageComponent initialized with record:', recordToOpen)
    this.facade.openRecord(recordToOpen, currentRecordSource)

    this.subscription.add(
      this.facade.record$.pipe(take(1)).subscribe((record) => {
        if (!record.uniqueIdentifier) {
          this.newRecord = true
          this.facade.saveRecord()
        } else {
          this.isLoading = false
        }
      })
    )

    this.subscription.add(
      this.facade.saveError$.subscribe((error) => {
        if (error instanceof PublicationVersionError) {
          this.notificationsService.showNotification(
            {
              type: 'error',
              title: this.translateService.instant(
                'editor.record.publishVersionError.title'
              ),
              text: this.translateService.instant(
                'editor.record.publishVersionError.body',
                { currentVersion: error.detectedApiVersion }
              ),
              closeMessage: this.translateService.instant(
                'editor.record.publishVersionError.closeMessage'
              ),
            },
            undefined,
            error
          )
        } else {
          this.notificationsService.showNotification(
            {
              type: 'error',
              title: this.translateService.instant(
                'editor.record.publishError.title'
              ),
              text: `${this.translateService.instant(
                'editor.record.publishError.body'
              )} ${error.message}`,
              closeMessage: this.translateService.instant(
                'editor.record.publishError.closeMessage'
              ),
            },
            undefined,
            error
          )
        }
      })
    )

    this.subscription.add(
      this.facade.saveSuccess$.subscribe(() => {
        if (!this.newRecord) {
          this.notificationsService.showNotification(
            {
              type: 'success',
              title: this.translateService.instant(
                'editor.record.publishSuccess.title'
              ),
              text: `${this.translateService.instant(
                'editor.record.publishSuccess.body'
              )}`,
            },
            2500
          )
        }
      })
    )

    this.subscription.add(
      this.facade.record$.subscribe((record) => {
        this.facade.checkHasRecordChanged(record)
      })
    )

    // if we're on the /duplicate route, go to /edit/{uuid} to update the uuid
    if (this.route.snapshot.routeConfig?.path.includes('duplicate')) {
      this.router.navigate(['edit', currentRecord.uniqueIdentifier], {
        replaceUrl: true,
      })
    }

    // if the record unique identifier changes, navigate to /edit/newUuid
    this.subscription.add(
      this.facade.record$
        .pipe(
          filter(
            (record) =>
              record?.uniqueIdentifier !== currentRecord.uniqueIdentifier
          ),
          take(1)
        )
        .subscribe((savedRecord) => {
          this.router.navigate(['edit', savedRecord.uniqueIdentifier], {
            replaceUrl: true,
          })
        })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  async previousPageButtonHandler() {
    const currentPage = await firstValueFrom(this.currentPage$)
    if (currentPage === 0) {
      this.router.navigate(['catalog', 'search'])
    } else {
      this.facade.setCurrentPage(currentPage - 1)
      this.scrollToTop()
    }
  }

  async nextPageButtonHandler() {
    const currentPage = await firstValueFrom(this.currentPage$)
    const pagesCount = await firstValueFrom(this.pagesLength$)
    if (currentPage < pagesCount - 1) {
      this.facade.setCurrentPage(currentPage + 1)
      this.scrollToTop()
    }
  }

  private scrollToTop() {
    this.scrollContainer.nativeElement.scroll({
      behavior: 'instant',
      top: 0,
    })
  }

  formatDate(date: Date): string {
    return this.dateService.formatDate(date, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  fetchRedmineData() {
    // console.log('Fetching Redmine data for card number:', this.cardNumber);

    if (!this.cardNumber) return

    this.redmineService
      .getIssueByCardNumber(this.cardNumber)
      .subscribe((data: any) => {
        // console.log('Redmine data received:', data);

        if (data.issues && data.issues.length > 0) {
          const issue = data.issues[0]
          const keywordsField = issue.custom_fields.find(
            (cf) => cf.name === 'Mots clés'
          )?.value
          const themeHdfField = issue.custom_fields.find(
            (cf) => cf.name === 'Thématique HdF'
          )?.value
          const collectionField =
            issue.custom_fields
              .find((cf) => cf.name === 'Collection')
              ?.value?.trim() === '-'
              ? null
              : issue.custom_fields.find((cf) => cf.name === 'Collection')
                  ?.value
          const alimentationField = issue.custom_fields.find(
            (cf) => cf.name === 'Alimentation Cartothèque'
          )?.value
          const echelleField = issue.custom_fields.find(
            (cf) => cf.name === 'Echelle'
          )?.value
          let empriseField = issue.custom_fields.find(
            (cf) => cf.name === 'Emprise données fournies'
          )?.value
          empriseField = empriseField == 'Régional' ? 'Région' : empriseField
          empriseField =
            empriseField == 'Départemental' ? 'Département' : empriseField
          empriseField =
            empriseField == 'Infra-Départemental'
              ? 'Infra-départemental'
              : empriseField
          empriseField =
            empriseField == 'Supra-Régional' ? 'France' : empriseField

          const keywords: Keyword[] = [
            ...keywordsField
              .split(',')
              .map((kw: string) => kw.trim())
              .filter((kw: string) => kw.length > 0)
              .map(
                (kw: string): Keyword => ({
                  thesaurus: { id: 'Mots-clés' },
                  type: 'other',
                  label: kw,
                })
              ),
          ]

          const keywordTheme: Keyword[] = [
            {
              thesaurus: {
                name: 'Thématiques région',
                id: 'geonetwork.thesaurus.local.theme.themes_sig',
                url: new URL(
                  'https://opendata.hautsdefrance.fr/geonetwork/srv/api/registries/vocabularies/external.theme.thematiques_region_hdf'
                ),
              },
              type: 'theme',
              label: themeHdfField,
              translations: {},
            },
          ]

          const collectionKeywords: Keyword[] = collectionField
            ? [
                {
                  thesaurus: {
                    name: 'Collections',
                    id: 'geonetwork.thesaurus.external.theme.collections',
                    url: new URL(
                      'https://opendata.hautsdefrance.fr/geonetwork/srv/api/registries/vocabularies/local.theme.collections'
                    ),
                  },
                  type: 'theme',
                  label: collectionField,
                  translations: {},
                },
              ]
            : []

          const typeCarteKeyword: Keyword[] = [
            {
              thesaurus: {
                name: 'Type de carte',
                id: 'geonetwork.thesaurus.external.theme.type_de_carte',
                url: new URL(
                  'https://opendata.hautsdefrance.fr/geonetwork/srv/api/registries/vocabularies/local.theme.type_de_carte'
                ),
              },
              type: 'theme',
              label: 'Statique',
              translations: {},
            },
          ]

          const empriseKeyword: Keyword[] = [
            {
              thesaurus: {
                name: 'Emprise géographique',
                id: 'geonetwork.thesaurus.external.theme.emprise_geographique',
                url: new URL(
                  'https://opendata.hautsdefrance.fr/geonetwork/srv/api/registries/vocabularies/local.theme.emprise_geographique'
                ),
              },
              type: 'theme',
              label: empriseField,
              translations: {},
            },
          ]

          const echelle = echelleField
            ? parseInt(
                (echelleField.match(/1\s*:\s*([\d\s]+)/)?.[1] || '').replace(
                  /\s+/g,
                  ''
                ),
                10
              )
            : ''

          this.facade.record$.pipe(take(1)).subscribe((oldRecord) => {
            const updatedRecord: CatalogRecord = {
              ...oldRecord,
              title: issue.subject,
              abstract: issue.description || 'Description par défaut',
              overviews: [],
              keywords: keywords,
              keywordsTheme: keywordTheme,
              keywordsCollection:
                collectionField === null ? [] : collectionKeywords,
              keywordsTypeCarte: typeCarteKeyword,
              keywordsEmprise: empriseKeyword,
              kind: 'dataset',
              resourceIdentifier: this.cardNumber,
              resourceCreated: issue.created_on,
              resourceUpdated: issue.updated_on,
              recordUpdated: issue.updated_on,
              licenses: [],
              lineage: '',
              contacts: [],
              contactsForResource: [],
              spatialExtents: [],
              temporalExtents: [],
              status: 'ongoing',
              topics: [],
              legalConstraints: [],
              securityConstraints: [],
              otherConstraints: [],
              ownerOrganization: {
                name: issue.author.name || 'MyOrganization',
                translations: {},
              },
              defaultLanguage: 'fre',
              otherLanguages: [],
              uniqueIdentifier: oldRecord?.uniqueIdentifier ?? 'temp-id',
              onlineResources: [],
              resolutionScaleDenominator: echelle.toString(),
              alimentations: alimentationField || 'alimentation par défaut',
            }

            this.facade.openRecord(updatedRecord, null)
            this.facade.setCurrentPage(0)
          })
        } else {
          alert('Aucune donnée trouvée pour ce numéro de carte.')
          return
        }
      })
  }
}
