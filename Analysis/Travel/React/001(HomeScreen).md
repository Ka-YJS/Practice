# HomeScreen

```JS
import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image/back1.jpg"
import Logo from "./Logo";

function HomeScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/Login");
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      {/* 로고 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Logo /> {/* 로고 컴포넌트 호출 */}
      </div>

      {/* 시골쥐의 여행하쥐 텍스트 */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "white", // 흰색 텍스트
          textShadow: `
            0 0 10px rgba(240, 175, 91, 0.8), 
            0 0 20px rgba(223, 168, 50, 0.6),
            0 0 30px rgba(224, 117, 55, 0.4)
          `, // 광택 효과
          animation: "pulse 2s infinite", // 빛나는 애니메이션
        }}
      >
        시골쥐의 어디가쥐
      </div>

      {/* 버튼 */}
      <button
        onClick={handleStart}
        style={{
          padding: "20px 40px",
          fontSize: "24px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#f39c12";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#4CAF50";
        }}
      >
        여행 시작
      </button>

      {/* 애니메이션 스타일 */}
      <style>
        {`
          @keyframes pulse {
            0% {
              text-shadow: 
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.6),
                0 0 30px rgba(255, 255, 255, 0.4);
            }
            50% {
              text-shadow: 
                0 0 15px rgba(255, 255, 255, 1),
                0 0 25px rgba(255, 255, 255, 0.8),
                0 0 40px rgba(255, 255, 255, 0.6);
            }
            100% {
              text-shadow: 
                0 0 10px rgba(19, 2, 2, 0.8),
                0 0 20px rgba(24, 3, 3, 0.6),
                0 0 30px rgba(22, 1, 1, 0.4);
            }
          }
        `}
      </style>
    </div>
  );
}

export default HomeScreen;
```

# 코드설명

```JS
import { useNavigate } from "react-router-dom"
```
1. useNavigate
  - react-router-dom이 제공하는 여러 기능들 중 하나임
  - React Router의 훅(Hook)으로, 프로그래밍 방식으로 페이지 이동을 할 수 있게 해줌
```JS
style={
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  animation: "pulse 2s infinite",
  transition: "all 0.3s ease"
}
```
1. display: "flex" -> Flexbox 레이아웃을 활성화함
2. flexDirection: "column" -> 자식 요소들을 세로로 배치함
3. justifyContent: "center" -> 주축(세로)에서 중앙 정렬함
4. alignItems: "center" -> 교차축(가로)에서 중앙 정렬함
5. animation: "pulse 2s infinite" -> pulse라는 애니메이션을 2초 동안 무한 반복함(깜빡임)
6. transition: "all 0.3s ease" -> 모든 속성 변화를 0.3초 동안 부드럽게 전환하며, ease는 전환의 속도 곡선을 의미
```JS
<style>
  {@keyframes pulse { 0%{} 50%{} 100%{}}}
</style>
```
1. @keyframes pulse
  - pulse라는 이름의 사용자 정의 애니메이션을 정의함
  - 요소의 상태 변화를 시간에 따라 정의함
2. 0%{} 50%{} 100%{}
  - 애니메이션의 각 단계를 정의함
  - 0%은 시작상태, 50%은 중간상태, 100%은 종료상태라고 볼 수 있음
  - 이를 통해 텍스트 그림자효과가 점점 강해졌다가 약해지는 순환을 만듦