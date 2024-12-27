# UserDTO

```JAVA

package com.korea.travel.dto;

import com.korea.travel.model.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

	private Long id;
	private String userId;			//유저Id
	private String userName; 		//유저이름
	private String userNickName;	//닉네임
	private String userPhoneNumber;	//전화번호
	private String userPassword;	//비밀번호
	private String newPassword;		//비밀번호
	private String userProfileImage;//프로필이미지
	private String token;			//토큰
	
	
	public UserDTO(UserEntity entity) {
		this.id = entity.getId();
		this.userId = entity.getUserId();
		this.userName = entity.getUserName();
		this.userNickName = entity.getUserNickName();
		this.userPhoneNumber = entity.getUserPhoneNumber();
		this.userPassword = entity.getUserPassword();
		this.userProfileImage = entity.getUserProfileImage();
	}
	
	
}
```

## DTO란?

- User의 정보를 담는 DTO(Data Transfer Object) 클래스임
- 클라이언트-서버 간 사용자 데이터 전송을 해야할 때, 사용됨
- Entity는 데이터베이스와 직접 매핑되어 있어 민감한 정보를 포함할 수 있지만, DTO를 사용해서 클라이언트에게 필요한 데이터만 선택적으로 전달할 수 있음
- Entity의 모든 필드가 아닌 실제로 필요한 데이터만 전송할 수 있음

## 코드설명

1. public UserDTO(UserEntity entity)
	- UserEntity entity : entity의 매개변수로 UserEntity객체를 받음
2. this.?? = entity.get??() -> ??는 임시값
	- UserEntity의 ??값을 DTO의 ??필드에 복사함
	- 이걸통해 사용자의 정보를 전달받음 -> Entity값의 노출을 방지함