import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { View } from 'react-native';

import configureStore from './store';
import theme from './common/theme';
import RootScreen from './root.screen';
import { IS_ANDROID, MAP_BOX_TOKEN } from './config';

const store = configureStore();
  }

  }

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) return null;

      return (
        <View>
          <Text>
            You need to accept location permissions in order to
            use this example applications
          </Text>
        </View>
      );
    }

    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RootScreen />
        </ThemeProvider>
      </Provider>
    );
  }
}
