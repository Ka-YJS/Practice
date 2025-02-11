# Login.js

```JS
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { validateEmail, validatePassword, removeWhitespace } from '../utils/common';
import { UserContext } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground, Modal, Text, TouchableOpacity } from 'react-native';

const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  justify-content: center;
  align-items: center;
  
`;

const ModalContainer = styled.View`
  width: 90%; 
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  elevation: 5; /* 그림자 효과 (Android) */
  shadow-color: #000; /* 그림자 효과 (iOS) */
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  font-family: GCB_Bold;
`;

const ErrorText = styled.Text`
  align-items : flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
  font-family: GCB_Bold;
`;

const Background = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin:3%;
  width: 300px;
`;

const LogoContainer = styled.View`
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  border: 3px solid ${({ theme }) => theme.logoBorder};
`;

const Login = ({ navigation }) => {
  const { dispatch } = useContext(UserContext);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFindId, setIsFindId] = useState(false);
  
  //아이디 찾기 상태
  const [findIdName, setFindIdName] = useState('');
  const [findIdPhone, setFindIdPhone] = useState('');
  const [findIdError, setFindIdError] = useState('');

  //비밀번호 찾기 상태
  const [findPasswordEmail, setFindPasswordEmail] = useState('');
  const [findPasswordName, setFindPasswordName] = useState('');
  const [findPasswordPhone, setFindPasswordPhone] = useState('');
  const [findPasswordEmailError, setFindPasswordEmailError] = useState('');
  const [findPasswordNameError, setFindPasswordNameError] = useState('');
  const [findPasswordPhoneError, setFindPasswordPhoneError] = useState('');
  
  //비밀번호 찾기 단계
  const [findPasswordStage, setFindPasswordStage] = useState('initial'); //'initial', 'emailRequested', 'emailVerified'
  const [authCode, setAuthCode] = useState('');
  const [authCodeError, setAuthCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  //새 비밀번호 상태
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  //로그인 아이디 핸들러
  const _handleLoginIdChange = loginId => {
    const changedLoginId = removeWhitespace(loginId);
    setLoginId(changedLoginId);
    setErrorMessage(
      validateEmail(changedLoginId) ? '' : '이메일(아이디) 형식을 확인하세요'
    );
  };

  //로그인 패스워드 핸들러
  const _handlePasswordChange = loginPassword => {
    setLoginPassword(removeWhitespace(loginPassword));
  };

  const _handleLoginButtonPress = async () => {
    if (!validateEmail(loginId) || !loginPassword) {
      setErrorMessage('아이디와 비밀번호를 확인하세요');
      return;
    }

    //로그인 백엔드에 보낼 객체
    const userProfile = {
      userId: loginId,
      userPassword: loginPassword
    };

    try {
      const response = await axios.post(
        '백엔드 엔드포인트/travel/login', //백엔드 엔드포인트
        userProfile,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data) {
        //서버에서 받은 userProfileImage 경로를 절대 URL로 변환
        const updatedUserData = {
          ...response.data,
          userProfileImage: `백엔드 엔드포인트${response.data.userProfileImage}`
        };

        //변환된 userProfileImage를 포함한 데이터로 UserContext 업데이트
        dispatch(updatedUserData); //UserContext에 사용자 정보 저장

        console.log(updatedUserData); //확인용
        alert(`로그인 성공! 환영합니다, ${response.data.userNickName} 님!`);
        //토큰 저장 예시
        await AsyncStorage.setItem('userToken', response.data.token);
      } else {
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  //아이디 찾기
  const handleFindId = async () => {
    
      setFindIdError(null);

      console.log("Request Body:", {
        userName: findIdName,
        userPhoneNumber: findIdPhone,
      });
    
    //유효성 검사
    if (!findIdName) {
      setFindIdError('이름을 입력해주세요.');
      return;
    }
    if (!findIdPhone) {
      setFindIdError('전화번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('백엔드 엔드포인트/travel/userFindId', { 
        userName: findIdName, 
        userPhoneNumber: findIdPhone,
      });
    
      if (response.data) {
        alert(`아이디는 ${response.data.userId}입니다.`);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.log("Error caught:", error); //디버깅
      if (error.response) {
        console.log("Error response data:", error.response.data); //서버 응답 확인
        setFindIdError(error.response.data.error || "알 수 없는 오류가 발생했습니다.");
      } else if (error.request) {
        console.log("Error request:", error.request); //요청 실패 확인
        setFindIdError("서버와 연결할 수 없습니다. 네트워크를 확인하세요.");
      } else {
        console.log("Axios error message:", error.message); //Axios 자체 문제
        setFindIdError(`요청 중 문제가 발생했습니다: ${error.message}`);
      }
    }
    
  };

  ///인증 코드 발송
  const handleSendPasswordResetAuthCode = async () => {
    let hasError = false;

    if (!validateEmail(findPasswordEmail)) {
        setFindPasswordEmailError('올바른 이메일 형식을 입력해주세요.');
        hasError = true;
    } else {
        setFindPasswordEmailError('');
    }

    if (!findPasswordName) {
        setFindPasswordNameError('이름을 입력해주세요.');
        hasError = true;
    } else {
        setFindPasswordNameError('');
    }

    if (!findPasswordPhone) {
        setFindPasswordPhoneError('전화번호를 입력해주세요.');
        hasError = true;
    } else {
        setFindPasswordPhoneError('');
    }

    if (hasError) return;

    try {
        setIsLoading(true);

        const requestData = {
            userId: findPasswordEmail,
            userName: findPasswordName,
            userPhoneNumber: findPasswordPhone,
        };

        console.log("Sending data to /findPassword:", requestData);

        const userVerifyResponse = await axios.post(
          '백엔드 엔드포인트/travel/userFindPassword',
          requestData,
          {
              headers: {
                  'Content-Type': 'application/json',
              },
          }
      );

        console.log("findPassword response:", userVerifyResponse.data);

        if (userVerifyResponse.data) {
            const authCodeResponse = await axios.get(
                `백엔드 엔드포인트/api/email/auth?address=${findPasswordEmail}`
            );

            if (authCodeResponse.data.success) {
                alert("인증 코드가 이메일로 전송되었습니다.");
                setFindPasswordStage('emailRequested');
            } else {
                setFindPasswordEmailError("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
            }
        } else {
            setFindPasswordEmailError("입력하신 정보와 일치하는 계정이 없습니다.");
        }
    } catch (error) {
        console.error("비밀번호 찾기 인증 코드 발송 실패:", error);
        setFindPasswordEmailError("인증 코드 발송 중 오류가 발생했습니다.");
    } finally {
        setIsLoading(false);
    }
};

  //인증 코드 확인
  const handleVerifyAuthCode = async () => {
    if (!authCode) {
      setAuthCodeError("인증 코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`백엔드 엔드포인트/api/email/auth?address=${findPasswordEmail}&authCode=${authCode}`);

      if (response.data.success) {
        alert("이메일 인증이 완료되었습니다.");
        setFindPasswordStage('emailVerified');
      } else {
        setAuthCodeError("인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("인증 코드 검증 실패:", error);
      setAuthCodeError("인증 코드 검증 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


  //새 비밀번호 변경
  const handleResetPassword = async () => {
    let hasError = false;

    if (!validatePassword(newPassword)) {
      setNewPasswordError('비밀번호는 8자 이상이며, 특수문자를 포함해야 합니다.');
      hasError = true;
    } else {
      setNewPasswordError('');
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('새 비밀번호가 일치하지 않습니다.');
      hasError = true;
    } else {
      setConfirmNewPasswordError('');
    }

    if (hasError) return;

    try {
      const response = await axios.post('백엔드 엔드포인트/travel/userResetPassword', {
        userId: findPasswordEmail,
        userPassword: newPassword
      });
      
      if (response.data) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setFindPasswordStage('initial');
        setIsModalVisible(false);
      } else {
        setNewPasswordError('비밀번호 변경에 실패했습니다.');
        console.error("비밀번호 변경 실패:", error);
      }
    } catch (error) {
      setNewPasswordError('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <Background source={require("../../assets/flowers.png")} resizeMode="cover">
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container>
        {/* 로고 추가 */}
        <LogoContainer>
          <Logo source={require('../../assets/Logo.png')} />
        </LogoContainer>
        {/* 아이디 */}
        <Input
          label="아이디"
          value={loginId}
          onChangeText={_handleLoginIdChange}
          onSubmitEditing={() => { }}
          placeholder="Email"
          returnKeyType="next"
          
        />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        {/* 패스워드 */}
        <Input
          label="비밀번호"
          value={loginPassword}
          onChangeText={_handlePasswordChange}
          onSubmitEditing={() => { }}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20, backgroundColor: "rgba(255, 255, 255, 0.7)" }} onPress={() => setIsModalVisible(true)}>
          <Text style={{ color: '#13C3F5', fontFamily:"GCB_Bold" }}>아이디 / 비밀번호 찾기</Text>
        </TouchableOpacity>

        <Button title="로그인" onPress={_handleLoginButtonPress} />
        <Button title="회원가입" onPress={() => navigation.navigate('Signup')} isFilled={false} />

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <ModalBackground>
            <ModalContainer>
              {/* 모달 제목 및 닫기 버튼 */}
              <CloseButton onPress={() => setIsModalVisible(false)}>
                <Text style={{ fontSize: 20 }}>×</Text>
              </CloseButton>
              
              {isFindId ? (
                //아이디 찾기
                <>
                  <ModalTitle>아이디 찾기</ModalTitle>
                  <Input 
                    label="이름" 
                    value={findIdName} 
                    onChangeText={setFindIdName} 
                  />
                  <Input 
                    label="전화번호" 
                    value={findIdPhone} 
                    onChangeText={setFindIdPhone} 
                  />
                   {findIdError && <ErrorText>{findIdError}</ErrorText>}
                  <Button title="아이디 찾기" onPress={handleFindId} />
                </>
              ) : (
                //비밀번호 찾기
                <>
                  <ModalTitle>비밀번호 찾기</ModalTitle>
                  
                  {/* 초기 정보 입력 단계 */}
                  {findPasswordStage === 'initial' && (
                    <>
                      <Input 
                        label="이메일" 
                        value={findPasswordEmail} 
                        onChangeText={setFindPasswordEmail} 
                      />
                      {findPasswordEmailError && <ErrorText>{findPasswordEmailError}</ErrorText>}
                      
                      <Input 
                        label="이름" 
                        value={findPasswordName} 
                        onChangeText={setFindPasswordName} 
                      />
                      {findPasswordNameError && <ErrorText>{findPasswordNameError}</ErrorText>}
                      
                      <Input 
                        label="전화번호" 
                        value={findPasswordPhone} 
                        onChangeText={setFindPasswordPhone} 
                      />
                      {findPasswordPhoneError && <ErrorText>{findPasswordPhoneError}</ErrorText>}
                      
                      <Button 
                        title="인증 코드 발송" 
                        onPress={handleSendPasswordResetAuthCode} 
                        disabled={isLoading}
                      />
                    </>
                  )}
                  
                  {/* 인증 코드 입력 단계 */}
                  {findPasswordStage === 'emailRequested' && (
                    <>
                      <Input 
                        label="인증 코드" 
                        value={authCode} 
                        onChangeText={setAuthCode} 
                        placeholder="인증 코드를 입력하세요"
                      />
                      {authCodeError && <ErrorText>{authCodeError}</ErrorText>}
                      <Button 
                        title="인증 코드 확인" 
                        onPress={handleVerifyAuthCode} 
                        disabled={isLoading}
                      />
                    </>
                  )}
                  
                  {/* 인증 코드 확인 후 단계 */}
                  {findPasswordStage === 'emailVerified' && (
                    <>
                      <Input 
                        label="새 비밀번호" 
                        value={newPassword} 
                        onChangeText={setNewPassword} 
                        isPassword
                      />
                      {newPasswordError && <ErrorText>{newPasswordError}</ErrorText>}
                      
                      <Input 
                        label="새 비밀번호 확인" 
                        value={confirmNewPassword} 
                        onChangeText={setConfirmNewPassword} 
                        isPassword
                      />
                      {confirmNewPasswordError && <ErrorText>{confirmNewPasswordError}</ErrorText>}
                      
                      <Button 
                        title="비밀번호 변경" 
                        onPress={handleResetPassword} 
                      />
                    </>
                  )}
                  
                </>
              )}

              <Button 
                title="닫기" 
                onPress={() => setIsModalVisible(false)} 
                isFilled={false} 
              />
              <Button 
                title={isFindId ? '비밀번호 찾기' : '아이디 찾기'} 
                onPress={() => {
                  setIsFindId(!isFindId);
                  //상태 초기화
                  setFindPasswordStage('initial');
                  setFindPasswordEmailError('');
                  setFindPasswordNameError('');
                  setFindPasswordPhoneError('');
                  setAuthCodeError('');
                }} 
                isFilled={false} 
              />
            </ModalContainer>
          </ModalBackground>
        </Modal>
      </Container>
    </KeyboardAwareScrollView>
    </Background>
  );
};

export default Login;
```

