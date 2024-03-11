import fs from "fs";

// Returns an array of randomly selected IDs from "jsonKey" array.
// The array is located in "jsonFileDirectory" file.
const getRandomIDs = (numberOfIDs, jsonFileDirectory, jsonKey) => {
  const jsonData = fs.existsSync(jsonFileDirectory)
    ? JSON.parse(fs.readFileSync(jsonFileDirectory, "utf-8"))
    : { [jsonKey]: [] };
  const idArrLength = jsonData[jsonKey].length;

  const randomIDs = [];
  for (let i = 0; i < numberOfIDs; i++) {
    const randomIndex = Math.floor(Math.random() * idArrLength);
    const randomID = jsonData[jsonKey][randomIndex];
    randomIDs.push(randomID);
  }
  return randomIDs;
};

// console.log(getRandomIDs(3, "../jsonData/IDs.json", "dataUserIDs"));
export default getRandomIDs;
