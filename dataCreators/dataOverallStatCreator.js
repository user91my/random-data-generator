import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import mongodbIdGenerator from "../modules/mongodbIdGenerator.js";

const createDataOverallStat = () => {
  const jsonProductStatFilePath = "./jsonData/dataProductStat.json";
  const jsonProductFilePath = "./jsonData/dataProduct.json";

  const jsonProductStatData = fs.existsSync(jsonProductStatFilePath)
    ? JSON.parse(fs.readFileSync(jsonProductStatFilePath, "utf-8"))
    : {};
  if (!Object.keys(jsonProductStatData).length) {
    console.log("No product stats available!");
    return;
  }
  const jsonProductData = fs.existsSync(jsonProductFilePath)
    ? JSON.parse(fs.readFileSync(jsonProductFilePath, "utf-8"))
    : {};
  if (!Object.keys(jsonProductData).length) {
    console.log("No products available!");
    return;
  }

  // There are 300 elements (12 months x 25 products) :-
  // [
  //   { month: "january", totalSales: 2633, totalUnits: 252 },
  //   { month: 'february', totalSales: 1839, totalUnits: 233 },
  //    ..... ,
  // ]
  const unsortedMonthlyData = jsonProductStatData.dataProductStat.reduce(
    (monthlyDataArr, { monthlyData }) => {
      monthlyDataArr.push(...monthlyData);
      return monthlyDataArr;
    },
    []
  );

  // There are 9125 elements (365 days x 25 products) :-
  // [
  //   { date: '2023-01-01', totalSales: 14, totalUnits: 13 },
  //   { date: '2023-01-02', totalSales: 54, totalUnits: 1 },
  //    ..... ,
  // ]
  const unsortedDailyData = jsonProductStatData.dataProductStat.reduce(
    (dailyDataArr, { dailyData }) => {
      dailyDataArr.push(...dailyData);
      return dailyDataArr;
    },
    []
  );

  // There are 12 elements (12 months). Each element contains the monthly
  // aggregated "totalSales" and "totalUnits" of all products :-
  //  {
  //     january: {
  //         month: 'january',
  //         totalSales: 63680,
  //         totalUnits: 6384,
  //         _id: '13fbc6cfafdff2fa7e88f45c'
  //     },
  //     ...... ,
  //  }
  const sortedMonthlyDataObj = unsortedMonthlyData.reduce(
    (monthlyDataObj, { month, totalSales, totalUnits }) => {
      const cumulativeSales = monthlyDataObj[month]
        ? monthlyDataObj[month]["totalSales"]
        : 0;
      const cumulativeUnits = monthlyDataObj[month]
        ? monthlyDataObj[month]["totalUnits"]
        : 0;
      const _id = monthlyDataObj["_id"] ? _id : mongodbIdGenerator(1)[0];

      monthlyDataObj[month] = {
        month,
        totalSales: cumulativeSales + totalSales,
        totalUnits: cumulativeUnits + totalUnits,
        _id: _id,
      };
      return monthlyDataObj;
    },
    {}
  );

  // There are 365 pairs of key-value (365 days). Each value contains the daily
  // aggregated "totalSales" and "totalUnits" of all products :-
  //  {
  //    '2023-01-01': { date: '2023-01-01', totalSales: 1996, totalUnits: 163 },
  //    '2023-01-02': { date: '2023-01-02', totalSales: 1684, totalUnits: 218 },
  //    ...... ,
  //  }
  const sortedDailyDataObj = unsortedDailyData.reduce(
    (dailyDataObj, { date, totalSales, totalUnits }) => {
      const cumulativeSales = dailyDataObj[date]
        ? dailyDataObj[date]["totalSales"]
        : 0;
      const cumulativeUnits = dailyDataObj[date]
        ? dailyDataObj[date]["totalUnits"]
        : 0;

      dailyDataObj[date] = {
        date,
        totalSales: cumulativeSales + totalSales,
        totalUnits: cumulativeUnits + totalUnits,
      };
      return dailyDataObj;
    },
    {}
  );

  const sortedMonthlyDataArr = Object.values(sortedMonthlyDataObj);
  const sortedDailyDataArr = Object.values(sortedDailyDataObj);

  // Aggregates yearly "totalSales" and "totalUnits" :-
  //    { totalSales: 734447, totalUnits: 73707 }
  const yearlyTotal = sortedMonthlyDataArr.reduce(
    (totalObj, { totalSales, totalUnits }) => {
      totalObj["totalSales"] = totalObj["totalSales"] + totalSales;
      totalObj["totalUnits"] = totalObj["totalUnits"] + totalUnits;
      return totalObj;
    },
    { totalSales: 0, totalUnits: 0 }
  );
  console.log(yearlyTotal);

  // Aggregates total sales during the year ("yearlySalesTotal")
  // according to category and compiles these categories into
  // "salesByCategoryObj" :-
  //   {
  //     accessories: 174309,
  //     clothing: 295689,
  //     misc: 235127,
  //     appliances: 29322
  //   }
  const salesByCategoryObj = {};
  const numberOfProducts = jsonProductData["dataProduct"].length;
  for (let productIndex = 0; productIndex < numberOfProducts; productIndex++) {
    const category = jsonProductData["dataProduct"][productIndex]["category"];
    const yearlySalesTotal =
      jsonProductStatData["dataProductStat"][productIndex]["yearlySalesTotal"];
    let cumulativeSalesByCategory = salesByCategoryObj[category]
      ? salesByCategoryObj[category]
      : 0;
    cumulativeSalesByCategory = cumulativeSalesByCategory + yearlySalesTotal;
    salesByCategoryObj[category] = cumulativeSalesByCategory;
  }
  console.log(salesByCategoryObj);

  return [
    {
      totalCustomers: faker.number.int({ min: 1000, max: 3500 }),
      yearlySalesTotal: yearlyTotal.totalSales,
      yearlyTotalSoldUnits: yearlyTotal.totalUnits,
      year: 2023,
      monthlyData: sortedMonthlyDataArr,
      dailyData: sortedDailyDataArr,
      salesByCategory: {
        appliances: salesByCategoryObj["appliances"],
        clothing: salesByCategoryObj["clothing"],
        accessories: salesByCategoryObj["accessories"],
        misc: salesByCategoryObj["misc"],
      },
      _id: mongodbIdGenerator(1)[0],
    },
  ];
};

// createDataOverallStat();
export default createDataOverallStat;
