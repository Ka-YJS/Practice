# React

## 프론트엔드 개발

1. 사용자의 바로 앞에서 사용자와 상호작용하며 애플리케이션 로직을 수행하고 백엔드서버로 요청을 전달하는 역할
2. 웹 서비스에서 클라이언트 또는 프론트엔드란 웹 브라우저를 뜻함
3. 사용자는 자신의 컴퓨터에서 브라우저를 실행함
4. 인터넷을 이용해 서버에 있는 자원을 사용자의 컴퓨터로 다운로드 후, 브라우저에서 실행시킴
5. 프론트엔드 개발환경 설정
    - 자바스크립트 라이브러리인 react.js를 이용해 프론트엔드 개발을 함
    - React.js를 사용하기 위해 자바스크립트 런타임 환경을 이용함
    - Node.js를 이용하면 브라우저 밖에서도 스크립트를 컴파일하고 실행할 수 있음

### Node.js

1. 이전에 자바스크립트 코드는 브라우저 내에서만 실행이 가능했음
2. 자바스크립트를 실행하기 위해서는 브라우저상의 html렌더링의 일부로 실행하거나 개발자도구창의 자바스크립트 콘송르 이용해 실행해야 했음
3. Node.js는 자바스크립트를 컴퓨터에서  실행할 수 있게 해주는 자바스크립트 런타임환경임
4. 브라우저 밖에서도 실행할 수 있다는 것은 자바스크립트를 클라이언트 언어뿐만 아니라 서버언어로도 사용할 수 있다는 뜻임. 즉, 자바스크립트로 서버를 만들 수 있다는 뜻임
5. 우리는 자바스크립트로 된 node서버를 이용해 프론트엔드 서버를 개발함
<br>->요청이 왔을 때 HTML, JS, CSS를 반환하는 정도의 기능을  할 것임

6. NPM(Node Package Manager)
    - Node.js의 패키지 관리 시스템
    - NPM을 이용해 npmjs(https://www.npmjs.com)에서 node.js의 라이브러리를 설치함
    - node.js를 설치하면 함께 설치됨
7. 책에서는 16.14.2LTS버전을 사용하므로 공부할 때는 같은 버전을 사용하는 것을 권장함
8. nodejs 프로젝트를 초기화하기 위해서는 npm init을 사용함
<br>->but. 우리는 npm이 아닌 npx라는 툴로 리액트 애플리케이션을 초기화 할 예정임
<br>->npm으로하면 일일히 설정해야 하는 부분이 많기 때문임

9. npm으로 프로젝트를 구성하려고 하면 패키지 이름, 버전 등등 설정해야 하는 내용이 많음
<br>->이 정보들을 다 입력하고 나면 해당폴더에 package.json이라는 파일을 만들어 줌
<br>->package.json에 프로젝트의 베타데이터가 들어감


### 설정하기

1. 비주얼스튜디오코드 -> 터미널 들어가기
2.mkdir test-project -> cd test-project -> npm init -> (enter)두번 -> test-project
<br>-> 계속 엔터눌러서 Is this OK? -> yes

3. 터미널에 npm install react 입력 -> node_modules, package-lock.json 생성됨
4. dependencies : 의존성
    - 의존성이라는 의미
    - 내가 프로젝트를 구성하는데 필요한 라이브러리를 정의하는 공간
    - "react": "^18.3.1" 
    - version : 명시된 버전과 일치
        1. \>version : 명시된 버전보다 높은 버전
        2. \>\=version : 명시된 버전보다 같거나 높은 버전
        3. \<version : 명시된 버전보다 낮은 버전
        4. <=version : 명시된 버전보다 같거나 낮은 버전
        5. ~version : 명시된 버전과 근사한 버전(패치한 버전 범위 
        6. ^version : 명시된 버전과 호환되는 버전
    - 사용예시 : ^1.2.3
    <br>->내가 1.2.3버전으로 개발했는데 이 버전과 호환되는 최근 버전으로 사용해달라는 뜻임
5. mkdir react-workspace -> cd react-workspace -> npx create-react-app todo-react-app
-> cd todo-react-app -> npm start
6. dependencies는 일종의 메모장 -> 이 안에 있는 걸 바탕으로 작업하겠다, 라는 의미임
<br>->package.json에서 dependencies의 내용을 아래와 같이 바꾸기

```JS
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^12.1.4",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.4"
```
7. rm -rf node_modules -> rm package-lock.json -> npm install -> 안되면 npm install --force
8. material-ui -> npm install @mui/material@5.6.0@mui/icons-material@5.6.0
    - 리액트 개발에서 쉽게 사용할 수 있는 UI프레임워크임
    - 미리 만들어놓은 컴포넌트나 CSS를 사용할 수 있음
9. emotion : JS로 CSS스타일을 작성할 수 있도록 설계된 라이브러리
<br>-> npm install @emotion/react@11.9.0 @emotion/styled@11.8.1