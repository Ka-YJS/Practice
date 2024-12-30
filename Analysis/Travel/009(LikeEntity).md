# LikeEntity

```JAVA
package com.korea.travel.model;

import org.apache.catalina.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "likes")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 고유 id
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // user_id 외래키
    private UserEntity userEntity; // 좋아요를 누른 유저

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id") // post_id 외래키
    private PostEntity postEntity; // 좋아요가 눌린 게시글

    // 추가적인 메서드들이 필요하면 여기에 추가 가능
}
```

## Annotation

-


## 코드설명

```JAVA
@GeneratedValue(strategy = GenerationType.IDENTITY)
```
1. GenerationType.IDENTITY
    - MySQL의 AUTO_INCREMENT와 같은 기능임
    <br>(AUTO_INCREMENT : )
    - 데이터베이스에 레코드가 삽입될 때 자동으로 고유한 값을 생성함
    - 데이터베이스가 ID 값을 자동으로 생성하고 관리함
    - 새로운 레코드가 추가될 때마다 이전 값에 1을 더한 값이 자동으로 할당됨
    - 한 번 생성된 ID는 변경되지 않으며, 레코드가 삭제되어도 해당 ID는 재사용되지 않음