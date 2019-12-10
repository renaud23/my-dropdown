import React, { useReducer, useEffect } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import * as actions from "../commons/actions";
import Panel from "../commons/panel";
import ClosedIcon from "../commons/closed.icon";
import OpenedIcon from "../commons/opened.icon";
import Label from "../commons/label";
import reducer, { initial } from "./reducer";
import Option from "./option";
import * as CLEAN from "../commons/cleaner-callbacks";
import "./dropdown.scss";

const BINDED_KEYS = {
  arrowUp: "ArrowUp",
  arrowDown: "ArrowDown",
  enter: "Enter",
  tab: "Tab"
};

/** */
const stopAndPrevent = e => {
  e.preventDefault();
  e.stopPropagation();
};

/* **/
const isDisplay = ({ visible, options }) => visible && options.length > 0;

/** */
const onKeyDownCallback = (state, dispatch, onSelect) => e => {
  const { activeIndex, options } = state;

  switch (e.key) {
    case BINDED_KEYS.arrowUp:
      break;
    case BINDED_KEYS.arrowDown:
      stopAndPrevent(e);
      break;
    case BINDED_KEYS.enter: {
      stopAndPrevent(e);
      break;
    }
    case BINDED_KEYS.tab: {
      dispatch(actions.setFocused(false));
      dispatch(actions.hidePanel());
      break;
    }
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
const getIcon = (_, dispatch) => visible => (
  <span
    className="icone"
    tabIndex="-1"
    onMouseDown={e => {
      e.stopPropagation();
      e.preventDefault();
      if (visible) {
        dispatch(actions.hidePanel());
      } else {
        dispatch(actions.showPanel());
      }
    }}
  >
    {visible ? (
      <OpenedIcon width={10} height={10} />
    ) : (
      <ClosedIcon width={10} height={10} />
    )}
  </span>
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
  const { visible, activeIndex, selectedOption, value, focused, id } = state;

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
    if (valueFromProps !== undefined) {
      const option = options.reduce(
        (a, o, i) => (o.value === valueFromProps ? o : a),
        {}
      );
      dispatch(actions.setSelectedOption(option));
      // dispatch(actions.setActiveOption(index));
    }
  }, [valueFromProps, options]);

  const onSelect_ = option => {
    // dispatch(actions.setSelectedOption(option));
    // dispatch(actions.hidePanel());
    onSelect(option);
  };
  return (
    <div
      className={className ? className : "dropdown"}
      tabIndex="-1"
      id={id}
      onMouseDown={onMouseDownCallback(state, dispatch, "id")}
      onKeyDown={onKeyDownCallback(state, dispatch, onSelect)}
      onFocus={() => dispatch(actions.showPanel())}
    >
      {label ? <Label content={label} focused={focused} /> : null}
      <div
        tabIndex="-1"
        style={{ zIndex: zIndex || 0 }}
        className={classnames("dropdown-container", { visible, focused })}
      >
        <span className={classnames("dropdown-button", { focused })}>
          <button>
            {selectedOption ? selectedOption.label : placeHolder || ""}
          </button>
        </span>
        {getIcon(state, dispatch)(visible)}
        <div
          tabIndex="-1"
          className={classnames("transition", {
            visible: isDisplay(state)
          })}
        >
          <Panel
            options={options}
            display={isDisplay(state)}
            activeIndex={activeIndex}
            optionComponent={Option}
            selectedOption={selectedOption}
            onSelect={onSelect_}
            handleActive={index => null}
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
