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

1)HTTP요청(Request)에는 GET,POST,PUT,DELETE와 같은 메서드를 지정할 수 있음

2)이러한 메서드는 호스트에게 지정한 리소스에 어떤 작업을 하소깊은지 알려주는 역할을 함

3)종류

HTTP Method		Description					Use Case Examples

GET		서버에서 리소스를 요청할 때 사용			데이터 조회 (예: 사용자 정보 가져오기)
POST		서버에 데이터를 전송할 때 사용			데이터 생성 (예: 새로운 게시글 작성)
PUT		서버의 기존 리소스를 업데이트할 때 사용		데이터 수정 (예: 사용자 정보 수정)
DELETE		서버의 리소스를 삭제할 때 사용			데이터 삭제 (예: 게시글 삭제)
------------------------------------------------------------------------------------------------------------------------------------------------
PATCH		리소스의 일부를 업데이트할 때 사용			데이터 일부 수정 (예: 특정 필드만 업데이트)
OPTIONS		서버가 지원하는 HTTP 메서드 확인			CORS 설정 확인 및 사전 검사
HEAD		GET과 동일하지만 응답 본문 없이 헤더 정보만 받음	리소스의 존재 여부 확인, 메타데이터 조회
CONNECT		서버에 터널을 설정해 SSL 등과 같은 프로토콜을 사용	프록시 서버를 통한 터널링
TRACE		요청이 서버까지 가는 경로를 추적			네트워크 진단 및 디버깅

4)비록 HTTP 메서드가 이런 기능을 한다고 하지만 실제 기능은 전적으로 API를 개발하는 개발자(백엔드)에게 달려있음

5)예를 들어 POST메서드이지만 개발자는 리소스에게 어떤 작업도 하지 않고 그냥 반환하도록 API를 작성할 수 있음

6)DELETE메서드에 아무것도 삭제하지 않는 API를 구현해 사용할 수도 있음

7)요지는, 표에서 HTTP 메서드 '기능'의 이미란 '이런 기능을 위한 API에 사용하는게 좋다'의 뜻임

8)GET메서드로 지정했으니 마법처럼 리소스가 반환되는 것이 아님

9)각 메서드에 연결되는 API는 개발자가 작성해야 하는 것임