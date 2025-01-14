# Context

```JS
import React, { createContext, useState } from "react";

//ImageContext 생성
export const ImageContext = createContext();

//ImageProvider 작성
export const ImageProvider = ({ children }) => {
  const [copyImage, setCopyImage] = useState([]);

  return (
    <ImageContext.Provider value={{ copyImage, setCopyImage }}>
      {children}
    </ImageContext.Provider>
  );
};
```

```JS
import React, { createContext, useState } from "react";

//PlaceContext 생성
export const PlaceContext = createContext();

//PlaceProvider 작성
export const PlaceProvider = ({ children }) => {
  const [placeList, setPlaceList] = useState([]);

  return (
    <PlaceContext.Provider value={{ placeList, setPlaceList }}>
      {children}
    </PlaceContext.Provider>
  );
};
```

```JS
import React, { createContext, useContext, useState } from "react";
import axios from "axios";//axios 임포트
import { UserContext } from "./UserContext";

//PostContext 생성
export const PostContext = createContext();

//PostProvider 작성
export const PostProvider = ({ children }) => {
  const [postList, setPostList] = useState([]);
  const {user} = useContext(UserContext);

//게시글 삭제 함수
const deletePost = async (id) => {
  console.log(user)
  try {
   //axios를 사용하여 백엔드에 DELETE 요청을 보냄
    const response = await axios.delete(`{백엔드 서버의 API 엔드포인트주소}/api/postDelete/${id}`, { 
      headers: { 
        'Authorization': `Bearer ${user.token}`
      }
    });
    
    if (response.status === 200) {
     //성공적으로 삭제된 경우, 로컬 postList에서 삭제된 게시물 제거
      setPostList((prevPostList) => prevPostList.filter((post) => post.postId !== id));
    } else {
      throw new Error("삭제 실패");
    }
  } catch (error) {
    console.error("게시물 삭제 오류:", error);
  }

};

return (
  <PostContext.Provider value={{ postList, setPostList, deletePost }}>
    {children}
  </PostContext.Provider>
);
};
```

```JS
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({
  user: { userId: null },
  dispatch: () => {},
  loginUser: () => {},
  logoutUser: () => {},
  registerUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    userName: null,
    userNickName: null,
    userPassword: null,
    userProfileImage: null,
    userPhoneNumber: null,
  });//현재 로그인한 사용자 정보
  const [users, setUsers] = useState([]);//모든 사용자 데이터 저장

  const dispatch = async (userData) => {
    try {
      if (!userData.userProfileImage) {
        userData.userProfileImage = require("../../assets/profile.jpg");//기본 이미지 경로
      }
      setUser(userData);//상태 업데이트
      await AsyncStorage.setItem('user', JSON.stringify(userData));//사용자 정보를 AsyncStorage에 저장
    } catch (error) {
      console.error('AsyncStorage 저장 실패:', error);
    }
  };

  const registerUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const loginUser = (userId, password) => {
    const existingUser = users.find((u) => u.userId === userId && u.userPassword === password);
    if (existingUser) {
      setUser(existingUser);
      AsyncStorage.setItem('user', JSON.stringify(existingUser));//로그인 후 AsyncStorage에 저장
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setUser({
      userId: null,
      userName: null,
      userNickName: null,
      userPassword: null,
      userProfileImage: null,
      userPhoneNumber: null,
    });//사용자 상태 초기화
    AsyncStorage.removeItem('user');//AsyncStorage에서 사용자 정보 삭제
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
       //앱이 켜질 때 AsyncStorage의 사용자 데이터를 초기화
        await AsyncStorage.removeItem('user');
        setUser({
          userId: null,
          userName: null,
          userNickName: null,
          userPassword: null,
          userProfileImage: null,
          userPhoneNumber: null,
        });
      } catch (error) {
        console.error('사용자 데이터 초기화 실패:', error);
      }
    };

    loadUserData();//컴포넌트가 마운트될 때 사용자 정보를 초기화

   //React Native에서 Promise rejection을 잡는 방법
    window.onunhandledrejection = (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
    };

    return () => {
      window.onunhandledrejection = null;//컴포넌트가 언마운트될 때 이벤트 리스너 제거
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, users, registerUser, loginUser, logoutUser, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
```


# 코드설명

```JS
export const ImageProvider = ({ children }) => { ... };
```
1. children의 역할 : React Native에서 컴포넌트의 "내부 구조"를 전달하는 특별한 prop임
2. children의 역할 예시
```JS
//CustomCard.js (커스텀 컴포넌트)
const CustomCard = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

//사용 예시
const HomeScreen = () => {
  return (
    <CustomCard>
      <Text>안녕하세요!</Text>
      <Image source={require('./image.jpg')} />
      <Button title="클릭" />
    </CustomCard>
  );
};
```
- 여기서 <CustomCard\> 와 </CustomCard\> 사이에 있는 모든 요소들(Text, Image, Button)이 children이 됨
- 마치 "상자"처럼 다른 컴포넌트들을 감싸서 구조를 만드는 역할을 함

```JS
<ImageContext.Provider value={{ copyImage, setCopyImage }}>
```
1. .Provider의 역할 : React Native 앱 전체에서 상태 관리를 위해 사용됨
2. value={{...}}의 역할
  - Context를 통해 공유하고자 하는 값들을 지정하는 prop임
  - Context를 통해 공유하고자 하는 데이터와 함수들을 담는 "컨테이너" 역할을 한다고 볼 수 있음

