# Context

```JS
import React, { createContext, useState } from "react";

// ImageContext 생성
export const ImageContext = createContext();

// ImageProvider 작성
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

// PlaceContext 생성
export const PlaceContext = createContext();

// PlaceProvider 작성
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
import axios from "axios"; // axios 임포트
import { UserContext } from "./UserContext";

// PostContext 생성
export const PostContext = createContext();

// PostProvider 작성
export const PostProvider = ({ children }) => {
  const [postList, setPostList] = useState([]);
  const {user} = useContext(UserContext);

// 게시글 삭제 함수
const deletePost = async (id) => {
  console.log(user)
  try {
    // axios를 사용하여 백엔드에 DELETE 요청을 보냄
    const response = await axios.delete(`http://192.168.3.25:9090/api/postDelete/${id}`, { 
      headers: { 
        'Authorization': `Bearer ${user.token}`
      }
    });
    
    if (response.status === 200) {
      // 성공적으로 삭제된 경우, 로컬 postList에서 삭제된 게시물 제거
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
  }); // 현재 로그인한 사용자 정보
  const [users, setUsers] = useState([]); // 모든 사용자 데이터 저장

  const dispatch = async (userData) => {
    try {
      if (!userData.userProfileImage) {
        userData.userProfileImage = require("../../assets/profile.jpg"); // 기본 이미지 경로
      }
      setUser(userData); // 상태 업데이트
      await AsyncStorage.setItem('user', JSON.stringify(userData)); // 사용자 정보를 AsyncStorage에 저장
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
      AsyncStorage.setItem('user', JSON.stringify(existingUser)); // 로그인 후 AsyncStorage에 저장
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
    }); // 사용자 상태 초기화
    AsyncStorage.removeItem('user'); // AsyncStorage에서 사용자 정보 삭제
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 앱이 켜질 때 AsyncStorage의 사용자 데이터를 초기화
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

    loadUserData(); // 컴포넌트가 마운트될 때 사용자 정보를 초기화

    // React Native에서 Promise rejection을 잡는 방법
    window.onunhandledrejection = (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
    };

    return () => {
      window.onunhandledrejection = null; // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
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

```

```JS

```

```JS

```