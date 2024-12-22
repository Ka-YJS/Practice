# React복습

## 컴포넌트

1. 컴포넌트를 호출할 때
	- 속성명=문자열,숫자,{변수,객체,함수}의 형태로 전달함
	- 해당함수에서 매개변수에 할당됨
	- 예시
	```JS
	<Comp title='제목' />

	const Comp = (props 혹은 { title }) => { 
		console.log(props) -> { "title" : "제목", "kye" : "value" }
		혹은 console.log(title)
	}
	```
2. state
	1. 사용하는 이유
		- UI업데이트의 자동화
		- state가 변경될 때마다 재렌더링을해서 직접 dom조작 할 필요가 없음
	2. 컴포넌트와 데이터의 일관성 유지 : 고유한 state를 통해 자신만의 데이터를 독립적으로 관리할 수 있음
	3. 비동기데이터와 상태 변화 처리
		- setter함수는 비동기로 작동함
		- 연속적으로 setter함수를 호출할 경우 예상치 못한 결과가 나올 수 있음
		- 이전 상태를 기준으로 다음상태를 설정할 때는 콜백함수를 이용하는 것이 좋음
		- 예시
		```JS
		setCount(( count+1 ))
		setCount(( count+1 )) -> 예상치 못한 결과가 나올 수 있음

		setCount(preventCount => preventCount +1 )
		setCount(preventCount => preventCount +1 ) -> 콜백함수를 이용
		```

## 스타일링

1. 리액트 네이티브에서 스타일링은 웹 프로그래밍에서 사용하는 CSS와 약간 차이가 있음
2. 3장에서 JSX의 문법에 대해 알아보면서 간단하게 살펴봤듯이 background-color처럼 하이픈으로 된 CSS와 달리 backgroundColor처럼 카멜 표기법으로 작성해야 함

### 클래스 스타일링

1. 컴포넌트의 태그에 직접 입력하는 방식이 아니라 스타일시트에 정의된 스타일을 사용하는 방법임
2. 스타일시트에 스타일을 정의하고 컴포넌트에서는 정의된 스타일의 이름으로 적용하는 클래스 스타일링 방법은 웹 프로그래밍에서 CSS클래스를 이용하는 방법과 유사함
3. 프로젝트를 생성하면 함께 생성되는 App.js파일에서 클래스 스타일링이 적용된 모습을 확인할 수 있음

### StyleSheet
1. React Native의 내장 객체로, 화면에 표시될 요소들의 디자인(예: 배경색, 글꼴 크기, 여백)을 지정하는 역할을 함
2. StyleSheet의 사용 이유
	- React Native 앱은 웹이 아닌 모바일 환경에서 동작하기 때문에, CSS처럼 스타일을 작성하는 방식은 비효율적일 수 있음
	- StyleSheet를 사용하면 코드의 성능이 개선되고, 스타일을 체계적으로 관리할 수 있게 됨
3. StyleSheet의 사용 방법
	- StyleSheet.create 메서드를 호출해 스타일을 정의함
	- 이 메서드를 통해 스타일을 객체 형태로 작성할 수 있음
4. StyleSheet의 장점
	- 성능 향상: StyleSheet.create를 사용하면 React Native가 스타일을 최적화해 앱 성능이 좋아짐
	- 재사용 가능성: 한 번 정의한 스타일을 여러 곳에서 재사용할 수 있음
	- 가독성: 스타일 코드가 깔끔하게 관리돼, 코드 가독성이 높아짐
5. 주요 스타일 속성
	- flex: 요소가 공간을 차지하는 비율을 설정함
	- justifyContent: 주축 방향(세로 또는 가로)으로 정렬 방식을 설정함
	- alignItems: 교차축 방향(주축과 수직)으로 정렬 방식을 설정함
	- backgroundColor: 배경색을 지정함
	- fontSize: 글자 크기를 지정함
	- color: 글자 색깔을 지정함

### 정렬

1. flex를 이용하면 컴포넌트가 원하는 영역을 차지하게 할 수 있음
2. flexDirection
	- 지금까지 실습을 하면서 컴포넌트가 항상 위에서 아래로 쌓인다는 것을 살펴봤음
	- 화면을 구성하다보면 컴포넌트가 쌓이는 방향을 변경하고 싶을 때가 있는데 이때 flexDirection을 이용하면 컴포넌트가 쌓이는 방향을 변경할 수 있음
	- flexDirection은 요소들이 정렬되는 주축의 방향을 결정하는 속성임 -> row와 column을 사용하여 가로 또는 세로 방향으로 정렬할 수 있음
3. flexDirection의 속성값
	- column : 세로 방향으로 정렬
	- column-reverse: 자식 요소들을 세로 방향으로 정렬하되, 역방향으로 배치함
	- row: 자식 요소들을 가로 방향으로 정렬함
	- row-reverse: 자식 요소들을 가로 방향으로 정렬하되, 역방향으로 배치함
4. justifyContent
	- 컴포넌트 내부의 자식 요소들이 주축(main axis)을 따라 정렬되는 방식을 설정하는 스타일 속성임
	- flexDirection 속성에 따라 주축의 방향이 바뀌는데, 기본적으로 flexDirection: 'column'일 경우 세로 방향이 주축이 되고, flexDirection: 'row'일 경우 가로 방향이 주축이 됨
