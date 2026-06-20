export const locales = ['en', 'hr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'forge_locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

// English is the source of truth; every other locale must provide the same keys.
const en = {
  'app.title': 'FORGE',
  'app.description': 'Behavior-based fitness tracking.',

  'language.aria': 'Language',

  'nav.home': 'Home',
  'nav.dailyLog': 'Daily log',
  'nav.weeklyReview': 'Weekly review',
  'nav.monthlyReview': 'Monthly review',
  'nav.logout': 'Log out',
  'nav.loggingOut': 'Logging out…',

  'common.cancel': 'Cancel',
  'common.nothingHere': 'Nothing here yet.',
  'common.errorGeneric': 'Something went wrong. Please try again.',

  'dashboard.title': 'Dashboard',
  'dashboard.subtitle':
    'Behavior-based fitness tracking application focused on long-term weight loss, habit building, and self-awareness.',
  'dashboard.weightTrend': 'Weight trend',
  'dashboard.last7Days': 'Last 7 logged days',
  'dashboard.noWeight': 'No weight logged yet.',

  'stats.currentWeight': 'Current weight',
  'stats.change7d': '7-day change',
  'stats.avgSleep': 'Avg. sleep',
  'stats.avgSteps': 'Avg. steps',

  'weekly.title': 'Weekly review',
  'monthly.title': 'Monthly review',

  'dailyLog.titleNew': 'New daily log',
  'dailyLog.titleEdit': 'Edit daily log',
  'dailyLog.loading': 'Loading…',
  'dailyLog.descNew':
    'Only the date is required — fill in whatever you track today.',
  'dailyLog.descEdit':
    'A log already exists for this date — edit it below and save.',
  'dailyLog.sectionDate': 'Date',
  'dailyLog.sectionBody': 'Body',
  'dailyLog.sectionNutrition': 'Nutrition',
  'dailyLog.sectionBehavior': 'Behavior',
  'dailyLog.sectionWellbeing': 'Wellbeing (1 = low, 5 = high)',
  'dailyLog.sectionNotes': 'Notes',
  'dailyLog.logDate': 'Log date',
  'dailyLog.weight': 'Weight (kg)',
  'dailyLog.sleep': 'Sleep (hours)',
  'dailyLog.steps': 'Steps',
  'dailyLog.training': 'Training',
  'dailyLog.trainingCheck': 'Completed training today',
  'dailyLog.protein': 'Protein (g)',
  'dailyLog.calories': 'Calories',
  'dailyLog.water': 'Water (liters)',
  'dailyLog.overeating': 'Overeating',
  'dailyLog.overeatingCheck': 'Overate today',
  'dailyLog.trigger': 'Trigger',
  'dailyLog.triggerPlaceholder': 'e.g. stress, boredom',
  'dailyLog.resistedTrigger': 'Resisted trigger',
  'dailyLog.resistedCheck': 'Resisted the trigger',
  'dailyLog.energy': 'Energy',
  'dailyLog.stress': 'Stress',
  'dailyLog.mood': 'Mood',
  'dailyLog.notes': 'Notes',
  'dailyLog.save': 'Save daily log',
  'dailyLog.saving': 'Saving…',
  'dailyLog.update': 'Update daily log',
  'dailyLog.updating': 'Updating…',
  'dailyLog.errorDuplicate': 'A daily log already exists for this date.',

  'login.titleLogin': 'Log in',
  'login.titleRegister': 'Create your account',
  'login.name': 'Name',
  'login.nameOptional': '(optional)',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.submitLogin': 'Log in',
  'login.submitRegister': 'Create account',
  'login.submittingLogin': 'Logging in…',
  'login.submittingRegister': 'Creating account…',
  'login.noAccount': "Don't have an account?",
  'login.register': 'Register',
  'login.haveAccount': 'Already have an account?',
  'login.errorInvalid': 'Invalid email or password. New here? Create an account.',
  'login.created': 'Account created. Please log in.',
} as const

export type MessageKey = keyof typeof en

const hr: Record<MessageKey, string> = {
  'app.title': 'FORGE',
  'app.description': 'Praćenje kondicije temeljeno na ponašanju.',

  'language.aria': 'Jezik',

  'nav.home': 'Početna',
  'nav.dailyLog': 'Dnevni unos',
  'nav.weeklyReview': 'Tjedni pregled',
  'nav.monthlyReview': 'Mjesečni pregled',
  'nav.logout': 'Odjava',
  'nav.loggingOut': 'Odjava…',

  'common.cancel': 'Odustani',
  'common.nothingHere': 'Ovdje još nema ničega.',
  'common.errorGeneric': 'Nešto je pošlo po zlu. Pokušajte ponovno.',

  'dashboard.title': 'Nadzorna ploča',
  'dashboard.subtitle':
    'Aplikacija za praćenje kondicije temeljena na ponašanju, usmjerena na dugoročno mršavljenje, izgradnju navika i samosvijest.',
  'dashboard.weightTrend': 'Trend težine',
  'dashboard.last7Days': 'Zadnjih 7 zabilježenih dana',
  'dashboard.noWeight': 'Težina još nije zabilježena.',

  'stats.currentWeight': 'Trenutna težina',
  'stats.change7d': 'Promjena u 7 dana',
  'stats.avgSleep': 'Prosj. san',
  'stats.avgSteps': 'Prosj. koraci',

  'weekly.title': 'Tjedni pregled',
  'monthly.title': 'Mjesečni pregled',

  'dailyLog.titleNew': 'Novi dnevni unos',
  'dailyLog.titleEdit': 'Uredi dnevni unos',
  'dailyLog.loading': 'Učitavanje…',
  'dailyLog.descNew':
    'Obavezan je samo datum — ispunite što god danas pratite.',
  'dailyLog.descEdit':
    'Za ovaj datum već postoji unos — uredite ga ispod i spremite.',
  'dailyLog.sectionDate': 'Datum',
  'dailyLog.sectionBody': 'Tijelo',
  'dailyLog.sectionNutrition': 'Prehrana',
  'dailyLog.sectionBehavior': 'Ponašanje',
  'dailyLog.sectionWellbeing': 'Dobrobit (1 = nisko, 5 = visoko)',
  'dailyLog.sectionNotes': 'Bilješke',
  'dailyLog.logDate': 'Datum unosa',
  'dailyLog.weight': 'Težina (kg)',
  'dailyLog.sleep': 'San (sati)',
  'dailyLog.steps': 'Koraci',
  'dailyLog.training': 'Trening',
  'dailyLog.trainingCheck': 'Danas odradio trening',
  'dailyLog.protein': 'Proteini (g)',
  'dailyLog.calories': 'Kalorije',
  'dailyLog.water': 'Voda (litre)',
  'dailyLog.overeating': 'Prejedanje',
  'dailyLog.overeatingCheck': 'Danas se prejeo',
  'dailyLog.trigger': 'Okidač',
  'dailyLog.triggerPlaceholder': 'npr. stres, dosada',
  'dailyLog.resistedTrigger': 'Odolio okidaču',
  'dailyLog.resistedCheck': 'Odolio okidaču',
  'dailyLog.energy': 'Energija',
  'dailyLog.stress': 'Stres',
  'dailyLog.mood': 'Raspoloženje',
  'dailyLog.notes': 'Bilješke',
  'dailyLog.save': 'Spremi dnevni unos',
  'dailyLog.saving': 'Spremanje…',
  'dailyLog.update': 'Ažuriraj dnevni unos',
  'dailyLog.updating': 'Ažuriranje…',
  'dailyLog.errorDuplicate': 'Za ovaj datum već postoji dnevni unos.',

  'login.titleLogin': 'Prijava',
  'login.titleRegister': 'Izradite svoj račun',
  'login.name': 'Ime',
  'login.nameOptional': '(nije obavezno)',
  'login.email': 'E-pošta',
  'login.password': 'Lozinka',
  'login.submitLogin': 'Prijava',
  'login.submitRegister': 'Izradi račun',
  'login.submittingLogin': 'Prijava…',
  'login.submittingRegister': 'Izrada računa…',
  'login.noAccount': 'Nemate račun?',
  'login.register': 'Registracija',
  'login.haveAccount': 'Već imate račun?',
  'login.errorInvalid': 'Neispravna e-pošta ili lozinka. Novi ste? Izradite račun.',
  'login.created': 'Račun je izrađen. Prijavite se.',
}

const dictionaries: Record<Locale, Record<MessageKey, string>> = { en, hr }

// Short month names for chart labels, per locale.
export const monthsShort: Record<Locale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  hr: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
}

export type Translator = (
  key: MessageKey,
  vars?: Record<string, string | number>,
) => string

export function createTranslator(locale: Locale): Translator {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale]
  return (key, vars) => {
    let text = dict[key] ?? dictionaries[defaultLocale][key] ?? key
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.split(`{${name}}`).join(String(value))
      }
    }
    return text
  }
}
