import { optionalFn } from "./helpers";

export class DOM {
  constructor() {
    HTMLElement.prototype.isReadOnly = this.isReadOnly;
    HTMLElement.prototype.resetChildsInputs = this.resetChildsInputs;
    NodeList.prototype.tListener = this.listener;
    NodeList.prototype.setProp = this.setProp;
    HTMLElement.prototype.print = this.print;
  }
  isReadOnly(type) {
    let properties = Object.getOwnPropertyDescriptor(this.__proto__, type);
    if (properties === undefined) {
      return false;
    }
    return properties.set === undefined;
  }
  listener(type, callback) {
    for (let index = 0; index < this.length; ++index) {
      let item = this[index];
      item.addEventListener(type, ev => {
        ev.node = item;
        callback(ev);
      });
    }
  }
  setProp(prop, value) {
    for (let index = 0; index < this.length; ++index) {
      let item = this[index];
      item[prop] = value;
    }
  }
  print(callback = null) {
    let iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(
      this.body != null ? this.body.innerHTML : this.innerHTML
    );
    iframe.contentWindow.document.close();
    iframe.contentWindow.addEventListener("afterprint", () => {
      setTimeout(() => {
        optionalFn(callback)();
      }, 1000);
    });
    window.setTimeout(ev => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  }
  resetChildsInputs() {
    let inputs = this.querySelectorAll("inputs,select,textarea");
    for (let index = 0; index < inputs.length; ++index) {
      inputs[index].value = "";
    }
  }
}
