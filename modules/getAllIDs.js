import fs from "fs";
import path from "path";

const getAllIDs = (fileDirectory, fileName, jsonMainKey, jsonIdKey) => {
  // Read main "jsonData" file (e.g. "./jsonData/dataUser.json").
  const jsonFullFilePath = path.join(fileDirectory, fileName);
  const jsonData = fs.existsSync(jsonFullFilePath)
    ? JSON.parse(fs.readFileSync(jsonFullFilePath, "utf-8"))
    : {};
  if (!Object.keys(jsonData).length) {
    console.log(`No IDs available to compile!`);
    return;
  }

  // Compile all IDs from "jsonData" file.
  const itemIDs = jsonData[jsonMainKey].map((item) => item._id);
  console.log(`${itemIDs.length} IDs compiled from dataUser.json`);

  // Read "jsonIdData" file (i.e. "./jsonData/IDs.json").
  const jsonIdFilePath = path.join(fileDirectory, "IDs.json");
  const jsonIdData = fs.existsSync(jsonIdFilePath)
    ? JSON.parse(fs.readFileSync(jsonIdFilePath, "utf-8"))
    : {};

  // Assigns "itemIDs" array to "jsonIdKey" in "jsonIdData" object.
  jsonIdData[jsonIdKey] = itemIDs;
  const updatedJsonIdData = JSON.stringify(jsonIdData, null, 2);

  // Updates "./jsonData/IDs.json"
  fs.writeFileSync(jsonIdFilePath, updatedJsonIdData);
  console.log(
    `"${jsonIdKey}" field successfully added/updated in ${jsonIdFilePath}!`
  );
};

export default getAllIDs;
