export default class DataProcessor {
    load(filename: string) {
        //Carrega conteúdo do arquivo
        console.log(`loading file ${filename}...`);
    }

    validate() {
        //valida os dados do arquivo
        console.log("validating file...");
    }

    calculateStatistics() {
        //calcula estatísticas com base nos dados do arquivo
        console.log("calculate statistics...");
    }
}