---
date: 2025-05-22
title: CHAPTER 12 - 패턴을 모아 패턴 만들기 (복합 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 12장을 읽고 정리한 내용입니다.
thumbnail:
---
## 복합 패턴

>복합 패턴은 여러 패턴을 함께 사용해서 다양한 디자인 문제를 해결하는 방법을 말한다.
>반복적으로 생길 수 있는 일반적인 문제를 해결하는 용도로 쓰이며, 2개 이상의 패턴을 결합해서 사용하는 것을 뜻한다.

단, 패턴 몇 개를 결합한다고 해서 무조건 복합 패턴은 되는 것은 아니다.
복합 패턴이라 불리기위해서는 여러 가지 문제의 일반적인 해결법을 제시해야 한다

책에서는 복합패턴을 설명하기위해 MVC에 대해 이야기한다.

모델-뷰-컨트롤러( Model-View-Controller, #MVC )는 여러 패턴을 합쳐놓은 복합 패턴의 대표적인 예이다.

재미있는 부분은 MVC에 대한 노래([MVC Song - James Dempsey](http://hayne.net/HCI/MVC/mvc_song.html))에 대한 내용도 책에 수록되어 있다. 

<iframe src="https://www.youtube.com/embed/YYvOGPMLVDo" title="MVC Song"
style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 모델-뷰-컨트롤러 (MVC)

>관심사의 분리를 통해 복잡한 애플리케이션을 체계적으로 관리하기 위한 아키텍처 패턴 중 하나로,
>
>Model, View, Controller를 각각 독립적인 계층으로 나누어 각각 다른 책임을 갖도록 하는 패턴

모델-뷰-컨트롤러 간 흐름은 다음과 같다.

![[Pasted image 20250527172459.png]]

## 모델-뷰-컨트롤러에 사용되는 패턴 알아보기

모델 (Model)
- 옵저버 패턴([[observer-pattern]])을 사용한다.
- 상태가 변경되었을 때 모델과 연관된 객체들에게 연락한다.
- 모델을 뷰와 컨트롤러부터 완전히 독립시킬 수 있다.
- 한 모델에서 서로 다른 뷰를 사용할 수도, 여러 개의 뷰를 동시에 사용하는 것도 가능하다.

뷰 (View)
- 컴포지트 패턴([[iterator-pattern-composite-pattern]]), 전략 패턴([[strategy-pattern]])을 사용한다.
- 컨트롤러가 뷰에게 화면을 갱신해달라고 요청하면 최상위 뷰 구성요소에게만 갱신요청하기만 하면 된다.

컨트롤러 (Controller)
- 전략 패턴([[strategy-pattern]])을 사용한다.
- 컨트롤러가 전략을 제공한다.
- 뷰는 애플리케이션의 겉모습만 신경을 쓰고, 인터페이스의 모든 행동을 결정하는 일은 모두 컨트롤러에게 맡긴다.
- 전략 패턴을 사용하여, 뷰를 모델로부터 분리한다.

## 모델-뷰-컨트롤러로 BPM 제어 도구 만들기

책의 예제 중 일부 기능들을 Typescript로 직접 작성해보며 학습해보았다.

<iframe src="https://codesandbox.io/embed/n3rg7p?view=preview"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="mvc-playground"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 정리

>[!info] 모델 (Model)  
>데이터, 상태, 비즈니스 로직을 관리한다.

##### 핵심 역할
- **데이터 관리**: 저장, 조회, 수정, 삭제
- **비즈니스 로직**: 업무 규칙과 계산 로직 구현
- **데이터 검증**: 입력 데이터의 유효성 검사
- **상태 관리**: 애플리케이션의 핵심 상태 유지

##### Do
- 순수한 비즈니스 로직만 포함
- 데이터 구조와 관련 메서드 정의
- Observer 패턴으로 상태 변경 알림
- 독립적으로 테스트 가능한 구조
##### Don't
- DOM 조작이나 UI 관련 코드
- 사용자 입력 처리
- View나 Controller에 대한 직접적인 의존
- 화면 표시 관련 로직

>[!info] 뷰(View)  
>UI 관련 로직을 관리한다.

##### 핵심 역할
- **화면 렌더링**: 데이터를 시각적으로 표현
- **사용자 입력 수집**: 폼, 버튼 등 UI 요소 제공
- **DOM 조작**: 실제 화면 요소 생성 및 업데이트
- **Model 관찰**: Observer 패턴으로 Model 변경사항 감지
##### Do
- Model의 데이터를 받아서 화면에 표시
- DOM 조작과 UI 렌더링 담당
- Model을 Observer 패턴으로 관찰
- 사용자 입력을 위한 UI 요소 제공
##### Don't
- 비즈니스 로직 처리
- 직접적인 데이터 조작
- Controller의 로직 포함
- 복잡한 계산이나 검증 로직

>[!info] 컨트롤러 (Controller)
>
>모델(Model)과 View의 중개자 역할을 한다.

##### 핵심 역할
- **사용자 입력 처리**: 이벤트 리스너 등록 및 처리
- **Model 호출**: 사용자 요청에 따른 Model 메서드 실행
- **애플리케이션 흐름 제어**: 비즈니스 로직 실행 순서 관리
- **View와 Model 연결**: 둘 사이의 데이터 흐름 조율
##### Do
- 사용자 이벤트를 받아서 적절한 처리 수행
- Model의 메서드를 호출하여 비즈니스 로직 실행
- View와 Model 모두에 의존 가능
- Strategy 패턴 등으로 명령 처리 전략화
##### Don't
- 복잡한 비즈니스 로직 직접 구현
- 직접적인 DOM 조작
- 데이터 저장이나 복잡한 계산
- UI 렌더링 로직