5. 주요 속성값
	- flex-start: 자식 요소들을 주축의 시작 부분에 배치함 (기본값)
	- center: 자식 요소들을 주축의 중앙에 배치함
	- flex-end: 자식 요소들을 주축의 끝 부분에 배치함
	- space-between: 첫 번째 자식 요소는 주축의 시작 부분에, 마지막 자식 요소는 주축의 끝 부분에 배치하며, 각 자식 요소 간에 동일한 간격을 둠
	- space-around: 자식 요소들 사이에 동일한 간격을 배치하되, 주축의 양 끝에도 반 간격만큼의 여백을 둠
	- space-evenly: 모든 자식 요소들 사이에 동일한 간격을 두며, 주축의 양 끝에도 동일한 간격을 둠
	- alignItems : flexDirection에서 정한 방향과 수직이 되는 방향으로 정렬할 때 사용하는 속성임
	- flex-start : 시작점에서부터 정렬(기본값)
	- flex-end : 끝에서부터 정렬
	- center : 중앙 정렬
	- stretch: alignItems의 방향으로 확대
	- baseline : 컴포넌트 내부의 텍스트 베이스라인을 기준으로 정렬

### Platform 모듈

1. 앱이 실행되는 운영 체제에 따라 다른 코드를 실행할 수 있게 도와주는 도구임
2. React Native로 앱을 개발하면 같은 코드로 iOS와 Android에서 동시에 실행할 수 있지만, 일부 기능이나 스타일은 플랫폼에 따라 다르게 적용해야 할 때가 있음
3. 이때 Platform 모듈을 사용하면 앱이 실행 중인 플랫폼에 맞춰 필요한 코드를 쉽게 추가할 수 있음
4. Platform 모듈 사용법
	1.  Platform.OS 사용하기 : Platform.OS는 현재 앱이 실행 중인 플랫폼을 알려주는 값으로 iOS에서는 "ios", Android에서는 "android" 값을 반환함
	2. Platform.select 사용하기
		- 운영 체제별로 서로 다른 값을 쉽게 설정할 수 있게 해줌
		- iOS와 Android에서 각각 다르게 설정해야 할 스타일이나 속성을 지정할 때 유용함

### Styled-component

1. 스타일드 컴포넌트는 자바스크립트 파일 안에 스타일을 작성하는 CSS-in-JS 라이브러리이며, 스타일이 적용된 컴포넌트라고 생각하면 이해하기 쉬움
2. react-router-dom 과 충돌나면 최신버전으로는 설치가 안됨
```JS
npm install styled-components@5.3 --legacy-peer-deps
```
3. 사용법
	- 리액트 네이티브의 컴포넌트 이름을 styled 뒤에 붙여 스타일링된 컴포넌트를 만듦
	- 이때 styled 뒤에 작성하는 컴포넌트이름은 반드시 존재하는 컴포넌트여야 함
	- 백틱(` `)안에 CSS 스타일을 작성하며, 이 스타일은 해당 컴포넌트에서만 적용됨
```JS
const 컴포넌트명 = styled.View`
  CSS코드
`

// 사용시
<컴포넌트명 />
```

### ThemeProvider

1. ThemeProvider는 Context API를 활용해 어플리케이션 전체에서 스타일드 컴포넌트를 이용할 때 미리 정의한 값을 사용할 수 있도록 props로 전달함
2. 객체리터럴
	1. const person = { key : value, key : value, ... }
	<br>->key : 프로퍼티, value : 프로퍼티의 값

	2. 프로퍼티에 들어갈 수 있는 타입 : 문자열, 숫자(정수,실수 다 포함), boolean, null, 객체, 배열, 함수(객체안에 정의된 함수를 메서드)
	3. 예시
	```JS
	const user = { 
		name : 'Alice',
		age : 30,
		isMarried : true,
		address : null,
		contact : { email : 'alice@example.com', phone : '123-456-789' },
		hobbies : ['reading', 'sports'],
		greet( ){ 
			console.log( ); } 혹은
		greet: function( ){ 
			console.log( ); } -> greet는 두가지의 방법이 있지만 호출은 상관없음
	}
	
	user.greet( )
	```
- justifyContent : 컴포넌트의 정렬
- alignment : flexDirection에서 정한 방향과 수직이 되는 방향으로 정렬할 때 사용하는 속성
- 주 축을 결정하는 flexDirection, 주 축에서 item을 정렬하는 justifyContent, 주 축의 수직에서 item을 정렬하는 alignment
3. 그림자설정
	- shawdowColor : 그림자 색 설정
	- shawdowOffset : width와 height값을 지정하여 그림자 거리 설정
	- shawdowOpacity : 그림자의 불투명도 설정
	- shawdowRadius : 그림자의 흐름 반경 설정
4. 리액트네이티브에서 제공하는 Plaform 이라는 모듈을 이용해 각 플랫폼마다 다른 코드가 적용되도록 코드를 작성할 수 있음
5. 스타일드 컴포넌트
	- 웹의 CSS와는 속성이름이나 타입이 다르거나, 단위를 생략하거나 하는 등의 차이때문에 불편하게 느끼는 경우가 있음
	- npm install styled-components -> npm install styled-components@5.3.6 --legacy-peer-deps
	(버전 6부터는 적용안되므로 그 밑에 단계 설치)
	- CSS-in-JS개념을 적용한 것으로, JavaScript파일 내에서 스타일을 선언하고 컴포넌트로 관리할 수 있도록 해줌