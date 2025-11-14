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
  'keywordsCollection',
  'ownerOrganization'
]

export const translatableFields = {
  'resourceIdentifier': 'Numéro de carte',
  'title': 'Titre',
  'abstract': 'Description',
  'resolutionScaleDenominator': 'Echelle de réalisation',
  'keywordsTheme': 'Thématique HdF',
  'keywords': 'Mots-clés',
  'keywordsCollection': 'Collection',
  'ownerOrganization': 'Auteur'
}
