import fs from "fs";
import { faker } from "@faker-js/faker";
import mongodbIdGenerator from "../modules/mongodbIdGenerator.js";

const createDataProductArr = (numloops) => {
  const dataProductArr = [];
  for (let i = 0; i < numloops; i++) {
    const product = {
      _id: mongodbIdGenerator(1)[0],
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement([
        "appliances",
        "clothing",
        "accessories",
        "misc",
      ]),
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
      supply: faker.number.int({ min: 100, max: 1500 }),
    };
    dataProductArr.push(product);
  }
  return dataProductArr;
};

// console.log(createDataProductArr(2));
export default createDataProductArr;
