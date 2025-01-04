# MainScreen

```JS
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";//useNavigate import
import "../App.css";
import { UserContext } from "../context/UserContext";
import TopIcon from "../TopIcon/TopIcon";
import main1 from "../image/mainImage/main1.jpg"
import main2 from "../image/mainImage/main2.jpg"
import main3 from "../image/mainImage/main3.jpg"
import main4 from "../image/mainImage/main4.jpg"
import main5 from "../image/mainImage/main5.jpg"
import main6 from "../image/mainImage/main6.jpg"
import main7 from "../image/mainImage/main7.jpg"
import main8 from "../image/mainImage/main8.jpg"
import main9 from "../image/mainImage/main9.jpg"
import main10 from "../image/mainImage/main10.jpg"

function MainScreen() {
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();//useNavigate 훅 사용
  const { user } = useContext(UserContext);

  //이미지 파일 경로 배열
  const images = [
    main1, main2, main3, main4, main5, main6, main7, main8, main9, main10
  ];

  const imageCount = images.length;//이미지 갯수

  //이미지 슬라이드 효과
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);//2초마다 이미지 변경
    }, 4000);//2초마다

    return () => clearInterval(intervalId);//컴포넌트가 언마운트되면 interval 클리어
  }, []);

  //기록 시작하기 버튼 클릭 시 실행되는 함수
  const handleStartRecord = () => {
    navigate("/map");//"/record" 경로로 이동
  };

  //내 게시물 보기 버튼 클릭 시 실행되는 함수
  const handleViewPosts = () => {
    navigate(`/mypost/${user.id}`);//"/posts" 경로로 이동
  };

  return (
    <div>
      <TopIcon />
      <div className="main-screen">
        <div className="content">
          <h1>{user.userNickName?user.userNickName:"홍길동"}님 환영합니다.</h1>

          {/* 이미지 슬라이드 */}
          <div className="image-slider">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`슬라이드 이미지 ${index + 1}`}
                className="slider-image"
                style={{
                  opacity: index === currentIndex ? 1 : 0,//현재 이미지만 보이도록 설정
                  transition: "opacity 1s ease-out",//애니메이션 효과 추가
                  position: "absolute",//이미지가 겹치도록 설정
                  width: "100%",
                  height: "100vh",//이미지 크기 설정
                }}
              />
            ))}
          </div>
          <div className="button-row">
            <button className="main-button" onClick={handleStartRecord}>
              기록 시작하기
            </button>
            <button className="main-button" onClick={handleViewPosts}>
              내 기록 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
```

# 코드설명

```JS
useEffect(() => {
  const intervalId = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);//4초마다 이미지 변경
  }, 4000);//4초마다

  return () => clearInterval(intervalId);//컴포넌트가 언마운트되면 interval 클리어
}, []);
```
1. (prevIndex) => (prevIndex + 1) % imageCount
  - prevIndex: 현재 표시중인 이미지의 인덱스
  - 1 : 다음 이미지로 이동
  - % imageCount : 마지막 이미지 다음에 첫 이미지로 돌아가기 위한 연산
2. 4000가 왜 2초인지?
  - JavaScript의 setInterval은 밀리초(ms) 단위를 사용함
  - 1초 = 1000ms -> 4000ms는 4초
```JS
style={
  opacity: index === currentIndex ? 1 : 0,//현재 이미지만 보이도록 설정
  transition: "opacity 1s ease-out",//애니메이션 효과 추가
  position: "absolute",//이미지가 겹치도록 설정
}
```
1. opacity: index === currentIndex ? 1 : 0
  - 현재 인덱스와 이미지의 인덱스가 일치하면 opacity: 1 (완전 불투명)
  - 일치하지 않으면 opacity: 0 (완전 투명)
  - 이를 통해 현재 선택된 이미지만 보이게 됨
2. transition: "opacity 1s ease-out"
  - opacity 변화에 1초간의 애니메이션 효과 적용함
  - ease-out: 애니메이션이 끝날 때 천천히 감속되는 효과
  - 이미지가 부드럽게 페이드 인/아웃되는 효과 생성
3. position: "absolute"
  - 모든 이미지가 같은 위치에 겹쳐서 배치됨
  - 이미지들이 일반 문서 흐름에서 벗어나 서로 겹칠 수 있게 됨
  - opacity와 함께 사용되어 이미지가 같은 위치에서 전환되는 효과 생성