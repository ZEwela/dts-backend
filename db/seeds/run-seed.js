import { testData } from "../test-data/index.js";
import seed from "./seed.js";
import db from "../connection.js";

const runSeed = () => {
  return seed(testData)
    .then(() => {
      console.log("Seeding completed");
      db.end();
    })
    .catch((err) => {
      console.error("Error seeding database:", err);
      db.end();
    });
};

runSeed();
