/* eslint-disable max-len */

import Color from 'color';

const basePrimary = '#369bff';
const baseSuccess = '#1d9800';
const baseError = '#ea4444';

export const primaryColor = basePrimary;
export const primaryColorLight = Color(basePrimary).lighten(0.2).hsl().string();
export const primaryColorLighter = Color(basePrimary).lighten(0.3).hsl().string();
export const primaryColorLightest = Color(basePrimary).lighten(0.4).hsl().string();
export const primaryColorDark = Color(basePrimary).darken(0.2).hsl().string();
export const primaryColorDarker = Color(basePrimary).darken(0.3).hsl().string();
export const primaryColorDarkest = Color(basePrimary).darken(0.4).hsl().string();

export const successBaseColor = Color(baseSuccess);
export const successColor = Color(baseSuccess).hsl().string();
export const successColorLight = Color(baseSuccess).lighten(0.2).hsl().string();
export const successColorLighter = Color(baseSuccess).lighten(0.4).hsl().string();
export const successColorLightest = Color(baseSuccess).lighten(0.6).hsl().string();
export const successColorDark = Color(baseSuccess).darken(0.2).hsl().string();
export const successColorDarker = Color(baseSuccess).darken(0.4).hsl().string();
export const successColorDarkest = Color(baseSuccess).darken(0.6).hsl().string();

export const errorBaseColor = Color(baseError);
export const errorColor = Color(baseError).hsl().string();
export const errorColorLight = Color(baseError).lighten(0.2).hsl().string();
export const errorColorLighter = Color(baseError).lighten(0.4).hsl().string();
export const errorColorLightest = Color(baseError).lighten(0.6).hsl().string();
export const errorColorDark = Color(baseError).darken(0.2).hsl().string();
export const errorColorDarker = Color(baseError).darken(0.4).hsl().string();
export const errorColorDarkest = Color(baseError).darken(0.6).hsl().string();

const theme = {
  primaryColorLight,
  primaryColorLighter,
  primaryColorLightest,
  primaryColor,
  primaryColorDark,
  primaryColorDarker,
  primaryColorDarkest,
  successColor,
  successColorLight,
  successColorLighter,
  successColorLightest,
  successColorDark,
  successColorDarker,
  successColorDarkest,
  errorColor,
  errorColorLight,
  errorColorLighter,
  errorColorLightest,
  errorColorDark,
  errorColorDarker,
  errorColorDarkest,
};

export default theme;

