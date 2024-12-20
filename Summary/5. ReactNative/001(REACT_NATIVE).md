# React Native


# React Native란?

1. 2015년 3월에 페이스북에 의해 공개된 오픈소스 프로젝트로, 사용자 인터페이스를 만드는 리액트에 기반을 두고 제작되었음
2. 하지만 리액트와 달리 웹 브라우저가 아닌, ios와 안드로이드에서 동작하는 네이티브 모바일 어플리케이션을 만드는 자바스크립트 프레임워크임
3. 현재 페이스북, 인스타그램, 핀터레스트, 월마트 등이 리액트 네이티브를 이용해서 개발되었으며, 리액트 네이티브 쇼케이스에서 대표적인 어플리케이션을 확인할 수 있음
4. 리액트 네이티브 쇼케이스 : https://reactnative.dev/showcase.html
5. 리액트 네이티브가 출시되면서 오브젝티브-C 또는 자바를 사용하여 개발하지 않아도 웹 개발자가 익숙한 기술을 이용하여 모바일 개발을 통해 어플리케이션을 출시할 수 있는 기회를 얻게 되었음
6. 특히 리액트에 익숙한 개발자라면 조금 더 수월하게 리액트 네이티브를 익힐 수 있음


## React Native_장점과 단점

### 장점

1. 작성된 코드 대부분 플랫폼간 공유가 가능해서 두 플랫폼을 동시에 개발할 수 있음
<br>-> 특히 모바일 개발에 대한 지식이 없어도 자바스크립트만 알고 있으면 쉽게 시작할 수 
있으며, 작성된 구성 요소들이 재사용 가능하다는 것은 리액트 네이티브가 갖고 있는 큰 장점임

2. 변경된 코드를 저장하기만 해도 자동으로 변경된 내용이 적용된 화면을 확인할 수 있는 fast refresh기능을 제공하고 있음
<br>-> 이 기능 덕분에 매번 수정하고 새로고침하는 번거로운 작업이 생략되고 즉각적인 수정 내용확인이 가능하다는 장점이 있음

3. 작성된 코드에 따라 각 플랫폼에서 그에 알맞은 네이티브 엘리먼트로 전환되기 때문에 성능 저하 없이 개발이 가능함

### 단점
1. 네이티브 코드로 전환되는 장점은 있지만, 네이티브의 새로운 기능을 사용하는 데 오래걸림
<br>-> 안드로이드나 ios에서 업데이트를 통해 새로운 API를 제공하더라도 리액트 네이티브가 이를 지원하기까지는 시간이 걸림

2. 유지보수가 어려움 : 개발 단계에서 문제가 생겼을 때 문제의 종류에 따라 원인을 찾고 문제를 해결하는 데 많은 시간이 걸림
3. 잦은 업데이트 :
    - 잦은 업데이트를 통해 버그를 수정하고 기능을 추가해주는 부분은 긍정적이지만, 너무 잦은 업데이트는 오히려 개발에 방해가 됨
    - 또한 리액트를 사용하는 리액트 네이티브의 특성상 리액트의 버전 변화에 따라 리액트 네이티브에도 많은 변화가 생길 수 있음

## React Native_동작 방식

### 브릿지
1. 리액트 네이티브에는 자바스크립트 코드를 이용해 네이티브 계층과 통신할 수 있도록 연겨하는 역할을 하는 브릿지가 있음
2. JavaScript와 네이티브 코드(Android의 Java/Kotlin, iOS의 Objective-C/Swift) 간의 통신을 가능하게 하는 핵심 아키텍처임
3. 리액트 네이티브의 핵심은 JavaScript 코드가 네이티브 모듈이나 네이티브 UI 컴포넌트와 상호작용할 수 있도록 연결해 주는 브릿지 구조에 있음

4. 주요 특징
    1. 비동기적 통신
        - 브릿지는 자바스크립트 스레드에서 정보를 받아 네이티브로 전달함
        - 자바스크립트 스레드는 자바스크립트 코드가 실행되는 장소이며 보통 리액트 코드로 구성되어 있음
        - JavaScript와 네이티브 코드는 서로 독립된 스레드에서 실행되며, 두 환경 간의 통신은 비동기적으로 이루어짐
        - 이를 통해 각자 별개의 이벤트 루프에서 작업을 수행할 수 있으며, UI의 반응성을 유지할 수 있음
    2. 직렬화된 메시지
        - JavaScript에서 네이티브로의 호출(또는 그 반대의 경우)은 JSON 형식의 메시지로 직렬화됨
        - 이렇게 직렬화된 데이터를 브릿지를 통해 네이티브 환경으로 보내면, 네이티브 쪽에서는 메시지를 파싱해 실제 네이티브 코드가 실행됨
    3. 커스텀 네이티브 모듈 구현 가능
        - 브릿지를 사용하여 자바스크립트 코드에서 접근할 수 있는 네이티브 모듈을 직접 만들어 리액트 네이티브에 연결할 수 있음
        - 이를 통해 플랫폼 별로 고유한 기능(카메라 접근, GPS, Bluetooth 등)을 JavaScript로 제어할 수 있음

