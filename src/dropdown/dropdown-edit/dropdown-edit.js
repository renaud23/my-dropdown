import React, { useReducer, useEffect, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import * as actions from "../commons/actions";
import Panel from "../commons/panel";
import ClosedIcon from "../commons/closed.icon";
import OpenedIcon from "../commons/opened.icon";
import Label from "../commons/label";
import CrossIcon from "./cross.icon";
import { preparePrefix } from "./prefix-tools";
import reducer, { initial } from "./reducer";
import Option from "./option";
import * as CLEAN from "../commons/cleaner-callbacks";
import onKeyDownCallback, { BINDED_KEYS } from "../commons/on-keydown-callback";
import "./dropdown-edit.scss";

/* **/
const isDisplay = ({ visible, visibleOptions }) =>
  visible && visibleOptions.length > 0;

/** */
const stopAndPrevent = e => {
  e.preventDefault();
  e.stopPropagation();
};

/** */
const onKeyDownCallback_ = (state, dispatch, onSelect) => e => {
  switch (e.key) {
    case BINDED_KEYS.enter:
    case BINDED_KEYS.arrowUp:
    case BINDED_KEYS.arrowDown:
    case BINDED_KEYS.tab:
      stopAndPrevent(e);
      onKeyDownCallback(state, dispatch, onSelect)(e.key);
      break;
    default:
  }
};

/** */
const onMouseDownCallback = ({ visible, id }, dispatch) => e => {
  e.stopPropagation();
  if (!visible) {
    CLEAN.applyAll(id);
    dispatch(actions.showPanel());
  }
};

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

/**
 *
 * @param {*} param0
 */
const Dropdown = ({
  options = [],
  children,
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

  CLEAN.add(id, () => {
    dispatch(actions.hidePanel());
    dispatch(actions.setFocused(false));
  });
  useEffect(
    e => {
      const hook = e => {
        dispatch(actions.hidePanel());
        dispatch(actions.setFocused(false));
      };
      window.addEventListener("mousedown", hook);

      return () => {
        window.removeEventListener("mousedown", hook);
        CLEAN.clear(id);
      };
    },
    [id]
  );

  useEffect(() => {
    dispatch(actions.setOptions(options));
  }, [options, children]);

  useEffect(() => {
    if (valueFromProps) {
      const { option, index } = options.reduce(
        (a, o, i) =>
          o.value === valueFromProps && a.index === -1
            ? { index: i, option: o }
            : a,
        { index: -1, option: {} }
      );
      dispatch(actions.setSelectedOption(option));
      dispatch(actions.setActiveOption(index));
    }
  }, [valueFromProps, options]);

  const inputEl = useRef();

  const onSelect_ = option => {
    dispatch(actions.setSelectedOption(option));
    dispatch(actions.hidePanel());
    onSelect(option);
  };

  return (
    <div
      className={classnames(className ? className : "dropdown", { focused })}
      tabIndex="-1"
      id={id}
      onMouseDown={onMouseDownCallback(state, dispatch, "id")}
      onKeyDown={onKeyDownCallback_(state, dispatch, onSelect)}
      onFocus={() => dispatch(actions.setFocused(true))}
    >
      {label ? <Label content={label} focused={focused} /> : null}
      <div
        tabIndex="-1"
        style={{ zIndex: zIndex || 0 }}
        className={classnames("dropdown-container", { visible, focused })}
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
      </div>
    </div>
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
    PropTypes.object,
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
