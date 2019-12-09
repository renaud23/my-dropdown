import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import DropdownEdit, { Option } from "./dropdown/dropdown-edit";
import "./application.scss";

ReactDOM.render(
  <div className="application">
    <button>un bouton</button>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
    <div className="simple-dropdown">
      <DropdownEdit
        value={4}
        zIndex={1}
        onSelect={item => console.log("onSelect", item)}
        label="Les langages informatiques"
      >
        <Option value={0}>Java</Option>
        <Option value={1}>Haskel</Option>
        <Option value={2}>C</Option>
        <Option value={3}>C#</Option>
        <Option value={4}>JavaScript</Option>
        <Option value={5}>Camel</Option>
        <Option value={6}>Perl</Option>
        <Option value={7}>Python</Option>
        <Option value={8}>Lisp</Option>
      </DropdownEdit>
    </div>
    <div className="second">
      <DropdownEdit
        value={0}
        zIndex={0}
        onSelect={item => console.log("onSelect", item)}
        label="Test avec trucs."
      >
        <Option value={"0"}>
          Un libellé long avec des accents - tout le toutim.
        </Option>
        <Option value={"1"}>Un libellé court.</Option>
      </DropdownEdit>
    </div>
    <p>
      <select>
        <option value="0">choix 1</option>
      </select>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
    <DropdownEdit
      value={0}
      zIndex={0}
      onSelect={item => console.log("onSelect", item)}
    />
  </div>,
  document.getElementById("root")
);
