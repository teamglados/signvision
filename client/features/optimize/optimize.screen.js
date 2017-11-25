import { Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const propTypes = {
  something: PropTypes.any,
};

class OptimizeScreen extends Component {
  state = {

  }

  render() {
    return (
      <OptimizeScreenWrapper>
        <Text>Optimize</Text>
      </OptimizeScreenWrapper>
    );
  }
}

const OptimizeScreenWrapper = styled.View`

`;

OptimizeScreen.propTypes = propTypes;

export default OptimizeScreen;
