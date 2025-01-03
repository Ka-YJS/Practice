# PostEntity

```JAVA
package com.korea.travel.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Table(name = "posts")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class PostEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long postId;				//고유 id
	
	@Column(nullable = false)
    private String postTitle;
    
    @Column(columnDefinition = "TEXT")
    private String postContent;
    
    @Column(nullable = false)
    private String userNickname;
    
    @ElementCollection
    @CollectionTable(name = "post_places", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "place_list")
    private List<String> placeList;
    
    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_urls")
    private List<String> imageUrls;
    
    private String postCreatedAt;
    
    // UserEntity와의 연관 관계 설정 (ManyToOne)
    @ManyToOne(fetch = FetchType.EAGER)  // 다대일 관계 user가 여러 게시글을 쓸수있게해준다.
    @JoinColumn(name = "user_id")       // 외래 키 컬럼명
    private UserEntity userEntity;            // 해당 게시글을 작성한 UserEntity
    
    // 좋아요를 눌렀던 유저들과의 관계 (OneToMany)
    @OneToMany(mappedBy = "postEntity")
    private List<LikeEntity> likeEntities; // 좋아요 엔티티 리스트

    // 좋아요 수 계산
    public int getLikeCount() {
        return likeEntities.size();  // LikeEntity 리스트의 크기 반환
    } 
}
```

## Annotation

1. @Column
    - 엔티티 클래스의 필드와 데이터베이스 테이블의 컬럼을 매핑하는 어노테이션
    - nullable = false와 같은 옵션을 통해 NOT NULL 제약 조건을 설정할 수 있음
    - columnDefinition = "TEXT"와 같이 컬럼의 타입을 지정할 수 있음
2. @ElementCollection
    - 엔티티에 포함된 값 타입 컬렉션을 매핑하는 어노테이션
    - placeList와 imageUrls와 같이 여러 개의 값을 가지는 컬럼을 표현할 때 사용됨
3. @CollectionTable
    - @ElementCollection과 함께 사용되며, 값 타입 컬렉션을 위한 별도의 테이블을 지정함
    - name = "post_places"와 같이 테이블 이름을 지정할 수 있음
4. @JoinColumn
    - 외래 키 관계를 매핑할 때 사용되며, 테이블 이름을 지정할 수 있음

## 코드설명

```JAVA
private List<String> placeList;
private List<String> imageUrls;
private List<LikeEntity> likeEntities;
```

1. List<String\>
    - 문자열 값들의 컬렉션을 나타내는 자바 자료 구조임
    - 게시글에 포함된 다양한 정보(장소, 이미지 등)를 효과적으로 저장할 수 있음
    - 데이터베이스 측면에서는 @ElementCollection과 @CollectionTable 어노테이션을 사용하여 이러한 리스트 타입의 데이터를 별도의 테이블에 저장할 수 있음