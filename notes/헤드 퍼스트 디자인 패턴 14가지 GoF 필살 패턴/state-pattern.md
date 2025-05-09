---
date: 2025-04-21
title: CHAPTER 10 - 객체의 상태 바꾸기 (상태 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 10장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---

## 상태 패턴

> 상태패턴
> 
> 상태 패턴을 사용하면 객체의 내부 상태가 바뀜에 따라서 객체의 행동을 바꿀 수 있다. 마치 객체의 클래스가 바뀌는 것과 같은 결과를 얻을 수 있다.

## 상태 기계(State Machine) 알아보기

1. 상태들을 모아 본다.
    - 예: `동전 없음`, `동전 있음`, `알맹이 매진`, `알맹이 판매`
2. 현재 상태를 저장하는 인스턴스 변수들을 만들고 각 상태의 값을 정의한다.
    
    ```java
    final static int SOLD_OUT = 0;
    final static int NO_QUARTER = 1;
    final static int HAS_QUARTER = 2;
    final static int SOLD = 3;
    
    int state = SOLD_OUT;
    ```
    
3. 이 시스템에서 일어날 수 있는 모든 행동을 모아 본다.
    - 예: 동전 투입, 동전 반환, 손잡이 돌림, 알맹이 내보냄
4. 각 행동을 조건문으로 구현하여 상태별 동작을 결정한다.
    
    ```java
    public void insertQuarter() {
        if (state == HAS_QUARTER) {
            System.out.println("동전은 한 개만 넣어주세요.");
        } else if (state == NO_QUARTER) {
            state = HAS_QUARTER;
            System.out.println("동전을 넣으셨습니다.");
        } else if (state == SOLD_OUT) {
            System.out.println("매진되었습니다. 다음 기회에.");
        } else if (state == SOLD) {
            System.out.println("알맹이를 내보내고 있습니다.");
        }
    }
    ```
    

## 조건문 기반 뽑기 기계 구현의 문제점

위와 같은 접근 방식은 간단한 상태 시스템에서는 잘 작동하지만, 다음과 같은 문제점이 있다:

1. **코드 중복**: 각 메소드마다 상태 확인을 위한 조건문이 반복된다.
2. **유지보수 어려움**: 새로운 상태나 행동을 추가할 때 모든 메소드를 수정해야 한다.
3. **오류 가능성**: 하나의 상태 전환을 놓치거나 잘못 구현할 가능성이 있다.
4. **가독성 저하**: 코드가 길어지고 복잡해지면서 가독성이 떨어진다.

이러한 문제는 상태가 많고 복잡한 시스템에서 더욱 두드러진다. 예를 들어, 10% 확률로 두 개의 알맹이가 나오는 추가 기능을 구현하려면, 모든 관련 메소드에 새로운 조건문을 추가해야 한다.

## 상태 패턴으로 재설계하기

상태 패턴은 각 상태를 별도의 클래스로 캡슐화하고, Context 객체에서 현재 상태 객체에 작업을 위임하는 방식으로 위 문제를 해결한다.

### 1. State 인터페이스 정의

모든 상태 클래스가 구현할 공통 인터페이스를 정의한다

```typescript
interface State {
  insertQuarter(): void;
  ejectQuarter(): void;
  turnCrank(): void;
  dispense(): void;
}
```

### 2. 구체적인 상태 클래스 구현

각 상태별로 클래스를 구현한다. 예를 들어, 동전이 없는 상태

```typescript
class NoQuarterState implements State {
  private gumballMachine: GumballMachine;
  
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  
  insertQuarter(): void {
    console.log("동전을 넣으셨습니다.");
    this.gumballMachine.setState(this.gumballMachine.getHasQuarterState());
  }
  
  ejectQuarter(): void {
    console.log("동전을 넣어주세요.");
  }
  
  turnCrank(): void {
    console.log("동전을 넣어주세요.");
  }
  
  dispense(): void {
    console.log("동전을 넣어주세요.");
  }
}
```

동전이 있는 상태

```typescript
class HasQuarterState implements State {
  private gumballMachine: GumballMachine;
  
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  
  insertQuarter(): void {
    console.log("동전은 한 개만 넣어주세요.");
  }
  
  ejectQuarter(): void {
    console.log("동전이 반환됩니다.");
    this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
  }
  
  turnCrank(): void {
    console.log("손잡이를 돌리셨습니다.");
    this.gumballMachine.setState(this.gumballMachine.getSoldState());
  }
  
  dispense(): void {
    console.log("알맹이를 내보낼 수 없습니다.");
  }
}
```

판매 상태

```typescript
class SoldState implements State {
  private gumballMachine: GumballMachine;
  
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  
  insertQuarter(): void {
    console.log("알맹이를 내보내고 있습니다.");
  }
  
  ejectQuarter(): void {
    console.log("이미 알맹이를 내보냈습니다.");
  }
  
  turnCrank(): void {
    console.log("손잡이는 한 번만 돌려 주세요.");
  }
  
  dispense(): void {
    this.gumballMachine.releaseBall();
    if (this.gumballMachine.getCount() > 0) {
      this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
    } else {
      console.log("껌볼이 더 이상 없습니다.");
      this.gumballMachine.setState(this.gumballMachine.getSoldOutState());
    }
  }
}
```

품절 상태

```typescript
class SoldOutState implements State {
  private gumballMachine: GumballMachine;
  
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  
  insertQuarter(): void {
    console.log("매진되었습니다. 다음 기회에.");
  }
  
  ejectQuarter(): void {
    console.log("동전을 넣지 않았습니다.");
  }
  
  turnCrank(): void {
    console.log("매진되었습니다.");
  }
  
  dispense(): void {
    console.log("매진되었습니다.");
  }
}
```

### 3. Context 클래스 (GumballMachine) 구현

```typescript
class GumballMachine {
  private soldOutState: State;
  private noQuarterState: State;
  private hasQuarterState: State;
  private soldState: State;
  
  private state: State;
  private count: number = 0;
  
  constructor(numberGumballs: number) {
    this.soldOutState = new SoldOutState(this);
    this.noQuarterState = new NoQuarterState(this);
    this.hasQuarterState = new HasQuarterState(this);
    this.soldState = new SoldState(this);
    
    this.count = numberGumballs;
    if (numberGumballs > 0) {
      this.state = this.noQuarterState;
    } else {
      this.state = this.soldOutState;
    }
  }
  
  // 상태 객체에 행동 위임
  insertQuarter(): void {
    this.state.insertQuarter();
  }
  
  ejectQuarter(): void {
    this.state.ejectQuarter();
  }
  
  turnCrank(): void {
    this.state.turnCrank();
    this.state.dispense();
  }
  
  // 상태 변경 메소드
  setState(state: State): void {
    this.state = state;
  }
  
  // 알맹이 배출 메소드
  releaseBall(): void {
    console.log("알맹이를 내보내고 있습니다.");
    if (this.count > 0) {
      this.count--;
    }
  }
  
  // 상태 객체 접근자
  getSoldOutState(): State {
    return this.soldOutState;
  }
  
  getNoQuarterState(): State {
    return this.noQuarterState;
  }
  
  getHasQuarterState(): State {
    return this.hasQuarterState;
  }
  
  getSoldState(): State {
    return this.soldState;
  }
  
  getCount(): number {
    return this.count;
  }
  
  getState(): State {
    return this.state;
  }
  
  refill(count: number): void {
    this.count += count;
    this.state = this.noQuarterState;
  }
}
```

## 상태 패턴 vs 전략 패턴 : "전략 패턴과 유사한 것 같은데요?"

상태 패턴과 전략 패턴은 유사한 클래스 다이어그램을 가지지만, 목적과 용도가 다르다

### 상태 패턴

- **목적**: 객체의 내부 상태에 따라 행동이 변경되도록 한다.
- **상태 전환**: 상태 객체 내부 또는 Context에서 자동으로 상태 전환이 이루어진다.
- **캡슐화**: 상태 전환 로직이 상태 객체 내부에 캡슐화된다.
- **클라이언트 관점**: 클라이언트는 상태 객체를 직접 다루지 않는다.

### 전략 패턴

- **목적**: 알고리즘을 교체 가능하게 만들어 런타임에 행동을 변경한다.
- **전략 선택**: 주로 클라이언트가 Context에 어떤 전략 객체를 사용할지 지정한다.
- **유연성**: 다양한 알고리즘(전략)을 쉽게 추가하고 교체할 수 있다.
- **구성**: 서브클래스 대신 구성(composition)을 통해 행동을 정의한다.

## 상태 패턴 요약

상태 패턴은 객체의 상태에 따른 행동 변화를 객체지향적으로 구현하는 방법이다. 각 상태를 별도 클래스로 캡슐화하고, Context 객체가 현재 상태 객체에 작업을 위임함으로써 마치 객체의 클래스가 바뀌는 것과 같은 효과를 얻을 수 있다.

이 패턴은 상태 전환이 복잡하고 상태별 행동이 크게 다른 시스템에서 특히 유용하다. 복잡한 조건문을 제거하고, 각 상태의 행동을 명확하게 분리함으로써 코드의 가독성과 유지보수성을 크게 향상시킨다.