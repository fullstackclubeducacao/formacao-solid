class PurchaseOrderDbEntity {
    id: string;
    customerID: string;

    constructor(id: string, customerID: string) {
        this.id = id;
        this.customerID = customerID;
    }
}

class CustomerDbEntity {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    getFullName(): string {
        return this.name;
    }
}

interface PurchaseOrderOutputData {
    orderId: string;
    customerID: string;
    customerName: string;
}

class GetPurchaseOrderService {
    execute(purchaseOrderId: string): PurchaseOrderOutputData {
        //Lógica para buscar informações do pedido de compra
        console.log(`getting purchase order data`);
        const order = new PurchaseOrderDbEntity(purchaseOrderId, "customer-id");
        //Lógica para buscar um cliente do banco de dados
        const customer = new CustomerDbEntity(order.customerID, "Customer");
        return {
            orderId: order.id,
            customerID: order.customerID,
            customerName: customer.getFullName(),
        } as PurchaseOrderOutputData;
    }
}

const service = new GetPurchaseOrderService();
const frontendOutput = service.execute("purchase-order-id");
console.log(frontendOutput);