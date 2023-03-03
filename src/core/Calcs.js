import { numberPadStart } from "./helpers";
/* eslint eqeqeq: 0*/
export class Calcs {
  getCenter = dom => {
    const pos = dom.getBoundingClientRect();
    return {
      y: pos.y - pos.height / 2,
      x: pos.x + pos.width / 2
    };
  };
  scaleTo = (current, maxVal = 10) => {
    let pow = Math.pow(maxVal, Math.log10(maxVal));
    return current / pow;
  };
  hipotenusa = (coord1, coord2) => {
    let x = coord1.x - coord2.x;
    let y = coord1.y - coord2.y;
    return {
      hipotenusa: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
      legY: y,
      legX: x
    };
  };
}
export class Time {
  miliseconds = 0;
  constructor(time = "00:00") {
    this.time = time;
    this.timeToMiliseconds();
  }
  timeToMiliseconds() {
    const time = this.time;
    const [hours = 0, minutes = 0, seconds = 0] = time.split(":");
    const miliseconds =
      hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    this.miliseconds = miliseconds;
    return this;
  }
  base12ToBase24() {}
  base24ToBase12() {}
  /**
   *
   * @param number time
   * @param string type
   */
  addTime(time, type = "miliseconds") {
    switch (type) {
      case "seconds":
        time = time * 1000;
        break;
      case "minutes":
        time = time * 60000;
        break;
      case "hours":
        time = time % 24;
        time = time * 3600 * 1000;
        break;
      default:
        time = 0;
    }
    this.miliseconds += time;
    return this;
  }
  get() {
    const miliseconds = this.miliseconds;
    const seconds = miliseconds / 1000;
    const minutes = miliseconds / 60000;
    return { minutes, seconds, miliseconds };
  }
  /**
   * convierte los milisegundos en horas.
   */
  milisecondsTogetBase24() {
    let miliseconds = this.miliseconds < 0 ? 0 : this.miliseconds;
    const hours = miliseconds / 1000 / 3600;
    const minutes = (hours % 1) * 60;
    const seconds = (minutes % 1) * 60;
    return {
      hours: numberPadStart(2, Math.floor(hours)),
      minutes: numberPadStart(2, Math.floor(minutes)),
      seconds: numberPadStart(2, Math.round(seconds))
    };
  }
  /**
   * retorna el tiempo de milisegundos a hora real.
   * @param number base
   */
  toString(base = 24) {
    const { hours, minutes, seconds } = this.milisecondsTogetBase24();
    const timePeriod = base == 12 ? (hours >= 12 ? "pm" : "am") : "";
    return `${
      base == 24 ? hours : hours % 12
    }:${minutes}:${seconds} ${timePeriod}`;
  }
}
