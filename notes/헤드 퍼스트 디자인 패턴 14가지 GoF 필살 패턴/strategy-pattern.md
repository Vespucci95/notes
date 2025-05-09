---
date: 2025-02-28
title: CHAPTER 01 - 디자인 패턴의 세계로 떠나기 (전략 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 1장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
## 전략 패턴

> 알고리즘군을 정의하고 캡슐화해서 각각의 알고리즘 군을 수정해서 쓸 수 있게 해준다. 전략 패턴을 사용하면 클라이언트로부터 알고리즘을 분리해서 독립적으로 변경할 수 있다.

## 오리 시뮬레이션 게임, SimUduck

개발자 A는 오리 시뮬레이션 게임(SimUduck)을 만드는 회사에 재직중이다. 개임 내에는 매우 다양한 오리가 등장한다.  개발자 A는 `Duck` 이라는 슈퍼 클래스를 만들어 이 클래스를 확장해서 서로 다른 종류의 오리를 만들었다.

```typescript
abstract class Duck {  
  public quack():void {}  
  public swim():void {}  
  public abstract display():void;
}
  
class MallardDuck extends Duck {  
  public override display() {  
    // 적당한 모양을 표시  
  }  
}  
  
class RedheadDuck extends Duck {  
  public override display() {  
    // 적당한 모양을 표시  
  }  
}
```

이때, 임원진은 오리가 날 수 있도록 요청하였다.

요청을 받은 개발자 A는 기존 `Duck` 클래스에 `fly()`를 추가한다.

```ts
abstract class Duck {  
  public quack():void {}  
  public swim():void {}  
  public abstract display():void;  
  public fly():void {} // A는 fly 를 추가했다.  
}
```

이로인해 문제가 발생했다. 날수 없는 오리(장난감 오리)들 까지 모두 날게되었다.

슈퍼클래스에 `fly()` 메서드를 추가하면서 일부 클래스에 적합하지 않은 행동이 추가된 것.

## 상속을 생각하기

개발자 A는 `quack()` 메서드를 오버라이드한 방법을 떠올려 `fly()`도 동일하게 작업한다.

```ts
class DecoyDuck extends Duck {  
  public override display() {  
    // 적당한 모양을 표시  
  }  
  public override fly() {  
	// 아무것도 하지 않도록 오버라이드   
  }  
  
  public override quack() {  
	// 아무것도 하지 않도록 오버라이드   
  }  
}
```

>이 방법은 좋은 방법이 아니다. 좋지 않은 이유는 다음과 같은 이유이다.
>- 서브클래스에서 코드가 중복된다.
>- 실행 시에 특징을 바꾸기 어렵다.
>- 모든 오리의 행동을 알기 어렵다.
>- 코드를 변경했을 때 다른 오리들에게 원치 않은 영향을 끼칠 수 있다.

## 인터페이스 설계하기

앞으로 오리가 6개월마다 추가된다고 가정해보자.

상속을 계속 활용한다면 개발자 A는 n개의 서브클래스를 살펴보며 오버라이드 해야할 것이다. ( 6개월에 한 번 괜찮지 않나? 라고 생각한다면 이 작업을 2개월 혹은 1주에 한번 반복 한다고 생각해보자. )

개발자 A는 옳은 방법이 아니라는 것을 알고, `Flyable`, `Quackable` 인터페이스를 만들어 기능이 필요한 오리에 사용하기로 한다.

```typescript
abstract class Duck {  
  public swim():void {}  
  public abstract display():void;  
}  
  
interface Flyable {  
  fly():void  
}  
  
interface Quackable {  
  quack():void  
}  
```

```ts
class MallardDuck extends Duck implements Flyable, Quackable {  
  public display() {}
  public fly() {}
  public quack() {} 
}

class RedheadDuck extends Duck implements Flyable, Quackable {  
  public display() {}
  public fly() {}
  public quack() {} 
}
 
class RubberDuck extends Duck implements Quackable {  
  public display() {}  
  public quack() {}
}  
  
class DecoyDuck extends Duck {
  public display() {}  
}
```

>이 방법은 일부 문제점을 해결할 수 있지만, 코드 관리에 커다란 문제가 생긴다.
>- 코드 재사용 문제
>- 날 수 있는 오리중에서도 날아다니는 방식이 다를 수 있음

## 문제를 명확하게 파악하기

상속이 성공적인 해결책이 아니라는 사실은 이제 알고있다.
Flyable과 Quackable 인터페이스를 사용하는 방법은 괜찮아 보였다.

하지만 자바 인터페이스에는 구현된 코드가 없으므로 코드를 재사용할 수 없다는 문제점이 있다.
즉 한 가지 행동을 바꿀 때마다 그 해동이 정의되어있는 모든 서브클래스를 전부 찾아서 고쳐야한다.
이 과정에서 버그가 생길 가능성은 책임지지 않는다.

>디자인 원칙
>
>"애플리케이션에서 달라지는 부분을 찾아내고, 달라지지 않는 부분과 분리한다."
>- 달라지는 부분을 찾아 나머지 코드에 영향을 주지않도록 **캡슐화** 한다.
>- 코드 변경 과정에서 의도치 않게 발생하는 일을 줄인다.
>- 시스템의 유연성을 향상시킬 수 있다.

**다시 말해, 코드에 새로운 요구사항이 있을 때마다 바뀌는 부분이 있다면 분리해야한다.**

## 바뀌지 않는 부분과 그렇지 않은 부분 분리하기

**바뀌지 않는 부분**

`fly()`와 `quack()` 문제를 제외하면 `Duck` 클래스는 잘 동작하고 있다.
나머지 부분은 자주 달라지거나 바뀌지 않는다.

그러니 몇 가지 자잘한 변경이 필요하지만 `Duck` 클래스는 그대로 두는 게 좋다.

**그렇지 않은 부분**

`fly()`, `quack()`는 오리의 종류에 따라 달라지기 때문에 행동을 나타낼 별개의 클래스 집합으로 만든다.

## 오리의 행동을 디자인하는 방법

**나는 행동과 꽥꽥 거리는 행동을 구현하는 클래스 집합을 어떻게 디자인해야할까?**
우선 최대한 유연하게 만드는 것이 좋을것이다.

`Duck`의 인스턴스에 행동을 할당할 수 있도록 해보자. 즉, Duck 클래스에 행동과 관련된 세터(setter) 메서드를 포함해서 프로그램 실행 중에도 나는 행동을 바꿀 수 있으면 좋다.

>디자인 원칙
>
>"구현보다는 인터페이스에 맞춰서 프로그래밍한다."
>- "인터페이스에 맞춰서 프로그래밍한다." 라는 말은 "상위 형식에 맞춰 프로그래밍한다." 라는 말이다.

핵심은 "상위 형식에 맞춰서 프로그래밍하라" 라는 원칙이다.

간단한 예시를 통해 의미를 더 파악해보자. `Animal` 이라는 추상 클래스가 있고, 그 밑에 `Dog`와 `Cat`이라는 구상 클래스가 있다고 가정해보자.

```typescript
// Animal과 Dog 정의
abstract class Animal {
  public abstract makeSound(): void;
}

class Dog extends Animal {
  public makeSound(): void {
    console.log("멍멍!");
  }
  
  public bark(): void {
    console.log("왈왈!");
  }
}

// 접근 방식 1: 구체적인 구현에 맞춰 프로그래밍
// 변수 d를 Dog 형식으로 선언하면 구체적인 구현에 맞춰서 코딩해야 합니다.
const d: Dog = new Dog();
d.bark(); // Dog 클래스의 특정 메소드 사용 가능

// 접근 방식 2: 인터페이스/상위 형식에 맞춰 프로그래밍
// Dog라는 걸 알고 있긴 하지만 다형성을 활용해서 Animal의 레퍼런스를 써도 됩니다.
const animal: Animal = new Dog();
animal.makeSound(); // Animal 인터페이스에 정의된 메소드만 사용 가능
// animal.bark(); // 오류! Animal 타입에는 bark() 메소드가 없음

// 접근 방식 3: 가장 바람직한 방법
// 상위 형식의 인스턴스를 만드는 과정을 분리하여 실행 시 대입
// 함수를 통해 Animal 객체를 얻음
function getAnimal(): Animal {
  // 여기서는 어떤 Animal 구현체를 반환할지 결정할 수 있음
  // 런타임에 다른 구현체를 반환할 수도 있음
  return new Dog();
}

// Animal의 하위 형식 가운데 어떤 형식인지는 모른다.
// 단지 makeSound에 올바른 반응만 할 수 있으면 된다.
const a: Animal = getAnimal();
a.makeSound();
```

## 오리의 행동을 구현하는 방법

(인터페이스에 맞춰서 프로그래밍 합시다!)

개발자 A는 `FlyBehavior`와 `QuackBehavior` 인터페이스를 사용하여 각 행동을 구현하는 클래스를 만들었다.

```typescript
abstract class Duck {  
  public swim():void {}  
  public abstract display():void;  
}  
  
interface FlyBehavior {  
  fly():void  
}  
  
class FlyWithWings implements FlyBehavior {  
  public fly() {  
    // 나는 방법을 구현  
  }  
}  
  
class FlyNoWay implements FlyBehavior {  
  public fly() {  
    // 아무것도 하지 않음.  
    // 날 수 없다!  
  }  
}  
  
interface QuackBehavior {  
  quack():void  
}  
  
class Quack implements QuackBehavior {  
  public quack() {  
    // 꽥꽥 소리를 낸다.  
  }  
}  
  
class Squeak implements QuackBehavior {  
  public quack() {  
    // 고무 오리 삑삑  
    // 소리를 낸다.  
  }  
}  
  
class MuteQuack implements QuackBehavior {  
  public quack() {  
    // 아무것도 하지 않음.  
    // 소리를 낼 수 없는 경우  
  }  
}
```

이런 식으로 디자인하면 다른 형식의 객체에서도 나는 행동과 꽥꽥 거리는 행동을 재사용할 수 있다. 그런 행동이 더 이상 `Duck` 클래스 안에 숨겨져 있지 않기 때문이다.

그리고 기존의 행동 클래스를 수정하거나 날라다니는 행동을 사용하는 **`Duck` 클래스를 전혀 건드리지 않고도 새로운 행동을 추가**할 수 있다.

# 오리 행동 통합하기

가장 중요한 점은 나는 행동과 꽥꽥 거리는 행동을 `Duck` 클래스(또는 그 서브클래스)에서 정의한 메소드를 써서 구현하지 않고 **다른 클래스에 위임**한다는 것이다.

## 구현 단계

1. 우선 Duck 클래스에 `flyBehavior`와 `quackBehavior`라는 인터페이스 형식의 인스턴스 변수를 추가한다. (특정 구상 클래스 형식으로 선언하지 않는다.)
2. 각 오리 객체에서는 실행시에 이 변수에 특정 행동 형식의 레퍼런스를 다형적으로 설정한다.
3. 나는 행동과 꽥꽥 거리는 행동은 `FlyBehavior`와 `QuackBehavior`인터페이스로 옮겨놓았으므로 Duck 클래스와 모든 서브 클래스에서 `fly()` `quack()` 메소드를 제거한다.
4. Duck 클래스에 `fly()` 와 `quack()` 대신 `performFly()` 와 `performQuack()` 이라는 메소드를 넣는다.

```typescript
abstract class Duck {  
  protected flyBehavior: FlyBehavior;  
  protected quackBehavior: QuackBehavior;  
  
  public swim(): void {  
  }  
  public abstract display(): void;  
  
  public performFly():void {  
    this.flyBehavior.fly();  
  }  
  
  public performQuack():void {  
    this.quackBehavior.quack();  
  }  
}
```

```typescript
class MallardDuck extends Duck {  
  constructor() {  
    super()  
    this.flyBehavior = new FlyWithWings();  
    this.quackBehavior = new Quack();  
  }  
  
  display(): void {  
    console.log('저는 물오리 입니다.')  
  }  
}
```

# 동적으로 행동 지정하기

오리의 행동을 생성자에서 인스턴스를 만드는 방법이 아닌, Duck의 서브클래스에서 세터 메소드를 호출하는 방법으로 설정할 수 있도록 개선해보자.

```typescript
abstract class Duck {  
  protected _flyBehavior: FlyBehavior;  
  protected _quackBehavior: QuackBehavior;  
  
  public swim(): void {  
  }  
  public abstract display(): void;  
  
  public performFly(): void {  
    this._flyBehavior.fly();  
  }  
  
  public performQuack(): void {  
    this._quackBehavior.quack();  
  }  
  
  set flyBehavior(fb: FlyBehavior) {  
    this._flyBehavior = fb;  
  }
  
  set quackBehavior(qb: QuackBehavior) {
    this._quackBehavior = qb;
  }
}
```

```typescript
class ModelDuck extends Duck {  
  constructor() {  
    super();  
    this._flyBehavior = new FlyNoWay();  
    this._quackBehavior = new Quack();  
  }  
  
  display() {  
    console.log('저는 모델 오리입니다.')  
  }  
}

// 로켓 추진 비행 행동 클래스 추가
class FlyRocketPowered implements FlyBehavior {  
  public fly() {  
    console.log("로켓 추진으로 날아갑니다.")  
  }  
}

// 사용 예시
const mallardDuck = new MallardDuck();  
mallardDuck.display() // 저는 물오리 입니다.  
mallardDuck.performFly() // 날고 있습니다.  
mallardDuck.performQuack() // 꽥-꽥  
  
const modelDuck = new ModelDuck();  
modelDuck.display() // 저는 모델 오리입니다.  
modelDuck.performFly() // 날수가 없어요.  
modelDuck.flyBehavior = new FlyRocketPowered()  
modelDuck.performFly() // 로켓 추진으로 날아갑니다.
```

# 캡슐화된 행동 살펴보기

오리의 행동들을 단순한 메소드가 아닌 알고리즘군(family of algorithms)으로 생각하는 접근법이 중요하다. 이 디자인에서의 알고리즘은 오리가 하는 행동(다른 방식으로 꽥꽥거리고 나는 행동)이지만, 이 패턴은 세금 계산, 주문 처리 등 다양한 알고리즘에도 적용할 수 있다.

클래스 간 관계에도 주목하자:

- A는 B이다 관계 (상속): `MallardDuck`은 `Duck`이다
- A에는 B가 있다 관계 (구성): `Duck`에는 `FlyBehavior`가 있다
- A가 B를 구현하는 관계: `FlyWithWings`는 `FlyBehavior`를 구현한다

# 두 클래스를 합치는 방법: 구성

"A에는 B가 있다" 관계는 구성(composition)을 나타낸다. 각 오리에는 `FlyBehavior`와 `QuackBehavior`가 있으며, 각각 나는 행동과 꽥꽥 거리는 행동을 위임받는다.

여기서 오리 클래스는 행동을 상속받는 대신, 적절한 행동 객체로 구성되어 행동을 부여받는다. 구성은 매우 중요한 테크닉이자 디자인 원칙이다:

> 디자인 원칙
> 
> "상속보다는 구성을 활용한다."

구성(composition)의 이점
- 유연성을 크게 향상시킨다
- 알고리즘군을 별도의 클래스 집합으로 캡슐화할 수 있다
- 구성요소로 사용하는 객체에서 올바른 인터페이스를 구현하기만 하면 실행 시에 행동을 바꿀 수 있다