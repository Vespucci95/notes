---
date: 2025-03-06
title: CHAPTER 04 - 객체지향 빵 굽기 (팩토리 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 4장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
## 팩토리 메소드 패턴의 정의

> 팩토리 메소드 패턴(Factory Method Pattern)에서는 객체를 생성할 때 필요한 인터페이스를 만들고, 어떤 클래스의 인스턴스를 만들지는 서브클래스에서 결정한다. 팩토리 메소드 패턴을 사용하면 클래스 인스턴스 만드는 일을 서브클래스에게 맡기게 된다.

## 추상 팩토리 패턴의 정의

> 추상 팩토리 패턴(Abstract Factory Pattern)은 구상 클래스에 의존하지 않고도 서로 연관되거나 의존적인 객체로 이루어진 제품군을 생성하는 인터페이스를 제공한다. 구상 클래스는 서브클래스에서 만든다.

## 팩토리 패턴이 필요한 이유

객체 생성 코드가 애플리케이션에 여러 군데 분산되어 있으면:

- 코드 관리와 갱신이 어려워진다
- 객체 생성 로직이 변경될 때마다 여러 곳을 수정해야 한다
- 구상 클래스에 직접 의존하게 되어 OCP를 위반한다

특히 아래와 같은 코드는 수정과 확장이 어렵다

```typescript
function orderPizza(type: string) {
    let pizza;
    
    if(type === "cheese") {
        pizza = new CheesePizza();
    } else if (type === "pepperoni") {
        pizza = new PepperoniPizza();    
    } else if (type === "clam") {
        pizza = new ClamPizza();    
    }
    // 피자 종류를 추가하거나 제거할 때마다 이 코드를 수정해야 함
    
    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
    
    return pizza;
}
```

## 팩토리 메소드 패턴 살펴보기

팩토리 메소드 패턴에서는 객체 생성을 담당하는 메소드를 추상화하고 서브클래스에서 구현하게 한다

```typescript
// 추상 Creator 클래스
abstract class PizzaStore {
    // 템플릿 메소드: 공통 알고리즘 정의
    orderPizza(type: string): Pizza {
        // 팩토리 메소드를 호출하여 객체 생성을 서브클래스에 위임
        const pizza = this.createPizza(type);
        
        // 나머지 처리는 추상 클래스에서 담당
        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();
        
        return pizza;
    }
    
    // 팩토리 메소드 - 서브클래스에서 구현
    protected abstract createPizza(type: string): Pizza;
}

// 구상 Creator 클래스
class NYPizzaStore extends PizzaStore {
    protected createPizza(type: string): Pizza {
        if(type === "cheese") {
            return new NYStyleCheesePizza();
        } else if (type === "pepperoni") {
            return new NYStylePepperoniPizza();
        }
        // 기타 피자 타입...
        return null;
    }
}
```

## 추상 팩토리 패턴 살펴보기

추상 팩토리 패턴은 관련된 객체들의 집합을 생성하기 위한 인터페이스를 제공한다

```typescript
// 추상 팩토리 인터페이스
interface PizzaIngredientFactory {
    createDough(): Dough;
    createSauce(): Sauce;
    createCheese(): Cheese;
    createVeggies(): Veggies[];
    createPepperoni(): Pepperoni;
    createClam(): Clams;
}

// 구상 팩토리 구현
class NYPizzaIngredientFactory implements PizzaIngredientFactory {
    createDough(): Dough {
        return new ThinCrustDough();
    }
    
    createSauce(): Sauce {
        return new MarinaraSauce();
    }
    
    createCheese(): Cheese {
        return new ReggianoCheese();
    }
    
    // 기타 재료 생성 메소드...
}

// 추상 제품
abstract class Pizza {
    name: string;
    dough: Dough;
    sauce: Sauce;
    // 기타 재료...
    
    abstract prepare(): void;
    
    // 공통 메소드
    bake(): void {
        console.log("175도에서 25분 간 굽기");
    }
    
    // 기타 공통 메소드...
}

// 구상 제품
class CheesePizza extends Pizza {
    ingredientFactory: PizzaIngredientFactory;
    
    constructor(ingredientFactory: PizzaIngredientFactory) {
        super();
        this.ingredientFactory = ingredientFactory;
    }
    
    prepare(): void {
        console.log(`준비 중: ${this.name}`);
        this.dough = this.ingredientFactory.createDough();
        this.sauce = this.ingredientFactory.createSauce();
        this.cheese = this.ingredientFactory.createCheese();
    }
}
```

## 팩토리 메소드 vs 추상 팩토리 비교

|특성|팩토리 메소드|추상 팩토리|
|---|---|---|
|생성 방식|상속 활용|구성(composition) 활용|
|객체 생성|서브클래스가 팩토리 메소드를 오버라이드해 객체 생성|구상 팩토리 객체가 관련 객체들의 집합 생성|
|확장성|새로운 제품이 필요하면 새 서브클래스 생성|새로운 제품군이 필요하면 새 팩토리 구현 및 모든 메소드 구현 필요|
|용도|단일 제품 계층구조 생성|관련된 제품군 생성|
|관계 구조|생산자와 제품이 병렬 계층 구조|제품군 간의 일관성 유지|

## 디자인 원칙: 의존성 뒤집기 원칙 (DIP)

> 추상화된 것에 의존하게 만들고 구상 클래스에 의존하지 않게 만든다.

의존성 뒤집기 원칙을 지키는 방법

- 변수에 구상 클래스의 레퍼런스를 저장하지 않는다
- 구상 클래스에서 유도된 클래스를 만들지 않는다
- 베이스 클래스에 이미 구현된 메소드를 오버라이드하지 않는다

## 팩토리 패턴 적용 시점

- 팩토리 메소드 패턴
	- 클라이언트 코드와 객체 생성 로직을 분리해야 할 때
	- 어떤 구상 클래스가 필요한지 미리 알 수 없을 때
	- 객체 생성 책임을 서브클래스에게 위임하고 싶을 때

- 추상 팩토리 패턴
	- 관련된 제품 객체들의 집합을 생성할 때
	- 제품군의 일관성을 유지해야 할 때
	- 구현을 바꿔가며 다양한 제품군을 생성해야 할 때

팩토리 패턴을 활용하면 객체 생성 코드를 캡슐화하여 클라이언트 코드와 분리하고, 확장 시 기존 코드를 수정하지 않아도 되는 유연한 설계가 가능하다.