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

export function localeDateUTFMex (dateString = null) {
  const date = dateString ? new Date(dateString) : new Date();
  // add 4 hours to the date
  date.setHours(date.getHours() + 4);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
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

export function getLastMonday (date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff)).setHours(0, 0, 0, 0);
  return monday;
}

export function getEndOfDay (date) {
  return new Date(date).setHours(23, 59, 59, 999);
}

export function getNumberOfWeekOfYear (date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const milisecondsPerDay = 86400000;
  const pastDaysOfYear = (date - firstDayOfYear) / milisecondsPerDay;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return weekNumber;
}

export function getDatesByWeekNumber (weekNumber) {
  const year = new Date().getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (weekNumber - 1) * 7;
  const firstDayOfWeek = new Date(
    firstDayOfYear.setDate(firstDayOfYear.getDate() + pastDaysOfYear)
  );
  const lastDayOfWeek = new Date(
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
  );
  return {
    firstDayOfWeek,
    lastDayOfWeek,
  };
}

export function getFirstDayOfMonth (date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function objectToSerialize (param) {
  if (!param) {
    return "";
  }
  let keys = Object.keys(param),
    values = [];
  for (let k in keys) {
    let value =
      typeof param[keys[k]] === "object"
        ? JSON.stringify(param[keys[k]])
        : param[keys[k]];
    values.push(keys[k] + "=" + value);
  }
  return values.join("&");
}

export function median (data) {
  // trim mean
  const trim = 0.2;
  const sorted = [...data].sort((a, b) => a - b);
  const trimSize = Math.round(sorted.length * trim);
  const trimmed = sorted.slice(trimSize, sorted.length - trimSize);
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
}

export function monthsSince (date) {
  const today = new Date();
  const diff = (today.getTime() - date.getTime()) / 1000;
  const months = diff / (60 * 60 * 24 * 30);
  return months;
}

export function timeSince (date) {
  date = new Date(date);
  date.setHours(date.getHours() + 4);
  const today = new Date();
  const diff = (today.getTime() - date.getTime()) / 1000;
  const days = diff / (60 * 60 * 24);
  const hours = diff / (60 * 60);
  const minutes = diff / 60;
  const seconds = diff;
  if (days > 1) {
    return `${Math.round(days)} días`;
  } else if (hours > 1) {
    return `${Math.round(hours)} horas`;
  } else if (minutes > 1) {
    return `${Math.round(minutes)} minutos`;
  } else if (seconds > 1) {
    return `${Math.round(seconds)} segundos`;
  }
  return "0 segundos";
}

export function reverseIva (price) {
  return price - (price / 1.16);
}