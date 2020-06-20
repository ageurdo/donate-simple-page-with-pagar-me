import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

interface Props {
  name: string,
  label: string,
  type?: string,
  style?: any,
}

const Input: React.FC<Props> = (props) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue = "", registerField, error } = useField(props.name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value"
    });
  }, [fieldName, registerField]);
  return (
    <>
      {props.label && <label htmlFor={fieldName}>{props.label}</label>}

      <input
        ref={inputRef}
        id={fieldName}
        defaultValue={defaultValue}
        type={props.type}
        style={props.style}
      />

      {error && <span style={{ margin: '-10px 0 10px 0', color: "#f00" }}>{error}</span>}
    </>
  );
}

export default Input;