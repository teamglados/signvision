import { Text, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

const propTypes = {
  something: PropTypes.any,
};

class OptimizeScreen extends Component {
  state = {

  }

  render() {
    return (
      <OptimizeScreenWrapper>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Street}
          zoomLevel={15}
          centerCoordinate={[11.256, 43.770]}
          style={styles.map}>
        </Mapbox.MapView>
      </OptimizeScreenWrapper>
    );
  }
}

const OptimizeScreenWrapper = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

OptimizeScreen.propTypes = propTypes;

export default OptimizeScreen;
