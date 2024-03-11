import { faker } from "@faker-js/faker";

// Generates an array consisting of random mongodb IDs.
// The number of IDs generated is determined by "numloops".
const mongodbIdGenerator = (numloops) => {
  const idArr = [];
  for (let i = 0; i < numloops; i++) {
    const id = faker.database.mongodbObjectId();
    idArr.includes(id) ? i-- : idArr.push(id);
  }
  return idArr;
};

export default mongodbIdGenerator;
