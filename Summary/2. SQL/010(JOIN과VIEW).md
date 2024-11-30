# 식별자와 속성분류

## 식별자

1. 본질식별자 : 업무에 의해서 만들어진 식별자
2. 인조 식별자
    - 업무적으로 만들어지지 않지만 인위적으로 만든 식별자
    - 본질 식별자가 복잡한 구성을 가지고 있으면 인조 식별자로 대체

## 속성분류

1. 기본속성
    - 업무로부터 추출한 속성
    - 가장 일반적이고 많은 속성을 차지
2. 설계속성 : 모델링을 진행할 때, 속성을 새로 만들거나 변형하여 정의하는 속성
3. 파생속성 : 다른 속성에 영향을 받아 발생하는 속성

# JOIN

1. 조인이란?
    - SELECT와 더불어 가장 많이 사용하는 옵션
    - 두 개 이상의 테이블을 묶어서 하나의 결과 집합으로 만들어 내는 것
    - 이를 통해 데이터를 효율적으로 검색하고 처리하는데 도움을 줌
    - JOIN을 사용하는 이유는 데이터베이스에서 테이블을 분리하여 '데이터 중복을 최소화'하고  '데이터의 일관성'을 유지하기 위함임
    - 여러가지 JOIN의 방식이 있으며 JOIN방식에 따라 결과가 달라짐
2. 분류
    - INNER JOIN
    - LEFT OUTER JOIN
    - RIGHT OUTER JOIN
    - FULL OUTER JOIN
    
## JOIN의 종류_Inner Join

1. 각 테이블에서 조인 조건에 일치되는 데이터만 가져옴
2. A와 B테이블의 공통된 부분을 의미한다 보통 교집합 이라고 부름
3. 형식 :
```SQL 
	TABLE_NAME_A INNER JOIN TABLE_NAME_B ON 조건식;
	TABLE_NAME_A JOIN TABLE_NAME_B ON 조건식;
    SELECT * FROM 테이블A INNER JOIN TABLE_NAME_B ON 조건식;--INNER는 생략가능
    ON 테이블A.column_name = 테이블B.column_name;
```
4. INNER JOIN은 교집합 연산과 같다음. JOIN 하는 컬럼 값이 양쪽 테이블 데이터 집합에서 공통적으로 존재하는 데이터만 조인해서 결과 데이터 집합으로 추출함
5. 사용법 : 

SELECT column_name1,column_name
FROM TABLE A (INNER) JOIN TABLE B
ON TABLE_A.조인컬럼 = TABLE_B.조인컬럼

SELECT column_name1,column_name
FROM TABLE A , TABLE B
WHERE TABLE_A.조인컬럼 = TABLE_B.조인컬럼

*엔티티를 보고 겹치는 부분 확인한 후에 JOIN 하기
6. PK와 FK로 연결되어 있는 테이블끼리 JOIN 가능함

### Inner Join_SELF INNER JOIN

1. 하나의 테이블 내에서 다른 컬럼을 참조하기 위해 사용하는 '자기 자신과의 조인'방법임
2. 이를 통해 데이터베이스에서 한 테이블 내의 값을 다른 값과 연결할 수 있음
3. 형식 : 
```SQL
	SELECT TABLE_NAME1.column_name, TABLE_NAME2.column_name
	FROM TABLE_NAME1 t1
	JOIN TABLE_NAME1 t2
	ON TABLE_NAME1.column_name = TABLE_NAME2.column_name;
```

### Inner Join_CROSS INNER JOIN

1. 두 개 이상의 테이블에서 '모든 가능한 조합'을 만들어 결과를 반환하는 조인 방법임
2. 이를 통해 두 개 이상의 테이블을 조합하여 새로운 테이블을 생성할 수 있음
3. Cross Join은 일반적으로 테이블 간의 관계가 없을 때 사용됨
4. 각 행의 모든 가능한 조합을 만들기 때문에 결과가 매우 큰 테이블이 될 수 있으므로 사용에 주의가 필요함
5. 형식 : 
```SQL
	SELECT TABLE_NAME1.column_name, TABLE_NAME2.column_name
	FROM TABLE_NAME1 
	CROSS JOIN TABLE_NAME2;
```

## OUTER JOIN

1. OUTER JOIN은 두 테이블에서 '공통된 값을 가지지 않는 행들'도 반환함 -> 교집합은 다 가져옴
2. Left Outer join, Right Outer join, Full Outer Join의 종류가 있음
3. LEFT OUTER JOIN과 RIGHT OUTER JOIN중 무엇을 많이 사용할까?
    - 상황에 따라 다르지만 대체로 'LEFT OUTER JOIN'을 더 많이 사용함
    - 이는 대부분의 경우 왼쪽 테이블의 데이터를 중심으로 분석하고자 할 때가 많기 때문임

### LEFT OUTER JOIN

