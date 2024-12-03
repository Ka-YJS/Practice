# SPRING

## SPRING 배경지식

1. HTTP(HyperText Transfer Protocol)
    - 웹에서 클라이언트와 서버 간에 데이터를 주고받기 위한 프로토콜임
    - 많은 웹 기반 애플리케이션이 HTTP를 이용하고, 우리 프로젝트도 HTTP로 서버와 클라이언트 간에 통신을 할 것임
2. HyperText
    - 다른 문서로 향하는 링크가 있는 텍스트
    - 문서를 하이퍼텍스트로 만들기 위해서 HTML(HyperTextMarkupLanguage)를 사용함
    - Transfer Protocol : 통신을 하기위한 규약임
3. 웹 서비스에서 HTTP를 어떤식으로 사용하는가?
    - 사용자는 브라우저(크롬,사파리,엣지 등)을 통해 서버에 HTTP요청(Request)를 전송할 수 있음
    - 브라우저의 주소창에 URL을 치고 엔터를 누르면 브라우저는 HTTP GET 요청을 해당 URL서버로 전송함
    - 그리고 그 결과인 HTTP응답(Response)을 브라우저에 렌더링함
4. HTTP요청 : 예시
GET /api/users?id=123 HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
Connection: keep-alive
- 송신자는 www.example.com으로 GET 요청을 전송하려고 함
- 프로토콜의 버전 : 1.1
- 운영체제는 위도우10이고 요청 당시 크롬을 사용함

## 요청메서드

1. HTTP요청(Request)에는 GET,POST,PUT,DELETE와 같은 메서드를 지정할 수 있음
2. 이러한 메서드는 호스트에게 지정한 리소스에 어떤 작업을 하소깊은지 알려주는 역할을 함
3. 종류
<table border="1">
    <tr>
        <td>HTTP Method</td>
        <td>Description</td>
        <td>Use Case Examples</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>서버에서 리소스를 요청할 때 사용</td>
        <td>데이터 조회 (예: 사용자 정보 가져오기)</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>서버에 데이터를 전송할 때 사용</td>
        <td>데이터 생성 (예: 새로운 게시글 작성)</td>
    </tr>
    <tr>
        <td>PUT</td>
        <td>서버의 기존 리소스를 업데이트할 때 사용</td>
        <td>데이터 수정 (예: 사용자 정보 수정)</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>서버의 리소스를 삭제할 때 사용</td>
        <td>데이터 삭제 (예: 게시글 삭제)</td>
    </tr>
</table>
<table border="1">
    <tr>
        <td>HTTP Method</td>
        <td>Description</td>
        <td>Use Case Examples</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>리소스의 일부를 업데이트할 때 사용</td>
        <td>데이터 일부 수정 (예: 특정 필드만 업데이트)</td>
    </tr>
    <tr>
        <td>OPTIONS</td>
        <td>서버가 지원하는 HTTP 메서드 확인</td>
        <td>CORS 설정 확인 및 사전 검사</td>
    </tr>
    <tr>
        <td>HEAD</td>
        <td>GET과 동일하지만 응답 본문 없이 헤더 정보만 받음</td>
        <td>리소스의 존재 여부 확인, 메타데이터 조회</td>
    </tr>
    <tr>
        <td>CONNECT</td>
        <td>서버에 터널을 설정해 SSL 등과 같은 프로토콜을 사용</td>
        <td>프록시 서버를 통한 터널링</td>
    </tr>
    <tr>
        <td>TRACE</td>
        <td>요청이 서버까지 가는 경로를 추적</td>
        <td>네트워크 진단 및 디버깅</td>
    </tr>
</table>

4. 비록 HTTP 메서드가 이런 기능을 한다고 하지만 실제 기능은 전적으로 API를 개발하는 개발자(백엔드)에게 달려있음
5. 예를 들어 POST메서드이지만 개발자는 리소스에게 어떤 작업도 하지 않고 그냥 반환하도록 API를 작성할 수 있음
6. DELETE메서드에 아무것도 삭제하지 않는 API를 구현해 사용할 수도 있음
7. 요지는, 표에서 HTTP 메서드 '기능'의 이미란 '이런 기능을 위한 API에 사용하는게 좋다'의 뜻임
8. GET메서드로 지정했으니 마법처럼 리소스가 반환되는 것이 아님
9. 각 메서드에 연결되는 API는 개발자가 작성해야 하는 것임

