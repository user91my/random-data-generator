// https://fakerjs.dev/guide/
// https://fakerjs.dev/guide/localization.html
import {
  faker,
  fakerEN_AU,
  fakerEN_CA,
  fakerEN_GB,
  fakerEN_US,
  fakerES,
  fakerFR,
  fakerIT,
  fakerSV,
  fakerEN_IN,
  fakerEN_ZA,
  fakerEN_NG,
} from "@faker-js/faker";
import { Country, State, City } from "country-state-city";
import mongodbIdGenerator from "../modules/mongodbIdGenerator.js";

// Seed is to produce consistent results.
// https://fakerjs.dev/api/faker#seed
// faker.seed(100);

const localesMapObj = {
  // ANGLOSPHERE
  fakerEN_AU: { localeAPI: fakerEN_AU, countryIsoCode: "AU" }, // Australia
  fakerEN_CA: { localeAPI: fakerEN_CA, countryIsoCode: "CA" }, // Canada
  fakerEN_GB: { localeAPI: fakerEN_GB, countryIsoCode: "GB" }, // Great Britain
  fakerEN_US: { localeAPI: fakerEN_US, countryIsoCode: "US" }, // United States
  // EUROPE
  fakerES: { localeAPI: fakerES, countryIsoCode: "ES" }, // Spain
  fakerFR: { localeAPI: fakerFR, countryIsoCode: "FR" }, // France
  fakerIT: { localeAPI: fakerIT, countryIsoCode: "IT" }, // Italy
  fakerSV: { localeAPI: fakerSV, countryIsoCode: "SE" }, // Sweden
  // ASIA
  fakerEN_IN: { localeAPI: fakerEN_IN, countryIsoCode: "IN" }, // India
  // AFRICA
  fakerEN_ZA: { localeAPI: fakerEN_ZA, countryIsoCode: "ZA" }, // South Africa
  fakerEN_NG: { localeAPI: fakerEN_NG, countryIsoCode: "NG" }, // Nigeria
};

// Generates an object consisting of "localeAPI", "countryIsoCode",
// "stateName" & "cityName".
const countryStateCity = () => {
  // LOCALE / COUNTRY
  const localesArr = Object.keys(localesMapObj);
  const randomLocaleIndex = faker.number.int({ max: localesArr.length - 1 }); // Generates number between 0 and "max" value (The bounds are inclusive).
  const locale = localesMapObj[localesArr[randomLocaleIndex]];
  const { localeAPI, countryIsoCode } = locale;

  // STATE
  const state = localeAPI.location.state;
  const stateIsoCode = state({ abbreviated: true }).toUpperCase();
  const stateDetails = State.getStateByCodeAndCountry(
    stateIsoCode,
    countryIsoCode
  );
  const stateName = stateDetails // If "stateDetails" unavailable, we'll just generate a random state
    ? stateDetails.name
    : state();

  // CITY
  const city = localeAPI.location.city;
  const citiesOfStateArr = City.getCitiesOfState(countryIsoCode, stateIsoCode);
  const randomCityIndex = citiesOfStateArr.length // Generates number between 0 and "max" value (The bounds are inclusive).
    ? faker.number.int({ max: citiesOfStateArr.length - 1 })
    : null;
  const cityName = citiesOfStateArr.length // If "citiesOfStateArr" has nothing, we'll just generate a random city.
    ? citiesOfStateArr[randomCityIndex].name
    : city();

  return { localeAPI, countryIsoCode, stateName, cityName };
};
// TESTS
// const { localeAPI, countryIsoCode, stateName, cityName } = countryStateCity();
// console.log("countryIsoCode :", countryIsoCode);
// console.log("stateName :", stateName);
// console.log("cityName :", cityName);

// ---------------------------------------------------------------------

// Generates an array consisting of user objects.
// [ {...}, {...}, ..... ]
// The number of user objects in the array is determined by "numloops".
const createDataUserArr = (numloops) => {
  const dataUserArr = [];

  for (let i = 0; i < numloops; i++) {
    const { localeAPI, countryIsoCode, stateName, cityName } =
      countryStateCity();

    const user = {
      _id: mongodbIdGenerator(1)[0],
      name: localeAPI.person.firstName(),
      email: localeAPI.internet.email(),
      password: localeAPI.internet.password(),
      city: cityName,
      state: stateName,
      country: countryIsoCode,
      occupation: localeAPI.person.jobTitle(),
      phoneNumber: localeAPI.phone.number(),
      transactions: mongodbIdGenerator(faker.number.int({ min: 1, max: 7 })),
      role: faker.helpers.arrayElement(["superadmin", "admin", "user"]),
    };

    dataUserArr.push(user);
  }
  return dataUserArr;
};

export default createDataUserArr;