```JS
import axios from "axios";

const response = await axios.delete(...);
```
1. PostContext에서만 axios를 사용한 이유?
  - 서버와의 통신이 필요한 부분이 게시글 관련 기능이기 때문임
  - 다른 Context들(Image, Place)은 주로 로컬 상태 관리용임
  - React Native에서는 fetch 대신 axios를 사용하면 iOS/Android 모두에서 일관된 동작을 보장받을 수 있음

```JS
import AsyncStorage from '@react-native-async-storage/async-storage';
```
1. AsyncStorage
  - React Native의 영구 저장소 시스템임
  - 웹의 localStorage와 비슷하지만 비동기적으로 동작함
  
  |localStorage|AsyncStorage|
  |---|---|
  |작업이 즉시 완료되고 다음 줄로 넘어감(동기식)|- 작업이 완료될 때까지 기다려야함(비동기식)<br>- 모바일 기기의 저장소 접근은 시간이 더 걸릴 수 있기 때문<br>- 다른 작업을 방해하지 않도록 비동기로 처리<br>- async/await 또는 .then()을 사용해야 함|
  
  - AsyncStorage는 비동기 처리를 통해 앱의 성능과 사용자 경험을 개선
  - 주로 사용자 설정, 로그인 토큰 등을 저장하는 데 사용됨
2. @react-native-async-storage/async-storage : syncStorage를 사용하기 위해 설치하는 패키지지
```JS
await AsyncStorage.setItem('user', JSON.stringify(userData));
```
1. JSON.stringify(userData)
  - userData는 로그인한 사용자의 실제 정보임
  - AsyncStorage는 문자열만 저장할 수 있어서 객체를 JSON 문자열로 변환해야 함
```JS
const existingUser = users.find((u) => u.userId === userId && u.userPassword === password);
```
1. u
  - find 메서드의 u
  - u는 사용자 배열의 각 객체를 나타내는 매개변수임
  - React Native에서 주로 FlatList나 ScrollView의 데이터를 처리할 때도 비슷한 패턴을 사용함
```JS
window.onunhandledrejection = null;
```
1. window.onunhandledrejection = null -> React Native에서는 실제로 이 코드가 필요하지 않음
2. 수정된코드
```JS
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNErrorBoundary } from 'react-native'; //에러 처리를 위한 임포트

export const UserContext = createContext({
 user: { userId: null },
 dispatch: () => {},
 loginUser: () => {},
 logoutUser: () => {},
 registerUser: () => {},
});

export const UserProvider = ({ children }) => {
 const [user, setUser] = useState({
   userId: null,
   userName: null,
   userNickName: null,
   userPassword: null,
   userProfileImage: null,
   userPhoneNumber: null,
 }); //현재 로그인한 사용자 정보
 
 const [users, setUsers] = useState([]); //모든 사용자 데이터 저장

 const dispatch = async (userData) => {
   try {
     if (!userData.userProfileImage) {
       userData.userProfileImage = require("../../assets/profile.jpg"); //기본 이미지 경로
     }
     setUser(userData); //상태 업데이트
     await AsyncStorage.setItem('user', JSON.stringify(userData)); //사용자 정보를 AsyncStorage에 저장
   } catch (error) {
     console.error('AsyncStorage 저장 실패:', error);
   }
 };

 const registerUser = (newUser) => {
   setUsers((prevUsers) => [...prevUsers, newUser]);
 };

 const loginUser = (userId, password) => {
   const existingUser = users.find((u) => u.userId === userId && u.userPassword === password);
   if (existingUser) {
     setUser(existingUser);
     AsyncStorage.setItem('user', JSON.stringify(existingUser)); //로그인 후 AsyncStorage에 저장
     return true;
   }
   return false;
 };

 const logoutUser = () => {
   setUser({
     userId: null,
     userName: null,
     userNickName: null,
     userPassword: null,
     userProfileImage: null,
     userPhoneNumber: null,
   }); //사용자 상태 초기화
   AsyncStorage.removeItem('user'); //AsyncStorage에서 사용자 정보 삭제
 };

 useEffect(() => {
   const loadUserData = async () => {
     try {
       //앱이 켜질 때 AsyncStorage의 사용자 데이터를 초기화
       await AsyncStorage.removeItem('user');
       setUser({
         userId: null,
         userName: null,
         userNickName: null,
         userPassword: null,
         userProfileImage: null,
         userPhoneNumber: null,
       });
     } catch (error) {
       console.error('사용자 데이터 초기화 실패:', error);
     }
   };

   loadUserData(); //컴포넌트가 마운트될 때 사용자 정보를 초기화

   //에러 처리 설정
   const handleError = (error) => {
     console.warn('Unhandled promise rejection:', error);
   };
   
   if (__DEV__) {
     //개발 모드에서만 에러 처리
     const subscription = RNErrorBoundary.subscribe(handleError);
     return () => subscription.unsubscribe(); //컴포넌트 언마운트시 구독 해제
   }
 }, []);

 return (
   <UserContext.Provider value={{ user, users, registerUser, loginUser, logoutUser, dispatch }}>
     {children}
   </UserContext.Provider>
 );
};
```
- 주요 변경사항:
  1. window.onunhandledrejection 관련 코드를 제거하고 React Native의 에러 처리 방식으로 변경함
  2. RNErrorBoundary를 사용한 에러 구독 방식 도입함
  3. DEV 플래그를 사용하여 개발 모드에서만 에러 처리 적용함
  4. 컴포넌트 언마운트시 에러 구독 해제 로직 추가됨됨
  5. 이 코드는 React Native의 방식에 더 적합하게 에러 처리를 구현함
  6. 개발 모드에서만 에러 처리를 하고, 컴포넌트가 언마운트될 때 적절히 정리됨