export const en = {
  home: {
    members: {
      title: "Members",
      description:
        "Warning! There should be at least a member with 18 years old if you plan to book an accomodation",
      add: "Add",
      done: "Done",
    },

    destination: "Type your destination",
    period: "Period",
    members_placeholder: "Members",
    most_requested: "Most requested",
    last_searches: "Last searches",
    submit: "Start planning!",
  },
  errors: {
    screen: {
      title: "Oh no!",
      description: "An error occurred.. Please try again later",
    },

    auth: {
      invalid_email: "Invalid email",
      invalid_password:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
      match_passwords: "Passwords don't match",
      wrong_password: "Wrong password",
    },

    plan: {
      invalid_start_date: "Start date must be after today",
      invalid_end_date: "End date must be after start date",
      min_members: "You must have at least one member",
      min_age: "Members must be at least 1 year old",
    },

    not_found: "The requested item was not found",
    month_limit: "You have reached your monthly limit",
  },
  plan: {
    loading: {
      create: "Generating your trip..",
      accomodation: "Looking for the best accomodations..",
    },
    limit: {
      title: "Oh no!",
      description:
        "You have reached your monthly limit. Buy a premium subscription to continue",
      premium: "Buy Premium",
    },
    step: {
      duration: "Duration",
      time: "Time",
    },
    accomodation: {
      select: "Select your accomodation",
      price: "Price",
      rating: "Rating",
    },
    checkout: {
      title: "Ready for checkout?",
      description: "Let's make this plan real!",
      details: "Checkout Details",
      processor: {
        title: "Payment Processor",
        description:
          "NextTravel creates amazing trips for you but is not responsible for attractions, accommodations, and travels.  You can check and pay the providers by clicking the button below.",
      },
      plan: "Your plan",
    },

    title: "Your plan is ready!",
    description: "Click any item that you want to change to edit it.",
    accomodation_title: "Accomodation",
    plan: "Your plan",
    next: "Next",
    back: "Back",
    share: "Share",
  },
  account: {
    premium: {
      random_traveler: {
        title: "Random Traveler",
        features: [
          { title: "1 trip per month", active: true },
          { title: "Switch accomodation", active: true },
          { title: "AI assistant", active: false },
          { title: "Trip themes", active: false },
        ],
      },

      expert_traveler: {
        title: "Random Traveler",
        features: [
          { title: "5 trip per month", active: true },
          { title: "Switch accomodation", active: true },
          { title: "AI assistant", active: true },
          { title: "Trip themes", active: true },
        ],
      },

      free_spirit: {
        title: "Random Traveler",
        features: [
          { title: "No monthly limits", active: true },
          { title: "Switch accomodation", active: true },
          { title: "AI assistant", active: true },
          { title: "Trip themes", active: true },
        ],
      },

      title: "Travel with no limits",
      current: "Current",
      buy: "Buy",
    },

    bookmarks: "Bookmarks",
    public: "Public / Shared",
    name: "Name",
    confirm_password: "Confirm Password",
    submit: "Submit",
  },
};
