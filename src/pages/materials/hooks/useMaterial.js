import { useState } from 'react';
import { useValidate } from '../../../hooks/useValidate';
import { usePopUp } from '../../../context/PopUpContext';

const { useQuery } = require('react-query');
const { MaterialTransaction } = require('../../../utils/transactions/materialTransaction');

export function useMaterial () {
  const [loading, setLoading] = useState(false);
  const materialsTransactions = new MaterialTransaction();

  const { popUpAlert } = usePopUp()
  const { validate, errors } = useValidate({
    type: 'object',
    required: ['name', 'unit'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        errorMessage: 'El nombre debe tener al menos 3 caracteres',
      },
      unit: {
        type: 'string',
        errorMessage: 'Unidad no valida',
        enum: ['kg', 'g'],
      }
    }
  })
  const resp = useQuery('materials', () => materialsTransactions.getMaterials());
  const addMaterial = async (material) => {
    setLoading(true);
    const valid = validate(material);
    if (!valid) {
      setLoading(false);
      popUpAlert('Error', errors.name || errors.unit);
      return;
    }
    try {
      await materialsTransactions.addMaterial({
        name: material.name,
        unit: material.unit,
        description: material.name,
      });
      popUpAlert('success', 'Material agregado');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      popUpAlert('Error', e.message);
    }

    resp.refetch();
  };
  return {
    materials: resp.data,
    loading: resp.isLoading || loading,
    addMaterial,
  }
}

export function useMaterialProducts (id) {
  const materialsTransactions = new MaterialTransaction();
  const { popUpAlert } = usePopUp()
  const resp = useQuery('materialsProducts', () => {
    const productMaterials = materialsTransactions.getProductsByMaterialId(id)
    const material = materialsTransactions.getMaterialById(id)
    return Promise.all([productMaterials, material])
  });
  const addProduct = async (materialId, prodcutId, quantity) => {
    try {
      await materialsTransactions.addProductToMaterial(materialId, prodcutId, quantity);
    } catch (e) {
      popUpAlert('Error', e.message);
    }
    resp.refetch();
  }
  return {
    childProducts: resp?.data?.[0] ?? [],
    materialDetails: resp?.data?.[1] ?? {},
    loading: resp.isLoading,
    addProduct
  }
}