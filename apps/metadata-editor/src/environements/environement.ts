export const environment = {
  production: false,
  redmineUrl: '/redmine-api',
  redmineUsername: 'metourneau',
  redminePassword: 'metourneau',
}

export const requiredFields = [
  'resourceIdentifier',
  'title',
  'abstract',
  'resolutionScaleDenominator',
  'keywordsTheme',
  'keywords',
  'keywordsTypeCarte',
  'keywordsEmprise',
  'contactsForResource-author',
  'resourceCreated',
  'overviews',
  'onlineResources',
  'resourcePublished',
]
export const requiredFieldsStatique = []
export const requiredFieldsDynamique = [
  // 'URL de la carte'
]

export const translatableFields = {
  resourceIdentifier: 'Numéro de carte',
  title: 'Titre',
  abstract: 'Description',
  resolutionScaleDenominator: 'Echelle de réalisation',
  keywordsTheme: 'Thématique HdF',
  keywords: 'Mots-clés',
  keywordsCollection: 'Collection',
  keywordsTypeCarte: 'Type de carte',
  keywordsEmprise: 'Emprise géographique',
  resourceCreated: 'Date de création',
  'contactsForResource-author': 'Auteur(s) de la ressource',
  onlineResources: 'Annexe - Fichier PDF ou URL de la carte',
  overviews: 'Aperçu - Fichier PNG',
  resourcePublished: 'Date de publication',
}
