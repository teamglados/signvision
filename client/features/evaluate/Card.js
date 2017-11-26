import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import format from 'date-fns/format';

import Text from '../common/Text';
import Gutter from '../common/Gutter';
import Button from '../common/Button';

import {
  errorColorLight,
  errorColorDark,
  successColorLight,
  successColorDark,
  primaryColor,
} from '../../common/theme';

const propTypes = {
  item: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
};

const { width: windowWidth } = Dimensions.get('window');

class Card extends PureComponent {
  render() {
    const { item, onOk, onDecline, onAddComment } = this.props;

    return (
      <CardWrapper>
        <CardImage
          source={{ uri: 'http://ec2-35-157-114-220.eu-central-1.compute.amazonaws.com:8000/static/' + item.id + '.jpg' }}
          resizeMode="contain"
        />
        <Details>
          <Icon name="clock-o" size={18} color="#444" />
          <Gutter amount="6px" />
          <Text size="12px" color="#555">
            {format(new Date(item.timestamp), 'HH:mm D.M.YYYY')}
          </Text>
        </Details>
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

        <AddComment>
          {item.comment ?
            <UpdateComment onPress={onAddComment}>
              <Text numberOfLines={1} ellipsizeMode="tail" color={primaryColor}>
                {item.comment.length > 30
                  ? `${item.comment.substring(0, 30)}...`
                  : item.comment
                }
              </Text>
              <Gutter amount="8px" />
              <Icon name="pencil-square-o" size={18} color={primaryColor} />
            </UpdateComment> :

            <Button onPress={onAddComment} w="140px" sm>
              <Text size="14px">
                Add comment
              </Text>
            </Button>
          }
        </AddComment>
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
  padding-bottom: 16px;
  elevation: 3;
`;

const CardImage = styled.Image`
  height: 250px;
  width: ${windowWidth - 24};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

const Controls = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
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
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
  shadow-color: ${props => props.error
    ? props.theme.errorColorDarker
    : props.theme.successColorDarker};
  border: 4px solid ${props => props.error
    ? props.theme.errorColorLighter
    : props.theme.successColorLighter};
`;

const Details = styled.View`
  padding-vertical: 12px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const AddComment = styled.View`
  margin-top: 16px;
  align-items: center;
  justify-content: center;
`;

const UpdateComment = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

Card.propTypes = propTypes;

export default Card;
