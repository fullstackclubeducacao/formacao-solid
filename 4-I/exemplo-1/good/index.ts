// Aplicação do ISP: Interfaces segregadas e específicas
// Cada interface representa uma responsabilidade específica

interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

// Trabalhador humano - implementa todas as interfaces que precisa
class HumanWorker implements Workable, Eatable, Sleepable {
  work(): void {
    console.log("Humano trabalhando...");
  }

  eat(): void {
    console.log("Humano comendo...");
  }

  sleep(): void {
    console.log("Humano dormindo...");
  }
}

// Robô - implementa APENAS o que faz sentido para ele
class RobotWorker implements Workable {
  work(): void {
    console.log("Robô trabalhando...");
  }
}

// Funções específicas que usam apenas as interfaces necessárias
function manageWork(worker: Workable): void {
  worker.work();
}

function manageBreak(worker: Eatable & Sleepable): void {
  worker.eat();
  worker.sleep();
}

// Teste
const human = new HumanWorker();
manageWork(human); // Funciona
manageBreak(human); // Funciona

const robot = new RobotWorker();
manageWork(robot); // Funciona
// manageBreak(robot); // Erro de compilação! Não compila, o que é bom!

console.log("\nTodos os workers podem trabalhar:");
[human, robot].forEach((worker) => manageWork(worker));
