# Input.js

```JS
import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

//스타일 컴포넌트 만들기
const Container = styled.View`
  flex-direction: column;
  width: 100%;
  margin: 5px 0;
`;
//textinput안에 쓰이는 글씨
const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme, isFocused }) => (isFocused ? theme.text : theme.label)};
  margin-left: 5px;
  font-family: GCB_Bold;
`;
//textinput 컴포넌트 
const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    background-color: ${({ theme, editable }) =>
        editable ? theme.background : theme.inputDisabledBackground};
    color: ${({ theme }) => theme.text};
    padding : 10px 10px;
    font-size: 16px;
    border : 1px solid ${({ theme, isFocused }) => (isFocused ? theme.text : theme.inputBorder)};
    border-radius : 4px;
    font-family: GCB_Bold;
    
`
//forwardRef
//react에서 특정 컴포넌트가 받은 ref를 자식 컴포넌트의 특정 DOM요소나
//react native 컴포넌트로 전달할 수 있도록 하는 기능
//forwardRef((props,ref))=>{}); 
const Input = forwardRef(
    (
        {
            label,
            value,
            onChangeText,
            onSubmitEditing,
            onBlur,
            placeholder,
            isPassword,
            returnKeyType,
            maxLength,
            disabled,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        return (
            <Container>
                <Label isFocused={isFocused}>{label}</Label>
                <StyledTextInput
                    ref={ref}//login에서 정의된 useRef를 전달
                    isFocused={isFocused}//해당 input이 포커스가 된 상태냐
                    value={value}//호출한쪽에서 넘어온 값
                    onChangeText={onChangeText}//호출한쪽에서 넘어온 함수 
                    onSubmitEditing={onSubmitEditing}//호출한쪽에서 넘어온 함수
                    onFocus={() => setIsFocused(true)}//input 포커스가 잡힐때 실행
                    onBlur={() => { //input 포커스가 안될 때 실행
                        setIsFocused(false);
                        onBlur();//proptype에 디폴트가 설정한 값이 실행 
                    }}
                    placeholder={placeholder} //가이드라인
                    secureTextEntry={isPassword} //전달된 패스워드가 true이면 암호화 false면 글씨 표시 
                    returnKeyType={returnKeyType}//키보드 완료버튼 (확인인지 넥스트인지)
                    maxLength={maxLength}//글씨 몇글자까지 
                    autoCapitalize="none"//첫글짜 대문자 안나오게
                    autoCorrect={false}//단어 추천기능 안뜨게
                    textContentType="none"//iOS에서만 사용 옵션, 옵션따라 뜨는 키보드 달라짐 
                    underlineColorAndroid="transparent"//컴포넌트의 밑줄 색상 설정할 때 사용 (안드로이드)
                    editable={!disabled}//해당 컴포넌트를 수정할수 잇냐(true) 없냐(false)
                />
            </Container>
        );
    }
);
Input.defaultProps = {
    onBlur: () => { },
    onChangeText: () => { },
    onSubmitEditing: () => { },
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    isPassword: PropTypes.bool,
    returnKeyType: PropTypes.oneOf(['done', 'next']),
    maxLength: PropTypes.number,
    onSubmitEditing: PropTypes.func,
    editable: PropTypes.bool,
}

export default Input;
```

# 코드설명

```JS
const input = forwardRef((props,ref))=>{...};
```
1. forwardRef
    - forwardRef는 React 컴포넌트에서 ref를 전달하기 위한 특별한 함수임
    - 일반적으로 부모 컴포넌트에서 자식 컴포넌트로 ref를 전달할 수 없지만, forwardRef를 사용하면 가능함
    - 이 코드에서는 Input 컴포넌트가 받은 ref를 내부의 StyledTextInput 컴포넌트로 전달하여, 부모 컴포넌트에서 직접 TextInput에 접근할 수 있게 함
```JS
Input.defaultProps = {
    onBlur: () => { },
    onChangeText: () => { },
    onSubmitEditing: () => { },
};
```
1. defaultProps : 컴포넌트의 기본 props 값을 설정하는 방법임
    1. 안전성 확보
        - props가 전달되지 않았을 때 발생할 수 있는 에러를 방지함
        - undefined나 null로 인한 런타임 에러를 예방할 수 있음
    2. 컴포넌트 재사용성 향상
        - 필수적이지 않은 props에 대해 기본값을 제공함으로써 컴포넌트를 더 유연하게 사용할 수 있음
        - 최소한의 props만으로도 컴포넌트를 사용할 수 있게 함
    3. 코드 가독성과 유지보수성 향상
        - 컴포넌트가 사용하는 props의 기본값을 한 눈에 파악할 수 있음
        - 다른 개발자가 컴포넌트를 사용할 때 참고할 수 있는 문서 역할을 함
    4. 개발 효율성 증가
        - 매번 모든 props를 전달할 필요 없이, 필요한 props만 전달하면 됨
        - 반복적인 코드 작성을 줄일 수 있음
    5. 이렇게 defaultProps를 사용함으로써 더 안정적이고 유연한 컴포넌트를 만들 수 있음
2. () => { }의 의미
    - 빈 함수(empty function)를 의미임
    - 이 코드에서는 onBlur, onChangeText, onSubmitEditing에 대해 기본값으로 빈 함수를 설정했음
    - 이렇게 하면 사용자가 이 props를 전달하지 않아도 에러가 발생하지 않음
```JS
Input.propTypes = {...}
```
1. Input.propTypes사용하는 이유
    - propTypes는 컴포넌트가 받는 props의 타입을 검증하는 도구임
    - 개발 단계에서 잘못된 타입의 props가 전달되는 것을 방지할 수 있음
    - 코드의 안정성과 가독성을 높여줌