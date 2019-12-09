import * as actions from "./actions";
import { filterOption } from "./prefix-tools";
import { preparePrefix } from "./prefix-tools";

export const initial = {
  prefix: undefined,
  options: [],
  visibleOptions: [],
  visible: false,
  activeIndex: undefined,
  selectedOption: undefined,
  focused: false,
  value: ""
};

const isPrefix = prefix => prefix !== undefined && prefix.length > 0;

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.SHOW_PANEL: {
      return { ...state, visible: true };
    }
    case actions.HIDE_PANEL: {
      return { ...state, visible: false };
    }
    case actions.SET_ACTIVE_OPTION: {
      const { index } = payload;
      return { ...state, activeIndex: index };
    }
    case actions.SET_OPTIONS: {
      const { options } = payload;
      const { prefix } = state;
      return {
        ...state,
        options,
        visibleOptions: isPrefix(prefix) ? filterOption(options) : options
      };
    }
    case actions.SET_PREFIX: {
      const { prefix } = payload;
      const { options } = state;
      return {
        ...state,
        prefix,
        activeIndex: undefined,
        visibleOptions: isPrefix(prefix)
          ? filterOption(options, prefix)
          : options
      };
    }
    case actions.SET_VALUE: {
      const { value } = payload;
      return { ...state, value };
    }
    case actions.SET_SELECTED_OPTION: {
      const { option } = payload;
      return {
        ...state,
        value: option.label,
        selectedOption: option,
        prefix: preparePrefix(option.label)
      };
    }
    case actions.SET_FOCUSED: {
      const { focused } = payload;
      return { ...state, focused };
    }
    case actions.RESET_SELECTION: {
      return {
        ...state,
        prefix: undefined,
        value: "",
        selectedOption: undefined,
        activeIndex: undefined,
        visibleOptions: state.options
      };
    }
    default:
      return state;
  }
};

export default reducer;
