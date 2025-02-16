import { useState } from 'react';
import { useCState } from './useHooks';
import { useCheckoutOrder } from './useRequestedOrders';



export function useCheckout () {
  const [products, setProducts] = useCState({ items: [] });
  const [discount, setDiscount] = useState(0);
  const { addOrder, isLoading, orderId, error, clearOrder } = useCheckoutOrder();
  const subtotal = products.items.reduce((acc, cur) => acc + cur.amount, 0);
  const fullDiscount = setDiscountToAbsoluteValue(discount, subtotal)
  const total = subtotal - fullDiscount;

  const clear = () => {
    clearOrder();
    setProducts({ items: [] });
    setDiscount(0);
  };
  // a class for this return would be better
  return {
    products: products.items,
    add: (values) => {
      addFn({ values, setProducts, products })
    },
    update: (id, quantity) => updateFn(id, quantity, setProducts, products),
    onDelete: (id) => (
      onDeleteFn(id, setProducts, products)
    ),
    total,
    subtotal,
    setDiscount,
    isLoading,
    discount: fullDiscount,
    orderId,
    error,
    send: (clientId, payment, paymentMethod) => {
      sendFn({ clientId, payment, discount: fullDiscount, paymentMethod, total, products, createOrder: addOrder, clear })
    },
    clear
  }
}


function setDiscountToAbsoluteValue (discount, subtotal) {
  discount = discount || 0;
  let percentage = 0;
  if (Number.isNaN(-discount)) {
    discount = discount.replace(/%/, '')
    percentage = (discount / 100)
    discount = subtotal * percentage;
  }
  return discount;
}
function updateFn (id, quantity, callback, products) {

  const prod = products.items
  const index = prod.findIndex((product) => product.id === id);
  if (index !== -1) {
    prod[index].quantity = quantity;
    prod[index].amount = prod[index].price * quantity;
  }
  if (quantity <= 0 || Number.isNaN(-quantity)) return onDeleteFn(id);
  callback({ items: prod });
  return prod;
}
function onDeleteFn (id, callback, products) {
  const prod = products.items
  const index = prod.findIndex((product) => product.id === id);
  if (index !== -1) {
    prod.splice(index, 1);
  }
  callback({ items: prod });
}
function addFn ({ values, setProducts, products }) {
  const prod = products.items
  const index = prod.findIndex((product) => product.id === values.id);
  if (index !== -1) {
    prod[index].quantity += values.quantity;
    prod[index].amount += values.price * values.quantity;
  }
  else {
    prod.push(values);
  }
  setProducts({ items: prod });
}
function sendFn ({ clientId, payment, paymentMethod, discount, products, createOrder }) {
  createOrder({
    clientId,
    discount,
    partialPayment: payment,
    paymentType: paymentMethod,
    items: products.items.map(({ id, quantity }) => ({ productId: id, quantity }))
  })

}