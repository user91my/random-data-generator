import fs from "fs";
import path from "path";

const jsonDirectory = "./jsonData";

// Returns an array of directories for every file located in the specified
// directory.
// -------------------------------------------------------------------------
const filesInDir = fs.readdirSync(jsonDirectory, (error, files) => {
  if (error) {
    console.log(error);
    return;
  }
  return files;
});
console.log("---------------------------------------------------");
console.log("---------------------------------------------------");
console.log(
  `filesInDir - All files in "${path.resolve(jsonDirectory)}" directory`
);
console.log(filesInDir);

// Data structure of "filePathsArr" :-
// [
//   { dataProduct: "jsonData\\dataProduct.json" } ,
//   { dataUser: "jsonData\\dataUser.json" } ,
//   .... ,
// ];
// -------------------------------------------------------------------------
const jsonFileRegex = /\.json$/i;
const filePathsArr = filesInDir
  .filter((file) => jsonFileRegex.test(file)) // removes non-json files
  .map((file) => {
    const jsonFileWithoutExtension = file.replace(jsonFileRegex, "");
    return {
      [jsonFileWithoutExtension]: path.join(jsonDirectory, file),
    };
  });
console.log("-----------------------------------------------------------");
console.log(
  "filePathsArr - JSON files (without extension) to relative directory mapping"
);
console.log(filePathsArr);

// Prints out the length of every jsonData object property.
// ---------------------------------------------------------
console.log("-----------------------------------------------------------");
filePathsArr.forEach((fileObj) => {
  const jsonKey = Object.keys(fileObj)[0]; // e.g. "dataProduct", "dataUser", etc.
  const filePath = fileObj[jsonKey]; // e.g. "jsonData\\dataProduct.json"
  const jsonDataFile = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
    : {};
  if (jsonKey === "IDs") {
    const idJsonKeys = Object.keys(jsonDataFile);
    idJsonKeys.forEach((idKey) =>
      console.log(
        `Number of elements in "${idKey}" field of "${filePath}" :`,
        jsonDataFile[idKey].length
      )
    );
  } else {
    console.log(
      `Number of elements in "${jsonKey}" field of "${filePath}" :`,
      jsonDataFile[jsonKey].length
    );
  }
});

// Delete "dataUser.json" data file in "./jsonData" directory.
// -------------------------------------------------------------
// fs.unlinkSync("./jsonData/dataUser.json");
