// Violação do DIP: Classe de negócio depende diretamente de implementação de banco de dados
// OrderService depende diretamente de MySQLDatabase (baixo nível)

interface Order {
  id: string;
  customerId: string;
  total: number;
  items: string[];
}

// Implementação concreta de banco de dados MySQL
class MySQLDatabase {
  connect(): void {
    console.log("🔌 Conectando ao MySQL...");
  }

  query(sql: string): any {
    console.log(`📊 Executando query MySQL: ${sql}`);
    return [];
  }

  insert(table: string, data: any): void {
    console.log(`➕ Inserindo no MySQL (${table}):`, data);
  }

  update(table: string, id: string, data: any): void {
    console.log(`✏️  Atualizando no MySQL (${table}) id ${id}:`, data);
  }

  delete(table: string, id: string): void {
    console.log(`🗑️  Deletando do MySQL (${table}) id ${id}`);
  }

  disconnect(): void {
    console.log("🔌 Desconectando do MySQL...");
  }
}

// Serviço de alto nível - PROBLEMA: depende diretamente do MySQL
class OrderService {
  private database: MySQLDatabase; // Dependência direta da implementação concreta!

  constructor() {
    this.database = new MySQLDatabase(); // Acoplamento forte!
    this.database.connect();
  }

  createOrder(order: Order): void {
    console.log(`\n📦 Criando pedido ${order.id}`);

    // Validação de negócio
    if (order.total <= 0) {
      throw new Error("Total do pedido deve ser maior que zero");
    }

    // Salvando no banco - dependente do MySQL
    this.database.insert("orders", order);
    console.log("✅ Pedido criado com sucesso");
  }

  getOrder(orderId: string): Order | null {
    console.log(`\n🔍 Buscando pedido ${orderId}`);
    const result = this.database.query(`SELECT * FROM orders WHERE id = '${orderId}'`);
    return result.length > 0 ? result[0] : null;
  }

  updateOrder(orderId: string, updates: Partial<Order>): void {
    console.log(`\n✏️  Atualizando pedido ${orderId}`);
    this.database.update("orders", orderId, updates);
    console.log("✅ Pedido atualizado com sucesso");
  }

  deleteOrder(orderId: string): void {
    console.log(`\n🗑️  Deletando pedido ${orderId}`);
    this.database.delete("orders", orderId);
    console.log("✅ Pedido deletado com sucesso");
  }
}

// Teste
const orderService = new OrderService();

const order: Order = {
  id: "ORD-001",
  customerId: "CUST-123",
  total: 250.50,
  items: ["Produto A", "Produto B"],
};

orderService.createOrder(order);
orderService.getOrder("ORD-001");
orderService.updateOrder("ORD-001", { total: 300.00 });

console.log("\n❌ Problemas:");
console.log("- OrderService está acoplado ao MySQL");
console.log("- Impossível trocar para PostgreSQL, MongoDB sem modificar OrderService");
console.log("- Difícil de testar sem banco de dados real");
console.log("- Mudanças no MySQL podem quebrar OrderService");
