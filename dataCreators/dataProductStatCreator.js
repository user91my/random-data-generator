import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import mongodbIdGenerator from "../modules/mongodbIdGenerator.js";

// {cumulative days : boolean}
const cumulativeDaysMap = {
  31: true, // jan
  59: true, // feb (non-leap year)
  90: true, // mar
  120: true, // apr
  151: true, // may
  181: true, // june
  212: true, // jul
  243: true, // aug
  273: true, // sep
  304: true, // oct
  334: true, // nov
  365: true, // dec
};

// Generates an array of daily data in 2023.
// There are 365 elements in the "dailyDataCreator()" array :-
// [
//   { date: "2023-01-01", totalSales: 32, totalUnits: 30 },
//   { date: "2023-01-02", totalSales: 33, totalUnits: 19 },
//   .......... ,
//   { date: "2023-12-30", totalSales: 66, totalUnits: 36 },
//   { date: "2023-12-31", totalSales: 23, totalUnits: 4 }
// ]
const dailyDataCreator = () => {
  const dailyDataArr = [];
  for (
    let month = 1, day = 1, cumulativeDays = 1;
    cumulativeDays < 366;
    day++, cumulativeDays++
  ) {
    dailyDataArr.push({
      date: "2023".concat(
        `-${`${month}`.length === 1 ? "0" + month.toString() : month}`,
        `-${`${day}`.length === 1 ? "0" + day.toString() : day}`
      ),
      totalSales: faker.number.int({ min: 1, max: 10000 }), // Math.floor(Math.random() * (500 - 1 + 1)) + 1,
      totalUnits: faker.number.int({ min: 1, max: 100 }), // Math.floor(Math.random() * (100 - 1 + 1)) + 1,
    });
    if (cumulativeDaysMap[cumulativeDays]) {
      month++;
      day = 0;
    }
  }
  return dailyDataArr;
};

// Generates an array of monthly data in 2023 that is based on data
// aggregated from "dailyDataCreator()" array.
// The "dailyDataCreator()" array is passed as an argument ("dailyDataArr")
// into "monthlyDataCreator".
// There are 13 elements in the "monthlyDataCreator()" array AND the LAST
// one being a "yearlySalesTotal" and "yearlyTotalSoldUnits" summary.
// [
//   { month: "january", totalSales: 574, totalUnits: 93 },
//   .......... ,
//   { month: "december", totalSales: 23, totalUnits: 4 },
//   { yearlySalesTotal: 29528 , yearlyTotalSoldUnits, 2985 }
// ]
const monthlyDataCreator = (dailyDataArr) => {
  let yearlySalesTotal = 0;
  let yearlyTotalSoldUnits = 0;
  //
  const monthlySalesArr = []; // [{ totalSales: 8011 },{ totalSales: 8336 },...]
  for (
    let month = 1, totalSales = 0, cumulativeDays = 1;
    month < 13;
    cumulativeDays++
  ) {
    const dayTotalSales = dailyDataArr[cumulativeDays - 1]["totalSales"];
    totalSales = totalSales + dayTotalSales;
    if (cumulativeDaysMap[cumulativeDays]) {
      yearlySalesTotal += totalSales;
      monthlySalesArr.push({ totalSales });
      totalSales = 0;
      month++;
    }
  }
  // console.log(monthlySalesArr);

  const monthlyUnitsArr = []; // [{ totalUnits: 749 },{ totalUnits: 680 },...]
  for (
    let month = 1, totalUnits = 0, cumulativeDays = 1;
    month < 13;
    cumulativeDays++
  ) {
    const dayTotalUnits = dailyDataArr[cumulativeDays - 1]["totalUnits"];
    totalUnits = totalUnits + dayTotalUnits;
    if (cumulativeDaysMap[cumulativeDays]) {
      yearlyTotalSoldUnits += totalUnits;
      monthlyUnitsArr.push({ totalUnits });
      totalUnits = 0;
      month++;
    }
  }
  // console.log(monthlyUnitsArr);

  const monthlyMap = {
    0: "january",
    1: "february",
    2: "march",
    3: "april",
    4: "may",
    5: "june",
    6: "july",
    7: "august",
    8: "september",
    9: "october",
    10: "november",
    11: "december",
  };
  const monthlyDataArr = [];
  for (let month = 0; month < 12; month++) {
    monthlyDataArr.push({
      month: monthlyMap[month],
      totalSales: monthlySalesArr[month]["totalSales"],
      totalUnits: monthlyUnitsArr[month]["totalUnits"],
    });
  }

  monthlyDataArr.push({ yearlySalesTotal, yearlyTotalSoldUnits });

  return monthlyDataArr;
};

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const createDataProductStat = () => {
  const dataProductFilePath = path.resolve("./jsonData/dataProduct.json");
  const jsonProductData = fs.existsSync(dataProductFilePath)
    ? JSON.parse(fs.readFileSync(dataProductFilePath, "utf-8"))
    : {};
  if (!Object.keys(jsonProductData).length) {
    console.log("No products available");
    return;
  }

  const dataProductStatArr = jsonProductData["dataProduct"].reduce(
    (productArr, product) => {
      const createdDailyDataArr = dailyDataCreator();
      const createdMonthlyDataArr = monthlyDataCreator(createdDailyDataArr);
      const yearlySummary = createdMonthlyDataArr.at(-1);

      productArr.push({
        _id: mongodbIdGenerator(1)[0],
        productId: product._id,
        yearlySalesTotal: yearlySummary["yearlySalesTotal"],
        yearlyTotalSoldUnits: yearlySummary["yearlyTotalSoldUnits"],
        monthlyData: createdMonthlyDataArr.slice(0, -1),
        dailyData: createdDailyDataArr,
      });
      return productArr;
    },
    []
  );

  return dataProductStatArr;
};
// console.log(createDataProductStat());

export default createDataProductStat;
