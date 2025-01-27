interface CostReportData {
  from: Date
  to: Date
  items: Array<CostReportDataItem>
}

interface CostReportDataItem {
  area: string
  total: number
}

interface ReportOutput {
  generate(reportData: CostReportData): void
}

class PrinterOutput implements ReportOutput {

  generate(reportData: CostReportData) {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }
    const formatNumber = new Intl.NumberFormat('pt-BR', options)
    console.log(`Relatório de custos entre ${this.formatDate(reportData.from)} e ${this.formatDate(reportData.to)}`)
    for (const item of reportData.items) {
      console.log(`Área: ${item.area} valor ${formatNumber.format(item.total)}`)
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR')
  }
}

class CSVOutput implements ReportOutput {

  generate(reportData: CostReportData) {
    console.log(`H,${this.formatDate(reportData.from)},${this.formatDate(reportData.to)},`)
    for (const item of reportData.items) {
      console.log(`I,${item.area},${item.total}`)
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }
}

class PDFOutput implements ReportOutput {

  generate(reportData: CostReportData) {
    console.log("Gerando do PDF ...")
    console.log(reportData)
    //Lógica para gerar o PDF
  }
}

class ReportGenerator {
  generate(from: Date, to: Date, output: ReportOutput): void {
    //Lógica para buscar dados e processar o relatório
    const costReportData: CostReportData = {
      from,
      to,
      items: [
        {
          area: "Administrativo",
          total: 1000.00
        },
        {
          area: "Comercial",
          total: 5000.00
        }
      ]
    }
    output.generate(costReportData)
  }
}

function lineSeparator() {
  console.log("".padEnd(40, "="))
}

const reportGenerator = new ReportGenerator();
const fromDate = new Date("2024-01-01T00:00:00-03:00")
const toDate = new Date("2024-01-31T00:00:00-03:00")
reportGenerator.generate(fromDate, toDate, new PrinterOutput())
lineSeparator()
reportGenerator.generate(fromDate, toDate, new CSVOutput())
lineSeparator()
reportGenerator.generate(fromDate, toDate, new PDFOutput())