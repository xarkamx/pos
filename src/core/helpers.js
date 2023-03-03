/* eslint eqeqeq: 0*/

export class Helpers {
  objectToSerialize(param) {
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
  /**
   * @description convierte todos los inputs dentro de un objeto dom en un objecto de cadenas.
   * @param {*} dom
   * @returns object
   */
  inputsToObject(dom) {
    let inputs = dom.querySelectorAll("input,select,textarea"),
      pos = 0;
    let content = {};
    for (pos; pos < inputs.length; ++pos) {
      if (!inputs[pos].checkValidity()) {
        inputs[pos].value = "";
        inputs[pos].placeholder = "Faltante";
        return false;
      }
      var input = inputs[pos];
      var value;
      if (input.name === "" || input.value === "") {
        continue;
      }
      if (input.type === "file") {
        value = input.files;
        //input.name
      } else if (input.type === "checkbox") {
        value = input.checked;
      } else if (input.type === "radio") {
        if (input.checked === false) {
          continue;
        }
        value = input.value;
      } else {
        /*if (input.value === '') {
                    continue;
                }*/
        value = input.value.replace(/,/, ".");
        value = encodeURIComponent(value);
      }
      if (input === undefined || typeof input !== "object") {
        continue;
      }
      if (!inputs[pos].checkValidity()) {
        return false;
      }
      if (content[input.name] === undefined) {
        content[input.name] = value;
      } else if (typeof content[input.name] === "object") {
        content[input.name].push(value);
      } else {
        let val = content[input.name];
        content[input.name] = [];
        content[input.name].push(val);
        content[input.name].push(value);
      }
    }
    return content;
  }
  error(msg) {
    document.body.innerHTML = msg.responseText;
    throw msg;
  }
  removeBySelector(selector) {
    let killList = document.querySelectorAll(selector);
    let pos = 0;
    for (pos; pos < killList.length; ++pos) {
      let killItem = killList[pos];
      killItem.parentElement.removeChild(killItem);
    }
  }
  decodeUriObject(obj) {
    let decoded = {};
    for (let key in obj) {
      decoded[key] = decodeURI(obj[key]);
    }
    return decoded;
  }
  /**
   *
   * @param {*} arrg
   * @param {*} key
   * @param {*} value
   */
  findInArrayOfObjects(arrg, key, value) {
    for (let index in arrg) {
      let item = arrg[index];
      if (item[key] === value) {
        return item;
      }
    }
  }
  fileTo64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((load, reject) => {
      reader.onload = load;
      reader.onerror = reject;
    });
  }
  fileToImage(file, dom) {
    return this.fileTo64(file).then((ev) => {
      let img = document.createElement("img");
      img.src = ev.target.result;
      return new Promise((load, reject) => {
        let data = {
          img,
          file,
        };
        load(data);
      });
    });
  }
  getBodyToken() {
    return document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
  }
  merge(...objs) {
    let finalObject = {};
    for (let index in objs) {
      let obj = objs[index];
      for (let keys in obj) {
        if (obj[keys] !== "") {
          finalObject[keys] = obj[keys];
        }
      }
    }
    return finalObject;
  }
  /**
   * busca un elemento en un arreglo y lo elimina.
   * @param {*} args
   * @param {*} key
   * @param {*} value
   */
  searchAndDestroy(args, key, value) {
    let filter = args.filter((item, index) => {
      return item[key] !== value;
    });
    return filter;
  }
  searchAndInsert(args, where, val, key, insert) {
    return args.map((item, index) => {
      if (item[where] === val) {
        item[key] = insert;
      }
      return item;
    });
  }
  /**
   * Permite buscar cualquier elemento en base a una propiedad.
   * @param {*} args
   * @param string key
   * @param {*} value
   * @returns Array
   */
  searchByKey(args, key, value) {
    if (value === undefined) {
      return [];
    }
    value = `${value}`;
    let values = value.split(/,/);
    let filter = args.filter((item, index) => {
      for (let pos in values) {
        let val = values[pos];
        if (item[key] == val) return true;
      }
      return false;
    });
    return filter;
  }
  /**
   * Permite buscar en un objeto
   * @param {*} args
   * @param {*} query
   */
  searchInObject(args, query) {
    return args.filter((item, index) => {
      for (let key in item) {
        if (item[key] == null) {
          continue;
        }
        let data = item[key].toString();
        let regQuery = RegExp(query, "i");
        let match = data.match(regQuery);
        if (match !== null) {
          return true;
        }
      }
      return false;
    });
  }

