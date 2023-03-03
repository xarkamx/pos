import { Helpers, ObjectAppender } from "./helpers";
export class Ajax extends Helpers {
  /**
   *
   * @param {*} path
   * @param {*} parameters
   * @param {*} method
   * @param {*} headers
   */
  async fetchData(
    path,
    parameters = {},
    method = "get",
    headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    stringify = true,
  ) {
    const data = await this._fetch(
      path,
      parameters,
      method,
      headers,
      stringify,
    );
    let result = await data.text();
    try {
      const response = JSON.parse(result);
      response.code = data.status;
      return response;
    } catch (e) {
      console.log("Error en backend");
      return { data: [] };
    }
  }
  async fetchFile(path) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const data = await this._fetch(path, {}, "get", headers);
    const blob = await data.blob();
    blob.lastModifiedDate = new Date();
    blob.name = this.pathSlicer(path).fileName;
    return blob;
  }
  async fetchHTML(path) {
    const headers = {
      "Content-Type": "application/json",
    };
    const data = await this._fetch(path, {}, "get", headers);
    return await data.text();
  }
  async _fetch(path, parameters, method, headers, stringify) {
    let args = { headers };
    if (method.toLowerCase() === "get") {
      parameters = this.objectToSerialize(parameters);
      path += "?" + parameters;
      parameters = "";
      //args.body = JSON.stringify(parameters);
    } else {
      args.body = stringify
        ? JSON.stringify(parameters)
        : ObjectAppender(parameters);
    }
    args.method = method;
    return await fetch(path, args);
  }
}
