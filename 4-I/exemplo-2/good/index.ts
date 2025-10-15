// Aplicação do ISP: Interfaces segregadas por funcionalidade
// Cada interface representa um conjunto coeso de operações

// Operações básicas de documento
interface BasicDocument {
  open(): void;
  close(): void;
  save(): void;
}

// Operações de edição
interface EditableDocument extends BasicDocument {
  edit(content: string): void;
}

// Operações de histórico
interface HistoryDocument {
  undo(): void;
  redo(): void;
}

// Operações de compartilhamento
interface ShareableDocument {
  share(email: string): void;
  export(format: string): void;
}

// Operações de versionamento
interface VersionedDocument {
  createVersion(): void;
  rollback(version: number): void;
}

// Documento simples - implementa apenas o necessário
class SimpleTextDocument implements EditableDocument {
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

  getContent(): string {
    return this.content;
  }
}

// Documento com histórico - adiciona funcionalidade de undo/redo
class DocumentWithHistory
  implements EditableDocument, HistoryDocument {
  private content: string = "";
  private history: string[] = [];
  private future: string[] = [];

  open(): void {
    console.log("Abrindo documento com histórico");
  }

  close(): void {
    console.log("Fechando documento");
  }

  save(): void {
    console.log("Salvando documento");
  }

  edit(content: string): void {
    this.history.push(this.content);
    this.content = content;
    this.future = []; // Limpa o histórico de redo
    console.log("Editando documento:", content);
  }

  undo(): void {
    if (this.history.length > 0) {
      this.future.push(this.content);
      this.content = this.history.pop()!;
      console.log("Desfazendo alteração. Conteúdo atual:", this.content);
    }
  }

  redo(): void {
    if (this.future.length > 0) {
      this.history.push(this.content);
      this.content = this.future.pop()!;
      console.log("Refazendo alteração. Conteúdo atual:", this.content);
    }
  }
}

// Documento colaborativo completo - implementa todas as funcionalidades
class CollaborativeDocument
  implements
  EditableDocument,
  HistoryDocument,
  ShareableDocument,
  VersionedDocument {
  private content: string = "";
  private history: string[] = [];
  private future: string[] = [];
  private versions: Map<number, string> = new Map();
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
    this.future = [];
    console.log("Editando documento colaborativo:", content);
  }

  undo(): void {
    if (this.history.length > 0) {
      this.future.push(this.content);
      this.content = this.history.pop()!;
      console.log("Desfazendo alteração");
    }
  }

  redo(): void {
    if (this.future.length > 0) {
      this.history.push(this.content);
      this.content = this.future.pop()!;
      console.log("Refazendo alteração");
    }
  }

  share(email: string): void {
    console.log(`Compartilhando documento com ${email}`);
  }

  export(format: string): void {
    console.log(`Exportando documento para formato ${format}`);
  }

  createVersion(): void {
    this.versions.set(this.currentVersion, this.content);
    this.currentVersion++;
    console.log(`Criando versão ${this.currentVersion}`);
  }

  rollback(version: number): void {
    const versionContent = this.versions.get(version);
    if (versionContent !== undefined) {
      this.content = versionContent;
      console.log(`Revertido para versão ${version}`);
    }
  }
}

// Funções que trabalham com interfaces específicas
function editDocument(doc: EditableDocument, content: string): void {
  doc.edit(content);
  doc.save();
}

function shareDocument(doc: ShareableDocument, email: string): void {
  doc.share(email);
}

function manageHistory(doc: HistoryDocument): void {
  console.log("\nTestando histórico:");
  doc.undo();
  doc.redo();
}

// Teste
console.log("=== Documento Simples ===");
const simpleDoc = new SimpleTextDocument();
simpleDoc.open();
editDocument(simpleDoc, "Hello World");
// manageHistory(simpleDoc); // Erro de compilação! Não compila, o que é bom!

console.log("\n=== Documento com Histórico ===");
const historyDoc = new DocumentWithHistory();
historyDoc.open();
editDocument(historyDoc, "First version");
editDocument(historyDoc, "Second version");
manageHistory(historyDoc);

console.log("\n=== Documento Colaborativo ===");
const collabDoc = new CollaborativeDocument();
collabDoc.open();
editDocument(collabDoc, "Hello Team");
collabDoc.createVersion();
shareDocument(collabDoc, "team@example.com");
collabDoc.export("PDF");
manageHistory(collabDoc);
