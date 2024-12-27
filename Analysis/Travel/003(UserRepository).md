# UserRepository

```JAVA
package com.korea.travel.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.korea.travel.model.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
		
		UserEntity findByUserId(String userId);
		
		UserEntity findByUserName(String userName);
		
		Boolean existsByUserId(String userId);
		
		// 아이디, 이름, 전화번호로 사용자 조회 (비밀번호 찾기)
		UserEntity findByUserIdAndUserNameAndUserPhoneNumber(
			String userId, String userName, String userPhoneNumber
		);
		
}

```

## Repository란?

- 데이터베이스 작업을 처리하는 인터페이스로 실제 데이터베이스 구현 방식을 숨김
- 간단하게보면, Entity에 의해 생성된 DB에 접근하는 메소드들을 사용하기 위한 인터페이스임
- 주로 JPA를 사용할 때 JpaRepository를 상속받아 사용함
- 순수 데이터 접근 담당하며, 비즈니스로직은 Service로 넘김
- 공통된 데이터 접근로직을 Repository에 한번만 구현하고, 여러 Service에서 동일한 Repository 재사용가능
- 데이터베이스없이도 테스트가 가능함


## Annotation

1. @Repository : 이 인터페이스가 Repository역할을 한다고 알려줌

## 코드설명

```JAVA
public interface UserRepository extends JpaRepository<UserEntity, Long>{}
```
1. extends JpaRepository : JpaRepository를 상속받는 인터페이스 선언함
2. <UserEntity, Long> : UserEntity를 다루며, ID타입은 Long임을 명시함

```JAVA
UserEntity findByUserId(String userId);
```
1. userId를 사용자를 찾는 메서드
2. Spring Data JPA가 메서드 이름을 분석해서 자동으로 쿼리를 생성해줌

```JAVA
UserEntity findByUserName(String userName);
```
1. userName으로 사용자를 찾는 메서드임

```JAVA
Boolean existsByUserId(String userId);
```
1. existsByUserId : 해당 userId가 존재하는지 확인함
2. 결과값으로 true / false를 반환함

```JAVA
UserEntity findByUserIdAndUserNameAndUserPhoneNumber(
	String userId, String userName, String userPhoneNumber
);
```

1. findByUserIdAndUserNameAndUserPhoneNumber : userId, userName, userPhoneNumber의 세가지조건을 모두 만족하는 사용자를 찾는 메서드임
2. 주로 비밀번호 찾기 기능에서 사용됨