import { Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

const propTypes = {
  something: PropTypes.any,
};

class EvaluateScreen extends Component {
  state = {

  }

  render() {
    return (
      <EvaluateScreenWrapper>
        <Text>Evaluate</Text>
      </EvaluateScreenWrapper>
    );
  }
}

const EvaluateScreenWrapper = styled.View`
  flex: 1;
`;

EvaluateScreen.propTypes = propTypes;

export default EvaluateScreen;
