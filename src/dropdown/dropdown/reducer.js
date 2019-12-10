import * as actions from "./actions";

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

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
};

export default reducer;
