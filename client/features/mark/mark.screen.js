import { Text, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Camera from 'react-native-camera';

const propTypes = {
  something: PropTypes.any,
};

class MarkScreen extends Component {
  setCamRef = cam => {
    this.camera = cam;
  }

  takePhoto = () => {
    if (this.camera) {
      const metadata = {};
      this.camera.capture({ metadata })
        .then((data) => console.log(data))
        .catch(err => console.error(err));
    }
  }

  render() {
    return (
      <MarkScreenWrapper>
        <Camera
          ref={this.setCamRef}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >
        </Camera>
      </MarkScreenWrapper>
    );
  }
}

const MarkScreenWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
});

MarkScreen.propTypes = propTypes;

export default MarkScreen;
