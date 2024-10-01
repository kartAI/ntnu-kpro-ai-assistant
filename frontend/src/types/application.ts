export type Application = {
  id: string;
  address: string;
  name: string;
  date: Date;
};

// Temporary data for testing purposes
export const applications: Application[] = [
  {
    id: "12345678",
    address: "Adresseveien 123",
    name: "Ola Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "23456789",
    address: "Adresseveien 234",
    name: "Kari Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "34567890",
    address: "Adresseveien 345",
    name: "Knut Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "45678901",
    address: "Adresseveien 456",
    name: "Per Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "56789012",
    address: "Adresseveien 567",
    name: "Pål Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "67890123",
    address: "Adresseveien 678",
    name: "Espen Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "78901234",
    address: "Adresseveien 789",
    name: "Nora Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "89012345",
    address: "Adresseveien 890",
    name: "Nina Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "90123456",
    address: "Adresseveien 901",
    name: "Nils Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "01234567",
    address: "Adresseveien 012",
    name: "Lars Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "99999999",
    address: "Adresseveien 999",
    name: "Gunnar Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "11111111",
    address: "Adresseveien 111",
    name: "Ingrid Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "22222222",
    address: "Adresseveien 222",
    name: "Marius Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "33333333",
    address: "Adresseveien 333",
    name: "Sofie Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "44444444",
    address: "Adresseveien 444",
    name: "Henrik Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "55555555",
    address: "Adresseveien 555",
    name: "Emma Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "66666666",
    address: "Adresseveien 666",
    name: "Jakob Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "77777777",
    address: "Adresseveien 777",
    name: "Thea Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "88888888",
    address: "Adresseveien 888",
    name: "Mathias Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "10101010",
    address: "Adresseveien 101",
    name: "Mia Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "12121212",
    address: "Adresseveien 121",
    name: "Lucas Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "13131313",
    address: "Adresseveien 131",
    name: "Julie Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "14141414",
    address: "Adresseveien 141",
    name: "Oliver Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "15151515",
    address: "Adresseveien 151",
    name: "Nora Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "16161616",
    address: "Adresseveien 161",
    name: "Emil Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "17171717",
    address: "Adresseveien 171",
    name: "Anna Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "18181818",
    address: "Adresseveien 181",
    name: "William Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "19191919",
    address: "Adresseveien 191",
    name: "Ida Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "20202020",
    address: "Adresseveien 202",
    name: "Sebastian Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "21212121",
    address: "Adresseveien 212",
    name: "Ella Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "22222222",
    address: "Adresseveien 222",
    name: "Noah Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "23232323",
    address: "Adresseveien 232",
    name: "Lilly Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "24242424",
    address: "Adresseveien 242",
    name: "Aksel Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "25252525",
    address: "Adresseveien 252",
    name: "Maja Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "26262626",
    address: "Adresseveien 262",
    name: "Oskar Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "27272727",
    address: "Adresseveien 272",
    name: "Leah Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  },
  {
    id: "28282828",
    address: "Adresseveien 282",
    name: "Filip Nordmann",
    date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  }
];
