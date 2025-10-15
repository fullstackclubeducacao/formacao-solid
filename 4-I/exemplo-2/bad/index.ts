// Violação do ISP: Interface de documento com muitas responsabilidades
// Força implementações a lidarem com operações que podem não precisar

interface OurDocument {
  // Operações básicas
  open(): void;
  close(): void;
  save(): void;

  // Operações de edição
  edit(content: string): void;
  undo(): void;
  redo(): void;

  // Operações de compartilhamento
  share(email: string): void;
  export(format: string): void;

  // Operações de versionamento
  createVersion(): void;
  rollback(version: number): void;
}

// Documento simples - PROBLEMA: precisa implementar tudo mesmo sem precisar
class SimpleTextDocument implements OurDocument {
  private content: string = "";

  open(): void {
    console.log("Abrindo documento de texto simples");
  }

  close(): void {
    console.log("Fechando documento");
  }

  save(): void {
    console.log("Salvando documento");
  }

  edit(content: string): void {
    this.content = content;
    console.log("Editando documento:", content);
  }

  // Não suporta undo/redo mas é forçado a implementar
  undo(): void {
    throw new Error("Documento simples não suporta undo");
  }

  redo(): void {
    throw new Error("Documento simples não suporta redo");
  }

  // Não suporta compartilhamento mas é forçado a implementar
  share(email: string): void {
    throw new Error("Documento simples não suporta compartilhamento");
  }

  export(format: string): void {
    throw new Error("Documento simples não suporta exportação");
  }

  // Não suporta versionamento mas é forçado a implementar
  createVersion(): void {
    throw new Error("Documento simples não suporta versionamento");
  }

  rollback(version: number): void {
    throw new Error("Documento simples não suporta rollback");
  }
}

// Documento colaborativo - usa tudo
class CollaborativeDocument implements OurDocument {
  private content: string = "";
  private history: string[] = [];
  private currentVersion: number = 0;

  open(): void {
    console.log("Abrindo documento colaborativo");
  }

  close(): void {
    console.log("Fechando documento colaborativo");
  }

  save(): void {
    console.log("Salvando documento colaborativo");
  }

  edit(content: string): void {
    this.history.push(this.content);
    this.content = content;
    console.log("Editando documento colaborativo:", content);
  }

  undo(): void {
    if (this.history.length > 0) {
      this.content = this.history.pop()!;
      console.log("Desfazendo alteração");
    }
  }

  redo(): void {
    console.log("Refazendo alteração");
  }

  share(email: string): void {
    console.log(`Compartilhando documento com ${email}`);
  }

  export(format: string): void {
    console.log(`Exportando documento para formato ${format}`);
  }

  createVersion(): void {
    this.currentVersion++;
    console.log(`Criando versão ${this.currentVersion}`);
  }

  rollback(version: number): void {
    console.log(`Revertendo para versão ${version}`);
  }
}

// Teste
const simpleDoc = new SimpleTextDocument();
simpleDoc.open();
simpleDoc.edit("Hello World");
simpleDoc.save();

try {
  simpleDoc.undo(); // Vai falhar!
} catch (error) {
  console.error("Erro:", (error as Error).message);
}

const collabDoc = new CollaborativeDocument();
collabDoc.open();
collabDoc.edit("Hello Team");
collabDoc.share("team@example.com");
collabDoc.createVersion();
