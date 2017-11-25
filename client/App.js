import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import configureStore from './root.ducks';
import theme from './common/theme';
import RootScreen from './screens/RootScreen';

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RootScreen />
        </ThemeProvider>
      </Provider>
    );
  }
}
