---
date: 2025-04-14
title: CHAPTER 08 - 알고리즘 캡슐화하기 (템플릿 메소드 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 8장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
# 템플릿 메소드 패턴

> 템플릿 메소드
> 
> 패턴은 알고리즘의 골격을 정의한다. 템플릿 메소드를 사용하면 알고리즘의 일부 단계를 서브클래스에서 구현할 수 있으며, 알고리즘의 구조는 그대로 유지하면서 알고리즘의 특정 단계를 서브클래스에서 재정의할 수도 있다.

간단하게 말하면 **템플릿(틀)** 을 만들어 사용한다.

## 커피와 홍차 예제로 알아보는 템플릿 메소드 패턴

커피와 홍차의 공통점:

- 카페인이 있다.
- 비슷한 방법으로 만들어진다.

### 스타버즈 커피 바리스타 훈련용 매뉴얼

**스타버즈 커피 만드는 방법**

1. 물을 끓인다.
2. 끓는 물에 커피를 우려낸다.
3. 커피를 컵에 따른다.
4. 설탕과 우유를 추가한다.

**스타버즈 홍차 만드는 방법**

1. 물을 끓인다.
2. 끓는 물에 찻잎을 우려낸다.
3. 홍차를 컵에 따른다.
4. 레몬을 추가한다.

### 공통된 알고리즘 찾기

커피와 홍차 제조법의 알고리즘이 같다는 사실을 알 수 있다:

1. 물을 끓인다.
2. 뜨거운 물을 사용해서 커피 또는 찻잎을 우려낸다.
3. 만들어진 음료를 컵에 따른다.
4. 각 음료에 맞는 첨가물을 추가한다.

### 템플릿 메소드 패턴 적용하기

#### 슈퍼클래스 만들기

```typescript
abstract class CaffeineBeverage {
  // 템플릿 메소드: 알고리즘의 전체 구조를 정의하고 일부 단계를 서브클래스에 위임
  // final로 선언하여 서브클래스가 알고리즘의 구조를 변경하지 못하게 함
  final prepareRecipe(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
  }
  
  // 추상 메소드: 서브클래스에서 구현해야 함
  abstract brew(): void;
  abstract addCondiments(): void;
  
  // 구체적인 메소드: 공통 기능은 슈퍼클래스에서 구현
  boilWater(): void {
    console.log("물 끓이는 중");
  }
  
  pourInCup(): void {
    console.log("컵에 따르는 중");
  }
}
```

#### 서브클래스 구현

```typescript
class Coffee extends CaffeineBeverage {
  brew(): void {
    console.log("커피를 내리는 중");
  }
  
  addCondiments(): void {
    console.log("설탕과 우유를 추가하는 중");
  }
}

class Tea extends CaffeineBeverage {
  brew(): void {
    console.log("차를 우려내는 중");
  }
  
  addCondiments(): void {
    console.log("레몬을 추가하는 중");
  }
}
```

## 템플릿 메소드 패턴의 장점

**시시한 Tea와 Coffee 클래스**

- Coffee와 Tea 클래스가 각각 작업을 처리한다. 두 클래스에서 각자 알고리즘을 수행
- Coffee와 Tea 클래스에 중복된 코드가 있다.
- 알고리즘이 바뀌면 서브클래스를 일일이 열어서 여러 군데를 고쳐야 한다.
- 클래스 구조상 새로운 음료를 추가하려면 꽤 많은 일을 해야 한다.
- 알고리즘 지식과 구현 방법이 여러 클래스에 분산되어 있다.

**템플릿 메소드로 새로 만든 CaffeineBeverage**

- CaffeineBeverage 클래스에서 작업을 처리한다. 알고리즘을 독점한다.
- CaffeineBeverage 덕분에 서브클래스에서 코드를 재사용할 수 있다.
- 알고리즘이 한 군데에 모여 있으므로 한 부분만 고치면 된다.
- 다른 음료도 쉽게 추가할 수 있는 프레임워크를 제공한다. 음료를 추가할 때 몇 가지 메소드만 더 만들면 된다.
- CaffeineBeverage 클래스에 알고리즘 지식이 집중되어 있으며 일부 구현만 서브클래스에 의존한다.

## 후크(Hook) 활용하기

후크는 추상 클래스에서 선언되지만 기본적인 내용만 구현되어 있거나 아무 코드도 들어있지 않은 메소드이다. 이를 통해 서브클래스가 알고리즘의 특정 단계를 선택적으로 오버라이드할 수 있다.

```typescript
abstract class CaffeineBeverageWithHook {
  final prepareRecipe(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    
    // 조건부 단계: 후크 메소드의 반환값에 따라 실행 여부 결정
    if (this.customerWantsCondiments()) {
      this.addCondiments();
    }
  }
  
  abstract brew(): void;
  abstract addCondiments(): void;
  
  boilWater(): void {
    console.log("물 끓이는 중");
  }
  
  pourInCup(): void {
    console.log("컵에 따르는 중");
  }
  
  // 후크(hook): 기본 구현을 제공하지만 서브클래스에서 오버라이드 가능
  customerWantsCondiments(): boolean {
    return true; // 기본값은 true
  }
}
```

후크를 활용한 서브클래스 예

```typescript
class CoffeeWithHook extends CaffeineBeverageWithHook {
  brew(): void {
    console.log("커피를 내리는 중");
  }
  
  addCondiments(): void {
    console.log("설탕과 우유를 추가하는 중");
  }
  
  // 후크 메소드 오버라이드
  customerWantsCondiments(): boolean {
    const answer = this.getUserInput();
    
    return answer.toLowerCase().startsWith("y");
  }
  
  private getUserInput(): string {
    // 사용자 입력을 받는 코드
    // 실제 구현에서는 프롬프트나 UI를 통해 사용자 입력을 받음
    return "no"; // 예시로 'no' 반환
  }
}
```

## 할리우드 원칙

> 할리우드 원칙 (Hollywood Principle): 먼저 연락하지 마세요. 저희가 연락 드리겠습니다.

이 원칙을 통해 **의존성 부패(dependency rot)** 를 방지할 수 있다.

**의존성 부패**란 고수준 구성 요소가 저수준 구성 요소에 의존하고, 그 저수준 구성 요소는 다시 고수준 구성 요소에 의존하고, 그 고수준 구성 요소는 다시 또 다른 구성 요소에 의존하고, 그 다른 구성 요소는 또 저수준 구성 요소에 의존하는 것처럼 의존성이 복잡하게 꼬여있는 상황을 말한다.

할리우드 원칙은 저수준 구성 요소가 시스템에 접속할 수 있지만, **언제, 어떻게 그 구성 요소를 사용할지는 고수준 구성 요소가 결정**한다.

### 할리우드 원칙과 템플릿 메소드 패턴의 관계

템플릿 메소드 패턴을 사용하면 고수준 구성 요소(추상 클래스)가 저수준 구성 요소(구체 서브클래스)에게 "우리가 연락할 테니까 먼저 연락하지 마세요"라고 말하는 것과 같다. 즉, 추상 클래스가 알고리즘의 전체 흐름을 제어하고, 서브클래스는 필요한 시점에 호출되어 특정 단계만 구현한다.

## 템플릿 메소드 패턴이 사용되는 곳

템플릿 메소드 패턴은 프레임워크 설계에 매우 유용하다:

- 작업이 처리되는 방식을 제어
- 처리하는 알고리즘의 각 단계를 사용자가 마음대로 지정

## 핵심 정리

- 템플릿 메소드는 알고리즘의 단계를 정의하며 일부 단계를 서브클래스에서 구현하도록 할 수 있다.
- 템플릿 메소드 패턴은 코드 재사용에 큰 도움이 된다.
- 템플릿 메소드가 들어있는 추상 클래스는 구상 메소드, 추상 메소드, 후크를 정의할 수 있다.
- 추상 메소드는 서브클래스에서 구현한다.
- 후크는 추상 클래스에 들어있는 메소드로 아무 일도 하지 않거나 기본 행동만을 정의한다. 서브클래스에서 후크를 오버라이드할 수 있다.
- 할리우드 원칙에 의하면 저수준 모듈은 언제 어떻게 호출할지는 고수준 모듈에서 결정하는 것이 좋다.
- 전략 패턴과 템플릿 메소드 패턴은 모두 알고리즘을 캡슐화하는 패턴이지만, 전략 패턴은 구성을, 템플릿 메소드 패턴은 상속을 사용한다.
- 팩토리 메소드 패턴은 특화된 템플릿 메소드 패턴이다.