# 코드설명

```JS
const _handleLoginButtonPress = async () => {
  if (!validateEmail(loginId) || !loginPassword) {
    setErrorMessage('아이디와 비밀번호를 확인하세요');
    return;
  }
}
```
1. async의 역할
  - async 키워드는 해당 함수가 비동기 작업을 포함하고 있음을 선언함
  - 로그인 과정에서는 서버와의 통신이 필요한데, 이는 시간이 걸리는 작업임
  - async 함수 내에서 await 키워드를 사용하여 비동기 작업(서버 응답 대기)이 완료될 때까지 기다릴 수 있음
  - 이를 통해 서버 응답을 기다리는 동안 앱이 멈추지 않고 다른 작업을 수행할 수 있음
```JS
const updatedUserData = {
  ...response.data,
  userProfileImage: `백엔드 엔드포인트${response.data.userProfileImage}`
};
```
1. ...response.data
  - 이것은 스프레드 연산자(spread operator)를 사용한 것임
  - response.data 객체의 모든 속성을 새로운 객체에 복사함
  - 모든 속성을 새 객체에 복사하고, 그 후에 새 값으로 덮어쓰게 됨
```JS
const userVerifyResponse = await axios.post(
  '백엔드 엔드포인트/travel/userFindPassword',
  requestData,
  {headers: {
          'Content-Type': 'application/json',}
  ,}
);
```
1. headers의 역할
  - HTTP 요청에서 중요한 메타데이터를 전달하는 역할을 함
  - 이 코드에서는 3가지의 역할을 함
    1. 데이터 형식 명시
      - 서버에게 전송하는 데이터가 JSON 형식임을 알림
      - 이를 통해 서버는 받은 데이터를 어떻게 파싱(해석)해야 할지 알 수 있음
    2. 올바른 데이터 처리 보장 : JavaScript 객체를 전송할 때, application/json 헤더는 이 데이터가 자동으로 JSON 문자열로 변환되어 전송되도록 함
    3. 서버-클라이언트 통신 규약
      - 이는 일종의 약속으로, 서버 측에서도 이 헤더를 보고 JSON 형식의 데이터가 전송되었음을 인지하고 적절히 처리할 수 있음
      - 만약 이 헤더가 없다면, 서버는 데이터를 어떤 형식으로 해석해야 할지 혼란스러울 수 있음
      - 이러한 헤더 설정은 HTTP 통신에서 데이터의 안전하고 정확한 전송을 보장하는 중요한 역할을 함함
```JS
if (hasError) return;
```
1. if (hasError) return;의 의미
  - 이는 early return 패턴을 사용한 에러 처리 방식임
  - hasError가 true인 경우 함수의 실행을 즉시 중단하며, 이전 코드에서 유효성 검사를 수행하면서 에러가 발견되면 hasError를 true로 설정함
  - 이를 통해 에러가 있을 경우 불필요한 서버 요청을 방지하고, 코드의 실행을 조기에 중단할 수 있음
  - 예를 들어 이메일 형식이 잘못되었거나, 필수 필드가 비어있는 경우 서버로 요청을 보내지 않고 함수를 종료함