/* eslint eqeqeq: 0 */


export function optionalFn (callback) {
  return typeof callback === "function" ? callback : () => { };
}
/**
 * convierte un numero en una cadena de texto con formato de dinero.
 * @param float number
 */
export function numberToMoney (number) {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });
  number = Math.abs(number);
  return formatter.format(number);
}
export async function playAudio (url) {
  const audio = new Audio(url);
  return audio.play();
}
/**
 * Convierte una fecha al formato mexicano.
 * @param string dateString
 */
export function localeDate (dateString = null) {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
/**
 * Convierte una fecha a un formato valido para inputs
 * @param {*} dateString
 */
export function validInputDate (dateString = null) {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleString("sv", { timeZoneName: "short" }).substring(0, 10);
}
/**
 * Determina si el objeto esta vacio
 * @param {*} obj
 * @return boolean
 */
export function isObjectEmpty (obj) {
  // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}
/**
 *
 * @param string url
 */

/**
 * Genera una secuencia en base al limite asignado.
 * @param int limit
 * @param function iteration
 */
export function secuence (limit, iteration = null) {
  const result = [];
  for (let index = 0; index <= limit; index += 1) {
    result.push(optionalFn(iteration)(index, limit) || index);
  }
  return result;
}
/**
 * añade un 0 al inicio del numero
 * @param int places
 * @param number number
 */
export function numberPadStart (places, number) {
  return String(number).padStart(places, "0");
}
/**
 * obtiene la version actual del archivo
 * @return number
 */
export function currentVersion () {
  return Math.round(new Date(document.lastModified).getTime() / 1000);
}

/**
 * Determina si cierto valor esta entre dos numeros
 * @param float comp
 * @param float value1
 * @param float? value2
 *
 * @return boolean
 */
export function between (comp, value1, value2 = null) {
  value2 = value2 || value1;

  return comp > value1 && comp <= value2;
}


export function ObjectAppender (object) {
  const fd = new FormData();
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const index in object) {
    const item = object[index];
    fd.append(index, item);
  }
  return fd;
}
// https://es.stackoverflow.com/questions/62031/eliminar-signos-diacr%C3%ADticos-en-javascript-eliminar-tildes-acentos-ortogr%C3%A1ficos
export function deleteDiacritics (texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
/**
 * @return env url local o remota
 */
export function envURL () {
  return window.location.hostname === "localhost"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_API_URL;
}
