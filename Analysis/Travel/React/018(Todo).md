# Todo

```JS

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';//Redux와 React 연결을 위한 Hook
import { addTodo, removeTodo } from './todo/actions';//액션 생성 함수 불러오기

function TodoApp() {
  const [input, setInput] = useState('');//입력값을 관리하는 로컬 상태
  const todos = useSelector((state) => state.todos);//Redux에서 todos 상태를 가져옴
  const dispatch = useDispatch();//액션을 디스패치하는 함수 가져오기

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch(addTodo(Date.now(), input));//새로운 Todo를 추가 (id는 현재 시간으로 고유값 생성)
      setInput('');//입력창 비우기
    }
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));//Todo를 삭제
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text} 
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

# 코드설명

```JS
import { addTodo, removeTodo } from './todo/actions';
```
1. 액션함수란?
  - 액션 함수는 Redux에서 상태 변경을 위한 정보를 담은 객체를 생성하는 함수임
  - actions.js의 값을 가져옴
```JS
const handleAddTodo = () => {
  if (input.trim()) {
    dispatch(addTodo(Date.now(), input));
    setInput('');
  }
}
```
1. input.trim() : 문자열 앞뒤의 공백을 제거함
2. dispatch(addTodo(Date.now(), input))
  - dispatch : 생성된 액션을 Redux 스토어로 전달
  - addTodo : 액션 객체를 생성
  - Date.now() : 현재 시간을 밀리초로 반환하여 고유 ID로 사용
```JS
const todos = useSelector((state) => state.todos);

return(
  <ul>
  {todos.map((todo) => (
    <li key={todo.id}>
      {todo.text} 
      <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
    </li>
  ))}
</ul>
)
```
1. todos
  - useSelector : Redux 스토어의 상태를 가져오는 Hook
  - 여기서는 todos의 데이터값을 가져옴
2. todos.map() : 배열의 각 항목을 순회하며 리스트 아이템으로 변환
3. key={todo.id} : React가 리스트 아이템을 식별하기 위한 고유 키
4. todo.text : 할일 내용을 표시
5. Remove 버튼 : 클릭 시 해당 todo를 삭제

#### Redux란?

1. JavaScript 애플리케이션의 상태 관리 라이브러리임
2. Redux의 핵심 구성요소
  - Store : 전체 애플리케이션의 상태를 보관하는 단일 저장소
  - Action : 상태 변경을 위한 정보를 담은 객체
  - Reducer : 이전 상태와 액션을 받아서 새로운 상태를 반환하는 순수 함수
3. Redux의 데이터 흐름
  - Action 생성 -> Dispatch를 통한 Action 전달 -> Reducer에서 상태 업데이트 -> 컴포넌트에서 상태 사용
4. Redux의 장점
  - 예측 가능한 상태 관리
  - 디버깅 용이성
  - 상태 변경의 중앙 집중화
  - 컴포넌트 간 상태 공유 용이
5. 이러한 구조로 인해 Redux는 특히 큰 규모의 애플리케이션에서 상태 관리를 효율적으로 할 수 있게 해줌줌