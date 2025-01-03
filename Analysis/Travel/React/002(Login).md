# Login

```JS
import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin,GoogleOAuthProvider } from '@react-oauth/google'; //구글 로그인 라이브러리 import
import "../css/Strat.css";
import TopIcon from "../TopIcon/TopIcon";
import {call} from "../api/ ApiService";
import backgroundImage from "../image/back3.png"
import config from "../Apikey";
import axios from "axios";

const Login = () => {
  const { user,setUser,setGoogleUser } = useContext(UserContext); //`user` 배열로부터 사용자 정보를 가져옴
  const [loginId, setLoginId] = useState(""); //입력받은 ID 저장 useState
  const [loginPassword, setLoginPassword] = useState(""); //입력받은 비밀번호 상태 useState
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isFindUserId,setIsFindUserId] = useState(false);
  const [isFindPassword, setIsFindPassword] = useState(false);
  const [isNewPassword,setIsNewPassword] = useState(false);
  //passwordError 저장 useState
  const [passwordError, setPasswordError] = useState("");
  //phoneNumberError 저장 useState
  const [phoneNumberError,setPhoneNumberError] = useState("");
  //emailError 상태 저장 useState
  const [emailError, setEmailError] = useState(false);
  //email 인증상태 저장 useState
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  //email 인증코드 저장 useState
  const [authCode, setAuthCode] = useState("");
  //email 인증코드error 저장 useState
  const [authCodeError, setAuthCodeError] = useState("");
  //email 인증코드 발송 상태 저장 useState
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  //loading 상태 저장 useState
  const [isLoading, setIsLoading] = useState(false);
  const [findUserId,setFindUserId] = useState("");
  const [findUserName,setFindUserName] = useState("");
  const [findUserPhoneNumber,setFindUserPhoneNumber] = useState("");
  const navigate = useNavigate();
  
  //이메일 정규식
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //전화번호 정규식
  const validataeUserPhoneNumber = (userPhoneNumber) =>{
    const userPhoneNumberRegex = /^01\d{9}$/;
    return userPhoneNumberRegex.test(userPhoneNumber);
  }

  //비밀번호 정규식
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  };

  //회원가입 버튼
  const toSignup = () => {
    navigate('/Signup')
  };//회원가입 버튼 종료

  //ID 찾기 팝업창 확인 버튼
  const handleFindIdConfirm = async() => {

    if (!validataeUserPhoneNumber(findUserPhoneNumber)) {
      alert("전화번호는 - 들어가지않은 11자리 숫자로 이루어져야 됩니다..");
      return;
    }

    const userInfo = {
      userName: findUserName,
      userPhoneNumber: findUserPhoneNumber
    };

    console.log(userInfo)
    try {
      //ID찾기 call 메서드
      const response = await call("/travel/userFindId","POST",userInfo,user)

      if(response){
        console.log("ID찾기 call 메서드 response:"+response);
        setFindUserName("");
        setFindUserPhoneNumber("");
        setIsFindUserId(false)
        alert(`ID는 ${response.userId} 입니다`);        
      }
    } catch (error) {
      console.error("ID찾기 실패:", error);
      alert("이름or전화번호 확인해주세요");
    }
  }//ID 찾기 팝업창 확인 버튼 종료

  //이메일인증버튼
  const handleEmailVerification = async () => {

    //이메일 형식 검증
    if (!validateEmail(findUserId)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    console.log()
    //이메일 인증 코드 발송 전에 로딩 상태로 설정
    setIsLoading(true);

    try {
      const response = await axios.get(`http://${config.IP_ADD}:9090/travel/email/auth?address=${findUserId}`);
      
      if (response.data.success) {
        alert("이메일 인증 코드가 발송되었습니다. 인증 코드를 입력하세요.");
        setIsAuthCodeSent(true);
      } else {
        alert("이메일 인증 코드 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 인증 코드 발송 실패:", error);
      alert("이메일 인증 코드 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);//로딩 상태 해제
    }
  };

  //이메일 인증코드 체크
  const handleAuthCodeChange = (e) => {
    setAuthCode(e.target.value);
    setAuthCodeError("");//오류 초기화
  };

  //이메일 인증코드 확인버튼
  const handleAuthCodeVerification = async () => {
    if (!authCode) {
      setAuthCodeError("인증 코드를 입력해주세요.");
      return;
    }

    //인증 코드 검증
    await axios.post(`http://${config.IP_ADD}:9090/travel/email/auth?address=${findUserId}&authCode=${authCode}`)
      .then((response) => {
        const { success } = response.data;
        if (success) {
          setIsEmailVerified(true);
          alert("이메일 인증이 완료되었습니다.");
        } else {
          setAuthCodeError("인증 코드가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("인증 코드 검증 실패:", error);
        setAuthCodeError("인증 코드 검증 중 오류가 발생했습니다.");
      });

  };//이메일 인증코드 확인버튼


  //Password 찾기 팝업창 확인 버튼
  const handleFindPasswordConfirm = async () => {
    
    //이메일 인증 확인
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    //전화번호 정규식 검증    
    if (!validataeUserPhoneNumber(findUserPhoneNumber)) {
      alert("전화번호는 - 들어가지않은 11자리 숫자로 이루어져야 됩니다..");
      return;
    }
    
    try {
      const userInfo = {
        userId: findUserId,
        userName: findUserName,
        userPhoneNumber: findUserPhoneNumber,
      };
  
      const response = await call("/travel/userFindPassword","POST",userInfo,user)

      console.log("findPassword response:", response);

      if (response) {
        setAuthCode("");
        setFindUserName("");
        setFindUserPhoneNumber("");
        setIsNewPassword(true);
        setIsFindPassword(false);
        setIsEmailVerified(false);
        alert("새로운 비밀번호를 입력해주세요")
      } else {
          alert("입력하신 정보와 일치하는 계정이 없습니다.");
      }

    } catch (error) {
      alert("정보를 다시 확인해주세요");
    }

  }//Password 찾기 확인 버튼 종료

  const handleNewPassword = async() => {

    if (!validatePassword(newPassword)) {
      alert('비밀번호는 8자 이상이며, 특수문자를 포함해야 합니다.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {

      const userInfo = {
        userId: findUserId,
        userPassword: newPassword
      }

      const response = await call("/travel/userResetPassword","POST",userInfo,user)

      if(response){
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setFindUserId("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setIsNewPassword(false)
      }
    } catch (error) {
      alert("비밀번호 변경 실패");
    }
  }

  //로그인 버튼
  const handleLogin = async (event) => {

    event.preventDefault();

    const userProfile = {
      userId: loginId,
      userPassword: loginPassword
    };

    try {

      //로그인 call 메서드
      const response = await call("/travel/login","POST",userProfile,user)

      if(response){
        setUser(response);
        console.log("로그인 call 메서드 response:"+response);
        alert(`로그인 성공! 환영합니다, ${response.userNickName}님!`);
        navigate("/main")
      }
      
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };//로그인 버튼 종료

  //Google 로그인 성공 처리
  const handleGoogleSuccess = async (response) => {
    try {
      console.log('Google Login Success:', response);
      console.log('Google Login Success:', response.credential);
      const credential = response.credential      

      //JWT 디코딩하여 Google 사용자 정보 확인
      try {
        //Authorization 헤더에 Bearer 토큰 포함, payload는 본문에 전달
        const response = await axios.post('http://192.168.3.24:9090/travel/oauth2/google/callback', { credential },{
          headers: {
              'Authorization': `Bearer ${credential}` //Google 로그인 후 받은 credential
          }
        })

        console.log("백엔드 응답:", response.data);
        
        if (response.data) {          
          setGoogleUser(response.data);
          navigate("/signup")
        }

      } catch (backendError) {
        console.error("백엔드 통신 에러:", {
          상태: backendError.response?.status,
          메시지: backendError.message,
          데이터: backendError.response?.data
        });
        throw backendError;
      }
  
    } catch (error) {
      console.error("전체 로그인 프로세스 에러:", error);
      handleGoogleFailure(error);
    }
  };//Google 로그인 성공 처리 종료

  //Google 로그인 실패 처리
  const handleGoogleFailure = (error) => {

    console.error("Google Login Failure:", error);
    alert("구글 로그인에 실패했습니다. 다시 시도해주세요.");

    setLoginId("");
    setLoginPassword("");
  };

  const googleOAuthConfig = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID  //환경변수가 제대로 로드되는지 확인
  };

  //ID찾기 전화번호 입력및 정규식확인
  const handleFindUserIdUserPhoneNumber = (e) => {
    const phoneNumber = e.target.value;
    setFindUserPhoneNumber(phoneNumber);

    if (!validataeUserPhoneNumber(phoneNumber)) {
      setPhoneNumberError("전화번호는 - 들어가지않은 11자리 숫자로 이루어져야 됩니다..");
    } else {
      setPhoneNumberError("");
    }
    if(!phoneNumber){
      setPhoneNumberError("");
    }
  };

  //비밀번호찾기 이메일 입력및 정규식확인
  const handleFindUserPasswordUserId = (e) => {
    const userId = e.target.value;
    setFindUserId(userId);

    if (!validateEmail(userId)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailError("");
    }
    if(!userId){
      setEmailError("");
    }
  }
  

  //비밀번호찾기 전화번호 입력및 정규식확인
  const handleFindUserPasswordUserPhoneNumber = (e) => {
    const phoneNumber = e.target.value;
    setFindUserPhoneNumber(phoneNumber);

    if (!validataeUserPhoneNumber(phoneNumber)) {
      setPhoneNumberError("전화번호는 - 들어가지않은 11자리 숫자로 이루어져야 됩니다..");
    } else {
      setPhoneNumberError("");
    }
    if(!phoneNumber){
      setPhoneNumberError("");
    }
  };

  
  //비밀번호찾기 비밀번호 입력및 정규식확인
  const handleFindUserPasswordUserPassword = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.");
    } else {
      setPasswordError("");
    }
    if(!password){
      setPasswordError("");
    }
  };

  return (
    <div>
      <TopIcon />
    <div
    className="fullscreen-background"
    style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay-text">시골쥐의 어디가쥐</div>
      <div className="container">
        <main>
          {!isFindUserId && !isFindPassword && !isNewPassword && (<form className="form" onSubmit={handleLogin}>
            <h3>::: 로그인 :::</h3>

            <div className="form-group">
              <label htmlFor="loginId">이메일(아이디)</label>
              <input
                id="loginId"
                name="loginId"
                value={loginId}
                placeholder="example@email.com"
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">비밀번호</label>
              <input
                id="loginPassword"
                name="loginPassword"
                type="password"
                value={loginPassword}
                placeholder="Password"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            {/* ID 찾기 및 Password 찾기 텍스트 */}
            <div className="find-texts">
              <span className="find-text" onClick={()=>setIsFindUserId(true)}>
                ID 찾기
              </span>
              <span className="divider">|</span>
              <span className="find-text" onClick={()=>setIsFindPassword(true)}>
                Password 찾기
              </span>
            </div>
            
            <div className="submit-container">
              <input type="submit" value="로그인" className="submit" />
              <input type="button" value="회원가입" className="cancel" onClick={toSignup} />
              
              {/* Google OAuth */}
              {/* <GoogleOAuthProvider clientId={googleOAuthConfig.clientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  useOneTap={false}
                  type="standard"
                  ux_mode="popup"
                  flow="implicit"
                  scope="email profile"
                  cookiePolicy={'single_host_origin'}
                />
              </GoogleOAuthProvider> */}
            </div>

          </form>
          )}
          {isFindUserId && (
            <div className="form">
              <h4>이메일(아이디) 찾기</h4>
              <div className="form-group">
                <label htmlFor="findUserName">이름</label>
                <input 
                  id="findUserName" 
                  name="findUserName"
                  value={findUserName}
                  placeholder="Name" 
                  onChange={(e) => setFindUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="findUserPhoneNumber">전화번호</label>
                <input
                  id="findUserPhoneNumber"
                  name="findUserPhoneNumber"
                  value={findUserPhoneNumber}
                  placeholder=" - 빼고 숫자만 입력하세요"
                  onChange={handleFindUserIdUserPhoneNumber}
                />
                {phoneNumberError && <span className="error-message">{phoneNumberError}</span>}
              </div>
              <div className="popup-buttons">
                <button onClick={handleFindIdConfirm}>확인</button>
                <button 
                  onClick={()=>{
                    setIsFindUserId(false)
                    setFindUserName("");
                    setFindUserPhoneNumber("");
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
          {isFindPassword && (
              <div className="form">
                <h4>Password 찾기</h4>
                <div className="form-group">
                  <label htmlFor="findUserId">새 비밀번호</label>
                  <input 
                    id="findUserId" 
                    name="findUserId" 
                    value={findUserId}
                    placeholder="example@email.com"  
                    onChange={handleFindUserPasswordUserId}
                  />
                  {emailError && <span className="error-message">{emailError}</span>}
                  <input
                    type="button"
                    value={isLoading ? "발송 중..." : "인증번호 발송"}
                    className="button-verify"
                    onClick={handleEmailVerification}
                    disabled={isLoading || !findUserId || emailError || isEmailVerified}
                  />
                </div>
                {/* 인증 코드 입력 필드 */}
                {isAuthCodeSent && (
                  <div className="form-group">
                    <label htmlFor="authCode">인증 코드</label>
                    <input
                      id="authCode"
                      name="authCode"
                      value={authCode}
                      onChange={handleAuthCodeChange}
                      placeholder="인증 코드를 입력하세요"
                    />
                    {authCodeError && <span className="error-message">{authCodeError}</span>}
                    <div className="auth-code-button">
                      <input
                        type="button"
                        value="인증 코드 확인"
                        onClick={handleAuthCodeVerification}
                      />
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="findIdName">이름</label>
                  <input 
                    id="findUserName" 
                    name="findUserName" 
                    value={findUserName}
                    placeholder="Name"
                    onChange={(e) => setFindUserName(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="findIdPhone">전화번호</label>
                  <input
                    id="findIdPhone"
                    name="findIdPhone"
                    value={findUserPhoneNumber}
                    placeholder=" - 빼고 숫자만 입력하세요"
                    onChange={handleFindUserPasswordUserPhoneNumber}
                  />
                  {phoneNumberError && <span className="error-message">{phoneNumberError}</span>}
                </div>
                <div className="popup-buttons">
                  <button onClick={handleFindPasswordConfirm}>확인</button>
                  <button 
                    onClick={()=>{
                      setIsFindPassword(false)
                      setFindUserId("");
                      setAuthCode("");
                      setFindUserName("");
                      setIsEmailVerified(false);
                      setFindUserPhoneNumber("");
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            {isNewPassword && (
              <div className="form">
                <h4>새비밀번호등록</h4>
                <div className="form-group">
                  <label htmlFor="newPassword">새비밀번호</label>
                  <input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password"
                    value={newPassword}
                    placeholder="NewPassword"  
                    onChange={handleFindUserPasswordUserPassword}           
                  />
                  {passwordError && <span className="error-message">{passwordError}</span>}
                </div>                
                <div className="form-group">
                  <label htmlFor="newPasswordConfirm">새비밀번호 확인</label>
                  <input 
                    id="newPasswordConfirm" 
                    name="newPasswordConfirm" 
                    type="password"
                    value={newPasswordConfirm}
                    placeholder="NewPasswordConfirm"
                    onChange={(e) => setNewPasswordConfirm(e.target.value)} 
                  />
                </div>                
                <div className="popup-buttons">
                  <button onClick={handleNewPassword}>확인</button>
                  <button 
                    onClick={()=>{
                      setFindUserId("");
                      setNewPassword("");
                      setNewPasswordConfirm("");
                      setIsNewPassword(false)
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
    
  </div>
  );
};

export default Login;
```

# 코드설명

```JS
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//이메일
const userPhoneNumberRegex = /^01\d{9}$/;//전화번호
const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;//비밀번호
```
1. /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  - ^ : 문자열 시작
  - [^\s@]+ : 공백과 @ 이외의 문자가 1개 이상
  - @ : @ 문자
  - \\.: 점(마침표)
  - $: 문자열 끝
2. /^01\d{9}$/
  - 01 : "01"로 시작
  - \d{9} : 숫자가 9개
3. /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
  - (?=.*[!@#$%^&*(),.?":{}|<>]) : 특수문자 최소 1개 포함
  - .{8,} : 모든 문자가 8개 이상
```JS
const response = await axios.get(`http://${config.IP_ADD}:9090/travel/email/auth?address=${findUserId}`);
```
1. axios
  - HTTP 클라이언트 라이브러리로 서버와의 HTTP 통신을 쉽게 할 수 있게 해줌
  - Promise 기반으로 동작 -> axios가 비동기 작업을 Promise를 사용하여 처리하며, 이를 통해 더 깔끔하고 관리하기 쉬운 코드를 작성할 수 있다는 의미함
2. ${config.IP_ADD}
  - 백틱(`)으로 둘러싸인 문자열 안에서 ${} 형식으로 변수 사용
  - config 객체에서 IP_ADD 값을 가져옴
```JS
//이메일 인증코드 체크
const handleAuthCodeChange = (e) => {
  setAuthCode(e.target.value);
  setAuthCodeError("");//오류 초기화
};
```
1. e.target.value
  - e : 이벤트 객체
  - e.target : 이벤트가 발생한 HTML요소
  - e.target.value : 해당 요소의 값
```JS
//인증 코드 검증
await axios.post(`http://${config.IP_ADD}:9090/travel/email/auth?address=${findUserId}&authCode=${authCode}`)
  .then((response) => {
    const { success } = response.data;
    if (success) {
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      setAuthCodeError("인증 코드가 일치하지 않습니다.");
    }
  })
  .catch((error) => {
    console.error("인증 코드 검증 실패:", error);
    setAuthCodeError("인증 코드 검증 중 오류가 발생했습니다.");
  });

```
1. const { success } = response.data;
  - 객체 비구조화 할당: response.data 객체에서 success 속성을 추출함
  - 비구조화 할당(Destructuring Assignment)이란? 배열이나 객체의 속성을 해체하여 그 값을 개별 변수에 담을 수 있게 하는 JavaScript 표현식임
  <br>(코드를 더 간단하고 읽기 쉽게 작성가능, 데이터 변환은 없음->단순히 객체나 배열의 값을 변수에 할당함)
2. .then().catch()
  - Promise체이닝 : Promise를 연속적으로 연결하여 사용하는 방법으로, .then()의 결과가 다음 .then()으로 전달되는 구조임
  - .then() : 성공 시 실행될 콜백
  - .catch() : 실패 시 실행될 콜백(어디에서든 발생할 수 있는 에러를 처리함)
```JS
{emailError && <span className="error-message">{emailError}</span>}
```
1. <span>
  - 인라인 텍스트를 감싸는 HTML 태그
  - 주로 작은 텍스트 블록이나 인라인 요소를 그룹화할 때 사용
  - 여기서는 에러 메시지를 표시하는 데 사용됨