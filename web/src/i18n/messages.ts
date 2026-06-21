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
  'nav.weeklyReview': 'Weekly report',
  'nav.monthlyReview': 'Monthly report',
  'nav.logout': 'Log out',
  'nav.loggingOut': 'Logging out…',

  'common.cancel': 'Cancel',
  'common.close': 'Close',
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
  'stats.daysNoOvereating': 'Days without overeating',
  'stats.trainingsDone': 'Trainings done',
  'stats.avgEnergy': 'Average energy',
  'stats.avgStress': 'Average stress',
  'stats.avgMood': 'Average mood',

  'weekly.title': 'Weekly report',
  'monthly.title': 'Monthly report',

  'weekly.addTitle': 'New weekly report',
  'weekly.weekOf': 'Week of {range}',
  'weekly.whatWentWell': 'What went well',
  'weekly.biggestChallenge': 'Biggest challenge',
  'weekly.mainTriggerNote': 'Main trigger',
  'weekly.nextWeekFocus': 'Next week focus',
  'weekly.notes': 'Notes',
  'weekly.save': 'Save weekly report',
  'weekly.saving': 'Saving…',
  'weekly.saved': 'Weekly report saved.',
  'weekly.errorDuplicate': 'A weekly report already exists for this week.',
  'weekly.tableTitle': 'Weekly metrics',
  'weekly.noData': 'No daily logs yet.',
  'weekly.col.week': 'Week',
  'weekly.col.avgWeight': 'Average weight',
  'weekly.col.change': 'Change',
  'weekly.col.avgSleep': 'Average sleep',
  'weekly.col.avgSteps': 'Average steps',
  'weekly.col.trainings': 'Trainings done',
  'weekly.col.daysNoOvereating': 'Days without overeating',
  'weekly.col.avgEnergy': 'Average energy',
  'weekly.col.avgStress': 'Average stress',
  'weekly.col.details': 'Details',
  'weekly.details': 'Details',
  'weekly.weekNumber': 'Week {n}',
  'weekly.reflection': 'Reflection',
  'weekly.dailyLogsTitle': 'Daily logs',
  'weekly.noLogsInWeek': 'No daily logs this week.',

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
  'dailyLog.sectionWellbeing': 'Wellbeing (1 = low, 10 = high)',
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
  'dailyLog.craving': 'Craving',
  'dailyLog.cravedFood': 'Craved food',
  'dailyLog.cravedFoodPlaceholder': 'e.g. chocolate, chips',
  'dailyLog.resistedCraving': 'Resisted craving',
  'dailyLog.resistedCravingCheck': 'Resisted the craving',
  'dailyLog.energy': 'Energy',
  'dailyLog.stress': 'Stress',
  'dailyLog.mood': 'Mood',
  'dailyLog.notes': 'Notes',
  'dailyLog.save': 'Save daily log',
  'dailyLog.saving': 'Saving…',
  'dailyLog.update': 'Update daily log',
  'dailyLog.updating': 'Updating…',
  'dailyLog.errorDuplicate': 'A daily log already exists for this date.',

  'trigger.HUNGER': 'Hunger',
  'trigger.STRESS': 'Stress',
  'trigger.BOREDOM': 'Boredom',
  'trigger.SOCIAL': 'Social',
  'trigger.FATIGUE': 'Fatigue',
  'trigger.CHAOS': 'Chaos',
  'trigger.AVAILABILITY': 'Availability',
  'trigger.NONE': 'None',

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
  'nav.weeklyReview': 'Tjedni izvještaj',
  'nav.monthlyReview': 'Mjesečni izvještaj',
  'nav.logout': 'Odjava',
  'nav.loggingOut': 'Odjava…',

  'common.cancel': 'Odustani',
  'common.close': 'Zatvori',
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
  'stats.daysNoOvereating': 'Dani bez prejedanja',
  'stats.trainingsDone': 'Odrađeni treninzi',
  'stats.avgEnergy': 'Prosječna energija',
  'stats.avgStress': 'Prosječni stres',
  'stats.avgMood': 'Prosječno raspoloženje',

  'weekly.title': 'Tjedni izvještaj',
  'monthly.title': 'Mjesečni izvještaj',

  'weekly.addTitle': 'Novi tjedni izvještaj',
  'weekly.weekOf': 'Tjedan {range}',
  'weekly.whatWentWell': 'Što je bilo dobro',
  'weekly.biggestChallenge': 'Najveći izazov',
  'weekly.mainTriggerNote': 'Glavni okidač',
  'weekly.nextWeekFocus': 'Fokus za sljedeći tjedan',
  'weekly.notes': 'Bilješke',
  'weekly.save': 'Spremi tjedni izvještaj',
  'weekly.saving': 'Spremanje…',
  'weekly.saved': 'Tjedni izvještaj spremljen.',
  'weekly.errorDuplicate': 'Za ovaj tjedan već postoji tjedni izvještaj.',
  'weekly.tableTitle': 'Tjedni pokazatelji',
  'weekly.noData': 'Još nema dnevnih unosa.',
  'weekly.col.week': 'Tjedan',
  'weekly.col.avgWeight': 'Prosječna težina',
  'weekly.col.change': 'Promjena',
  'weekly.col.avgSleep': 'Prosječni san',
  'weekly.col.avgSteps': 'Prosječni koraci',
  'weekly.col.trainings': 'Odrađeni treninzi',
  'weekly.col.daysNoOvereating': 'Dani bez prejedanja',
  'weekly.col.avgEnergy': 'Prosječna energija',
  'weekly.col.avgStress': 'Prosječni stres',
  'weekly.col.details': 'Detalji',
  'weekly.details': 'Detalji',
  'weekly.weekNumber': 'Tjedan {n}',
  'weekly.reflection': 'Osvrt',
  'weekly.dailyLogsTitle': 'Dnevni unosi',
  'weekly.noLogsInWeek': 'Nema dnevnih unosa ovaj tjedan.',

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
  'dailyLog.sectionWellbeing': 'Dobrobit (1 = nisko, 10 = visoko)',
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
  'dailyLog.craving': 'Žudnja (1–10)',
  'dailyLog.cravedFood': 'Hrana koju je poželio',
  'dailyLog.cravedFoodPlaceholder': 'npr. čokolada, čips',
  'dailyLog.resistedCraving': 'Odolio žudnji',
  'dailyLog.resistedCravingCheck': 'Odolio žudnji',
  'dailyLog.energy': 'Energija',
  'dailyLog.stress': 'Stres',
  'dailyLog.mood': 'Raspoloženje',
  'dailyLog.notes': 'Bilješke',
  'dailyLog.save': 'Spremi dnevni unos',
  'dailyLog.saving': 'Spremanje…',
  'dailyLog.update': 'Ažuriraj dnevni unos',
  'dailyLog.updating': 'Ažuriranje…',
  'dailyLog.errorDuplicate': 'Za ovaj datum već postoji dnevni unos.',

  'trigger.HUNGER': 'Glad',
  'trigger.STRESS': 'Stres',
  'trigger.BOREDOM': 'Dosada',
  'trigger.SOCIAL': 'Društvo',
  'trigger.FATIGUE': 'Umor',
  'trigger.CHAOS': 'Kaos',
  'trigger.AVAILABILITY': 'Dostupnost',
  'trigger.NONE': 'Nijedan',

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
