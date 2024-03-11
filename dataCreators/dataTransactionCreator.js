import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import mongodbIdGenerator from "../modules/mongodbIdGenerator.js";
import getRandomIDs from "../modules/getRandomIDs.js";

// Generates an array consisting of transaction objects.
// [ {...}, {...}, ..... ]
// The number of transaction objects in the array is determined by "numloops".
const createDataTransactionArr = (numloops) => {
  const dataTransactionArr = [];

  for (let i = 0; i < numloops; i++) {
    const transaction = {
      _id: mongodbIdGenerator(1)[0],
      userId: getRandomIDs(
        1,
        path.resolve("./jsonData/IDs.json"),
        "dataUserIDs"
      )[0],
      cost: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
      products: getRandomIDs(
        faker.number.int({ min: 1, max: 5 }),
        path.resolve("./jsonData/IDs.json"),
        "dataProductIDs"
      ),
    };
    dataTransactionArr.push(transaction);
  }

  return dataTransactionArr;
};

// console.log(createDataTransactionArr(3));
export default createDataTransactionArr;