## 콘텐츠 용어정리1

1. Date : 서버가 응답을 보낸 시간
2. Content-Type
    - 응답의 미디어 타입을 의미함
    - 다양한 종류의 타입을 가지고 있음
3. 콘텐츠 유형의 종류

<table border="1">
    <tr>
        <td>Content-Type</td>
        <td>Description</td>
        <td>Use Case Examples</td>
    </tr>
    <tr>
        <td>text/html</td>
        <td>HTML 문서</td>
        <td>웹 페이지 콘텐츠 (HTML 파일)</td>
    </tr>
    <tr>
        <td>text/plain</td>
        <td>일반 텍스트 파일</td>
        <td>단순 텍스트 파일</td>
    </tr>
    <tr>
        <td>application/json</td>
        <td>JSON 데이터</td>
        <td>API 응답, JSON 형식데이터</td>
    </tr>
    <tr>
        <td>application/xml</td>
        <td>XML 데이터</td>
        <td>XML 형식의 API 응답 또는 데이터</td>
    </tr>
    <tr>
        <td>application/javascript</td>
        <td>JavaScript 파일</td>
        <td>웹 페이지에서 사용하는 자바스크립트 코드</td>
    </tr>
    <tr>
        <td>application/x-www-form-urlencoded</td>
        <td>폼 데이터 (키-값 쌍)로 인코딩된 데이터	HTML 폼 제출 시 주로 사용</td>
        <td>  </td>
    </tr>
    <tr>
        <td>multipart/form-data</td>
        <td>파일 업로드를 포함한 폼 데이터</td>
        <td>파일 업로드와 함께 전송되는 데이터</td>
    </tr>
    <tr>
        <td>image/png</td>
        <td>PNG 이미지</td>
        <td>PNG 포맷의 이미지 파일</td>
    </tr>
    <tr>
        <td>image/jpeg</td>
        <td>JPEG 이미지</td>
        <td>JPEG 포맷의 이미지 파일</td>
    </tr>
    <tr>
        <td>image/gif	</td>
        <td>GIF 이미지</td>
        <td>GIF 포맷의 이미지 파일</td>
    </tr>
    <tr>
        <td>audio/mpeg</td>
        <td>MPEG 오디오 파일</td>
        <td>MP3 파일</td>
    </tr>
    <tr>
        <td>video/mp4</td>
        <td>MP4 비디오 파일	</td>
        <td>MP4 비디오 파일</td>
    </tr>
    <tr>
        <td>application/pdf</td>
        <td>PDF 문서</td>
        <td>PDF 파일</td>
    </tr>
    <tr>
        <td>application/zip</td>
        <td>ZIP 압축 파일</td>
        <td>ZIP 압축된 파일</td>
    </tr>
</table>

4. Content-Length : 응답 본문의 길이 (바이트 단위)



## 콘텐츠 용어정리2

1. Connection : keep-alive (연결 유지), close (연결 종료)
2. keep-alive (연결 유지)
    - 클라이언트가 서버와의 연결을 유지하려고 할 때 사용됨
    - 기본적으로 HTTP/1.1에서 연결을 끊지 않고 여러 요청과 응답을 같은 연결을 통해 주고받음
    - 장점: 여러 요청을 할 때 매번 새로운 연결을 생성하지 않아도 되므로 성능이 향상됨
    - 특히, 웹 페이지를 로드할 때 여러 리소스(HTML, CSS, 이미지 등)를 한꺼번에 요청할 때 유용함
3. close (연결 종료)
    - 요청과 응답이 끝난 후 연결을 즉시 닫겠다는 의미임
    - HTTP/1.0에서는 기본적으로 각 요청마다 연결을 닫음
    - 장점: 서버 리소스를 절약할 수 있으나, 매번 새로운 연결을 생성해야 하므로 성능이 떨어질 수 있음
4. Response Body
    - Response Body는 HTTP 응답의 일부로, 클라이언트가 요청한 리소스나 데이터를 포함하는 본문임
    - 서버가 요청을 처리한 후 클라이언트에게 반환하는 실제 콘텐츠가 이 부분에 담김
