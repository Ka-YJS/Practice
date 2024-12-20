# 스프링 시큐리티(Spring Security)

1. 스프링 시큐리티는 스프링 기반 애플리케이션에서 인증(Authentication)과 인가(Authorization)를 처리하기 위한 강력한 보안 프레임워크임
2. 스프링 애플리케이션에서 보안과 관련된 다양한 요구 사항을 손쉽게 구현할 수 있도록 도움
3. 주요 개념
	1. 인증(Authentication)
		- 사용자가 누구인지 확인하는 과정
		- 사용자가 애플리케이션에 접근할 때 제공한 자격 증명(예: 사용자명, 비밀번호)을 확인하여 신원을 검증하는 단계
	2. 인가(Authorization)
		- 인증된 사용자가 어떤 리소스에 접근할 수 있는지 결정하는 과정
		- 사용자에게 주어진 역할(Role)과 권한(Authority)에 따라 리소스에 대한 접근 권한을 부여함
	3. 필터 기반 아키텍처
		- 스프링 시큐리티는 필터 체인을 기반으로 동작함
		- HTTP 요청이 들어오면 여러 보안 필터들이 순차적으로 실행되어 요청을 처리하고, 보안 관련 로직을 적용함
4. 스프링 시큐리티와 서블릿 필터
	- API가 실행될 때마다 사용자를 인증해주는 부분을 구현해야 함
	- HTTP 요청과 응답을 가로채어, 요청이 컨트롤러에 도달하기 전 또는 응답이 클라이언트에 전달되기 전에 필요한 전처리 또는 후처리를 수행하는 데 사용됨
	- 주로 보안, 로깅, 인증, 인코딩 설정, 데이터 압축 등의 작업을 처리하는 데 유용함
	- 우리는 서블릿 필터를 구현하고 서블릿 필터를 서블릿 컨테이너가 실행하도록 설정해주기만 하면 됨
	- 스프링부트를 사용하지 않는 웹 서비스의 경우 web.xml과 같은 설정 파일에 이 필터를 어느 경로(/todo)에 적용해야 하는지 알려줘야 함
	- 서블릿 컨테이너가 서블릿 필터 실행시 xml에 설정된 필터를 실행시켜줌
	- 서블릿 필터가 꼭 한 개일 필요는 없지만, 걸러내고 싶은 모든 것을 하나의 클래스에 담으면 그 크기가 매우 커질 것임
	- 그래서 기능에 따라 다른 서블릿 필터를 작성할 수 있고 이 서블릿 필터들을 FilterChain을 이용해 연쇄적으로 순서대로 실행할 수 있음
	- doFilter()메서드가 다음으로 부를 필터를 FilterChain안에 갖고 있어 다음 필터를 실행할 수 있음
	- 스프링 시큐리티 프로젝트를 추가하면 스프링 시큐리티가 FilterChainProxy라는 필터를 서블릿 필터에 끼워넣어줌
	- FilterChainProxy클래스 안에는 내부적으로 필터를 실행시키는데 이 필터들이 스프링이 관리하는 스프링 빈 필터임
	- Filter를 만들기 위해 HttpFilter 대신 OncePerRequestFilter를 상속함
	- web.xml이 없기 때문에 WebSecurityConfigurerAdapter클래스를 상속해 필터를 설정함


## 스프링부트 시큐리티를 이용한 토큰 인증 과정

1. 사용자 로그인 (토큰 발급)
	- 클라이언트가 사용자 이름과 비밀번호를 포함한 인증 요청을 서버로 보냄 (예: /login 엔드포인트)
	- 서버는 사용자 정보를 검증하고, 인증 성공 시 JWT 토큰을 발급함
	- 이 JWT 토큰은 인증된 사용자임을 나타내며, Access Token으로 클라이언트에게 반환됨
2. 클라이언트가 요청에 토큰 포함
	- 이후 클라이언트는 보호된 자원에 접근하기 위해 HTTP 요청의 Authorization 헤더에 발급받은 JWT 토큰을 포함함
	- 예시
	GET /api/protected-resource
	Authorization: Bearer <JWT 토큰>
3. JWT 인증 필터에서 요청 가로채기
	- 스프링 시큐리티는 요청이 들어올 때 필터 체인을 통해 요청을 처리함
	- JwtAuthenticationFilter 같은 커스텀 필터를 사용하여 Authorization 헤더에서 JWT 토큰을 추출하고 검증함
	- 예시
	```JAVA
	String token = request.getHeader("Authorization");
	if (token != null && token.startsWith("Bearer ")) {
    	  token = token.substring(7);
	}
	```
4. JWT 토큰 검증
	- 필터에서 추출한 토큰을 TokenProvider 같은 클래스를 사용해 검증함
	- 이 과정에서 다음 사항을 확인함
		<br>->토큰의 서명이 올바른지
		<br>->토큰이 만료되지 않았는지
		<br>->토큰의 사용자 정보가 유효한지
	- 유효하지 않으면 401 Unauthorized 응답을 반환함
