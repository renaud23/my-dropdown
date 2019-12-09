import React, { useRef } from "react";
import PropTypes from "prop-types";

/**
 *
 */
const Panel = ({
  options = [],
  display,
  handleActive,
  prefix,
  activeIndex,
  selectedOption,
  onSelect,
  optionComponent: Option
}) => {
  const ulRef = useRef();

  return display ? (
    <ul className="dropdown-panel" ref={ulRef} tabIndex="-1">
      {options.map(({ label, value }, index) => (
        <li
          key={value}
          onMouseEnter={() => handleActive(index)}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onSelect({ label, value });
          }}
        >
          <Option
            label={label}
            value={value}
            prefix={prefix}
            active={activeIndex === index}
            selected={selectedOption && selectedOption.value === value}
          />
        </li>
      ))}
    </ul>
  ) : null;
};

const propTypesOption = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
    PropTypes.symbol,
    PropTypes.bool
  ])
});

Panel.propTypes = {
  prefix: PropTypes.string,
  onSelect: PropTypes.func,
  handleActive: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
  selectedOption: propTypesOption,
  display: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(propTypesOption)
};

Panel.defaultProps = {
  options: [],
  onSelect: () => null,
  selectedOption: undefined
};

export default Panel;
