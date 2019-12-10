import * as actions from "./actions";

export const initial = {
  options: [],
  visibleOptions: [],
  visible: false,
  activeIndex: undefined,
  selectedOption: undefined,
  focused: false,
  value: ""
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.SWITCH_VISIBLE: {
      const { visible } = state;
      return { ...state, visible: !visible };
    }
    case actions.HIDE_PANEL: {
      return { ...state, visible: false };
    }
    case actions.SET_OPTIONS: {
      const { options } = payload;
      return { ...state, options };
    }
    case actions.SET_SELECTED_OPTION: {
      const { option } = payload;
      return { ...state, selectedOption: option };
    }
    case actions.SET_FOCUSED: {
      const { focused } = payload;
      return { ...state, focused };
    }
    default:
      return state;
  }
};

export default reducer;