5. 사용자 인증 정보 설정
	- 토큰이 유효하면, 토큰에서 사용자 ID나 이름을 추출하여 스프링 시큐리티의 **SecurityContext**에 인증 정보를 설정
	- 예시
	```JAVA
	Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
	SecurityContextHolder.getContext( ).setAuthentication(authentication);
	```
6. 보안 컨텍스트를 통해 권한 확인
	- 스프링 시큐리티는 **SecurityContextHolder**에 저장된 인증 정보를 사용해 사용자가 요청한 자원에 접근할 수 있는 권한이 있는지 확인함
	- 필요한 권한이 없으면 403 Forbidden 응답을 반환함
7. 요청 처리 후 응답 반환
	- 모든 검증이 완료되면 스프링 시큐리티는 요청을 컨트롤러로 전달하여 비즈니스 로직을 처리함
	- 컨트롤러가 요청을 처리하고, 결과를 클라이언트에 반환함
8. 전체 흐름 요약
	- 클라이언트 로그인 : 사용자 정보로 로그인 후, 서버가 JWT 토큰을 발급함
	- JWT 토큰 포함 요청 : 클라이언트가 JWT 토큰을 포함한 요청을 보냄
	- JWT 필터에서 요청 가로채기 : 스프링 시큐리티의 필터가 요청을 가로채서 JWT 토큰을 검증함
	- JWT 검증 : 서버에서 토큰의 유효성을 확인하고, 서명과 만료 여부 등을 검증함
	- 사용자 인증 정보 설정 : 토큰이 유효하면 사용자 정보를 추출하고, 스프링 시큐리티의 SecurityContext에 인증 정보를 설정함
	- 권한 확인 : 설정된 인증 정보를 통해 사용자의 권한을 확인함
	- 요청 처리 후 응답 : 권한이 확인되면 요청을 처리하고, 결과를 클라이언트에 반환함

### @AuthenticationPrincipal

1. 스프링 시큐리티에서 사용자의 Principal 객체를 컨트롤러 메서드의 파라미터로 주입하기 위해 사용됨
2. Principal
	- Principal은 스프링 시큐리티에서 현재 인증된 사용자를 나타내는 객체
	- 주로 SecurityContextHolder에 저장된 Authentication 객체를 통해 접근할 수 있음
	- Authentication 객체의 getPrincipal() 메서드는 인증된 사용자의 정보를 담고 있으며, 이 정보는 @AuthenticationPrincipal 어노테이션을 통해 컨트롤러 메서드에 자동으로 주입됨
3. 주된 역할
	1. 현재 인증된 사용자의 정보를 가져옴
		- @AuthenticationPrincipal을 사용하면 SecurityContext에 저장된 인증된 사용자의 정보를 쉽게 가져올 수 있음
		- 이 정보는 보통 사용자 이름, 이메일, ID, 권한 정보 등을 포함함
	2. 간편한 주입
	- 직접적으로 SecurityContextHolder에서 Authentication 객체를 가져오는 번거로운 과정 없이, 어노테이션 하나로 해당 정보를 메서드 파라미터에 자동으로 주입받을 수 있음
4. 테스팅
	- user1이 회원가입 -> user1이 로그인하면서 토큰을 발급받음
	- user1이 Todo를 추가 { "title" : "테스트하기1" }라는 데이터를 넣으면서 토큰을 같이 전송함
	- 토큰을 검증받고 유효하면 추가를 해줌
	- user2도 같은방식으로 진행됨
	- 하지만 서로 추가한 내용이 서로에게 보이지않음
	- 비밀키를 가지고 암호화 하는 것을 서명이라고 함

## 패스워드 암호화

1. 보통 암호화된 패스워드를 비교해야 하는 경우, 사용자에게 받은 패스워드를 같은 방법으로 암호화한 후, 그 결과를 데이터베이스의 값과 비교하는것이 자연스러운 흐름임
2. 하지만 BCryptPasswordEncoder는 같은 값을 인코딩 할 때마다 다른 값이 나옴
3. 패스워드에 랜덤하게 의미 없는 값을 붙여 결과를 생성하기 때문임
4. 이런 의미없는 값을 보안용어로 Salt라고 하고, Salt를 붙여 인코딩하는 것을 Salting이라고 함
5. 따라서 사용자에게 받은 패스워드를 인코딩해도 데이터베이스에 저장된 패스워드와는 다를 확률이 높음
6. 대신 BCryptPasswordEncoder는 두 값이 일치하는지 여부를 알려주는 matcher()메서드를 제공함
7. 이 메서드는 Salt를 고려해 두 값을 비교해줌

### 추가

1. filter : 요청이 들어왔을 때 가로채서 검증을 함 -> Controller로 보냄
2. filter(토큰이 유효한지 검증을 한 뒤, 인증된 사용자의 정보를 저장)
3. Spring security : 필터체인 기반임
4. 우리가 만든 필터를 Spring security가 사용하도록 설정함
5. 필터체인.doFilter( )를 반드시 호출해야 함
6. 회원가입 -> 로그인 시 토큰 발급
7. 인증이 필요한 API사용 시 토큰과 함께 요청을 함