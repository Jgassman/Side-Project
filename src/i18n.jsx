import { createContext, useContext, useEffect, useState } from 'react'

const LANG_KEY = 'daily-wins:lang'

// Languages available in the header toggle. `label` is shown natively.
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ja', label: '日本語', short: 'JA' },
]

// All UI strings. {placeholders} are replaced at runtime by t().
const translations = {
  en: {
    tagline: 'Build better habits, one day at a time',
    addHabit: 'Add Habit',
    todaysProgress: "Today's Progress",
    completedOf: '{done} of {total} completed',
    allDone: 'All done for today — nice work! 🎉',
    nothingYet: 'Nothing checked off yet today',
    stats: {
      activeHabits: 'Active Habits',
      completedToday: 'Done Today',
      bestStreak: 'Best Streak',
      totalCheckins: 'Check-ins',
    },
    newHabit: 'New Habit',
    editHabit: 'Edit Habit',
    habitName: 'Habit name',
    habitNamePlaceholder: 'e.g. Drink water',
    category: 'Category',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    markComplete: 'Mark complete',
    completedToday: 'Completed today',
    dayStreak: '{count}-day streak',
    noStreak: 'No streak yet',
    best: 'Best',
    current: 'Current',
    longest: 'Longest',
    emptyTitle: 'No habits yet',
    emptyBody: 'Add your first habit to start building better routines.',
    emptyCta: 'Add your first habit',
    deleteConfirm: 'Delete this habit? This can’t be undone.',
    language: 'Language',
    all: 'All',
    categories: {
      fitness: 'Fitness',
      mindfulness: 'Mindfulness',
      learning: 'Learning',
      productivity: 'Productivity',
    },
  },
  es: {
    tagline: 'Crea mejores hábitos, un día a la vez',
    addHabit: 'Añadir hábito',
    todaysProgress: 'Progreso de hoy',
    completedOf: '{done} de {total} completados',
    allDone: '¡Todo hecho por hoy, buen trabajo! 🎉',
    nothingYet: 'Aún no has marcado nada hoy',
    stats: {
      activeHabits: 'Hábitos activos',
      completedToday: 'Hechos hoy',
      bestStreak: 'Mejor racha',
      totalCheckins: 'Registros',
    },
    newHabit: 'Nuevo hábito',
    editHabit: 'Editar hábito',
    habitName: 'Nombre del hábito',
    habitNamePlaceholder: 'p. ej. Beber agua',
    category: 'Categoría',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    markComplete: 'Marcar como hecho',
    completedToday: 'Completado hoy',
    dayStreak: 'racha de {count} días',
    noStreak: 'Sin racha todavía',
    best: 'Mejor',
    current: 'Actual',
    longest: 'Más larga',
    emptyTitle: 'Aún no hay hábitos',
    emptyBody: 'Añade tu primer hábito para empezar a crear mejores rutinas.',
    emptyCta: 'Añade tu primer hábito',
    deleteConfirm: '¿Eliminar este hábito? No se puede deshacer.',
    language: 'Idioma',
    all: 'Todos',
    categories: {
      fitness: 'Ejercicio',
      mindfulness: 'Mindfulness',
      learning: 'Aprendizaje',
      productivity: 'Productividad',
    },
  },
  fr: {
    tagline: 'Créez de meilleures habitudes, jour après jour',
    addHabit: 'Ajouter une habitude',
    todaysProgress: 'Progression du jour',
    completedOf: '{done} sur {total} terminées',
    allDone: 'Tout est fait pour aujourd’hui, bravo ! 🎉',
    nothingYet: 'Rien de coché pour aujourd’hui',
    stats: {
      activeHabits: 'Habitudes actives',
      completedToday: 'Faites aujourd’hui',
      bestStreak: 'Meilleure série',
      totalCheckins: 'Validations',
    },
    newHabit: 'Nouvelle habitude',
    editHabit: 'Modifier l’habitude',
    habitName: 'Nom de l’habitude',
    habitNamePlaceholder: 'ex. Boire de l’eau',
    category: 'Catégorie',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    markComplete: 'Marquer comme fait',
    completedToday: 'Terminée aujourd’hui',
    dayStreak: 'série de {count} jours',
    noStreak: 'Pas encore de série',
    best: 'Record',
    current: 'Actuelle',
    longest: 'Plus longue',
    emptyTitle: 'Aucune habitude pour l’instant',
    emptyBody: 'Ajoutez votre première habitude pour commencer à créer de meilleures routines.',
    emptyCta: 'Ajouter votre première habitude',
    deleteConfirm: 'Supprimer cette habitude ? Cette action est irréversible.',
    language: 'Langue',
    all: 'Toutes',
    categories: {
      fitness: 'Forme',
      mindfulness: 'Pleine conscience',
      learning: 'Apprentissage',
      productivity: 'Productivité',
    },
  },
  ja: {
    tagline: '毎日少しずつ、より良い習慣を',
    addHabit: '習慣を追加',
    todaysProgress: '今日の進捗',
    completedOf: '{total}件中{done}件完了',
    allDone: '今日はすべて完了です。お疲れさまでした！🎉',
    nothingYet: '今日はまだ何も完了していません',
    stats: {
      activeHabits: 'アクティブな習慣',
      completedToday: '今日の完了',
      bestStreak: '最高連続記録',
      totalCheckins: 'チェックイン',
    },
    newHabit: '新しい習慣',
    editHabit: '習慣を編集',
    habitName: '習慣の名前',
    habitNamePlaceholder: '例：水を飲む',
    category: 'カテゴリー',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    markComplete: '完了にする',
    completedToday: '今日完了',
    dayStreak: '{count}日連続',
    noStreak: 'まだ連続記録はありません',
    best: '最高',
    current: '現在',
    longest: '最長',
    emptyTitle: 'まだ習慣がありません',
    emptyBody: '最初の習慣を追加して、より良い習慣づくりを始めましょう。',
    emptyCta: '最初の習慣を追加',
    deleteConfirm: 'この習慣を削除しますか？元に戻せません。',
    language: '言語',
    all: 'すべて',
    categories: {
      fitness: 'フィットネス',
      mindfulness: 'マインドフルネス',
      learning: '学習',
      productivity: '生産性',
    },
  },
}

const LanguageContext = createContext(null)

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved && translations[saved]) return saved
  } catch {
    /* ignore */
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang
  }, [lang])

  // Resolve a dot-path key (e.g. "stats.bestStreak") and interpolate {params}.
  function t(key, params) {
    const dict = translations[lang] || translations.en
    let value = key.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), dict)
    if (value === undefined) {
      // Fall back to English, then to the raw key.
      value = key.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), translations.en)
    }
    if (typeof value !== 'string') return key
    if (params) {
      value = value.replace(/\{(\w+)\}/g, (m, name) =>
        params[name] !== undefined ? String(params[name]) : m,
      )
    }
    return value
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider')
  return ctx
}
