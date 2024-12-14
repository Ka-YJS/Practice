# Hibernate

1. Java 기반의 ORM(Object-Relational Mapping) 프레임워크로, 객체지향 프로그래밍 언어인 자바에서 데이터베이스를 다룰 때 객체와 관계형 데이터베이스 간의 매핑을 자동으로 처리해주는 도구임
2. 이를 통해 개발자는 SQL을 직접 작성할 필요 없이, 자바 객체를 통해 데이터베이스 작업을 쉽게 수행할 수 있음
3. 주요 기능과 개념
	1. HQL(Hibernate Query Language)
		- Hibernate는 SQL을 직접 사용하지 않고, HQL이라는 Hibernate 전용 쿼리 언어를 제공함
		- HQL은 SQL과 유사하지만, 테이블이 아니라 객체를 대상으로 쿼리를 작성함
		- 예를 들어, HQL에서 FROM User WHERE id = 1이라고 작성하면, Hibernate는 이를 SQL로 변환하여 SELECT * FROM users WHERE id = 1과 같은 SQL을 실행함
	2. 자동 테이블 생성 및 관리
		- Hibernate는 애플리케이션 실행 시 자바 엔티티 클래스와 대응하는 데이터베이스 테이블을 자동으로 생성하거나 
		업데이트할 수 있음
		- Hibernate가 제공하는 DDL(Data Definition Language) 기능을 통해 이루어짐
		- 설정에 따라 테이블 생성, 수정, 삭제 등 다양한 작업을 자동으로 처리할 수 있음
4. 장점
	1. 생산성 향상 : 개발자가 SQL 쿼리를 직접 작성하지 않고 객체 지향 방식으로 데이터베이스를 다룰 수 있게 하여, 개발 시간을 단축하고 코드의 가독성을 높여줌
	2. 데이터베이스 독립성
		- 데이터베이스에 의존하지 않고 동작하기 때문에, 데이터베이스 독립적으로 사용할 수 있음
		- 애플리케이션이 MySQL에서 Oracle로 변경되더라도 별도의 SQL 수정 없이 쉽게 전환할 수 있음
	3. 자동화된 테이블 관리
		- 애플리케이션의 엔티티 클래스를 분석하여 데이터베이스의 테이블을 자동으로 생성, 업데이트, 삭제할 수 있음
		- 개발자는 데이터베이스 스키마를 관리하는 수고를 덜 수 있음
	4. 복잡한 관계 매핑 지원 : 1대1(One-to-One), 1대N(One-to-Many), **N대M(Many-to-Many)**와 같은 복잡한 엔티티 간의 관계를 쉽게 매핑할 수 있도록 함
5. 단점
	1. 학습 곡선 : 복잡한 쿼리나 성능 최적화를 위한 설정은 처음 사용자가 이해하기 어려울 수 있
	2. 성능 문제
		- 잘못된 설정이나 비효율적인 지연 로딩 사용은 성능 문제를 일으킬 수 있음
		- SQL을 자동으로 생성하지만, 이를 충분히 이해하지 않고 사용할 경우 예상치 못한 성능 저하가 발생할 수 있음
	3. ORM과 SQL 간의 불일치
		- 객체 지향적인 자바의 모델링 방식과 데이터베이스의 관계형 모델링 방식은 서로 다름
		- 복잡한 관계의 매핑에서는 여전히 ORM과 SQL 간의 불일치 문제가 존재할 수 있음


## JpaRepository<T, ID>

1. Spring Data JPA에서 제공하는 기본 인터페이스로, **JPA(Java Persistence API)**를 사용하여 데이터베이스 작업을 쉽게 처리할 수 있도록 도와주는 역할을 함
2. 이 인터페이스는 CRUD(Create, Read, Update, Delete) 기능과 페이징, 정렬 같은 데이터 처리 기능을 기본적으로 제공함
3. 데이터베이스와 상호작용하는 데 필요한 대부분의 작업을 자동으로 처리해줌
4. T는 엔티티 클래스(즉, 데이터베이스 테이블과 매핑되는 클래스)를 의미함
5. ID는 엔티티 클래스의 기본 키 타입을 의미함
6. 주요 메서드
	- save(S entity) : 엔티티를 데이터베이스에 저장하거나 업데이트
	- findById(ID id): 기본 키를 이용하여 엔티티를 조회
	- findAll(): 데이터베이스의 모든 엔티티를 조회
	- deleteById(ID id): 기본 키를 이용하여 엔티티를 삭제

