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
    return this.post(`/materials/${materialId}/products`, [{
      productId,
      quantity: qty
    }]);
  }

  async delProductToMaterial (materialId, productId) {
    return this.delete(`/materials/${materialId}/products/${productId}`);
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

  async getInventory () {
    return this.get('/inventory/materials');
  }

  async addMaterialToInventory (materialId, qty) {
    return this.post('/inventory/materials', {
      materialId,
      quantity: qty
    });
  }

  async updateMaterial (id, material) {
    return this.put(`/materials/${id}`, material);
  }



}