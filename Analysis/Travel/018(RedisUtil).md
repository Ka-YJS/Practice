# RedisUtil

```JAVA
package com.korea.travel.service;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisUtil {

    private final StringRedisTemplate redisTemplate;

    public String getData(String key) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        return valueOperations.get(key);
    }

    public boolean existData(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void setDataExpire(String key, String value, long duration) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        Duration expireDuration = Duration.ofSeconds(duration);
        valueOperations.set(key, value, expireDuration);
    }

    public void deleteData(String key) {
        redisTemplate.delete(key);
    }
}
```

## Annotation

\-

## 코드설명

```JAVA
private final StringRedisTemplate redisTemplate;
```
1. StringRedisTemplate
    - Redis 작업을 위한 스프링의 템플릿 클래스임
    - 문자열 키-값 쌍을 Redis에 저장/조회하는 기능 제공
    - Redis(Remote Dictionary Server) : 인메모리 데이터 구조 저장소
        1. 주요특징 : 고성능 키-값 저장소, 선택적 데이터 영구 저장 가능, 캐싱, 세션 관리, 실시간 순위표 등에 사용
        2. 주로 사용되는 경우 : 임시 데이터 캐싱, 세션 관리, 실시간 분석, 대기열 관리
```JAVA
public void setDataExpire(String key, String value, long duration) {
    ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
    Duration expireDuration = Duration.ofSeconds(duration);
    valueOperations.set(key, value, expireDuration);
}
```
1. ValueOperations<String, String\>
    - Redis의 문자열 작업을 위한 인터페이스
    - 키-값 쌍의 기본적인 작업(조회, 저장, 삭제) 제공
2. Duration.ofSeconds(duration)
    - 시간 간격을 나타내는 객체 생성함
    - 초 단위로 만료 시간 설정
3. valueOperations.set(key, value, expireDuration)
    - 지정된 만료 시간 후 자동 삭제됨
    - expireDuration : Redis 서버가 내부적으로 만료 시간을 추적하고, 지정된 시간이 지나면 자동으로 해당 키-값을 메모리에서 삭제함
    <br>(임시토큰, 인증코드, 캐시데이터같은 일시적 데이터관리에 유용함)