# WebConfig

```JAVA
package com.korea.travel.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")	//모든 경로에 대해 CORS 설정
				.allowedOrigins("탄력적IP","todo-test-dev.store:9090")	//허용할 출처
				.allowedMethods("GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS")	//허용할 HTTP 메서드
				.allowedHeaders("*")		//모든 헤더 허용
				.allowCredentials(true);	//쿠키나 인증 정보를 포함한 요청 허용
	}
	
	//업로드된 파일을 제공할 수 있도록 설정
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        		// /uploads/** 경로에 대한 요청 처리
        registry.addResourceHandler("/uploads/**")
        		//실제 파일 위치 설정
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
    }
}
```

## Annotation

\-

## 코드설명

```JAVA
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
```
1. CorsRegistry
	- CORS(Cross-Origin Resource Sharing) 설정을 관리하는 클래스
	- 다른 출처(도메인)에서의 리소스요청을 제어함
2. ResourceHandlerRegistry
	- 정적 리소스(이미지, CSS, JavaScript 등)의 위치와 접근 경로를 매핑함
	- 파일 시스템의 특정 디렉토리를 웹에서 접근 가능하게 만듦
3. WebMvcConfigurer
	- Spring MVC의 다양한 설정을 커스터마이징할 수 있는 인터페이스임
	- 주요 메서드

	|메서드|기능|
	|---|---|
	|addCorsMappings()|CORS 설정|
	|addResourceHandlers()|리소스 핸들러 설정|
	|addInterceptors()|인터셉터 추가|
	|addViewControllers()|뷰 컨트롤러 설정|