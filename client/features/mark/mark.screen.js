import { Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const propTypes = {
  something: PropTypes.any,
};

class MarkScreen extends Component {
  state = {

  }

  render() {
    return (
      <MarkScreenWrapper>
        Mark
      </MarkScreenWrapper>
    );
  }
}

const MarkScreenWrapper = styled.View`

`;

MarkScreen.propTypes = propTypes;

export default MarkScreen;
