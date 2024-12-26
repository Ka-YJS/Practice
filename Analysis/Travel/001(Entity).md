# User Entity

```JAVA
package com.korea.travel.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "users")
@Entity
@Builder
@AllArgsConstructor 
@NoArgsConstructor
public class UserEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;				//고유 id
	private String userId;			//유저Id
	private String userName; 		//유저이름
	private String userNickName;	//닉네임
	private String userPhoneNumber;	//전화번호
	private String userPassword;	//비밀번호
	private String userProfileImage;//프로필이미지
	private String userCreatedAt;	//생성시간
	
	//관계 설정
	@OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<PostEntity> post = new ArrayList<>();
}
```

## Annotation

1. @Data : Lombok에서 getter, setter, toString 등 자동생성
	- Entity에서는 필요한 필드에따라 @Getter 혹은 @Setter을 사용하는 것을 권장함
	- @Data 사용 시 주의사항
		- toString() 메서드가 자동 생성되어 순환 참조(서로가 서로를 참조해서 무한루프발생)문제 발생 가능
		- 모든 필드에 대한 getter/setter가 생성되어 캡슐화(private로 변수를 묶어서 외부에서 사용불가)가 깨질 수 있음
2. @Table(name = "users") : DB 테이블이름을 "users"로 지정
	- "user"는 많은 데이터베이스에서 예약어로 지정되어 있어서 사용불가
	- 명확하게 테이블이름을 지정함으로써 충돌방지
	- 클래스이름과 실제DB테이블이름 다르게 설정가능

	|클래스이름|실제DB테이블이름|
	|---|---|
	|UserEntity|users|

3. @Entity : JPA 엔티티임을 선언
	- Java에 코드를 적었을 때, DB테이블을 자동으로 만들어줌 -> 쿼리 직접 작성하지않아도 됨
	- 자바코드만으로 DB작업가능
	- 예시
	```JAVA
	@Entity  //이 클래스는 데이터베이스 테이블과 매핑
	public class User {
    @Id  //이 필드는 테이블의 기본키(Primary Key)가 됨
    private Long id;
    
    private String name;  //테이블의 name 컬럼과 매핑
    private String email; //테이블의 email 컬럼과 매핑
	}
	```
	-> 위와같은 코드가 적히면 아래와같은 DB테이블을 자동으로 생성
	```SQL
	CREATE TABLE user (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
	);
	```
4. @Builder : Lombok의 빌더 패턴 구현

#### Builder 패턴

- Builder클래스를 따로 개발하지 않고도 Builder패턴을 사용해 객체를 생성할 수 있음
- 빌더패턴을 구현할 때의 장점
<br>->선택적 매개변수 처리가 쉬움, 가독성이 좋음, 불변성 보장, 유효성 검사 수행 가능

- 예시
```JAVA
//일반적인 User 클래스
public class User {
    private final Long id;
    private final String userId;
}
// private 생성자
private User(UserBuilder builder) {
    this.id = builder.id;
    this.userId = builder.userId;
}
```
->위처럼 코드가 있을 때, Builder클래스를 작성하면 아래와 같음
```JAVA
public static class UserBuilder {
    private final Long id;
    private final String userId;

	public UserBuilder() {}

	public UserBuilder id(Long id) {
            this.id = id;
            return this;
    }
	public UserBuilder userId(String userId) {
            this.userId = userId;
            return this;
    }
}
```
->public UserBuilder() {} : 단순히 UserBuilder 클래스의 인스턴스를 생성하기 위한 빈 생성자로 User 객체를 만들기위한 과정임

5. @AllArgsConstructor : Lombok의 모든 필드를 매개변수로 받는 생성자
6. @NoArgsConstructor : Lombok의 매개변수 없는 기본 생성자
7. @OneToMany