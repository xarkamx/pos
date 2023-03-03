import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { SimpleInput } from "../Inputs/SimpleInput";
export function SmartFormik({ model, onSubmit, children }) {
  return (
    <Formik
      initialValues={model.getDefaultValues()}
      validationSchema={Yup.object().shape(model.getYupValidations())}
      onSubmit={onSubmit}>
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          {autogenerateForm(model, formik, children(formik))}
        </form>
      )}
    </Formik>
  );
}
export function FormikSpace({ children }) {
  return children;
}
function autogenerateForm(model, formik, children) {
  const formikSpace = Array.isArray(children.props.children)
    ? children.props.children
    : [children.props.children];
  let comp = [];

  const nameless = formikSpace.filter((item) => !item.props.name);
  for (let key in model.values) {
    const item = model.values[key];
    const customComponent = formikSpace.filter(
      (item) => item.props.name === key,
    );

    if (customComponent.length > 0) {
      customComponent.key = key;
      comp.push(customComponent);
      continue;
    }
    comp.push(
      <SimpleInput
        name={key}
        key={key}
        error={Boolean(formik.touched[key] && formik.errors[key])}
        msg={formik.touched[key] && formik.errors[key]}
        onChange={formik.handleChange}
        type={item.type || "text"}
        step={0.1}
        value={formik.values[key] || item.value}
        title={item.title || key}
      />,
    );
  }
  comp = [...comp, nameless];
  return comp;
}
