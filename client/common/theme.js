import Color from 'color';

const primaryBase = '#369bff';

export const primaryColor = primaryBase;
export const primaryColorLight = Color(primaryBase).lighten(0.2).hsl().string();
export const primaryColorLighter = Color(primaryBase).lighten(0.3).hsl().string();
export const primaryColorLightest = Color(primaryBase).lighten(0.4).hsl().string();
export const primaryColorDark = Color(primaryBase).darken(0.2).hsl().string();
export const primaryColorDarker = Color(primaryBase).darken(0.3).hsl().string();
export const primaryColorDarkest = Color(primaryBase).darken(0.4).hsl().string();


const theme = {
  primaryColorLight,
  primaryColorLighter,
  primaryColorLightest,
  primaryColor,
  primaryColorDark,
  primaryColorDarker,
  primaryColorDarkest,
};

export default theme;

