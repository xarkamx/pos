export class ErrorObj extends Error {
  constructor (obj) {
    super(obj.message)
    this.obj = obj
  }
}