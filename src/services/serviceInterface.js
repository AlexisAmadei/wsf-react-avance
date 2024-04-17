class ServiceInterface {
    constructor() {
        if (this.constructor === ServiceInterface) {
            throw new Error("Cannot instantiate an interface");
        }
    }
    async create() {
        throw new Error("Method not implemented");
    }
    async fetch() {
        throw new Error("Method not implemented");
    }
    async delete() {
        throw new Error("Method not implemented");
    }
}