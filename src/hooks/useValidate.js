const { default: Ajv } = require('ajv');
const { useState } = require('react');
const ajvErr = require("ajv-errors")


export function useValidate (schema) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const ajv = new Ajv({ allErrors: true });
  ajvErr(ajv)
  const validate = ajv.compile(schema);
  return {
    validate: (data) => {
      const valid = validate(data);
      if (!valid) {
        setErrors(validate.errors.reduce((acc, error) => {
          acc[error.instancePath.slice(1)] = error.message;
          return acc;
        }, {}));
      } else {
        setErrors({});
      }
      setValues(data);
      return valid;
    },
    errors,
    values
  }
}