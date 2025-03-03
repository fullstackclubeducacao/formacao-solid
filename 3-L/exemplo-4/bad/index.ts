class Order {
  protected id: string;
  protected status: string;

  constructor(id: string) {
    this.id = id;
    this.status = "Pending";
  }

  cancel(): void {
    if (this.status === "Shipped") {
      throw new Error("Não é possível cancelar um pedido que já tenha sido enviado.");
    }
    this.status = "Cancelled";
    console.log(`O pedido ${this.id} foi cancelado.`);
  }

  ship(): void {
    this.status = "Shipped";
    console.log(`O pedido ${this.id} foi enviado.`);
  }
}

class RegularOrder extends Order {
  // Herda todos os métodos da classe base
}

class DiscountedOrder extends Order {
  constructor(id: string) {
    super(id);
  }

  cancel(): void {
    throw new Error("Os pedidos com desconto não podem ser cancelados.");
  }
}

// Função para processar o cancelamento de um pedido
function processOrderCancellation(order: Order): void {
  try {
    order.cancel();
  } catch (error) {
    console.log(`Falha ao cancelar o pedido: ${error.message}`);
  }
}

const regularOrder = new RegularOrder("ORD123");
const discountedOrder = new DiscountedOrder("DISC456");

// Funciona corretamente para RegularOrder
processOrderCancellation(regularOrder); // O pedido ORD123 foi cancelado.

// Violação do LSP: DiscountedOrder não pode substituir Order sem alterar o comportamento
processOrderCancellation(discountedOrder); // Falha ao cancelar o pedido: Os pedidos com desconto não podem ser cancelados.