5. Response Body의 주요 특징 : 데이터 포맷
    - Response Body에는 다양한 형식의 데이터가 포함될 수 있음
    - 서버는 클라이언트의 요청에 따라 적절한 포맷으로 데이터를 제공함
    - HTML: 웹 페이지 렌더링을 위한 HTML 문서
    - JSON: API 응답에서 자주 사용하는 데이터 형식
    - XML: 구조화된 데이터 전송에 사용
    - Plain Text: 단순 텍스트 데이터
    - 이미지, 동영상: 바이너리 파일 형식

# JSON

## JSON이란?

1. JSON(JavaScript Object Notation)은 데이터를 저장하고 전송하는 데 사용되는 경량의 데이터 교환 형식임
2. 사람과 기계 모두 읽고 쓰기 쉽도록 설계되었으며, 주로 웹에서 클라이언트와 서버 간의 데이터 교환 형식으로 많이 사용됨

## JSON의 주요 특징
1. 텍스트 기반
    - JSON은 텍스트로 구성되어 있으며, 사람이 읽기 쉬운 구조를 갖음
    - 주로 데이터를 네트워크를 통해 전송하거나 파일로 저장하는 데 적합함
2. 언어 독립적
    - JSON은 특정 프로그래밍 언어에 종속되지 않음
    - 대부분의 프로그래밍 언어에서 JSON을 쉽게 파싱하거나 생성할 수 있는 라이브러리를 제공함
3. 키-값 쌍
    - JSON 데이터는 키-값 쌍의 구조로 이루어짐
    - 각 키는 문자열로 나타내고, 값은 다양한 자료형(문자열, 숫자, 배열, 객체 등)이 될 수 있음
4. 데이터 구조 표현 : JSON은 객체, 배열, 숫자, 문자열, true, false, null과 같은 자료형을 표현할 수 있어, 복잡한 데이터 구조를 직관적으로 표현할 수 있음
5. JSON의 기본 구조 : 객체(Object) -> 중괄호 { }로 감싸며, 여러 개의 키-값 쌍을 포함할 수 있음, " "필수임
```JSON
{
    "name": "John",
    "age": 30,
    "city": "New York"
}
```
6. JSON의 장점
    - 경량 : 데이터의 표현이 간결하여 네트워크를 통해 데이터를 효율적으로 전송할 수 있음
    - 호환성 : 대부분의 프로그래밍 언어에서 JSON을 지원하며, 데이터를 쉽게 파싱하고 생성할 수 있음
    - 가독성 : 사람이 읽고 쓰기 쉬운 구조로 되어 있어, 디버깅과 유지보수에 유리함
7. 직렬화와 역직렬화 : 언어와 아키텍처가 서로 다른 APP1과 APP2이 있다고 할 때 데이터를 전송하려면 둘 다 이해할 수 있는 형태로 변환해야 함
8. 직렬화
    - 메모리상의 객체를 특정 포맷(JSON,XML,바이너리 등)으로 변환하는것을 말함
    - 이렇게 변환된 데이터를 파일로 저장하거나 네트워크를 통해 전송할 수 있음
9. 직렬화의 목적
    - 데이터 저장 : 데이터를 파일로 저장하거나 데이터베이스에 기록하기 위해 사용됨
    - 데이터 전송 : 네트워크를 통해 다른 애플리케이션이나 시스템으로 데이터를 전송할 때 사용됨
10. 역직렬화
    - 직렬화된 데이터를 다시 원래의 객체나 데이터 구조로 복원하는 과정임
    - 전송된 후 이를 다시 사용할 수 있는 객체로 복구할 때 사용됨

# 서버

1. 서버란 간단히 말하면 프로그램임
2. 이 프로그램은 지정된 포트, 예를 들어 8080포트에 소켓을 열고 클라이언트가 연결할 때까지 무한히 대기하며 기다림
<br>-> 그러다가 클라이언트가 연결하면 해당 클라이언트 소켓에서 요청을 받아와 수행하고 응답을 작성해 전달함

