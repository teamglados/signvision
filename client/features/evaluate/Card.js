import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import Text from '../common/Text';
import Gutter from '../common/Gutter';
import {
  errorColorLight,
  errorColorDark,
  successColorLight,
  successColorDark,
} from '../../common/theme';

const propTypes = {
  item: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

const { width: windowWidth } = Dimensions.get('window');

class Card extends Component {
  state = {

  }

  render() {
    const { item, onOk, onDecline } = this.props;

    return (
      <CardWrapper>
        <CardImage
          source={{ uri: item.image }}
          resizeMode="cover"
        />
        <Controls>
          <ButtonWrapper>
            <IconButton onPress={onDecline} error>
              <Icon name="times" size={60} color={errorColorLight} />
            </IconButton>
            <Gutter vertical />
            <Text size="14px" color={errorColorDark}>
              Needs repair
            </Text>
          </ButtonWrapper>

          <ButtonWrapper>
            <IconButton onPress={onOk} success>
              <Icon name="check" size={60} color={successColorLight} />
            </IconButton>
            <Gutter vertical />
            <Text size="14px" color={successColorDark}>
              Looks good
            </Text>
          </ButtonWrapper>
        </Controls>
      </CardWrapper>
    );
  }
}

const CardWrapper = styled.View`
  height: 500px;
  width: ${windowWidth - 24};
  border-radius: 8px;
  flex-direction: column;
  background-color: #eee;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
`;

const CardImage = styled.Image`
  margin-bottom: 32px;
  height: 300px;
  width: ${windowWidth - 24};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

const Controls = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
`;

const ButtonWrapper = styled.View`
  flex-direction: column;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
  height: 100px;
  width: 100px;
  border-radius: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
  shadow-opacity: 0.4;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  shadow-color: ${props => props.error
    ? props.theme.errorColorDarker
    : props.theme.successColorDarker};
  border: 4px solid ${props => props.error
    ? props.theme.errorColorLighter
    : props.theme.successColorLighter};
`;

Card.propTypes = propTypes;

export default Card;
