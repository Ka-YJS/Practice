# Index.js

```JS
import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import MainStack from './MainStack';//MainStack을 제대로 import 했는지 확인
import { UserContext } from '../contexts/UserContext'; 

const Stack = createStackNavigator();

const Navigation = () => {
  const { user, dispatch } = useContext(UserContext);//현재 로그인한 사용자 정보 가져오기

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
      }
    };

    loadUserData();//앱 시작 시 사용자 정보 불러오기
  }, []);

  return (
    <NavigationContainer>
      {user.userId ? (
        <MainStack />//사용자 있을 경우 MainStack 렌더링
      ) : (
        <AuthStack />//사용자 없을 경우 AuthStack 렌더링
      )}
    </NavigationContainer>
  );
};

export default Navigation;
```

# 코드설명

```JS
const loadUserData = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  if (storedUser) {
    dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
  }
};
```
1. async
  - async는 비동기 함수를 정의할 때 사용하는 키워드임
  - AsyncStorage.getItem()이 비동기 작업이므로, 이를 처리하기 위해 async 함수로 선언함
  - async 함수는 항상 Promise를 반환하며, await 키워드를 사용할 수 있게 해줌
2. dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser)})
  - UserContext의 상태를 업데이트하는 액션을 발송함
  - type: 'SET_USER'는 수행할 액션의 종류를 지정함
  - payload: JSON.parse(storedUser)는 저장된 사용자 데이터를 JavaScript 객체로 변환하여 전달함
  - JSON.parse()는 문자열로 저장된 JSON 데이터를 JavaScript 객체로 변환함
  <br>(AsyncStorage는 문자열 형태로만 데이터를 저장하기 때문에 이 과정이 필요함)