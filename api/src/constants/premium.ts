export type Plan = {
  id: string;
  price: number;
  limit: number;
  chat: boolean;
  themes: boolean;
};

export const randomTraveler: Plan = {
  id: "random_traveler",
  price: 0,
  limit: 1,
  chat: false,
  themes: false,
};

export const expertTraveler: Plan = {
  id: "expert_traveler",
  price: 4.99,
  limit: 5,
  chat: true,
  themes: true,
};

export const freeSpirit: Plan = {
  id: "free_spirit",
  price: 9.99,
  limit: 999,
  chat: true,
  themes: true,
};

export const plans: Plan[] = [randomTraveler, expertTraveler, freeSpirit];

export const getPlan = (id: string | null) =>
  plans.find((plan) => plan.id === id) || randomTraveler;
