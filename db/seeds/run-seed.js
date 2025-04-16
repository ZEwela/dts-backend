import { testData } from "../test-data/index.js";
import seed from "./seed.js";
import { developmentData } from "../development-data/index.js";
import db from "../connection.js";
import dotenv from "dotenv";
dotenv.config();

const data =
  process.env.NODE_ENV === "development" ? developmentData : testData;

const runSeed = () => {
  return seed(data)
    .then(() => {
      console.log(`Seeding completed for ${process.env.NODE_ENV}`);
      db.end();
    })
    .catch((err) => {
      console.error("Error seeding database:", err);
      db.end();
    });
};

runSeed();