3. 정적 웹 서버(예를 들어 호스트는 8080에서 실행한다고 가정)
    - localhost:8080/hello HTTP 요청을 서버로 보내면 정적 웹 서버인 이 서버는 지정된 디렉토리 경로에서 hello.html을 찾아서 HTTP응답 바디에 넣어 전송함
    - 이 때 서버는 해당 HTML 파일에 아무 작업도 하지 않고, 파일을 있는 그대로 반환함
    <br>-> 그래서 정적(static)웹 서버인 것임
    - 이런 정적 웹 서버의 예로 아파치나 Nginx등이 있음
4. 정적 웹 서버 종류
    - Nginx, Apache: 성능과 확장성에 강점이 있는 정적 웹 서버
    - GitHub Pages, Netlify, Vercel: 간단한 정적 웹사이트를 쉽게 배포할 수 있는 서비스
    - Amazon S3: 대규모 정적 파일 저장 및 제공에 적합
    - Lighttpd, Caddy, Python SimpleHTTPServer, Node.js http-server: 경량 웹 서버 또는 간단한 로컬 테스트용 서버

## 동적 웹 서버

1. 동적 웹 서버란?
    - 클라이언트의 요청에 따라 실시간으로 데이터를 처리하고 응답하는 서버임
    - 요청에 맞게 데이터를 생성하거나 수정하여 클라이언트에게 맞춤형 콘텐츠를 제공할 수 있으며, 서버 측 언어(예: PHP, Node.js, Python 등)와 데이터베이스를 사용해 데이터를 처리함
2. 동적 웹 서버의 주요 특징
    - 실시간 데이터 처리: 요청이 들어올 때마다 데이터를 처리해 맞춤형 페이지나 응답을 제공함
    - 서버 측 처리: 클라이언트의 요청을 서버에서 처리한 후 결과를 반환함
    - 데이터베이스와의 상호작용: 클라이언트 요청에 따라 데이터베이스에서 데이터를 읽고 쓰는 작업을 수행
    - 동적 콘텐츠 생성: HTML, JSON 등 요청마다 다른 데이터를 동적으로 생성하여 제공함
3. 동적 웹 서버의 동작 흐름
    - 클라이언트 요청: 브라우저에서 서버로 HTTP 요청 전송
    - 서버 측 처리: 서버에서 스크립트 실행 및 데이터베이스 연동
    - 데이터베이스 연동: 필요한 데이터를 데이터베이스에서 조회 또는 저장
    - 동적 콘텐츠 생성: 요청에 맞는 동적인 콘텐츠 생성
    - 클라이언트 응답: 클라이언트에게 동적 데이터를 반환하여 화면에 렌더링
4. 동적 웹 서버의 예
    - Node.js: 자바스크립트를 사용해 비동기 방식으로 동적 콘텐츠를 처리
    - PHP: 서버 측 스크립트 언어로, 워드프레스 같은 CMS에서 사용.
    - Python (Django, Flask): 파이썬 기반 웹 프레임워크로, 데이터베이스와의 연동이 강력함
    - Ruby on Rails: Ruby 언어 기반으로 MVC 구조를 사용한 동적 웹 애플리케이션 구축
    - ASP.NET: C#과 같은 언어를 사용해 동적 콘텐츠 제공
5. 동적 웹 서버의 장점
    - 개별 사용자 맞춤형 콘텐츠 제공: 사용자 맞춤형 데이터 제공 가능
    - 실시간 데이터 처리: 클라이언트의 요청에 따라 실시간으로 데이터 처리
    - 복잡한 애플리케이션 구축 가능: 로그인 시스템, 데이터 조회/입력 등 복잡한 기능 구현 가능
6. 동적 웹 서버의 단점
    - 복잡성: 설정과 관리가 정적 웹 서버보다 복잡함
    - 성능 부담: 요청마다 데이터를 처리하므로 트래픽이 많으면 성능에 부담이 갈 수 있음
    - 보안 문제: 실시간 처리 과정에서 해킹 시도를 막기 위한 보안 관리가 중요함
7. 요약 : 
    - 동적 웹 서버는 실시간으로 데이터를 처리해 클라이언트에게 맞춤형 콘텐츠를 제공하는 서버임
    - 서버 측 스크립트와 데이터베이스를 이용해 요청에 따라 동적인 데이터를 생성하며, Node.js, PHP, Python, Ruby on Rails 등 다양한 기술로 구현할 수 있음