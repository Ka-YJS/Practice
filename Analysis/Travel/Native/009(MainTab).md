# MainTab.js

```JS
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Profile, ChannelList, Main, Map, MyPage, Post } from "../screens/index";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "styled-components";
import { CardStyleInterpolators } from '@react-navigation/stack';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//TabBarIcon 컴포넌트
const TabBarIcon = ({ focused, name }) => {
    const theme = useContext(ThemeContext);
    return (
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
        />);}

//Main 탭 내부에 스택 네비게이터 생성
const MainScreenStack = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureEnabled: true,
                headerTitleStyle: {
                    fontFamily: 'GCB_Bold',//폰트 설정
                },
            }}>
            <Stack.Screen
                name="MainScreen"
                component={Main}
                options={({ navigation }) => ({
                    title: "",
                    headerRight: () => (
                        <MaterialIcons
                            name="person"
                            size={26}
                            style={{ margin: 10 }}
                            onPress={() => {
                                navigation.push('MyPage');
                            }}/>
                    )
                })}/>
            <Stack.Screen
                name="MyPage"
                component={MyPage}
                options={{
                    title: "내 정보",
                }}/>
        </Stack.Navigator>);}

const MainTab = () => {
    const theme = useContext(ThemeContext);

    return (
        <Tab.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.tabActiveColor,
                tabBarInactiveTintColor: theme.tabInactiveColor,
                headerTitleStyle: {
                    fontFamily: 'GCB_Bold',//폰트 설정
                },
            }}>
            <Tab.Screen
                name="Map"
                component={Map}
                options={{
                    title:"Record",
                    tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "edit" }),
                }}/>
            <Tab.Screen
                name="Main"
                component={MainScreenStack}//MainScreenStack으로 변경
                options={{
                    tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "home" }),
                }}/>
            <Tab.Screen
                name="Post"
                component={Post}
                options={{
                    tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "apps" }),
                }}/>
        </Tab.Navigator>
    );
}

export default MainTab;
```

# 코드설명

```JS
const Tab = createBottomTabNavigator();

const MainTab = () => {
    <Tab.Navigator>
    </Tab.Navigator>
}
```
1. createBottomTabNavigator
    -  React Navigation의 bottom tab navigation을 생성하는 함수임
    - 화면 하단에 탭 바를 만들어 여러 화면 간의 네비게이션을 구현함
    - Tab.Navigator는 전체 탭 네비게이션의 컨테이너 역할을 하며, 그 안에 Tab.Screen들이 각각의 탭 화면을 정의함

```JS
import { CardStyleInterpolators } from '@react-navigation/stack';

screenOptions={{
    headerTitleAlign: "center",
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureEnabled: true,
    headerTitleStyle: {
        fontFamily: 'GCB_Bold',//폰트 설정
    },
}}
```
1. CardStyleInterpolators : CardStyleInterpolators는 화면 전환 애니메이션을 정의하는 객체임
2. CardStyleInterpolators.forHorizontalIOS, gestureEnabled: true, ...
    - forHorizontalIOS : iOS 스타일의 가로 방향 슬라이드 애니메이션을 적용함
    - gestureEnabled: true: 제스처 기반 네비게이션을 활성화함(화면을 스와이프하여 뒤로 가기 등)
```JS
tabBarIcon: ({ focused }) => TabBarIcon({ focused, name: "xxxx" })
```
1. { focused }의 의미 : 현재 탭이 선택되었는지 여부를 나타내는 boolean 값임
2. TabBarIcon({ focused, name: "xxxx" })
    - 아이콘 컴포넌트에 props를 전달하는 구문임
    - focused : 현재 탭의 활성화 상태
    - name : MaterialIcons에서 사용할 아이콘의 이름