import React, { useReducer, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import * as actions from "../commons/actions";
import Panel from "../commons/components/panel";
import DropdownContainer from "../commons/components/dropdown-container";
import ClosedIcon from "../commons/components/closed.icon";
import OpenedIcon from "../commons/components/opened.icon";
import CrossIcon from "./cross.icon";
import { preparePrefix } from "./prefix-tools";
import reducer, { initial } from "./reducer";
import Option from "./option";
import "./dropdown-edit.scss";

/* **/
const isDisplay = ({ visible, visibleOptions }) =>
  visible && visibleOptions.length > 0;

/** */
const onChangeCallback = (state, dispatch) => e => {
  e.stopPropagation();
  e.preventDefault();
  dispatch(actions.setValue(e.target.value));
  dispatch(actions.setPrefix(preparePrefix(e.target.value)));
};

/** */
const getIcon = visible =>
  visible ? (
    <OpenedIcon width={10} height={10} />
  ) : (
    <ClosedIcon width={10} height={10} />
  );

const createOnSelect = (_, dispatch, onSelect) => option => {
  dispatch(actions.setSelectedOption(option));
  dispatch(actions.hidePanel());
  onSelect(option);
};

/**
 *
 * @param {props}
 */
const Dropdown = ({
  options = [],
  onSelect,
  className,
  placeHolder,
  label,
  value: valueFromProps,
  zIndex
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initial,
    id: `dropdown-${new Date().getMilliseconds()}`
  });
  const {
    prefix,
    visible,
    activeIndex,
    visibleOptions,
    selectedOption,
    value,
    focused,
    id
  } = state;
  const inputEl = useRef();
  const onSelect_ = createOnSelect(state, dispatch, onSelect);
  return (
    <DropdownContainer
      className={className}
      state={state}
      dispatch={dispatch}
      options={options}
      label={label}
      onSelect={onSelect_}
      value={valueFromProps}
      zIndex={zIndex}
    >
      <span className={classnames("dropdown-input", { focused })}>
        <input
          type="text"
          ref={inputEl}
          value={value}
          placeholder={placeHolder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          tabIndex="0"
          onFocus={() => dispatch(actions.setFocused(true))}
          onChange={onChangeCallback(state, dispatch)}
        />
      </span>
      {prefix && prefix.length > 0 ? (
        <span
          className="icone"
          tabIndex="-1"
          onMouseDown={e => {
            e.stopPropagation();
            inputEl.current.value = "";
            dispatch(actions.resetSelection());
          }}
        >
          <CrossIcon width={10} height={10} />
        </span>
      ) : (
        <span
          className="icone"
          tabIndex="-1"
          onMouseDown={e => {
            e.stopPropagation();
            if (visible) {
              dispatch(actions.hidePanel());
            } else dispatch(actions.showPanel());
          }}
        >
          {getIcon(visible)}
        </span>
      )}
      <div
        tabIndex="-1"
        className={classnames("transition", {
          visible: isDisplay(state)
        })}
      >
        <Panel
          idDropdown={id}
          options={visibleOptions}
          display={isDisplay(state)}
          prefix={prefix}
          activeIndex={activeIndex}
          optionComponent={Option}
          selectedOption={selectedOption}
          onSelect={onSelect_}
          handleActive={index => dispatch(actions.setActiveOption(index))}
        />
      </div>
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  zIndex: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  placeHolder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ])
};

Dropdown.defaultProps = {
  options: [],
  zIndex: 0,
  onSelect: () => null,
  placeHolder: "Search..."
};

export default Dropdown;
