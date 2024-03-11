import fs from "fs";
import path from "path";
import createUpdateJsonData from "./modules/createUpdateJsonData.js";
import getAllIDs from "./modules/getAllIDs.js";
import createDataUserArr from "./dataCreators/dataUserCreator.js";
import createDataProductArr from "./dataCreators/dataProductCreator.js";
import createDataTransactionArr from "./dataCreators/dataTransactionCreator.js";
import createDataProductStat from "./dataCreators/dataProductStatCreator.js";
import createDataOverallStat from "./dataCreators/dataOverallStatCreator.js";
import createDataAffiliateStatArr from "./dataCreators/dataAffiliateStatCreator.js";

// Create/Update "dataUser.json" data file in "./jsonData" directory.
// ------------------------------------------------------------------
createUpdateJsonData(
  "./jsonData",
  "dataUser.json",
  "dataUser",
  createDataUserArr,
  250
);

// Get all user IDs in "./jsonData/dataUser.json" and create a new
// field "dataUserIDs" in "./jsonData/IDs.json".
// -----------------------------------------------------------------
getAllIDs("./jsonData", "dataUser.json", "dataUser", "dataUserIDs");

// Create/Update "dataProduct.json" data file in "./jsonData" directory.
// ----------------------------------------------------------------------
createUpdateJsonData(
  "./jsonData",
  "dataProduct.json",
  "dataProduct",
  createDataProductArr,
  25
);

// Get all product IDs in "./jsonData/dataProduct.json" and create a new
// field "dataProductIDs" in "./jsonData/IDs.json".
// ----------------------------------------------------------------------
getAllIDs("./jsonData", "dataProduct.json", "dataProduct", "dataProductIDs");

// Create/Update "dataTransaction.json" data file in "./jsonData" directory.
// --------------------------------------------------------------------------
createUpdateJsonData(
  "./jsonData",
  "dataTransaction.json",
  "dataTransaction",
  createDataTransactionArr,
  550
);

// Get all transaction IDs in "./jsonData/dataTransaction.json" and
// create a new field "dataTransactionIDs" in "./jsonData/IDs.json".
// ------------------------------------------------------------------
getAllIDs(
  "./jsonData",
  "dataTransaction.json",
  "dataTransaction",
  "dataTransactionIDs"
);

// Create/Update "dataProductStat.json" data file in "./jsonData" directory.
// --------------------------------------------------------------------------
createUpdateJsonData(
  "./jsonData",
  "dataProductStat.json",
  "dataProductStat",
  createDataProductStat,
  25
);

// Create/Update "dataOverallStat.json" data file in "./jsonData" directory.
// --------------------------------------------------------------------------
createUpdateJsonData(
  "./jsonData",
  "dataOverallStat.json",
  "dataOverallStat",
  createDataOverallStat,
  null
);

// Create/Update "dataAffiliateStat.json" data file in "./jsonData" directory.
// --------------------------------------------------------------------------
createUpdateJsonData(
  "./jsonData",
  "dataAffiliateStat.json",
  "dataAffiliateStat",
  createDataAffiliateStatArr,
  50
);