## Optional

1. findById( )의 반환형
2. **Optional**는 Java 8에 도입된 클래스로, null 값을 안전하게 처리하기 위해 사용
3. findById() 메서드는 조회 결과가 존재할 수도 있고, 존재하지 않을 수도 있기 때문에, null을 반환하는 대신 Optional을 사용하여 결과를 감싸서 반환함
4. **Optional**는 해당 엔티티가 존재하는지 여부를 확인하고, 존재하면 그 값을 반환하며, 존재하지 않을 경우에 대해 추가적인 처리를 할 수 있는 다양한 메서드를 제공함
5. Optional의 주요 메서드
	- isPresent( ) : 반환된 Optional 객체 안에 값이 존재하면 true, 존재하지 않으면 false를 반환함
	<br>예시

	```java
	if (optionalTodo.isPresent()) {
		// 엔티티가 존재할 때 처리
			}
	```
	- get( ) : Optional 안에 값이 존재할 때, 그 값을 반환함 -> 만약 값이 없는데 get()을 호출하면 NoSuchElementException이 발생할 수 있음
	<br>예시

	```java
	TodoEntity todo = optionalTodo.get();  // 값이 있을 때만 호출 가능
	```
	- orElse(T other): 값이 존재하지 않을 때, 기본값을 반환
	<br>예시

	```java
	TodoEntity todo = optionalTodo.orElse(new TodoEntity());  // 없으면 새로운 엔티티 반환
	```
	- orElseThrow(Supplier<? extends X> exceptionSupplier): 값이 없을 때, 예외를 던짐
	<br>예시

	```java
	TodoEntity todo = optionalTodo.orElseThrow(() -> new RuntimeException("Todo not found"));
	```
6. 반환형이 Optional인 이유
	- findById() 메서드의 반환형이 Optional인 이유는 조회하려는 ID가 존재하지 않을 수 있기 때문임
	- 데이터베이스에서 해당 ID로 엔티티를 찾을 수 없는 경우에도 Optional을 사용하면 null 값 처리로 인해 발생할 수 있는 NullPointerException을 방지할 수 있음


# 어노테이션(@)

## @Entity

1. 테이블이름을 지정하기 위해 @Table 어노테이션을 사용함
2. 이 엔티티는 데이터베이스의 Todo테이블에 매핑된다는 뜻임
3. 만약 @Table을 추가하지 않거나, 추가해도 name을 명시하지 않는다면 @Entity의 이름을 테이블로 간주함
4. 만약 @Entity에 이름을 지정하지 않는 경우 클래스의 이름을 테이블 이름으로 간주함
5. 이블이 자동으로 생성되는 원리
	1. Hibernate가 엔티티 분석
		- 애플리케이션이 실행되면, Hibernate가 @Entity 어노테이션이 붙은 모든 클래스를 자동으로 검색하고 분석함
		- JPA는 각 엔티티 클래스의 필드, 애노테이션, 타입 등을 바탕으로 SQL DDL(데이터 정의 언어) 명령어를 생성하여 데이터베이스 테이블을 정의함
	2. Hibernate가 테이블 생성 : Hibernate는 이러한 정보를 바탕으로 CREATE TABLE과 같은 SQL 명령어를 생성하고, 데이터베이스에 테이블을 자동으로 생성
	3. spring.jpa.hibernate.ddl-auto 설정
		- Spring Boot와 같은 프레임워크에서는 spring.jpa.hibernate.ddl-auto라는 설정을 통해 테이블을 자동 생성, 업데이트 또는 삭제할 수 있음
		- 이  설정이 없으면 Hibernate는 애플리케이션 실행 시 엔티티에 해당하는 테이블을 자동으로 생성하거나 업데이트함

