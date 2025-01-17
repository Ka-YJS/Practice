# MainStack.js

```JS
import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { createStackNavigator } from '@react-navigation/stack'
import MyPost from "../screens/MyPost";
import Login from "../screens/Login";
import { Main } from "../screens";
import MainTab from "./MainTab";
import PostDetail from "../screens/PostDetail";
import EditPost from "../screens/EditPost";

const Stack = createStackNavigator();

const MainStack = () => {
    const theme = useContext(ThemeContext);
    return(
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign:"left",
                headerTintColor:theme.headerTintColor,
                cardStyle:{backgroundColor:theme.background},
                headerBackTitleVisible:false,
                headerTitleStyle: {
                    fontFamily: 'GCB_Bold',//폰트 설정
                },
            }}>
            <Stack.Screen 
                name="MainTab" 
                component={MainTab}
                options={{
                    headerShown:false,
                }}/>
            <Stack.Screen
                name="MyPost"
                component={MyPost}
                options={{ 
                    title: '내 기록 보기',
                    headerTitleAlign : "center",
                    headerTitleStyle: {
                        fontFamily: 'GCB_Bold',//폰트 설정
                    }, 
                }}/>
            <Stack.Screen 
                name="PostDetail" 
                component={PostDetail} 
                options={{ 
                    title: "기록 상세", headerTitleAlign : "center",
                    headerTitleStyle: {
                        fontFamily: 'GCB_Bold',//폰트 설정
                    },
                }}/>
            <Stack.Screen
                name="EditPost"
                component={EditPost}
                options={{
                    title: "기록 수정", headerTitleAlign : "center",
                    headerTitleStyle: {
                        fontFamily: 'GCB_Bold',//폰트 설정
                    },
                }}/>
        </Stack.Navigator>
    )
}

export default MainStack;
```

# 코드설명

```JS
<Stack.Navigator
    screenOptions={{
        headerTitleAlign:"left",
        headerTintColor:theme.headerTintColor,
        cardStyle:{backgroundColor:theme.background},
        headerBackTitleVisible:false,
        headerTitleStyle: {
            fontFamily: 'GCB_Bold',//폰트 설정
        },
 }}>
```
1. screenOptions : Stack.Navigator 내의 모든 화면(Screen)에 공통적으로 적용될 기본 설정을 정의하는 역할을 함
2. screenOptions의 세부사항
    - headerTitleAlign : "left" -> 모든 스크린의 헤더 타이틀을 왼쪽 정렬함
    - headerTintColor : theme.headerTintColor -> 헤더의 색상을 테마에서 정의한 색상으로 설정함
    - cardStyle : {backgroundColor: theme.background} -> 스크린의 배경색을 테마 색상으로 설정함
    - headerBackTitleVisible : false -> iOS에서 뒤로가기 버튼의 텍스트를 숨김김
    - headerTitleStyle: 모든 헤더 타이틀에 'GCB_Bold' 폰트를 적용함
```JS
<Stack.Navigator>
    <Stack.Screen/>
    <Stack.Screen/>
    <Stack.Screen/>
</Stack.Navigator>
```
1. Stack.Navigator의 역할
    - 앱의 화면 전환을 스택 형태로 관리함
    - 스택은 LIFO(Last In First Out) 구조로 작동함
    - 새로운 화면으로 이동할 때 이전 화면 위에 쌓이는 형태임
    - 뒤로가기를 하면 가장 위에 있는 화면이 제거됨
    - 기본적인 iOS/Android의 네비게이션 패턴을 따름
2. Stack.Screen의 역할
    - name: 화면의 고유 식별자로 사용됨
    - component: 실제로 렌더링될 React 컴포넌트를 지정함
    - options: 각 화면별로 다른 헤더 스타일이나 설정을 적용할 수 있음