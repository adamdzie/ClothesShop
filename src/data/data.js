export const categories = [
  {
    id: 1,
    name: "Bluzy",
    under_categories: [
      {
        id: 1,
        name: "Rozpinane",
      },
      {
        id: 2,
        name: "Polarowe",
      },
      {
        id: 3,
        name: "Z kapturem",
      },
    ],
  },
  {
    id: 2,
    name: "Kurtki",
    under_categories: [
      {
        id: 1,
        name: "Jeansowe",
      },
      {
        id: 2,
        name: "Pikowane",
      },
      {
        id: 3,
        name: "Sportowe",
      },
      {
        id: 4,
        name: "Wiosenne",
      },
      {
        id: 5,
        name: "Zimowe",
      },
    ],
  },
  {
    id: 3,
    name: "Koszulki",
    under_categories: [
      {
        id: 1,
        name: "Sportowe",
      },
      {
        id: 2,
        name: "Z nadrukiem",
      },
    ],
  },
  {
    id: 4,
    name: "Spodnie",
    under_categories: [
      {
        id: 1,
        name: "Bojówki",
      },
      {
        id: 2,
        name: "Sportowe",
      },
      {
        id: 3,
        name: "Szorty",
      },
    ],
  },
  {
    id: 5,
    name: "Koszule",
    under_categories: [
      {
        id: 1,
        name: "Sportowe",
      },
      {
        id: 2,
        name: "Eleganckie",
      },
      {
        id: 3,
        name: "W kratę",
      },
    ],
  },
  {
    id: 6,
    name: "Swetry",
    under_categories: [
      {
        id: 1,
        name: "Pulowery",
      },
      {
        id: 2,
        name: "Rozpinane",
      },
      {
        id: 3,
        name: "W serek",
      },
    ],
  },
  {
    id: 7,
    name: "Garnitury i marynarki",
    under_categories: [
      {
        id: 1,
        name: "Garnitury",
      },
      {
        id: 2,
        name: "Marynarki",
      },
    ],
  },
];

export const sizes = ["XS", "S", "M", "L", "XL"];

export const colors = [
  "Czerwony",
  "Fioletowy",
  "Niebieski",
  "Zielony",
  "Żółty",
  "Pomarańczowy",
  "Czarny",
  "Szary",
];

export class ItemCart {
  constructor(userItemId, userItemQuantity, userItemSize, userItemColor) {
    this._userItemId = userItemId;
    this._userItemQuantity = userItemQuantity;
    this._userItemSize = userItemSize;
    this._userItemColor = userItemColor;
  }
  get userItemId() {
    return this._userItemId;
  }
  get userItemQuantity() {
    return this._userItemQuantity;
  }
  get userItemSize() {
    return this._userItemSize;
  }
  get userItemColor() {
    return this._userItemColor;
  }
  addQuantity(val) {
    return (this._userItemQuantity = this._userItemQuantity + Number(val));
  }
}
