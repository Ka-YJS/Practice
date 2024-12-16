1)컴포넌트를 호출할 때
1>속성명=문자열,숫자,{변수,객체,함수}의 형태로 전달함
2>해당함수에서 매개변수에 할당됨
3>
<Comp title='제목' />

const Comp = (props 혹은 { title }) => { 
	console.log(props) -> { "title" : "제목", "kye" : "value" }
	혹은 console.log(title)
 }

2)state
1>사용하는 이유
-UI업데이트의 자동화
-state가 변경될 때마다 재렌더링을해서 직접 dom조작 할 필요가 없음
2>컴포넌트와 데이터의 일관성 유지
-고유한 state를 통해 자신만의 데이터를 독립적으로 관리할 수 있음
3>비동기데이터와 상태 변화 처리
-setter함수는 비동기로 작동함
-연속적으로 setter함수를 호출할 경우 예상치 못한 결과가 나올 수 있음
-이전 상태를 기준으로 다음상태를 설정할 때는 콜백함수를 이용하는 것이 좋음
-ex.
setCount(( count+1 ))
setCount(( count+1 )) -> 예상치 못한 결과가 나올 수 있음

setCount(preventCount => preventCount +1 )
setCount(preventCount => preventCount +1 ) -> 콜백함수를 이용



2. 스타일링

1)객체리터럴
1>const person = { key : value, key : value, ... }
->key : 프로퍼티, value : 프로퍼티의 값
2>프로퍼티에 들어갈 수 있는 타입 : 문자열, 숫자(정수,실수 다 포함), 
			boolean, null, 객체, 배열, 함수(객체안에 정의된 함수를 메서드)
3>예시

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

2)justifyContent : 컴포넌트의 정렬

3)alignment : flexDirection에서 정한 방향과 수직이 되는 방향으로 정렬할 때 사용하는 속성

4)주 축을 결정하는 flexDirection, 주 축에서 item을 정렬하는 justifyContent, 주 축의 수직에서 item을 정렬하는 alignment

5)그림자설정
1>shawdowColor : 그림자 색 설정
2>shawdowOffset : width와 height값을 지정하여 그림자 거리 설정
3>shawdowOpacity : 그림자의 불투명도 설정
4>shawdowRadius : 그림자의 흐름 반경 설정

6)리액트네이티브에서 제공하는 Plaform 이라는 모듈을 이용해 각 플랫폼마다 다른 코드가 적용되도록 코드를 작성할 수 있음

7)스타일드 컴포넌트
-웹의 CSS와는 속성이름이나 타입이 다르거나, 단위를 생략하거나 하는 등의 차이때문에 불편하게 느끼는 경우가 있음
-npm install styled-components -> npm install styled-components@5.3.6 --legacy-peer-deps
(버전 6부터는 적용안되므로 그 밑에 단계 설치)
-CSS-in-JS개념을 적용한 것으로, JavaScript파일 내에서 스타일을 선언하고 컴포넌트로 관리할 수 있도록 해줌