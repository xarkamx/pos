import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class MaterialTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
  }


  async getMaterials () {
    return this.get('/materials');
  }

  async getProductsByMaterialId (id) {
    return this.get(`/materials/${id}/products`);
  }

  async addProductToMaterial (materialId, productId, qty) {
    console.log(materialId, productId, qty);
    return this.post(`/materials/${materialId}/products`, [{
      productId,
      quantity: qty
    }]);
  }

  async getMaterialById (id) {
    return this.get(`/materials/${id}`);
  }

  async addMaterial (material) {
    return this.post('/materials', {
      name: material.name,
      unit: material.unit,
      description: material.description,
      price: 0,
    });
  }



}