### 가상DOM

1. **가상 DOM(Virtual DOM)**은 JavaScript 객체 형태로 메모리에 저장되는 가상화된 DOM 구조로, 실제 DOM을 변경하기 전 상태를 메모리에 미리 반영하여 UI 업데이트 성능을 최적화하는 기법임
2. 가상 DOM은 리액트(React)와 같은 프레임워크에서 사용되며, 변화가 발생할 때마다 실제 DOM을 직접 조작하지 않고 가상 DOM을 통해 효율적으로 UI를 갱신할 수 있도록 도움
3. 데이터가 변했을 때 화면이 다시 그려지는 과정은 다음과 같음
    - 데이터에 변화가 있음
    - 변화된 데이터를 이용하여 가상 DOM을 그림
    - 가상 DOM과 실제 DOM을 비교하여 차이점을 확인함
    - 차이점이 있는 부분만 실제 DOM에 적용하여 그림
4. 여기서 실제 DOM은 우리가 보는 화면에 나타나는 DOM이고, 가상 DOM은 화며에 보이지 않지만 비교를 위해 존재하는 DOM이라고 생각하면됨
5. 장점
    1. 성능 향상
    - 실제 DOM 조작은 느리고, 특히 복잡한 UI에서는 성능 저하를 유발할 수 있음
    - 가상 DOM을 통해 변경 사항만을 효율적으로 적용함으로써, UI 업데이트를 빠르게 처리할 수 있음
    2. 추상화 : 가상 DOM은 리액트가 네이티브 브라우저 DOM API에 의존하지 않도록 해주며, 
    다양한 환경에서 동일한 렌더링 결과를 제공하도록 함
    3. 개발 편의성 : 개발자는 상태 변화에 따라 UI를 다시 그리는 과정에 대해 신경 쓰지 않고, 리액트가 알아서 최적의 방식으로 변경 사항을 반영하도록 할 수 있음
6. 단점
    1. 초기 렌더링 비용 : 가상 DOM 자체가 메모리에 생성되고, 상태가 변할 때마다 가상 DOM 트리를 다시 생성하므로 초기 렌더링이나 대규모 애플리케이션에서는 메모리와 CPU 사용이 늘어날 수 있음
    2. 복잡한 Diffing 비용
        - 리액트의 Diffing 알고리즘은 효율적이지만, DOM 트리가 복잡해질수록 성능 저하가 발생할 수 있음
        - 이러한 경우 Reconciliation 최적화나 React.memo 등의 성능 최적화 기법이 필요함
7. 가상 DOM은 리액트의 성능 최적화에 핵심적인 역할을 하며, 변경된 부분만 실제 DOM에 반영함으로써 효율적인 UI 업데이트를 가능하게 하는 기술임
8. 이를 통해 개발자는 UI 업데이트 로직을 간단히 관리할 수 있으며, 리액트가 변화에 따라 효율적인 방식으로 DOM을 업데이트하도록 할 수 있음


### JSX

1. 자바스크립트 라이브러리에서 화면을 구성할 때 사용하는 특별한 문법임
2. 쉽게 말해, HTML처럼 생긴 자바스크립트라고 생각하면 됨
3. JSX를 사용하면 웹 페이지의 구조를 마치 HTML을 쓰는 것처럼 편리하게 작성할 수 있음
4. 자바스크립트 코드 안에서 UI작업을 할 때 가독성에 도움을 주는 등 여러 가지 장점이 있으며 리액트에서 많이 사용되고 있음
5. JSX를 사용하면 HTML 태그와 자바스크립트 코드를 하나의 파일에서 함께 작성할 수 있어서, 웹 화면을 구성하는 코드를 간단하고 깔끔하게 만들 수 있음
6. 이렇게 작성된 코드는 웹 브라우저가 이해할 수 있도록 자바스크립트 코드로 변환되어 사용됨


# 개발환경 준비하기

