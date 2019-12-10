export const SWITCH_VISIBLE = "dropdown/swith-visible";
export const switchVisible = () => ({ type: SWITCH_VISIBLE });

export const HIDE_PANEL = "dropdown/hide-panel";
export const hidePanel = () => ({ type: HIDE_PANEL });

export const SET_OPTIONS = "dropdown/set-options";
export const setOptions = (options = []) => ({
  type: SET_OPTIONS,
  payload: { options }
});

export const SET_SELECTED_OPTION = "dropdown/set-selected-option";
export const setSelectedOption = option => ({
  type: SET_SELECTED_OPTION,
  payload: { option }
});

export const SET_FOCUSED = "dropdown/set-focused";
export const setFocused = focused => ({
  type: SET_FOCUSED,
  payload: { focused }
});
