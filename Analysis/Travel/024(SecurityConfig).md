# SecurityConfig

```JAVA
package com.korea.travel.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.korea.travel.security.JwtAuthenticationFilter;
import com.korea.travel.security.TokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final TokenProvider tokenProvider;
	
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()//CSRF 보호 비활성화 (필요시 활성화)
            .authorizeRequests()
          	.requestMatchers(
          			"/travel/login",
          			"/travel/signup",
          			"/travel/userIdCheck",
          			"/travel/userFindId",
          			"/travel/userFindPassword",
          			"/travel/userResetPassword",
          			"/travel/oauth2/google/callback",
          			"/travel/email/**", 
          			"/uploads/**",
          			"/home", "/favicon.ico"
          			).permitAll()//경로는 인증 없이 허용
          	.anyRequest().authenticated()//그 외 요청은 인증 필요
        	.and()
        	.cors()//CORS 설정 활성화
        	.and()
        	//JWT 인증 필터 추가 요청이 들어올 때마다 JWT 토큰을 검증하고 인증처리하도록
        	.addFilterBefore(
        			new JwtAuthenticationFilter(tokenProvider), 
        			UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    
 //비밀번호를 BCrypt 해시 알고리즘으로 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## Annotation

\-

## 코드설명

```JAVA
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
```
1. SecurityFilterChain
	- Spring Security의 필터체인을 구성하는 인터페이스
	- 보안 관련 필터들의 순서와 설정을 정의함
	- HTTP요청에 대한 보안처리를 담당함
2. BCryptPasswordEncoder
	- 비밀번호를 안전하게 암호화하는 인코더
	- 단방향 해시함수를 사용하여 비밀번호를 암호화함
```JAVA
http.csrf().disable()
```
1. csrf(Cross-Site Request Forgery)
	- CSRF는 웹사이트 취약점 공격 방법 중 하나임
	- 사용자의 의도와 다른 요청을 서버에 전송하는 공격임
	- REST API 서버의 경우 CSRF 보호가 불필요한 경우가 많아 비활성화하기도 함
	- 보통 JWT를 사용하는 경우 CSRF 보호를 비활성화함
	- csrf를 활성화하는 경우 : 세션기반인증사용, 폼기반의 로그인사용, 브라우저기반 클라이언트 사용, OAuth/OpenID Connect를 사용
```JAVA
.addFilterBefore(
	new JwtAuthenticationFilter(tokenProvider), 
	UsernamePasswordAuthenticationFilter.class);
```
1. UsernamePasswordAuthenticationFilter.class
	- 여기서 class는 Java의 Class리터럴을 의미함
	- Class리터럴이란?
		1. 클래스의 정보를 담고있는 Class타입의 객체를 참조하는 방법임
		2. 해당 클래서의 타입정보를 얻을 수 있음
		3. 예시
		```JAVA
		//1. 직접 Class 객체 얻기
		Class<String> stringClass = String.class;

		//2. 메서드에서 Class 타입 파라미터 사용
		public void someMethod(Class<?> clazz) {
			String className = clazz.getName();//클래스 이름 얻기
			Method[] methods = clazz.getMethods();//클래스의 메서드 정보 얻기
		}

		//3. 실제 SecurityConfig에서의 사용
		.addFilterBefore(
			new JwtAuthenticationFilter(tokenProvider), 
			UsernamePasswordAuthenticationFilter.class//UsernamePasswordAuthenticationFilter의 Class 객체
		);
		```