1. Node최신버전 설치 : https://nodejs.org/ko
2. Python 설치
3. Java 설치
4. 안드로이드 스튜디오 설치
    - https://bit.ly/android-ide-download
    - 환경변수설정

## 안드로이드 SDK란?

1. 안드로이드 앱을 개발하는 데 필요한 기본적인 구성 요소들을 모아놓은 도구 세트임
2. 이를 통해 개발자가 안드로이드 앱을 쉽게 만들고 테스트해 볼 수 있음
3. 만약 SDK가 없다면, 안드로이드 앱의 기능을 하나하나 직접 만들어야 하기 때문에 개발이 매우 어려워짐
4. 안드로이드 SDK에 포함된 것들
    - 안드로이드 플랫폼 : 안드로이드가 실행되는 환경을 제공하여, 앱이 안드로이드 기기에서 작동할 수 있도록 함
    - 에뮬레이터(Emulator) : 실제 안드로이드 기기 없이도 컴퓨터에서 안드로이드 기기처럼 앱을 테스트해 볼 수 있는 가상의 안드로이드 장치임
    - 빌드 도구(Build Tools) : 개발한 앱을 실행 가능한 형태로 만들기 위해 필요한 도구로, 앱이 완성되면 이를 패키지로 만들어 설치할 수 있게 함
    - 디버깅 도구(Debugging Tools) : 앱을 실행해 보면서 오류를 찾아 수정할 수 있도록 돕는 도구로, 앱이 제대로 작동하는지 확인할 때 사용됨
    - 기타 라이브러리와 API : 안드로이드 앱에서 자주 사용하는 기능들(예: 카메라, 위치 정보 등)을 쉽게 추가할 수 있게 도와주는 코드 묶음이 포함되어 있음

### 에뮬레이터

1. 안드로이드 에뮬레이터는 컴퓨터에서 가상의 안드로이드 스마트폰을 만들어 앱을 테스트할 수 있게 해주는 프로그램임
2. 안드로이드 휴대폰을 사용하는 것처럼 컴퓨터 화면에서 스마트폰을 작동할 수 있도록 해주는 도구라고 생각하면 됨
3. 에뮬레이터 덕분에 실제 기기가 없어도 컴퓨터에서 앱이 어떻게 작동하는지 확인할 수 있음
4. 안드로이드 에뮬레이터의 주요 개념과 기능
1. 가상의 안드로이드 기기
    - 에뮬레이터는 안드로이드 휴대폰이나 태블릿을 가상으로 만들어주기 때문에, 
    화면에서 가상의 스마트폰을 보면서 앱을 테스트할 수 있음
    - 여러 기기 모델이나 화면 크기, 안드로이드 버전 등을 설정할 수 있어서 다양한 기기에서 앱이 어떻게 작동하는지 확인할 수 있음
2. 앱 테스트에 유용
    - 에뮬레이터는 개발 중인 앱을 바로 실행해 볼 수 있어서, 오류를 빠르게 수정하거나 디자인을 조정할 때 매우 유용함
    - 예를 들어, 앱에 새로운 기능을 추가하고 나서 그 기능이 제대로 작동하는지 에뮬레이터에서 확인할 수 있음
3. 다양한 기기 환경 설정 가능
    - 에뮬레이터는 가상의 기기이기 때문에 다양한 설정을 쉽게 바꿀 수 있음
    - 안드로이드 버전(예: Android 10, Android 11)이나 화면 크기, 해상도 등을 변경해 다양한 환경에서 테스트할 수 있음
    - 이 기능을 통해 사용자가 어떤 기기를 사용하더라도 앱이 잘 작동하는지 확인할 수 있음
4. 사용법
    - 안드로이드 스튜디오에서 제공하는 에뮬레이터는 프로그램 설치 후 설정을 통해 간단히 실행할 수 있음
    - 앱을 개발한 후 에뮬레이터에서 실행해 보면, 컴퓨터 화면에 가상의 스마트폰이 나타나며 그 안에서 앱이 작동하게 됨
5. 에뮬레이터의 장점
    - 비용 절약: 여러 종류의 실제 안드로이드 기기를 구매할 필요 없이, 다양한 기기 환경에서 앱을 테스트할 수 있음
    - 편리함: 앱을 코드로 수정한 후 바로 에뮬레이터에서 실행해 볼 수 있어 빠르게 오류를 수정하고 기능을 테스트할 수 있음
    - 다양한 테스트 가능: 기기마다 다른 화면 크기, 해상도, 안드로이드 버전 등을 에뮬레이터로 설정할 수 있어, 여러 상황에서 앱이 잘 작동하는지 확인할 수 있음
