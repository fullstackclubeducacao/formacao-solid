import DataProcessor from "./data-processor";

const processor = new DataProcessor();
processor.load("filename")
processor.validate()
processor.calculateStatistics()