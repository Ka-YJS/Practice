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
	1. 선택적 매개변수 처리가 쉬움
		- 선택적 매개변수는 메서드 체이닝 방식으로 유연하게 설정할 수 있어 객체 생성 시 편리함(원하는 값을 순서상관없이 불러올 수 있음)
		<br>*메서드 체이닝 : 여러 메서드를 한 줄의 코드에서 연속적으로 호출할 수 있는 방식으로 각 메서드가 객체 자신을 반환하도록 설계되어, 호출된 메서드가 끝난 후 바로 다음 메서드를 호출할 수 있게 만듦
	2. 가독성이 좋음
		- 모든 설정을 하나의 "빌더" 객체에서 처리하므로 매개변수가 많더라도 가독성을 유지할 수 있음
	3. 불변성 보장
		- 생성자가 아닌 빌더를 통해 객체를 생성하면, 생성된 객체는 불변 객체로 만들 수 있음
		- 객체가 생성된 후에는 필드값을 변경할 수 없게 만들 수 있기 때문에, 객체가 생성된 이후에는 상태가 변하지 않음
		<br>->빌더 클래스 내부에서 객체를 초기화하고, build() 메서드를 통해 완전한 객체를 반환하게 되어, 이후 객체의 상태를 변경할 수 없기때문임
	4. 유효성 검사 수행 가능
		- 잘못된 데이터로 객체가 생성되는 것을 방지할 수 있음
		- 객체를 생성할 때 모든 필드를 검증하여, 유효하지 않은 값이 들어가면 예외를 발생시키거나, 잘못된 객체가 생성되지 않도록 할 수 있음
- builder패턴의 예시
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
	- 생성자를 직접 작성할 필요가 없어서 코드가 더 간결하고 읽기 쉬워짐
	- 모든 필드를 초기화하는 생성자를 자동으로 제공하므로 객체 생성 시 실수를 방지하고, 코드의 일관성을 유지할 수 있음
	- Lombok을 사용하면 생성자 외에도 toString(), equals(), hashCode() 등 여러 메서드를 자동으로 생성할 수 있기 때문에 객체를 다룰 때 더 유연하게 대응할 수 있음
6. @NoArgsConstructor : Lombok의 매개변수 없는 기본 생성자
	- 기본 생성자를 수동으로 작성할 필요가 없음 -> 객체를 기본값으로 초기화할 때 사용함
	- 기본 생성자를 사용하여 객체를 나중에 설정할 수 있는 유연성을 제공함
	- Java Bean 규약을 준수함
	<br>-> Java Bean 규약 : 기본생성자를 가짐, getter&setter사용, Serializable(직렬화)인터페이스구현, private사용 
7. @OneToMany : 일대다 관계, 하나의 Entity가 여러 개의 다른 Entity와 관계를 맺음

## 코드설명

```JAVA
@OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
private List<PostEntity> post = new ArrayList<>();
```
1. mappedBy = "userEntity"
	- mappedBy : 양방향 관계에서 자식 엔티티에서 부모 엔티티의 필드를 지정하는 속성
	- "userEntity" : PostEntity 클래스에서 부모 엔티티인 UserEntity와의 관계를 나타내는 필드 이름
2. cascade = CascadeType.ALL
	- cascade : 부모 엔티티에서 수행된 영속성 연산(저장, 삭제 등)이 자식 엔티티에도 전이되는 방식
	- CascadeType.ALL : 모든 연산(저장, 삭제, 업데이트 등)을 자식 엔티티로 전이됨
	<br>-> 부모 엔티티(UserEntity)에 대해 persist(), merge(), remove() 등의 작업이 수행되면 자식 엔티티(PostEntity)에도 동일한 작업이 적용됨
3. orphanRemoval = true
	- orphanRemoval : 부모 엔티티에서 자식 엔티티를 제거할 때, 자식 엔티티가 더 이상 부모와 관계가 없을 경우 자식엔티티를 자동으로 삭제되도록 하는 옵션
	- true : 
4. fetch = FetchType.LAZY
	- fetch : JPA에서 연관된 엔티티의 데이터를 로딩하는 방식을 지정하는 속성으로 지연로딩과 즉시로딩 중 하나를 선택할 수 있음 -> 관계 매핑에서 사용됨
	- FetchType.LAZY : 지연 로딩(Lazy Loading)을 사용하도록 설정하는 옵션
	<br>*지연 로딩은 객체를 실제로 사용할 때까지 데이터를 로드하지 않도록 설정하는 방식
	<br>-> UserEntity를 조회할 때 관련된 PostEntity 객체들은 즉시 로딩되지 않고, user.getPosts()를 호출할 때, PostEntity들이 실제로 로드됨(필요할때만 로딩)
5. private List<PostEntity> post = new ArrayList<>();