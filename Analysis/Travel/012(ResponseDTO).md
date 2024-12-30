# ResponseDTO

```JAVA
package com.korea.travel.dto;

import java.util.List;

import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResponseDTO<T> {
	
	private String error;
	private List<T> data;

}
```

## Annotation

-

## 코드설명

```JAVA
public class ResponseDTO<T>

private List<T> data
```
1. ResponseDTO<T>
	-  T는 타입 파라미터로, 어떤 타입이든 들어올 수 있음을 의미함
	- 하나의 ResponseDTO 클래스로 다양한 타입의 응답을 처리할 수 있음
	- 타입 안정성이 보장됨(컴파일 시점에 타입 체크)
	- 코드 재사용성이 높아짐