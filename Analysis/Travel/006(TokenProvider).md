# TokenProvider

```JAVA
package com.korea.travel.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.korea.travel.model.UserEntity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenProvider {
	
	@Value("${jwt.secret}")
	private String secretKey; 
	
	//JWT생성
	public String create(UserEntity entity) {
		
		//JWT Header
		//JWT header의 값을 담을 Map.
		Map<String, Object> header = new HashMap<>();		
		//만들어진 Map타입을 가지고있는 header 변수에 key value 방식으로 typ(key)와 JWT(value)를 넣어준다.
		header.put("typ", "JWT");
		
		//토큰의 유효기간 1000(밀리세컨드)*60(초)*180(분)설정
		Long expTime = 1000*60L*180L;
		//현재시간
		Date ext = new Date();
		//ext의 시간을 현재 시간에 추가해주기
		ext.setTime(ext.getTime() + expTime);
		
		//payload를 담을 Map
		Map<String,Object> payload = new HashMap<>();
		//Map타입을 가지고있는 
		
		//jwt 생성
		String jwt = Jwts.builder()
				.setHeader(header)	//헤더 설정
				.signWith(SignatureAlgorithm.HS512,secretKey)// 서명 알고리즘과 비교
				.setSubject(entity.getUserId())	//사용자 id설정
				.setIssuer("travel app")	//토큰 발행 주체
				.setIssuedAt(new Date())	//토큰 발행 날짜
				.setExpiration(ext)		//exp
				.compact();			//토큰을 .으로 구분된 하나의 문자열로 만들어준다
		return jwt;
	}	
	
	//JWT 토큰 검증 및 유저 id 반환
	public String validateAndGetUserId(String token) {
		
		if(!isTokenExpired(token)) {
			try {
				Claims claims = Jwts.parser()
						.setSigningKey(secretKey)
						.parseClaimsJws(token)
						.getBody();
				return claims.getSubject();
			} catch (Exception e) {
				throw new RuntimeException("Token validation failed",e);
			}
		}else {
			return null;
		}
	}	
	
	//토큰이 만료되었는지 확인
	public boolean isTokenExpired(String token) {
		Date expiration = Jwts.parser()
				.setSigningKey(secretKey)
				.parseClaimsJws(token)
				.getBody()
				.getExpiration();
		//만료되었으면 true
		return expiration.before(new Date());
	}	
}
```

## Annotation

\-

## 코드설명

```JAVA
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
```
1. io.jsonwebtoken.Claims : JWT 토큰의 내용(payload)을 나타내는 클래스
2. io.jsonwebtoken.Jwts : JWT 토큰을 생성하고 파싱하는 메인 클래스
3. io.jsonwebtoken.SignatureAlgorithm : JWT 서명에 사용할 알고리즘을 지정하는 열거형
```JAVA
//jwt 생성
String jwt = Jwts.builder()
		.setHeader(header)
		.signWith(SignatureAlgorithm.HS512,secretKey)
		.setSubject(entity.getUserId())
		.setIssuer("travel app")
		.setIssuedAt(new Date())
		.setExpiration(ext)
		.compact();
return jwt;
```
1. setHeader(header) : JWT 헤더 설정(typ: JWT)
2. signWith(SignatureAlgorithm.HS512,secretKey)
	- signWith : JWT(JSON Web Token)에서 토큰에 서명을 추가하는 메서드임
	- HS512
		1. HMAC(Hash-based Message Authentication Code)는 메시지 인증 코드를 생성하는 방식임
		2. HS512는 HMAC SHA-512 알고리즘을 의미함
		3. 512비트(64바이트) 해시 값을 생성하는 암호화 알고리즘임
		4. JWT에서 사용 가능한 여러 알고리즘 중 하나임(HS256, HS384, HS512 등)
	- secretKey : JWT 토큰을 서명할 때 사용되는 비밀키로, application.properties에서 정의됨
3. setSubject(entity.getUserId()) : 토큰제목 -> 여기서는 사용자ID를 사용함
```JAVA
//JWT 토큰 검증 및 유저 id 반환
public String validateAndGetUserId(String token) {

	if(!isTokenExpired(token)) {
		try {
			Claims claims = Jwts.parser()
					.setSigningKey(secretKey)
					.parseClaimsJws(token)
					.getBody();
			return claims.getSubject();
		} catch (Exception e) {
			throw new RuntimeException("Token validation failed",e);
		}
	}else {
		return null;
	}
}
```
1. Jwts.parser() : JWT토큰을 해석할 수 있는 파서객체를 생성함
2. .setSigningKey(secretKey) : 토큰을 생성할 때 사용한 비밀키를 설정하고, 이 키를 사용해서 토큰의 서명을 검증함
3. parseClaimsJws(token)
	- 실제로 JWT 토큰을 파싱해서 토큰의 유효성을 검사함
	- 서명이 유효하지 않으면 예외를 발생시킴
4. getBody()
	- 파싱된 토큰에서 Claims(페이로드) 부분을 가져옴
	- 사용자 ID, 발행 시간 등의 정보 포함
	- 토큰의 구조가 xxxxx.yyyyy.zzzzz라고 본다면 getBody()는 yyyy를 가져옴
	<br>(xxxxx.yyyyy.zzzzz -> xxxxx는 헤더, yyyyy는 페이로드, zzzzz는 서명임)