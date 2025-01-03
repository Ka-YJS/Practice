# RedisConfig

```JAVA
package com.korea.travel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Configuration
@RequiredArgsConstructor
@EnableRedisRepositories
public class RedisConfig {
    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    // 내장 / 외부 Redis 연결
    @Bean
    public RedisConnectionFactory redisConnectionFactory(){
        return new LettuceConnectionFactory(host, port);
    }

    /*
     * RedisConnection 에서 넘겨준 byte 값을 직렬화 RedisTemplate 은
     * Redis 데이터를 저장하고 조회하는 기능을 하는 클래스 REdis cli 를 사용해 Redis 데이터를 직접 조회할때,
     * Redis 데이터를 문자열로 반환하기 위한 설정
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(){
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
```

## Annotation

1. @Configuration
    - 스프링의 설정 클래스임을 나타냄
    - Bean을 등록하고 설정하는 클래스임을 스프링에게 알려줌
2. @EnableRedisRepositories
    - Redis 저장소를 활성화하는 어노테이션
    - Spring Data Redis의 Repository기능을 사용할 수 있게 해줌

## 코드설명

```JAVA
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
```
1. RedisConnectionFactory
    - Redis 서버와의 연결을 관리하는 인터페이스임
    - REdis 연결에 필요한 기본적인 구성을 제공함
2. LettuceConnectionFactory
    - RedisConnectionFactory의 구현체 중 하나임
    - Lettuce라이브러리를 사용하여 Redis에 연결함
    - 비동기 처리가 가능하며, 높은 성능을 제공함
3. RedisTemplate
    - REdis의 데이터접근을 위한 높은 수준의 추상화를 제공함
    - REdis 명령어를 실행하고 데이터를 저장/조회하는 기능을 제공함
    - 다양한 타입의 데이터를 Redis에 저장할 수 있게 해줌
```JAVA
redisTemplate.setKeySerializer(new StringRedisSerializer());
redisTemplate.setValueSerializer(new StringRedisSerializer());
```
1. StringRedisSerializer
    - Redis의 데이터를 String형태로 직렬화/역직렬화하는 클래스임
    - 키와 값을 문자열로 변호나하여 저장하고 조회함
    - REdis CLI로 데이터를 조회할 때 사람이 읽을 수 있는 형태로 보여줌
    <br>-> 이러한 설정을 통해 Redis를 캐시서버나 세션저장소 등으로 활용할 수 있음
