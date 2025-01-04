# Context

```JS
import { createContext } from "react";

export const CopyListContext = createContext(null)
```

```JS
import { createContext } from "react";

export const CopyPlaceListContext = createContext(null)
```

```JS
import { createContext } from "react";

export const ImageContext = createContext(null);
```

```JS
import { createContext } from "react";

export const isWriteContext = createContext(null);
```

```JS
import { createContext } from "react";

export const ListContext = createContext(null);
```

```JS
import { createContext } from "react";

export const PlaceContext = createContext(null);
```

```JS
import { createContext } from "react";

export const PostContext = createContext(null);
```

```JS
import {createContext} from "react";

export const UserContext = createContext(null);
```

# 코드설명

1. Context란?
    - Context는 React에서 제공하는 기능으로, 컴포넌트 트리 전체에 걸쳐 데이터를 공유할 수 있게 해주는 방법임
    - 앱의 상태 관리를 더 효율적이고 구조화된 방식으로 할 수 있게 해줌
2. Context를 쓰는 이유
    1. Props Drilling 방지
        - 부모 컴포넌트에서 깊은 곳에 위치한 자식 컴포넌트로 데이터를 전달할 때, 중간 컴포넌트들을 거치지 않고도 직접 전달할 수 있음
        - 예를 들어, 사용자 정보(UserContext)를 앱 전체에서 사용해야 할 때, 모든 중간 컴포넌트를 통해 전달하지 않아도 됨
    2. 전역 상태 관리
        - 여러 컴포넌트에서 공통으로 사용되는 데이터를 효율적으로 관리할 수 있음
        - 예를 들어, 게시물 목록(PostContext)이나 장소 정보(PlaceContext)를 여러 컴포넌트에서 필요로 할 때 유용함
    3. 컴포넌트 재사용성 향상
        - Context를 사용하면 컴포넌트가 특정 데이터에 직접 의존하지 않게 되어, 더 유연하게 재사용할 수 있음
        - 예를 들어, 이미지 관련 기능(ImageContext)을 여러 다른 컴포넌트에서 일관되게 사용할 수 있음
    4. 성능 최적화 : 필요한 컴포넌트만 Context의 변화에 반응하도록 설정할 수 있어, 불필요한 리렌더링을 방지할 수 있음