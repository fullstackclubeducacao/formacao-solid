import DataLoader from "./data-loader";
import DataValidator from "./data-validator";
import DataCalculator from "./data-calculator";

const loader = new DataLoader();
const fileContent = loader.load("filename")
const validator = new DataValidator();
validator.validate(fileContent)
const statisticsCalculator = new DataCalculator();
statisticsCalculator.calculate(fileContent);