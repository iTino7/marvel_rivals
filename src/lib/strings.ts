/**
 * File contenente tutte le stringhe di testo del progetto
 * Organizzate per componente per facilitare la manutenzione
 */

// ============================================
// SingleHero Component
// ============================================
export const SingleHeroStrings = {
  loading: 'Caricamento...' as const,
  heroNotFound: 'Personaggio non trovato' as const,
} as const

// ============================================
// Lore Component
// ============================================
export const LoreStrings = {
  loading: 'Caricamento...' as const,
  noHeroAvailable: 'Nessun eroe disponibile' as const,
  noDescriptionAvailable: 'Nessuna descrizione disponibile' as const,
  goToDetails: 'Vai ai dettagli' as const,
} as const

// ============================================
// HeroesList Component
// ============================================
export const HeroesListStrings = {
  loadingHeroes: 'Caricamento eroi...' as const,
  errorLoadingHeroes: 'Errore nel caricamento degli eroi' as const,
  noHeroesFound: 'Nessun eroe trovato' as const,
  noHeroesFoundFor: (query: string): string => `Nessun eroe trovato per "${query}"`,
} as const

// ============================================
// Ability Component
// ============================================
export const AbilityStrings = {
  abilities: 'Abilità' as const,
} as const

// ============================================
// Button Component
// ============================================
export const ButtonStrings = {
  defaultText: 'clicca qui' as const,
} as const

// ============================================
// SearchInput Component
// ============================================
export const SearchInputStrings = {
  placeholder: 'Cerca eroi...' as const,
  clearSearch: 'Cancella ricerca' as const,
} as const

// ============================================
// Navbar Component
// ============================================
export const NavbarStrings = {
  marvelRivals: 'Marvel Rivals' as const,
  vanguard: 'Vanguard' as const,
  duelist: 'Duelist' as const,
  strategist: 'Strategist' as const,
} as const

// ============================================
// Home Component
// ============================================
export const HomeStrings = {
  welcome: 'Benvenuto in Marvel Rivals' as const,
  exploreHeroes: 'Esplora tutti gli eroi' as const,
  marvel: 'Marvel' as const,
  seeAllHeroes: 'Vedi tutti gli eroi' as const,
  circularText: 'MARVEL*RIVALS*HEROES*' as const,
} as const
