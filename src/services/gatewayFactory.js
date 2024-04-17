function doSynchro() {
    const toSync = [];
    window.addEventListener("online", async () => {
        while (toSync.length) {
            const { action, params } = toSync.shift();
            await action(...params);
        }
    });
    return {
        addToSync: (action, params) => {
            toSync.push({ action, params });
        }
    };
}

class GatewayService {
    constructor(serviceLocalStorage, serviceBackend) {
        this.serviceLocalStorage = serviceLocalStorage;
        this.serviceBackend = serviceBackend;
        this.syncExec = doSynchro();
    }

    async fetch() {
        if (navigator.onLine) {
            const results = await this.serviceBackend.getProducts();
            await this.serviceLocalStorage.sync(results);
            return results;
        }
        return this.serviceLocalStorage.getProducts();
    }

    async create(product) {
        if (navigator.onLine) {
            const newProduct = await this.serviceBackend.addProduct(product);
            return this.serviceLocalStorage.addProduct(newProduct);
        }
        this.syncExec.addToSync(this.serviceBackend.addProduct, [product]);
        return this.serviceLocalStorage.addProduct(product);
    }

    async delete(productToDelete) {
        if (navigator.onLine) {
            await this.serviceBackend.delete(productToDelete);
            return this.serviceLocalStorage.delete(productToDelete);
        }
        this.syncExec.addToSync(this.serviceBackend.deleteProduct, [productToDelete]);
        return this.serviceLocalStorage.delete(productToDelete);
    }
}

export default function gatewayFactory(serviceLocalStorage, serviceBackend) {
    return new GatewayService(serviceLocalStorage, serviceBackend);
}