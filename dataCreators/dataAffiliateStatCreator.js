import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import mongodbIdGenerator from "../modules/mongodbIdGenerator.js";

const createDataAffiliateStatArr = (numloops) => {
  const jsonIDFilePath = "./jsonData/IDs.json";
  const jsonIdData = fs.existsSync(jsonIDFilePath)
    ? JSON.parse(fs.readFileSync(jsonIDFilePath, "utf-8"))
    : {};
  if (!Object.keys(jsonIdData).length) {
    console.log("No ID data available");
    return;
  }

  let dataUserIDsArr = [...jsonIdData.dataUserIDs];
  const dataTransactionIDsArr = [...jsonIdData.dataTransactionIDs];

  console.log(`${dataUserIDsArr.length} user IDs available`);
  console.log(`${dataTransactionIDsArr.length} transaction IDs available`);

  if (numloops > dataUserIDsArr.length) {
    console.log(
      `ERROR: Number of affiliate stats requested (${numloops}) exceeds the
       number of user data IDs available (${dataUserIDsArr.length})!`
    );
    return;
  }

  const generateAffiliateSales = (min, max) => {
    const randomNumber = faker.number.int({ min, max });

    if (randomNumber > dataTransactionIDsArr.length) {
      console.log(
        `ERROR: Number of affiliate sales requested (${randomNumber})
         exceeds the number of transaction IDs available 
         (${dataTransactionIDsArr.length})!`
      );
      return;
    }

    const affiliateSalesArr = [];
    for (let i = 0; i < randomNumber; i++) {
      const randomIndex = faker.number.int({
        max: dataTransactionIDsArr.length - 1,
      });
      const randomTransactionID = dataTransactionIDsArr[randomIndex];
      if (affiliateSalesArr.includes(randomTransactionID)) {
        i--;
        continue;
      }
      affiliateSalesArr.push(randomTransactionID);
    }
    return affiliateSalesArr;
  };

  const dataAffiliateStatArr = [];
  for (let i = 0; i < numloops; i++) {
    const randomIDIndex = Math.floor(Math.random() * dataUserIDsArr.length);
    const randomUserID = dataUserIDsArr[randomIDIndex];
    const affiliateSalesArr = generateAffiliateSales(2, 10);

    dataAffiliateStatArr.push({
      _id: mongodbIdGenerator(1)[0],
      userId: randomUserID,
      affiliateSales: affiliateSalesArr,
    });
    dataUserIDsArr.splice(randomIDIndex, 1);
  }
  // console.log(dataAffiliateStatArr);
  return dataAffiliateStatArr;
};

// createDataAffiliateStatArr(3);
export default createDataAffiliateStatArr;
