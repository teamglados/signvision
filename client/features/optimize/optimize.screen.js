import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getMarks } from '../mark/mark.ducks';

const propTypes = {
  marks: PropTypes.array.isRequired,
};

class OptimizeScreen extends Component {
  getCenterCoord = () => {
    const { marks } = this.props;
    if (!marks.length) return [11.256, 43.770];
    return [marks[0].geo.long, marks[0].geo.lat];
  }

  render() {
    const { marks } = this.props;
    const center = this.getCenterCoord();

    return (
      <OptimizeScreenWrapper>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Dark}
          zoomLevel={9}
          centerCoordinate={center}
          style={styles.map}
        >
          {marks.map((mark, i) =>
            <Mapbox.PointAnnotation
              key={`${mark.id}_${mark.geo.lat}`}
              id={`point_${mark.id}_${i}`}
              coordinate={[mark.geo.long, mark.geo.lat]}
            >
              <Dot>
                <DotFill />
              </Dot>
              <Mapbox.Callout title="Look! An annotation!" />
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>
      </OptimizeScreenWrapper>
    );
  }
}

const OptimizeScreenWrapper = styled.View`
  flex: 1;
`;

const Dot = styled.View`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 15;
`;

const DotFill = styled.View`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.primaryColorLight};
  border-radius: 15;
  transform: scale(0.6);
`;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

OptimizeScreen.propTypes = propTypes;


const mapStateToProps = state => ({
  marks: getMarks(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OptimizeScreen);
