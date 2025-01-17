# AuthStack.js

```JS
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { createStackNavigator } from '@react-navigation/stack';
import { Login, Signup } from '../screens';

const Stack = createStackNavigator();

const AuthStack = () => {
    const theme = useContext(ThemeContext);
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTitleAlign: 'center',
                cardStyle: { backgroundColor: theme.background },
                headerTitleStyle: {
                    fontFamily: 'GCB_Bold',//폰트 설정
                    fontSize: 20,//폰트 크기 설정
                    color: theme.text,//제목 색상 설정
                },
            }}>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerLeft: () => null,
                    headerTitle: "로그인"
                }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                    headerTitle: "회원 가입"
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
```

# 코드설명

```JS
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
```
1. createStackNavigator
    - React Navigation에서 제공하는 스택 형식의 네비게이션을 생성하는 함수임
    - 화면이 위로 쌓이는 방식으로 동작하며, 일반적인 모바일 앱의 화면 전환 방식을 구현함
    - props drilling을 피하고 전역적으로 테마에 접근할 수 있음(중간 컴포넌트들을 거치지 않고도 필요한 컴포넌트에서 직접 데이터를 사용할 수 있음)
    <br>*props drilling : 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달할 때, 중간에 있는 컴포넌트들을 거쳐가야 하는 현상을 말함
```JS
import { ThemeContext } from 'styled-components';

const theme = useContext(ThemeContext);
```
1. ThemeContext 사용이유
    - 앱 전체에서 일관된 테마(색상, 스타일 등)를 관리하기 위해 사용됨
    - 다크모드/라이트모드 같은 테마 전환을 쉽게 구현할 수 있음
    - 
2. useContext(ThemeContext)의 의미
    - useContext Hook을 사용하여 ThemeContext에서 제공하는 테마 정보를 가져옴
    - 상위 컴포넌트에서 제공한 테마 객체를 직접 사용할 수 있게 됨