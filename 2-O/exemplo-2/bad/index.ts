enum OutputType {
  Printer,
  CSV
}

interface CostReportData {
  from: Date
  to: Date
  items: Array<CostReportDataItem>
}

interface CostReportDataItem {
  area: string
  total: number
}

class ReportGenerator {
  generate(from: Date, to: Date, output: OutputType): void {
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
    switch (output) {
      case OutputType.Printer:
        this.generateText(costReportData)
        break;
      case OutputType.CSV:
        this.generateCSV(costReportData)
        break;
      default:
        throw new Error("output not supported")
    }
  }

  private generateText(costReportData: CostReportData) {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }
    const formatNumber = new Intl.NumberFormat('pt-BR', options)
    console.log(`Relatório de custos entre ${this.formatDateText(costReportData.from)} e ${this.formatDateText(costReportData.to)}`)
    for (const item of costReportData.items) {
      console.log(`Área: ${item.area} valor ${formatNumber.format(item.total)}`)
    }
  }

  private formatDateText(date: Date): string {
    return date.toLocaleDateString('pt-BR')
  }

  private generateCSV(costReportData: CostReportData) {
    console.log(`H,${this.formatDateCSV(costReportData.from)},${this.formatDateCSV(costReportData.to)},`)
    for (const item of costReportData.items) {
      console.log(`I,${item.area},${item.total}`)
    }
  }

  private formatDateCSV(date: Date): string {
    return date.toISOString().split('T')[0]
  }
}

function lineSeparator() {
  console.log("".padEnd(40, "="))
}

const reportGenerator = new ReportGenerator();
const fromDate = new Date("2024-01-01T00:00:00-03:00")
const toDate = new Date("2024-01-31T00:00:00-03:00")
reportGenerator.generate(fromDate, toDate, OutputType.Printer)
lineSeparator()
reportGenerator.generate(fromDate, toDate, OutputType.CSV)