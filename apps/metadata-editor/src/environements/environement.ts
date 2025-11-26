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
  'keywordsTypeCarte',
  'keywordsEmprise',
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
  'keywordsTypeCarte': 'Type de carte',
  'keywordsEmprise': 'Emprise géographique',
  'ownerOrganization': 'Auteur'
}
