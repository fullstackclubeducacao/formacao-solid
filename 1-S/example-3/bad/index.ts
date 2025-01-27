class PurchaseOrderDbEntity {
    orderId: string;
    customerID: string;
    customerName: string;

    constructor(orderId: string,
        customerID: string,
        customerName: string
    ) {
        this.orderId = orderId;
        this.customerID = customerID;
        this.customerName = customerName;
    }
}

class GetPurchaseOrderService {
    execute(purchaseOrderId: string): PurchaseOrderDbEntity {
        //Lógica para buscar informações do pedido de compra
        console.log(`getting purchase order data`);
        //Lógica para buscar o nome do cliente do banco de dados
        const customerName = "customer-name";
        return new PurchaseOrderDbEntity(
            purchaseOrderId,
            "customer-id",
            customerName
        );
    }
}

const service = new GetPurchaseOrderService();
const frontendOutput = service.execute("purchase-order-id");
console.log(frontendOutput);