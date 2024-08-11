export const en = {
  home: {
    members: {
      title: "Members",
      description:
        "Warning! There should be at least a member with 18 years old if you plan to book an accomodation",
      add: "Add",
      done: "Done",
    },

    title: "Welcome back",
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
    invalid_plan: "This feature is only available to premium members!",
  },
  plan: {
    loading: {
      create: "Generating your trip..",
      accomodation: "Looking for the best accomodations..",
      attractions: "Finding the best attractions..",
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
      select: "Select accomodation",
      price: "Price",
      rating: "Rating",
    },
    attractions: {
      select: "Select attractions",
    },
    checkout: {
      title: "Checkout",
      description:
        "NextTravel doesn't handle payments for you, you can proceed by clicking the buttons below",
      friends: "Traveling with friends?",
      friends_description:
        "Share your trip with friends to enjoy your holiday even more",
      invite: "Invite",
      friends_count: "invited friends",
      public: "Public",
      bookmark: "Bookmark",
    },

    title: "Plan your trip",
    accomodation_title: "Accomodation",
    plan: "Your plan",
    next: "Next",
    back: "Back",
    share: "Share",
    calendar: "Calendar",
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
        title: "Expert Traveler",
        features: [
          { title: "5 trip per month", active: true },
          { title: "Switch accomodation", active: true },
          { title: "AI assistant", active: true },
          { title: "Trip themes", active: true },
        ],
      },

      free_spirit: {
        title: "Free Spirit",
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
      soon: "Coming Soon",
    },

    bookmarks: "Bookmarks",
    history: "History",
    public: "Shared Plans",
    name: "Name",
    current_password: "Current Password / Reset Code",
    confirm_password: "Confirm Password",
    submit: "Submit",

    new_member: "New member?",
    already_member: "Already a member?",
    register: "Register",
    login: "Login",
    forgot_password: "Forgot password?",
    remember_password: "Remember password?",

    success: "Success",
    password_reset: "Password reset email sent",
    password_changed: "Password changed",

    manage_plan: "Manage Plan",
  },
  chat: {
    title: "Chat",
    input: "Type your message",
  },
  settings: {
    title: "Settings",
    clear_cache: "Clear cache",
    logout: "Logout",
  },
};