*@Id : 기본키가 될 필드에 지정함


## @GeneratedValue(generator="system-uuid")

1. @GeneratedValue는 JPA에서 기본 키 값을 자동으로 생성할 때 사용되는 어노테이션
2. generator="system-uuid"는 특정 키 생성 전략을 참조하겠다는 의미로, 주로 Hibernate에서 제공하는 커스텀 생성 전략을 사용할 때 사용됨
3. @GeneratedValue는 기본 키 값을 자동으로 생성하도록 하고, generator 속성은 커스텀 생성기를 참조하게 함
4. 이 경우, **"system-uuid"**라는 이름의 생성기를 사용하여 UUID를 기본 키로 자동 생성하는 것임
5. GenericGenerator(name="system-uuid", strategy="uuid")
	- **"system-uuid"**라는 이름의 커스텀 생성기를 정의하고, 그 생성 전략으로 UUID를 사용하도록 설정함
	- 이로 인해, UUID 형식의 고유한 식별자가 기본 키로 자동 생성됨
6. UUID 생성방식
	- Hibernate는 이 설정을 통해 UUID 4 방식을 사용하여 랜덤 UUID를 생성
	- 이는 128비트 크기의 고유 식별자로, 각 엔티티가 고유한 식별자를 가질 수 있게 해줌

## Slf4j(Simple Logging Facade for Java) -> for = 4

1. Java 애플리케이션에서 사용하는 로깅 프레임워크에 대한 통합된 인터페이스를 제공하는 로그 추상화 라이브러리임
2. SLF4J는 로그를 작성하는 표준 인터페이스를 제공하고, 실제로 로그를 기록하는 것은 Logback, Log4j 같은 다른 로깅 프레임워크가 담당하는 방식임
3. SLF4J가 필요한 이유
	- 과거에는 애플리케이션에서 로그를 기록하기 위해 다양한 로깅 프레임워크가 사용되었음
	- 이들은 각각 고유한 API를 가지고 있어서, 만약 다른 로깅 프레임워크로 교체하려면 코드를 전부 수정해야 했음
	- SLF4J는 여러 로깅 프레임워크에 대한 추상화 레이어를 제공해 개발자는 한 가지 방식으로 로그를 작성하고, 나중에 어떤 로깅 프레임워크를 사용할 지결정 할 수 있게 되었음
4. SOLID : 객체 지향 설계 5대원칙
	- 단일 책임 원칙 (SPR, Single Responsiblity Principle) : 
	<br>->하나의 메서드는 하나의 책임만 가져야 함
	- 개방-폐쇄 원칙 (OCP, Open Closed Principle) : 
	<br>->상속에는 OPEN, 변경에는 CLOSE해야함
	<br>-> 기존코드는 변경하지않으면서 상속을 이용해서 기능은 추가해야함 
	- 리스코프 치환 원칙 (LSP, Liskov Substitution Principle) : 
	<br>->같은 조상의 다른 클래스로 바꿔도 동작해야 함(다형성)
	<br>->Spring Data JPA : Hibernate를 다른 구현체로 바꿔도 문제가 생기지 않음(Logback, Log4j 같이 다른 구현체로 바꿔도 문제가 생기지않음)
	<br>->자식클래스는 언제나 자신의 부모클래스를 대체할 수 있음. 즉, 부모클래스자리에 자식클래스를 넣어도 작동됨
	- 인터페이스 분리 원칙 (ISP, Interface Segregation Principle) : 
	<br>->유사한 인터페이스가 있더라도 목적이 다르면 분리해야 함
	- 의존 역전 원칙 (DIP, Dependency Inversion Principle) : 
	<br>->추상화에 의존한 코드를 작성해야함
	<br>->코드가 너무 구체적이면 변경에 불리함

# JPQL (Java Persistence Query Language)

