# Node와 설정

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
        5. ~version : 명시된 버전과 근사한 버전(패치한 버전 범위) 
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

### 브라우저 작동시키기

1. 랜더링의 원리
    - HTML코드를 파싱함 -> DOM트리로 만듦(코드들을 트리형태로 뜯어놓음)
    - parse와 parsing의 차이점
    <table border="1">
        <tr>
            <td>parse</td>
            <td>주어진 데이터를 해석+분석 -> 원하는 형식/구조로 변환하는 작업</td>
        </tr>
        <tr>
            <td>parsing</td>
            <td>-주어진 데이터를 구문분석 -> 의미있는 구조로 변환<br>-일련의 문자열로 이루어진 입력을 토큰이나 트리와 같은 구조로 변환하는 과정<br>-입력을 분석하여 구조적인 정보를 추출하고 해석한다고 보면 됨<br>파싱은 일반적으로 언어의 문법이나 형식에 따라 수행되며, 이를 Parser라는 도구가 사용됨</td>
        </tr>
    </table>

    - image, css, script 등 다운로드해야하는 리소스를 다운로드 함
    - CSS도 CSSOM트리로 변환을 함
    <br>CSSOM : CSS내용을 파싱하여 자료를 구조화한 것
    - 다운로드한 자바스크립트를 인터프리트, 컴파일, 파싱(구문분석), 실행 함
    - 파싱을 마친 후 브라우저는 랜더링에 들어감
2. SPA(Single Page Application) : 리액트, 뷰, 앵글러가 현재 가장 많이 쓰임(↔MPA : Multi Page Application)
    - 서버에 다시 요청하지않고, 자바스크립트가 동적으로 HTML을 재구성해서 만드는 애플리케이션
    - CSR(Client Side Rendering) : 서버에서 최소한의 HTML을 받고, 내부에 위치한 script태그로 JS를 받아서 클라이언트에서 페이지를 랜더링는 방식임(ex. REACT, VUE, ANGULAR)
    - 장점 : 초기 렌더링 이후에 진행되는 렌더링의 속도가 매우 빠름
    - 단점 : 초기 구동에 필요한 파일을 전부 받아야하기때문에 초기페이지구동 속도가 느림
3. SSR(Server Side Rendering)
    - 서버에서 사전에 렌더링된 파일을 클라이언트에게 전송하고, 클라이언트는 이를 즉시 렌더링하는 방식
    - 단, JS에 경우 정적 리소스(HTML, CSS)가 렌더링 된 후 적용되기때문에 JS가 모두 적용되기 전에는 조작이 불가능함
    - 사용자가 웹 페이지를 방문 할 경우, 서버는 이를 확인하고 브라우저에게 제공 할 HTML컨텐츠를 컴파일 함
    - 컴파일된 HTML은 브라우저에 제공되며, 브라우저는 이를 다운로드하고 렌더링하여 사용자가 이를 볼 수 있도록 함
    - 이후 JS 파일을 다운로드 받은 후 실행하여 사용자와 페이지 간의 상호작용을 가능하게끔 함
    - 사용자가 다른페이지로 이동 할 경우, 1~3번 과정을 반복함
4. JSP, Thymeleaf
    - JSP(JavaServer Pages) : HTML 코드에 JAVA 코드를 넣어 동적웹페이지를 생성하는 웹어플리케이션 도구임
    - Thymeleaf : JSP, Freemarker와 같은 템플릿 엔진의 일종으로 다음과 같은 특징을 갖고 있음
5. JSX : 컴포넌트를 만들 때 자바스크립트 안에다가 HTML을 작성하는 것
6. React18부터 Rect.render( )가 아닌 createRoot( )를 먼저 사용함
7. ReactDOM이 내부 컴포넌트들을 'root'엘리먼트에 render함
    - 컴포넌트 사용방법 : 컴포넌트 정의(ex.컴포넌트가 root의 하위에 추가됨) -> App 컴포넌트를 import함
    <br>-> <컴포넌트명 \/>을 이용해 컴포넌트를 사용함
    - react는 순수 자바스크립트이고, 자바스크립트를 이용해 컴포넌트를 만들어나감
    - 실제로 브라우저가 이해할 수 있는 것은 HTML, CSS, JS뿐임
    - JSX문법으로 작성된 코드를 Babel라이브러리가 순수 자바스크립트로 변환하고, 우리가 만든 컴포넌트를 HTML과 연결하는 작업을 해주는 라이브러리가 reactdom임