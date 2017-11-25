import { Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const propTypes = {
  something: PropTypes.any,
};

class ReportScreen extends Component {
  state = {

  }

  render() {
    return (
      <ReportScreenWrapper>
        <Text>Report</Text>
      </ReportScreenWrapper>
    );
  }
}

const ReportScreenWrapper = styled.View`

`;

ReportScreen.propTypes = propTypes;

export default ReportScreen;
