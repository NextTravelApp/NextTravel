import type { en } from "./en";

export const it: typeof en = {
  home: {
    members: {
      title: "Membri",
      description:
        "Attenzione! Ci deve essere almeno un membro di 18 anni se hai intenzione di prenotare un alloggio",
      add: "Aggiungi",
      done: "Fatto",
    },

    title: "Bentornato",
    destination: "Digita la tua destinazione",
    period: "Periodo",
    members_placeholder: "Membri",
    theme: "Tema (opzionale)",
    most_requested: "Più richiesti",
    last_searches: "Ultime ricerche",
    submit: "Inizia a pianificare!",
  },
  errors: {
    screen: {
      title: "Oh no!",
      description: "Si è verificato un errore.. Per favore riprova più tardi",
    },

    auth: {
      invalid_email: "Email non valida",
      invalid_password:
        "La password deve contenere almeno 8 caratteri, una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale",
      match_passwords: "Le password non coincidono",
      wrong_password: "Password errata",
    },

    plan: {
      invalid_start_date: "La data di inizio deve essere successiva ad oggi",
      invalid_end_date:
        "La data di fine deve essere successiva alla data di inizio",
      min_members: "Devi avere almeno un membro",
      min_age: "Tutti i membri devono avere almeno 1 anno",
    },

    not_found: "L'elemento richiesto non è stato trovato",
    invalid_plan: "Questa funzione è disponibile solo per i membri premium!",
  },
  plan: {
    loading: {
      create: "Pianificazione del tuo viaggio..",
      accomodation: "Cercando i migliori alloggi..",
      attractions: "Cercando le migliori attrazioni..",
      not_ready: "Il tuo viaggio non è ancora pronto",
    },
    limit: {
      title: "Oh no!",
      description:
        "Hai raggiunto il tuo limite mensile. Acquista un abbonamento premium per continuare",
      premium: "Acquista Premium",
    },
    step: {
      duration: "Durata",
      time: "Orario",
    },
    accomodation: {
      select: "Seleziona alloggio",
      price: "Prezzo",
      rating: "Valutazione",
    },
    attractions: {
      select: "Select attractions",
    },
    checkout: {
      title: "Checkout",
      description:
        "NextTravel non gestisce i pagamenti per te, puoi procedere cliccando sui pulsanti qui sotto",
      friends: "Viaggi con amici?",
      friends_description:
        "Condividi il tuo viaggio con amici per pianificare la tua vacanza al meglio",
      invite: "Invita",
      friends_count: "amici invitati",
      public: "Publico",
      bookmark: "Segnalibro",
    },

    title: "Pianifica il tuo viaggio",
    accomodation_title: "Alloggio",
    plan: "Il tuo piano",
    next: "Avanti",
    back: "Indietro",
    share: "Condividi",
    book: "Prenota",
    booked: "Prenotato",
    calendar: "Calendario",
  },
  account: {
    premium: {
      random_traveler: {
        title: "Viaggiatore Occasionale",
        features: [
          { title: "1 viaggio al mese", active: true },
          { title: "Cambia alloggio", active: true },
          { title: "Assistente AI", active: false },
          { title: "Temi di viaggio", active: false },
        ],
      },

      expert_traveler: {
        title: "Viaggiatore Esperto",
        features: [
          { title: "5 viaggi al mese", active: true },
          { title: "Cambia alloggio", active: true },
          { title: "Assistente AI", active: true },
          { title: "Temi di viaggio", active: true },
        ],
      },

      free_spirit: {
        title: "Spirito Libero",
        features: [
          { title: "Nessun limite mensile", active: true },
          { title: "Cambia alloggio", active: true },
          { title: "Assistente AI", active: true },
          { title: "Temi di viaggio", active: true },
        ],
      },

      title: "Viaggia senza limiti",
      current: "Attuale",
      buy: "Acquista",
      soon: "Prossimamente",
    },

    bookmarks: "Segnalibri",
    history: "Cronologia",
    public: "Piani Condivisi",
    name: "Nome",
    current_password: "Password Attuale / Codice di Ripristino",
    confirm_password: "Conferma Password",
    submit: "Invia",

    new_member: "Nuovo membro?",
    already_member: "Già membro?",
    register: "Registrati",
    login: "Accedi",
    forgot_password: "Hai dimenticato la password?",
    remember_password: "Ricorda password?",

    success: "Successo",
    password_reset: "Email di ripristino della password inviata",
    password_changed: "Password modificata",

    manage_plan: "Gestisci Piano",
  },
  chat: {
    title: "Chat",
    input: "Digita il tuo messaggio",
  },
  settings: {
    title: "Impostazioni",
    clear_cache: "Svuota cache",
    logout: "Esci",
  },
  notifications: {
    resume_plan: {
      title: "Il tuo piano è pronto",
      body: "Il tuo {{title}} è pronto nell'app. Cosa stai aspettando?",
    },

    plan_ready: {
      title: "Il tuo piano è pronto!",
      body: "Il tuo piano per {{destination}} è pronto nell'app. Esploralo ora!",
    },
  },
};
