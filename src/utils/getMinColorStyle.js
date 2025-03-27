import { ColorStyle } from "../constants/colorStyles";

const getMinColorStyle = (enum1, enum2) => {
  const COLOR_STYLE_ORDER = [
    ColorStyle.GREEN,
    ColorStyle.YELLOW,
    ColorStyle.GREY,
    ColorStyle.DEFAULT_GRID,
    ColorStyle.DEFAULT_KEYBOARD,
  ];

  return COLOR_STYLE_ORDER.indexOf(enum1) < COLOR_STYLE_ORDER.indexOf(enum2)
    ? enum1
    : enum2;
};

export { getMinColorStyle };
