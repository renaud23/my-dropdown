import React from "react";
import classnames from "classnames";

export default ({ label, active, selected }) => {
  return (
    <span
      className={classnames("dropdown-option", {
        "dropdown-option-active": active,
        "dropdown-option-selected": selected
      })}
    >
      {label}
    </span>
  );
};