1. '왼쪽 테이블의 모든 행'과 '오른쪽 테이블에서 왼쪽 테이블과 공통된 값'을 가지고 있는 행들을 반환
2. 교집합의 연산결과와 차집합의 연산 결과를 합친것과 같음
3. 만약 오른쪽 테이블에서 공통된 값을 가지고 있는 행이 없다면 NULL값을 반환함
4. 형식 : 
```SQL
SELECT column_name1,column_name
FROM TABLE A LEFT OUTER JOIN TABLE B
ON TABLE_A.조인컬럼 = TABLE_B.조인컬럼
```

### RIGHT OUTER JOIN

1. LEFT OUTER JOIN의 반대임
2. RIGHT OUTER JOIN 키워드의 오른쪽에 명시된 테이블에만 존재하는 데이터를 추출함
3. 형식 :
```SQL 
SELECT column_name1,column_name
FROM TABLE A RIGHT OUTER JOIN TABLE B
ON TABLE_A.조인컬럼 = TABLE_B.조인컬럼
```

### FULL OUTER JOIN

1. 두 테이블에서 '모든 값'을 반환함. 만약 공통된 값을 가지고 있지 않는 행이 있다면 NULL값을 반환함
2. 합집합 연산 결과와 같음
3. 양쪽 테이블 데이터 집합에서 공통적으로 존재하는데이터, 한쪽에만 존재하는 데이터 모두 추출함
4. 형식 :
```SQL 
SELECT column_name1,column_name
FROM TABLE A FULL OUTER JOIN TABLE B
ON TABLE_A.조인컬럼 = TABLE_B.조인컬럼
```

# VIEW

1. 가상테이블로 실제 행과 열을 가지고 있지만, 실제로 데이터 저장하지않음
2. 여러 번 조인된 같은 결과를 조회할 때 해당 결과를 View로 만들어서 사용함
3. 실제 데이터는 뷰를 구성하는 테이블에 담겨 있지만 마치 테이블 처럼 사용할 수 있음
4. 하나 이상의 테이블이나 다른 뷰의 데이터를 볼 수 있게 하는 데이터베이스 객체임
5. 테이블 뿐만 아니라 다른 뷰를 참조해 새로운 뷰를 만들어서 사용할 수 있음
6. 튜플을 보여주는 역할로, 한 번 정의된 뷰는 변경할 수 없고, 삽입/수정/삭제도 되지않으며, 인덱스도 가질 수 없음

## VIEW의 사용 목적

1. 코딩을 하다보면 여러개의 테이블에서 필요한 정보를 뽑아 사용할때가 많음
2. 이때 좀 더 편리하게 사용할 수 있는 방법중의 하나가 VIEW임
3. VIEW를 사용하면 복잡한 쿼리문을 간단하게 만들어줌
4. 여러 테이블이 JOIN과 GROUP BY같은 복잡한 쿼리를 VIEW로 저장시켜 놓으면 다음부터는 저장한 VIEW만 호출하면 됨

## VIEW의 특징

1. 독립성 : 테이블 구조가 변경되어도 뷰를 사용하는 응용 프로그램은 변경하지 않아도 됨
2. 편리성
    - 복잡한 쿼리문을 뷰로 생성함으로써 관련 쿼리를 단순하게 작성할 수 있음
    - 또한 해당 형태의 SQL문을 자주 사용할 때 뷰를 이용하면 편리하게 사용할 수 있음
    - 보안성 : 직원의 급여정보와 같이 숨기고 싶은 정보가 존재한다면, 뷰를 생성할 때 해당 칼럼을 빼고 생성함으로써 사용자에게 정보를 감출 수 있음(원본테이블에 어떤내용이 있는지 알 수 없음)
3. 형식
```SQL
--VIEW의 생성
CREATE VIEW 뷰이름 AS(
  	쿼리문
)

--VIEW의 수정 : OR REPLACE는 기존의 정의를 변경하는데 사용할 수 있음
CREATE OR REPLACE VIEW 뷰이름 AS(
  쿼리문
)

--VIEW의 삭제
DROP VIEW 뷰이름 RESTRICT OR CASCADE
```
- RESTRICT : 뷰를 다른곳에서 참조하고 있다면 삭제가 취소됨
- CASCADE : 뷰를 참조하는 다른 뷰나 제약 조건까지 모두 삭제됨

# 관계대수

1. 기존릴레이션(테이블)에서 결과(절차적인언어)로 해석(비절차적인언어)와는 반대라고 볼 수 있음
2. Selet *같이 전체가 아닌 특정 부분을 수학적으로 계산하여 표기하는 것
3. 카테이션 곱  : A X B 일때,
카디널리티 = A의 카디널리티 * B의 카디널리티
디그리(차수)개수 = A의 디그리(5) + (B)의 디그리 = 8
프로젝션뒤에 속성 = 셀렉션 + 조건 + 테이블
4. 관계대수의 종류와 표기법
![013_RS](https://github.com/user-attachments/assets/1cccb854-1ebd-4280-8ec6-35536cec9e49)


