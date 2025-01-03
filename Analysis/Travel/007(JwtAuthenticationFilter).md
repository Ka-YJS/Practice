# JwtAuthenticationFilter

```JAVA
package com.korea.travel.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.korea.travel.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	private final TokenProvider tokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
		
		String requestURI = request.getRequestURI();

	    if (requestURI.equals("/travel/userIdCheck") ||
	    		requestURI.equals("/travel/login") || 
	    		requestURI.equals("/travel/signup")|| 
	    		requestURI.equals("/travel/userFindId")|| 
	    		requestURI.equals("/travel/userFindPassword")|| 
	    		requestURI.equals("/travel/userResetPassword")|| 
	    		requestURI.equals("/travel/oauth2/google/callback")||
	    		requestURI.startsWith("/travel/email")|| 
	    		requestURI.startsWith("/uploads")) {
	        filterChain.doFilter(request, response);
	        return;//이 경로들은 필터를 넘기고 종료
	    }
		
		String token = request.getHeader("Authorization");
		
		if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);//"Bearer " 제거
            try {
                String userId = tokenProvider.validateAndGetUserId(token);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);//403 Forbidden
                response.getWriter().write("Invalid or expired token");
                return;//토큰이 유효하지 않거나 만료되었으면, 필터에서 더 이상 진행되지 않도록
            }
        }else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);//401 Unauthorized
            response.getWriter().write("Authorization header is missing or invalid");
            System.out.println("Authorization header is missing or invalid");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
```

## Annotation

\-

## 코드설명

```JAVA
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.xxxxx;
import jakarta.servlet.ServletException;
```
1. OncePerRequestFilter
	- 스프링에서 제공하는 필터 클래스로, 하나의 요청에 대해 단 한 번만 실행되는 필터를 보장함
	- 같은 요청에 대해 필터가 중복 실행되는 것을 방지함
2. servlet
	- JAVA웹 애플리케이션의 기본구성요소임
	- HTTP요청을 처리하고 응답을 생성하는 JAVA클래스임
3. ServletException
	- 서블릿처리 중 발생하는 예외를 나타냄
	- 필터나 서블릿에서 처리할 수 없는 오류가 발생했을 때 던져짐
```JAVA
if (token != null && token.startsWith("Bearer ")) {
token = token.substring(7); ...}
```
1. Bearer을 제거하는 이유
	- JWT는 일반적으로 "Bearer{token}"형식으로 전송됨
	- "Bearer"는 인증방식으로 나타내는 접두어일 뿐, 실제 토큰 검증에는 필요하지않음
	- 실제 토큰 값만 필요하므로 "Bearer"부분인 7글자를 제거함
```JAVA
String userId = tokenProvider.validateAndGetUserId(token);
	UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
```
1. UsernamePasswordAuthenticationToken
	- 보통 두가지의 생성자를 가짐 -> Object principal, Object credentials
	- authorities는 null로 설정됨
2. userId : 첫번째 파라미터 -> principal
	- 사용자를 식별하는 정보임
	- 여기서는 userId가 들어가며, 이는 인증된 사용자의 ID임
	- 이 값은 나중에 SecurityContextHolder에서 getPrincipal()로 조회할 수 있음
3. null : 두번째 파라미터 -> credentials
	- 사용자의 비밀번홍와 같은 자격증명 정보임
	- null로 설정된 이유
		1. JWT인증에서는 이미 토큰검증이 완료되었기 때문에 비밀번호가 필요없음
		2. 보안상의 이유로 메모리에 비밀번호를 유지하지 않음
4. new ArrayList<>() : 세번째 파라미터 -> authorities
	- 사용자의 권한목록을 나타내며, new ArrayList<>()는 빈 권한 목록을 의미함

```JAVA
response.setStatus(HttpServletResponse.SC_FORBIDDEN)
response.setStatus(HttpServletResponse.SC_UNAUTHORIZED)
```
1. SC_FORBIDDEN -> 403
	- 클라이언트가 인증되었지만 요청한 리소스에 대한 접근 권한이 없음을 나타냄
	- 토큰이 만료되었거나 유효하지않은 경우 사용됨
2. SC_UNAUTHORIZED -> 401
	- 클라이언트가 인증되지않았음
	- 토큰이 아예 없거나 Bearer형식이 아닌 경우 사용됨