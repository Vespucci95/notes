---
date: 2025-03-12
title: CHAPTER 05 - 하나뿐인 특별한 객체 만들기 (싱글턴 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 5장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
## 싱글턴 패턴

> 싱글턴 패턴(Singleton Pattern)은 클래스 인스턴스를 하나만 만들고, 그 인스턴스로의 전역 접근을 제공한다.

## 싱글턴이 필요한 이유

전역변수와 달리 싱글턴 패턴은 필요할 때만 인스턴스를 생성할 수 있어 자원을 효율적으로 사용할 수 있다. 애플리케이션 전체에서 공유해야 하는 단일 객체가 필요한 경우에 유용하다.

## 싱글턴 패턴 구현

```typescript
class Singleton {
  private static instance: Singleton;

  // 생성자를 private로 선언하여 외부에서 인스턴스 생성을 막음
  private constructor() {}

  // 유일한 인스턴스를 반환하는 정적 메소드
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  // 기타 메소드
  public someMethod(): void {
    console.log('싱글턴 메소드 호출됨');
  }
}

// 사용 예시
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true - 같은 인스턴스를 참조
```

## 초콜릿 보일러

초콜릿 공장에서 초콜릿 보일러를 제어하는 시스템을 예로 들어보자. 보일러는 공장에 하나만 존재하며, 여러 인스턴스가 만들어지면 위험한 상황이 발생할 수 있다.

```typescript
class ChocolateBoiler {
  private empty: boolean;
  private boiled: boolean;
  private static instance: ChocolateBoiler;

  private constructor() {
    this.empty = true;
    this.boiled = false;
  }

  public static getInstance(): ChocolateBoiler {
    if (!ChocolateBoiler.instance) {
      ChocolateBoiler.instance = new ChocolateBoiler();
    }
    return ChocolateBoiler.instance;
  }

  public fill(): void {
    if (this.isEmpty()) {
      // 보일러에 우유와 초콜릿을 혼합한 재료를 넣음
      this.empty = false;
      this.boiled = false;
    }
  }

  public drain(): void {
    if (!this.isEmpty() && this.isBoiled()) {
      // 끓인 재료를 다음 단계로 넘김
      this.empty = true;
    }
  }

  public boil(): void {
    if (!this.isEmpty() && !this.isBoiled()) {
      // 재료를 끓임
      this.boiled = true;
    }
  }

  public isEmpty(): boolean {
    return this.empty;
  }

  public isBoiled(): boolean {
    return this.boiled;
  }
}

// 사용 예시
const boiler = ChocolateBoiler.getInstance();
boiler.fill();
boiler.boil();
boiler.drain();
```

## 싱글턴 구현 방식 살펴보기

```typescript
class Singleton {
  // 클래스 정의 시점에 인스턴스를 바로 생성
  private static instance: Singleton = new Singleton();

  private constructor() {}

  public static getInstance(): Singleton {
    return Singleton.instance;
  }

  // 기타 메소드
  public someMethod(): void {
    console.log('싱글턴 메소드 호출됨');
  }
}
```

이 방법은 모듈이 로드될 때 인스턴스가 생성되므로 안전하지만, 인스턴스가 즉시 필요하지 않은 경우에도 메모리를 차지한다.

Node.js에서 모듈 캐싱 활용

```typescript
// singleton.ts
class Singleton {
  private constructor() {}

  public someMethod(): void {
    console.log('싱글턴 메소드 호출됨');
  }
}

// 모듈에서 바로 인스턴스를 내보냄
export default new Singleton();

// 사용 예시
// import singleton from './singleton';
// singleton.someMethod();
```

Node.js는 모듈을 캐싱하기 때문에, 이 모듈을 여러 번 임포트해도 같은 인스턴스를 반환한다.

ES6 모듈 시스템도 Node.js와 유사하게 동작한다:

```typescript
// singleton.ts
class Singleton {
  private constructor() {}

  public someMethod(): void {
    console.log('싱글턴 메소드 호출됨');
  }
}

export default new Singleton();

// 사용 예시
// import singleton from './singleton';
// singleton.someMethod();
```

클로저 활용

클로저를 사용한 방법은 인스턴스의 프라이버시를 더 잘 보장할 수 있다

```typescript
const Singleton = (() => {
  let instance: any;

  function createInstance() {
    // 싱글턴 객체
    const object = {
      someMethod: () => {
        console.log('싱글턴 메소드 호출됨');
      }
    };
    return object;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 사용 예시
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
```

TypeScript에서 싱글턴 구현

TypeScript의 접근 제어자와 정적 프로퍼티를 활용

```typescript
class Singleton {
  private static _instance: Singleton | null = null;

  private constructor() {
    // 초기화 코드
  }

  public static get instance(): Singleton {
    if (this._instance === null) {
      this._instance = new Singleton();
    }
    return this._instance;
  }

  // 다른 메소드들
  public someBusinessLogic(): void {
    // 비즈니스 로직
  }
}

// 사용 예시
function clientCode() {
  const s1 = Singleton.instance;
  const s2 = Singleton.instance;

  if (s1 === s2) {
    console.log('싱글턴이 제대로 작동합니다.');
  } else {
    console.log('싱글턴이 실패했습니다.');
  }
}

clientCode();
```
