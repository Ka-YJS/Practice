# Button.js

```JS
import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const TRANSPARENT = 'transparent';

const Container = styled.TouchableOpacity`
  background-color: ${({ theme, isFilled }) =>
    isFilled ? theme.buttonBackground : "rgba(255, 255, 255, 0.8)"};
  align-items: center;
  border-radius: 4px;
  width: ${({ width }) => width || "100%"};
  padding: 10px;
  margin: 5px 0;
`;

const Title = styled.Text`
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: ${({ theme, isFilled }) =>
    isFilled ? theme.buttonTitle : theme.buttonUnfilledTitle};
  font-family: GCB_Bold;
`;

const Button = ({ containerStyle, title, onPress, isFilled}) => {
  return (
    <Container
      style={containerStyle}
      onPress={onPress}
      isFilled={isFilled}
    >
      <Title isFilled={isFilled}>{title}</Title>
    </Container>
  );
};

Button.defaultProps = {
  isFilled: true,
};

Button.propTypes = {
  containerStyle: PropTypes.object,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  isFilled: PropTypes.bool,
};

export default Button;
```

# 코드설명

*React Native에서 style을 css로 따로 분리하기 어려운 이유?
1. React Native는 웹 환경이 아닌 네이티브 환경에서 동작하기 때문에 일반적인 CSS 파일을 직접 사용할 수 없음
2. React Native는 네이티브 컴포넌트로 변환되어야 하므로, 스타일링도 JavaScript 객체 형태로 작성해야 함


```JS
import PropTypes from 'prop-types';

Button.propTypes = {
  containerStyle: PropTypes.object,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  isFilled: PropTypes.bool,
};
```
1. PropTypes : 리액트 컴포넌트의 props 타입을 검증하는 라이브러리로, 개발 시 타입 관련 버그를 미리 방지할 수 있음
2. PropTypes.object : props가 객체 타입이어야 함을 명시하며, containerStyle이 객체여야 함을 의미함함
3. PropTypes.string : props가 문자열 타입이어야 함을 명시하며, title이 문자열이어야 함을 의미함
4. PropTypes.func.isRequired : props가 함수 및 필수값임을 명시하며, onPress 함수가 반드시 제공되어야 함을 의미함
5. PropTypes.bool : props가 boolean타입이어야 함을 명시하며, isFilled가 불리언이어야 함을 의미함

```JS
const TRANSPARENT = 'transparent';
```
1. transparent : transparent는 투명한 배경을 의미하는 CSS 값임

```JS
Button.defaultProps = {
  isFilled: true,
};
```
1. Button.defaultProps
  - 컴포넌트의 기본 props 값을 설정하는 속성임
  - 여기서는 isFilled의 기본값을 true로 설정하고 있음
  - props로 isFilled 값을 따로 전달하지 않으면 자동으로 true가 적용됨됨