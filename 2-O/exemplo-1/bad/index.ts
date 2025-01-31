class Employee {
  public type: string
  public monthlySalary: number;
  public hourlyRate: number;
  public hoursWorked: number;
  public contractAmount: number;
  public bonus: number;

  constructor(type: string, monthlySalary: number, hourlyRate: number, hoursWorked: number, contractAmount: number, bonus: number = 0) {
    this.type = type;
    this.monthlySalary = monthlySalary;
    this.hourlyRate = hourlyRate;
    this.hoursWorked = hoursWorked;
    this.contractAmount = contractAmount;
    this.bonus = bonus;
  }
}

class EmployeeSalaryCalculator {
  calculateSalary(employee: Employee): number {
    if (employee.type === "full-time") { //CLT ou PJ
      return employee.monthlySalary;
    } else if (employee.type === "part-time") { //Serviço - Consultoria
      return employee.hourlyRate * employee.hoursWorked;
    } else if (employee.type === "contract") { //Contrato
      return employee.contractAmount / 12;
    } else if (employee.type === "sales") { //Bonus por venda
      return employee.monthlySalary + employee.bonus;
    }
    throw new Error("Unknown employee type");
  }
}

const employee_1 = new Employee("full-time", 1000, 0, 0, 0);
const employee_2 = new Employee("part-time", 0, 10, 40, 0);
const employee_3 = new Employee("contract", 0, 0, 0, 1000);
const employee_4 = new Employee("sales", 1000, 0, 0, 0, 100);

const calculator = new EmployeeSalaryCalculator();
console.log(`Employee ${employee_1.type} salary: ${calculator.calculateSalary(employee_1)}`);
console.log(`Employee ${employee_2.type} salary: ${calculator.calculateSalary(employee_2)}`);
console.log(`Employee ${employee_3.type} salary: ${calculator.calculateSalary(employee_3)}`);
console.log(`Employee ${employee_4.type} salary: ${calculator.calculateSalary(employee_4)}`);