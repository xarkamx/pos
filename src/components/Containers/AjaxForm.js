import React, { Component } from "react";
import swal from "sweetalert";
import { Helpers } from "../../core/helpers";
import { AuthFetch } from "../../utils/AuthFetch";
import { Translator } from "../../utils/Translator";
/**
 * @summary Formulario asincrono (tipo maruchan)
 * @description envia la informacion de los inputs a la ruta definida como un prop
 * @props willSubmit @type function @description permite editar de manera externa el contenido que se mandara a la ruta
 * @props path @type string
 * @props submitted @type function
 * @props getter @type function
 * @props autoload @type boolean
 * @return void
 */
export class AjaxForm extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: props.autoload };
  }
  async submit(ev) {
    ev.preventDefault();
    // Convierte los props en constantes
    const { willSubmit, path, submitted } = this.props;
    const method = (this.props.method
      ? this.props.method
      : "get"
    ).toLowerCase();
    const ajax = new AuthFetch(path);
    const helpers = new Helpers();
    const jsxForm = this.refs.ajaxForm;
    let inputs = helpers.inputsToObject(jsxForm);
    // Revisa si existe el prop willsubmit como funcion y de ser el caso la ejecuta.

    if (typeof willSubmit === "function") {
      inputs = willSubmit(inputs, jsxForm);
      if (inputs === false) {
        return false;
      }
    }
    // Hace un request asincrono al path definido en el prop.
    const result = await ajax[method](inputs);

    if (result.details !== undefined) {
      swal("Opps", result.details, "error");
      return false;
    }

    jsxForm.reset();
    if (typeof submitted === "function") {
      return submitted(result, jsxForm);
    }
    swal(
      new Translator("Saved").get(),
      new Translator("Sucess").get(),
      "success"
    );
  }
  componentDidMount() {
    let autoload = this.props.autoload;
    if (typeof autoload === "undefined" || autoload === true) {
      this.fillForm();
    }
  }
  async fillForm() {
    await this.setState({ loading: true });
    const ajax = new AuthFetch(this.props.path);
    let result = await ajax.get();
    let formated = null;
    if (typeof this.props.getter === "function" && result.message !== "error") {
      formated = setTimeout(() => {
        this.props.getter(result);
        this.setState({ loading: false });
      }, 600);
    }

    return formated;
  }
  render() {
    const loading = this.state.loading;
    return (
      <form
        onSubmit={this.submit.bind(this)}
        ref="ajaxForm"
        style={this.props.style}
      >
        {loading ? "cargando..." : this.props.children}
        {this.props.button ? (
          <button type="submit" className="btn btn-success">
            {this.props.button}
          </button>
        ) : (
          ""
        )}
      </form>
    );
  }
}
