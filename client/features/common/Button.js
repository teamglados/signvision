import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const noop = () => {};

const Button = ({ children, onPress, disabled, ...rest }) => (
  <ButtonBase onPress={disabled ? noop : onPress} disabled={disabled} {...rest}>
    {children}
  </ButtonBase>
);

const ButtonBase = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  align-items: center;
  border-radius: 100px;
  padding-horizontal: 32px;
  padding-vertical: ${props => props.lg ? 24 : 12};
  justify-content: ${props => props.justify || 'center'};
  background-color: ${props => props.disabled
    ? props.theme.primaryColorLight
    : props.theme.primaryColor};
`;

Button.propTypes = {
  children: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Button;