1. JPA에서 사용하는 객체지향 쿼리 언어
2. 데이터베이스 테이블이 아닌 JPA 엔티티 객체를 대상으로 CRUD(생성, 조회, 수정, 삭제) 작업을 수행하는 쿼리를 작성할 수 있도록 설계되었었음
3. JPQL의 특징
	1. 객체 지향적
		- JPQL은 데이터베이스 테이블 대신 JPA 엔티티 객체를 대상으로 쿼리를 실행함
		- 테이블 이름이나 컬럼 대신 엔티티 클래스 이름과 필드를 사용하여 쿼리를 작성함
		- 이 때문에, JPQL 쿼리는 데이터베이스 독립적이며, 데이터베이스의 스키마에 의존하지 않음
	2. SQL과 유사한 구문
		- JPQL은 SQL과 매우 유사한 문법을 사용하지만, 엔티티 객체를 다룬다는 점에서 차이가 있음
		- 예를 들어, SQL에서 SELECT * FROM users는 JPQL에서는 SELECT u FROM User u로 표현됨
		- 여기서 User는 데이터베이스 테이블이 아닌 엔티티 클래스를 의미함

# 로그(★★★★★)

1. 소프트웨어 시스템이나 애플리케이션에서 동작 상태나 이벤트가 발생했을 때, 그 내용을 기록한 정보임
2. 개발자, 운영자, 또는 시스템이 해당 애플리케이션의 상태를 파악하거나 문제 해결을 위해 사용함
3. 주로 애플리케이션의 실행 흐름, 오류 또는 성능 문제를 추적하고 분석하는 데 매우 중요한 도구임
4. 로그의 주요 목적
	1. 디버깅
		- 애플리케이션에서 발생한 문제나 버그를 추적하고 원인을 파악하기 위해 사용됨
		- 디버깅 시 로그를 통해 애플리케이션이 어떤 작업을 하고 있었는지, 어떤 오류가 발생했는지를 알 수 있음
	2. 모니터링
		- 애플리케이션이 예상대로 작동하는지 확인하고, 시스템 성능을 모니터링하기 위해 사용됨
		- 예를 들어, 응답 속도, 메모리 사용량 등을 로그로 기록하여 애플리케이션의 성능을 분석할 수 있음
	3. 문제 해결
		- 애플리케이션에서 예상치 못한 상황이 발생했을 때, 로그를 통해 그 문제를 해결하는 데 필요한 정보를 얻을 수 있음
		- 특히, 시스템이 갑작스럽게 중단되거나 성능 저하가 발생했을 때, 그 원인을 파악하는 데 중요한 역할을 함
	4. 보안 검사
		- 애플리케이션에 대한 보안 감사 및 추적을 위해 사용됨
		- 시스템에 대한 접근 시도나 비정상적인 활동을 로그로 기록하여, 보안 위협을 감지하고 대응할 수 있음
5. 로그의 주요 구성 요소
	1. 타임스탬프 : 로그가 기록된 시간으로, 이는 이벤트가 발생한 시점을 추적하는 데 매우 중요함
	2. 로그 레벨(Log Level) : 로그의 중요도를 나타내며, 보통 아래와 같은 레벨이 사용됨
		- TRACE: 가장 낮은 수준의 로그. 아주 상세한 디버깅 정보
		- DEBUG: 개발 과정에서 주로 사용되는 디버깅 정보
		- INFO: 시스템의 정상적인 동작을 나타내는 정보
		- WARN: 예상치 못한 상황이 발생했지만, 시스템이 정상적으로 동작하는 경우
		- ERROR: 오류가 발생했으며, 시스템이 정상적으로 동작하지 않는 경우
		- FATAL: 매우 심각한 오류로, 시스템이 더 이상 동작할 수 없는 경우
	3. 메시지 : 로그에 기록된 이벤트에 대한 설명. 어떤 일이 일어났는지 명확하게 기술함
	4. 이벤트 소스 : 로그가 기록된 위치, 예를 들어 특정 클래스, 메서드, 또는 모듈