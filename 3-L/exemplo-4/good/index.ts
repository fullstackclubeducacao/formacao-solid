interface IOrder {
  cancel(): void;
  ship(): void;
}

class RegularOrder implements IOrder {
  private id: string;
  private status: string;

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

class DiscountedOrder implements IOrder {
  private id: string;
  private status: string;

  constructor(id: string) {
    this.id = id;
    this.status = "Pending";
  }

  cancel(): void {
    throw new Error("Os pedidos com desconto não podem ser cancelados.");
  }

  ship(): void {
    this.status = "Shipped";
    console.log(`Order ${this.id} has been shipped.`);
  }
}

// Função para processar o cancelamento de um pedido
function processOrderCancellation(order: IOrder): void {
  try {
    order.cancel();
  } catch (error) {
    console.log(`Failed to cancel order: ${error.message}`);
  }
}

const regularOrder = new RegularOrder("ORD123");
const discountedOrder = new DiscountedOrder("DISC456");

// Funciona corretamente para RegularOrder
processOrderCancellation(regularOrder); // O pedido ORD123 foi cancelado.

// Funciona corretamente para DiscountedOrder
processOrderCancellation(discountedOrder); // Falha ao cancelar o pedido: Os pedidos com desconto não podem ser cancelados.