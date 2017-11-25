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
  background-color: ${props =>
    props.disabled
      ? props.theme.primaryColorLight
      : props.theme.primaryColorLightest};
  align-items: center;
  justify-content: ${props => props.justify || 'center'};
  border-radius: 100px;
  padding-horizontal: 32px;
  padding-vertical: 12px;
`;

Button.propTypes = {
  children: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Button;