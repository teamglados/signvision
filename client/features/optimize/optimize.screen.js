import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Icon from 'react-native-vector-icons/FontAwesome';
import { lineString as makeLineString } from '@turf/helpers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { MAP_BOX_TOKEN, MAP_BOX_API } from '../../config';
import { getMarks } from '../mark/mark.ducks';
import { primaryColorLight } from '../../common/theme';

const propTypes = {
  marks: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

class OptimizeScreen extends Component {
  state = {
    route: null,
    adById: null,
  }

  componentWillMount() {
    this.getAddresses();
    this.getDirections();
  }

  getCenterCoord = () => {
    const { marks } = this.props;
    if (!marks.length) return [11.256, 43.770];
    return [marks[0].geo.long, marks[0].geo.lat];
  }

  getAddresses = () => {
    const { marks } = this.props;
    const promises = [];

    marks.forEach(({ geo, id }) => {
      promises.push(
        fetch(`http://nominatim.openstreetmap.org/reverse?format=json&lat=${geo.lat}&lon=${geo.long}&zoom=18&addressdetails=1`) // eslint-disable-line
          .then(res => res.json())
          .then(({ address }) => ({ address, id }))
      );
    });

    Promise.all(promises)
      .then(addresses => {
        const adById = {};
        addresses.forEach(({ address, id }) => {
          adById[id] = `${address.road}, ${address.suburb}, ${address.city}`;
        });
        this.setState({ adById });
      });
  }

  getDirections = () => {
    const { marks } = this.props;

    // Build query
    const coords = marks
      .filter(m => m.type === 'repair')
      .reduce((acc, m) => {
        const lo = `${m.geo.long}`.substring(0, 6);
        const la = `${m.geo.lat}`.substring(0, 6);
        acc += `${lo},${la};`;
        return acc;
      }, '');

    // Remove last ";" character
    const c = coords.slice(0, -1);
    const p = '&geometries=geojson';

    fetch(`${MAP_BOX_API}/driving/${c}.json?access_token=${MAP_BOX_TOKEN}${p}`)
      .then(res => res.json())
      .then(({ routes }) => {
        if (!routes) return;

        this.setState({
          route: makeLineString(routes[0].geometry.coordinates),
        });
      });
  }

  goHome = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const { route, adById } = this.state;
    const { marks } = this.props;
    const center = this.getCenterCoord();

    if (!adById) return null;

    return (
      <OptimizeScreenWrapper>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Dark}
          zoomLevel={12}
          centerCoordinate={center}
          style={styles.map}
        >
          <ToHome onPress={this.goHome}>
            <Icon name="arrow-left" size={32} color="#fff" />
          </ToHome>

          {marks.map(mark =>
            <Mapbox.PointAnnotation
              key={`${mark.id}`}
              id={`${mark.id}`}
              coordinate={[mark.geo.long, mark.geo.lat]}
              title={adById[mark.id]}
            >
              <Dot>
                <DotFill type={mark.type} />
              </Dot>
              <Mapbox.Callout title={adById[mark.id]} />
            </Mapbox.PointAnnotation>
          )}

          {route &&
            <Mapbox.ShapeSource id="routeSource" shape={route}>
              <Mapbox.LineLayer id="routeFill" style={mstyles.route} />
            </Mapbox.ShapeSource>
          }
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

const getDotColor = (props) => {
  if (props.type === 'repair') return props.theme.errorColor;
  if (props.type === 'ok') return props.theme.successColor;
  return '#ccc';
};

const DotFill = styled.View`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${props => getDotColor(props)};
  border-radius: 15;
  transform: scale(0.6);
`;

const ToHome = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.theme.primaryColor};
  position: absolute;
  top: 8px;
  left: 8px;
  align-items: center;
  justify-content: center;
`;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

const mstyles = Mapbox.StyleSheet.create({
  route: {
    lineColor: primaryColorLight,
    lineWidth: 3,
    lineOpacity: 0.85,
  },
});

OptimizeScreen.propTypes = propTypes;


const mapStateToProps = state => ({
  marks: getMarks(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OptimizeScreen);
