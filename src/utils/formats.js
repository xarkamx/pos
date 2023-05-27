import { PAYMENT_TYPE } from '../config/constants';

export function paymentType (paymentCode) {
  const types = PAYMENT_TYPE;
  const type = types.find((item) => parseInt(item.codigo, 10) === parseInt(paymentCode, 10));
  return type?.descripcion;
}