  getObjectTitles(obj) {
    let result = [];
    for (let key in obj) {
      result.push({ key });
    }
    return result;
  }
  flatMultilevel(multiLevelObject) {
    let flatObject = {};
    for (let key in multiLevelObject) {
      let item = multiLevelObject[key];
      flatObject[key] = item;
      flatObject = this.merge(flatObject, item);
    }
    return flatObject;
  }
  searchAndGetIndex(arr, key, query) {
    for (let index in arr) {
      let item = arr[index];
      if (item[key] === query) {
        return index;
      }
    }
    return -1;
  }
  searchCommonAndUpdate(contentID, newData, currentData) {
    let data = this.flatMultilevel(newData);
    let index = this.searchAndGetIndex(currentData, "id", contentID);
    for (let key in data) {
      currentData[index][key] =
        currentData[index][key] !== undefined
          ? currentData[index][key]
          : data[key];
    }
    return currentData;
  }
  splitOnUpperCase($text) {
    $text = $text.split(/(?=[A-Z])/);
    return $text.join(" ");
  }
  /**
   * @description Obtiene el ultimo item del array
   * @param {array} arr
   */
  lastItem(arr) {
    return arr[arr.length - 1];
  }
  /**
   * @description Ordena un objeto por alguno de sus elementos.
   * @param {object} data
   * @param {string} by
   * @param {string} direction asc|desc
   */
  orderBy(data, by, direction = "asc") {
    data = this.cloneArray(data);
    return data.sort((a, b) => {
      if (a[by] === null) {
        return 1;
      }
      if (b[by] === null) {
        return 1;
      }
      if (typeof a[by] === "string") {
        return direction === "asc"
          ? a[by].localeCompare(b[by])
          : b[by].localeCompare(a[by]);
      }
      return direction === "asc" ? a[by] - b[by] : b[by] - a[by];
    });
  }
  cloneArray(data) {
    data = { ...data };
    data = Object.values(data);
    return data;
  }
  /**
   * Calcula los años que han pasado desde una fecha dada.
   * @param Date fecha
   */
  dateToYears(fecha) {
    let now = new Date();
    let born = new Date(fecha);
    let diff = now - born;
    let age_dt = new Date(diff);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }
  /**
   * Calcula los dias que han pasado desde una fecha dada.
   * @param Date time
   */
  getTimePassed(time) {
    let currentDate = new Date();
    let passDate = new Date(time);
    let ms = currentDate - passDate;
    let days = ms / 1000 / 3600 / 24;
    let hours = (days - Math.floor(days)) * 24;
    let mins = Math.ceil((hours - Math.floor(hours)) * 60);
    return {
      days: Math.floor(days),
      hours: Math.floor(hours),
      mins: Math.floor(mins),
    };
  }
  /**
   * @description Separa una cadena con formato de Path en sus componente individuales
   * @param {string} path
   * @returns {object} {folder,fileName,ext}
   */
  pathSlicer(path) {
    let fileName = this.lastItem(path.split(/\//));
    let ext = this.lastItem(fileName.split(/\./));
    let folder = path.replace(fileName, "");
    folder = folder.replace(/\/\//, "/");
    return { fileName, ext, folder };
  }
  /**
   * Revisa si la cadena es un json valido y de ser el caso
   *  regresa el objeto del json
   * @param string str
   * @return object || boolean
   */
  isJsonString(str) {
    try {
      var json = JSON.parse(str);
      return json;
    } catch (e) {
      return false;
    }
  }
  /* @description Compara dos arreglos y devuelve true si son iguales
   * @param {array} array1
   * @param {array} array2
   * @returns boolean
   */
  compareArrays(array1, array2, key = null) {
    if (!array1 || !array2) return;

    let result;

    array1.forEach((e1, i) =>
      array2.forEach((e2) => {
        let item1 = e1;
        if (key) {
          item1 = e1[key];
        }

        if (e1.length > 1 && e2.length) {
          result = this.compareArrays(e1, e2);
        } else if (item1 !== e2) {
          result = false;
        } else {
          result = true;
        }
      }),
    );

    return result;
  }
  keylogger(callback) {
    let search = "";
    let searcher = (el) => {
      search = el.key;
      if (typeof search === "undefined") {
        return "";
      }
      search = search.replace(/AltGraph/, "{");
      callback(search);
    };
    document.body.addEventListener("keydown", searcher);
    return {
      killItWithFire: () =>
        document.body.removeEventListener("keydown", searcher),
    };
  }
}
export function optionalFn(callback) {
  return typeof callback === "function" ? callback : () => {};
}
/**
 * convierte un numero en una cadena de texto con formato de dinero.
 * @param float number
 */
export function numberToMoney(number) {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });
  number = Math.abs(number);
  return formatter.format(number);
}
export async function playAudio(url) {
  let audio = new Audio(url);
  return audio.play();
}
/**
 * Convierte una fecha al formato mexicano.
 * @param string dateString
 */
export function localeDate(dateString = null) {
  let date = dateString ? new Date(dateString) : new Date();
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
export function validInputDate(dateString = null) {
  let date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleString("sv", { timeZoneName: "short" }).substring(0, 10);
}
/**
 * Determina si el objeto esta vacio
 * @param {*} obj
 * @return boolean
 */
export function isObjectEmpty(obj) {
  //https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
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
export function secuence(limit, iteration = null) {
  let result = [];
  for (let index = 0; index <= limit; index++) {
    result.push(optionalFn(iteration)(index, limit) || index);
  }
  return result;
}
/**
 * añade un 0 al inicio del numero
 * @param int places
 * @param number number
 */
export function numberPadStart(places, number) {
  return String(number).padStart(places, "0");
}
/**
 * obtiene la version actual del archivo
 * @return number
 */
export function currentVersion() {
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
export function between(comp, value1, value2 = null) {
  value2 = value2 || value1;

  return comp > value1 && comp <= value2;
}

export function filesToB64(files) {
  let promises = [];
  const hp = new Helpers();
  for (let index = 0; index < files.length; index++) {
    let item = files[index];
    promises.push(hp.fileTo64(item));
  }
  return Promise.all(promises);
}
export function ObjectAppender(object) {
  let fd = new FormData();
  for (let index in object) {
    let item = object[index];
    fd.append(index, item);
  }
  return fd;
}
//https://es.stackoverflow.com/questions/62031/eliminar-signos-diacr%C3%ADticos-en-javascript-eliminar-tildes-acentos-ortogr%C3%A1ficos
export function deleteDiacritics(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
/**
 * @return env url local o remota
 */
export function envURL() {
  return window.location.hostname === "localhost"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_API_URL;
}
