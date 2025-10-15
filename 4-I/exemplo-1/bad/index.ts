// Violação do ISP: Interface "inchada" que força implementações desnecessárias
// Uma interface Worker que obriga todas as classes a implementarem métodos que talvez não usem

interface WorkerEmployee {
  work(): void;
  eat(): void;
  sleep(): void;
}

// Trabalhador humano - usa todos os métodos
class HumanWorker implements WorkerEmployee {
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

// Robô - PROBLEMA: é forçado a implementar eat() e sleep() que não fazem sentido
class RobotWorker implements WorkerEmployee {
  work(): void {
    console.log("Robô trabalhando...");
  }

  eat(): void {
    // Robôs não comem! Mas somos forçados a implementar
    throw new Error("Robôs não comem!");
  }

  sleep(): void {
    // Robôs não dormem! Mas somos forçados a implementar
    throw new Error("Robôs não dormem!");
  }
}

// Teste
function manageWorker(worker: WorkerEmployee): void {
  worker.work();
  worker.eat(); // Vai falhar para RobotWorker!
  worker.sleep(); // Vai falhar para RobotWorker!
}

const human = new HumanWorker();
manageWorker(human);

const robot = new RobotWorker();
try {
  manageWorker(robot); // Vai lançar exceções
} catch (error) {
  console.error("Erro:", (error as Error).message);
}
