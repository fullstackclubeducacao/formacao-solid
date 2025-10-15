// Aplicação do DIP: Repository Pattern com inversão de dependência
// OrderService depende da abstração (OrderRepository), não da implementação

interface Order {
  id: string;
  customerId: string;
  total: number;
  items: string[];
}

// Abstração - o contrato do repositório
interface OrderRepository {
  save(order: Order): void;
  findById(orderId: string): Order | null;
  update(orderId: string, updates: Partial<Order>): void;
  delete(orderId: string): void;
}

// Implementação com MySQL - depende da abstração
class MySQLOrderRepository implements OrderRepository {
  private connected: boolean = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    console.log("🔌 [MySQL] Conectando ao banco...");
    this.connected = true;
  }

  save(order: Order): void {
    console.log(`➕ [MySQL] Salvando pedido ${order.id}`);
    console.log(`   Query: INSERT INTO orders VALUES (...)`, order);
  }

  findById(orderId: string): Order | null {
    console.log(`🔍 [MySQL] Buscando pedido ${orderId}`);
    console.log(`   Query: SELECT * FROM orders WHERE id = '${orderId}'`);
    // Simulando retorno
    return null;
  }

  update(orderId: string, updates: Partial<Order>): void {
    console.log(`✏️  [MySQL] Atualizando pedido ${orderId}`);
    console.log(`   Query: UPDATE orders SET ... WHERE id = '${orderId}'`, updates);
  }

  delete(orderId: string): void {
    console.log(`🗑️  [MySQL] Deletando pedido ${orderId}`);
    console.log(`   Query: DELETE FROM orders WHERE id = '${orderId}'`);
  }
}

// Implementação com MongoDB - depende da mesma abstração
class MongoDBOrderRepository implements OrderRepository {
  constructor() {
    console.log("🔌 [MongoDB] Conectando ao banco...");
  }

  save(order: Order): void {
    console.log(`➕ [MongoDB] Salvando pedido ${order.id}`);
    console.log(`   db.orders.insertOne(...)`, order);
  }

  findById(orderId: string): Order | null {
    console.log(`🔍 [MongoDB] Buscando pedido ${orderId}`);
    console.log(`   db.orders.findOne({ _id: '${orderId}' })`);
    return null;
  }

  update(orderId: string, updates: Partial<Order>): void {
    console.log(`✏️  [MongoDB] Atualizando pedido ${orderId}`);
    console.log(`   db.orders.updateOne({ _id: '${orderId}' }, { $set: ... })`, updates);
  }

  delete(orderId: string): void {
    console.log(`🗑️  [MongoDB] Deletando pedido ${orderId}`);
    console.log(`   db.orders.deleteOne({ _id: '${orderId}' })`);
  }
}

// Implementação em memória - útil para testes
class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  constructor() {
    console.log("🔌 [InMemory] Repositório em memória inicializado");
  }

  save(order: Order): void {
    console.log(`➕ [InMemory] Salvando pedido ${order.id}`);
    this.orders.set(order.id, order);
  }

  findById(orderId: string): Order | null {
    console.log(`🔍 [InMemory] Buscando pedido ${orderId}`);
    return this.orders.get(orderId) || null;
  }

  update(orderId: string, updates: Partial<Order>): void {
    console.log(`✏️  [InMemory] Atualizando pedido ${orderId}`);
    const order = this.orders.get(orderId);
    if (order) {
      this.orders.set(orderId, { ...order, ...updates });
    }
  }

  delete(orderId: string): void {
    console.log(`🗑️  [InMemory] Deletando pedido ${orderId}`);
    this.orders.delete(orderId);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }
}

// Serviço de alto nível - depende da abstração
class OrderService {
  private repository: OrderRepository; // Dependência da interface!

  constructor(repository: OrderRepository) {
    this.repository = repository; // Injeção de dependência!
  }

  createOrder(order: Order): void {
    console.log(`\n📦 Criando pedido ${order.id}`);

    // Validação de negócio
    if (order.total <= 0) {
      throw new Error("Total do pedido deve ser maior que zero");
    }

    if (order.items.length === 0) {
      throw new Error("Pedido deve ter pelo menos um item");
    }

    // Salvando - não sabe qual implementação está sendo usada!
    this.repository.save(order);
    console.log("✅ Pedido criado com sucesso");
  }

  getOrder(orderId: string): Order | null {
    console.log(`\n🔍 Buscando pedido ${orderId}`);
    const order = this.repository.findById(orderId);

    if (order) {
      console.log("✅ Pedido encontrado:", order);
    } else {
      console.log("❌ Pedido não encontrado");
    }

    return order;
  }

  updateOrder(orderId: string, updates: Partial<Order>): void {
    console.log(`\n✏️  Atualizando pedido ${orderId}`);

    if (updates.total !== undefined && updates.total <= 0) {
      throw new Error("Total do pedido deve ser maior que zero");
    }

    this.repository.update(orderId, updates);
    console.log("✅ Pedido atualizado com sucesso");
  }

  deleteOrder(orderId: string): void {
    console.log(`\n🗑️  Deletando pedido ${orderId}`);
    this.repository.delete(orderId);
    console.log("✅ Pedido deletado com sucesso");
  }

  calculateDiscount(orderId: string, discountPercent: number): number {
    const order = this.repository.findById(orderId);
    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const discount = order.total * (discountPercent / 100);
    console.log(`💰 Desconto calculado: R$ ${discount.toFixed(2)}`);
    return discount;
  }
}

// Testes e demonstração
const order: Order = {
  id: "ORD-001",
  customerId: "CUST-123",
  total: 250.50,
  items: ["Produto A", "Produto B"],
};

console.log("=== Usando MySQL ===");
const mysqlRepo = new MySQLOrderRepository();
const orderServiceMySQL = new OrderService(mysqlRepo);
orderServiceMySQL.createOrder(order);
orderServiceMySQL.updateOrder("ORD-001", { total: 300.00 });

console.log("\n=== Usando MongoDB ===");
const mongoRepo = new MongoDBOrderRepository();
const orderServiceMongo = new OrderService(mongoRepo);
orderServiceMongo.createOrder(order);
orderServiceMongo.getOrder("ORD-001");

console.log("\n=== Usando InMemory (para testes) ===");
const inMemoryRepo = new InMemoryOrderRepository();
const orderServiceTest = new OrderService(inMemoryRepo);

orderServiceTest.createOrder(order);
const foundOrder = orderServiceTest.getOrder("ORD-001");
orderServiceTest.updateOrder("ORD-001", { total: 350.00 });

console.log("\n📊 Verificando pedidos em memória:");
console.log(`   Total de pedidos: ${inMemoryRepo.getAllOrders().length}`);

console.log("\n✅ Vantagens:");
console.log("- OrderService não conhece implementação de banco");
console.log("- Fácil trocar MySQL por MongoDB ou outro banco");
console.log("- Fácil testar com repositório em memória");
console.log("- Baixo acoplamento entre camadas");
console.log("- Segue o Repository Pattern");
