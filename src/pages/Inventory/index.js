import CategoryIcon from '@mui/icons-material/Category';
import { QuickInventoryForm } from './components/QuickInventoryForm';
import { useInventory } from './hooks/useInventory';
import { InventoryTable } from './components/InventoryTable';
import { kValues, monthsSince } from '../../core/helpers';
import { refillRatio } from './components/utils';
import { CustomTable } from '../../components/tables/Table';
import { SmartGrid } from '../../components/Containers/SmartGrid';
import { useNav } from '../../hooks/useNav';
import { Money } from '../../components/Formats/FormatNumbers';

export function InventoryPage () {
  const { add, items } = useInventory();
  return (
    <SmartGrid container spacing={2}>
      <SmartGrid title='Inventario' item xs={12} md={8}>
        <QuickInventoryForm onSubmit={add} />
        <InventoryTable items={items} />
      </SmartGrid>
      <SmartGrid title='Materiales' icon={<CategoryIcon />} item xs={12} md={4}>

        <RequiredMaterials items={items} />
      </SmartGrid>

    </SmartGrid>
  );
};

function RequiredMaterials ({ items }) {
  const required = Object.values(requiredMaterialsList(items));
  const nav = useNav();
  required.sort((b, a) => {
    if (a.required > b.required) return 1;
    if (a.required < b.required) return -1;
    return 0;
  });
  return (
    <CustomTable content={required} titles={['Material', 'Requerido', 'Precio']} format={(item) => [
      item.name,
      kValues(item.required),
      <Money number={(item.price * item.required)} key={`price-${item.name}`} />
    ]}
      onClick={(item) => {
        nav(`/dashboard/insumos/${item.materialId}`);
      }}
    />
  );
}

function requiredMaterialsList (items) {
  const filtered = filterMaterials(items);
  return filtered.reduce((acc, item) => {
    item.materials.forEach((material) => {
      const { materialId, name, required, price } = material;

      if (acc[materialId]) {
        acc[materialId].required += required;
      } else {
        acc[materialId] = {
          materialId,
          name,
          required,
          price,
        };
      }
    });
    return acc;
  }, {});
}
function filterMaterials (items) {
  const months = monthsSince(new Date('2023-03-01'));
  const filtered = items?.map((item) => {
    const mediamPerMonth = Math.ceil(item.soldUnits / months);
    item.refill = refillRatio(item.inStock, mediamPerMonth);
    item.mediamPerMonth = mediamPerMonth;

    const total = (item.mediamPerMonth * 2) - item.inStock || 0;
    item.materials = item.materials?.map((material) => {
      const requiredTotal = total < 0 ? 0 : total;
      const required = Math.ceil(material.quantity * requiredTotal) * 1.30;
      return {
        ...material,
        required,
      };
    });
    return item;
  }).filter((item) => item.refill < 100 && item.mediamPerMonth > 0);
  return filtered ?? [];
}

