import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

interface Props {
  id: string,
  name: string,
  value: string
  onChange: any,
  array: string[],
  placeholder: string,
  label: string,
}

const Select: React.FC<Props> = (props) => {
  const selectRef = useRef(null);

  const { fieldName, defaultValue = "", registerField, error } = useField(props.name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: "value"
    });
  }, [fieldName, registerField]);
  return (
    <>
      <label htmlFor="uf">{props.label}</label>
      <select
        ref={selectRef}
        id={fieldName}
        defaultValue={defaultValue}
        onChange={props.onChange}
        name={props.name}
        value={props.value}
      >
        <option value="0">{props.placeholder}</option>
        {props.array.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        )
        )}

      </select>

      {error && <span style={{ color: "#f00" }}>{error}</span>}
    </>
  );
}

export default Select;