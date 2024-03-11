// The `assert { type: 'json' }` part specifies the import assertion
// to tell Node.js that the imported module is of type JSON.
// If you are using CommonJS syntax (with require), you don't need
// to worry about import assertions.

import dataUserJson from "./dataUser.json" assert { type: "json" };
import dataProductJson from "./dataProduct.json" assert { type: "json" };
import dataTransactionJson from "./dataTransaction.json" assert { type: "json" };
import dataProductStatJson from "./dataProductStat.json" assert { type: "json" };
import dataOverallStatJson from "./dataOverallStat.json" assert { type: "json" };
import dataAffiliateStatJson from "./dataAffiliateStat.json" assert { type: "json" };

export const { dataUser } = dataUserJson;
export const { dataProduct } = dataProductJson;
export const { dataTransaction } = dataTransactionJson;
export const { dataProductStat } = dataProductStatJson;
export const { dataOverallStat } = dataOverallStatJson;
export const { dataAffiliateStat } = dataAffiliateStatJson;

console.log("dataUser", dataUser.length);
console.log("dataProduct", dataProduct.length);
console.log("dataTransaction", dataTransaction.length);
console.log("dataProductStat", dataProductStat.length);
console.log("dataOverallStat", dataOverallStat.length);
console.log("dataAffiliateStat", dataAffiliateStat.length);
