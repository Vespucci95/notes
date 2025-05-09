---
date: 2025-04-18
title: CHAPTER 09 - 컬렉션 잘 관리하기 (반복자 패턴과 컴포지트 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 9장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
## 반복자 패턴(Iterator Pattern)

> 반복자 패턴
> 
> 컬렉션의 구현 방법을 노출하지 않으면서 집합체 내의 모든 항목에 접근하는 방법을 제공한다.

### 객체마을 식당과 팬케이크 하우스 합병

객체마을 식당(A)과 팬케이크 하우스(B)가 합병하면서 메뉴 항목을 나타내는 `MenuItem` 클래스는 합의했지만, 메뉴를 저장하는 방식은 다르다:

- A 식당: 배열을 사용하여 메뉴 저장
- B 식당: ArrayList를 사용하여 메뉴 저장

이렇게 다른 구현 방식으로 인해 종업원이 두 메뉴를 일관된 방식으로 처리하기 어려운 문제가 발생한다.

### 반복자 패턴 적용하기

반복자 패턴은 "바뀌는 부분을 캡슐화하라"는 원칙을 적용한다. 여기서 바뀌는 부분은 컬렉션(배열, ArrayList 등)을 순회하는 방식이다.

#### Iterator 인터페이스 정의

```typescript
interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}
```

#### DinerMenuIterator 구현 (배열용 반복자)

```typescript
class DinerMenuIterator implements Iterator<MenuItem> {
  private items: MenuItem[];
  private position: number = 0;

  constructor(items: MenuItem[]) {
    this.items = items;
  }

  hasNext(): boolean {
    return this.position < this.items.length && this.items[this.position] != null;
  }

  next(): MenuItem {
    const menuItem = this.items[this.position];
    this.position++;
    return menuItem;
  }
}
```

#### 메뉴에 반복자 적용하기

```typescript
class DinerMenu {
  static readonly MAX_ITEMS: number = 6;
  private numberOfItems: number = 0;
  private menuItems: MenuItem[];

  constructor() {
    this.menuItems = new Array<MenuItem>(DinerMenu.MAX_ITEMS);
    // 메뉴 항목 추가
  }

  addItem(name: string, description: string, vegetarian: boolean, price: number): void {
    // 메뉴 항목 추가 로직
  }

  // 내부 구현을 노출하는 메소드는 제거
  // getMenuItems(): MenuItem[] { return this.menuItems; }

  // 대신 반복자를 제공
  createIterator(): Iterator<MenuItem> {
    return new DinerMenuIterator(this.menuItems);
  }
}

class PancakeHouseMenu {
  private menuItems: MenuItem[] = [];

  constructor() {
    // 메뉴 항목 추가
  }

  addItem(name: string, description: string, vegetarian: boolean, price: number): void {
    // 메뉴 항목 추가 로직
  }

  createIterator(): Iterator<MenuItem> {
    return new ArrayListIterator(this.menuItems);
  }
}
```

#### 종업원 코드 개선

```typescript
class Waitress {
  private pancakeHouseMenu: PancakeHouseMenu;
  private dinerMenu: DinerMenu;

  constructor(pancakeHouseMenu: PancakeHouseMenu, dinerMenu: DinerMenu) {
    this.pancakeHouseMenu = pancakeHouseMenu;
    this.dinerMenu = dinerMenu;
  }

  printMenu(): void {
    const pancakeIterator = this.pancakeHouseMenu.createIterator();
    const dinerIterator = this.dinerMenu.createIterator();

    console.log("메뉴\n----\n아침 메뉴");
    this.printMenuItems(pancakeIterator);
    console.log("\n점심 메뉴");
    this.printMenuItems(dinerIterator);
  }

  private printMenuItems(iterator: Iterator<MenuItem>): void {
    while (iterator.hasNext()) {
      const menuItem = iterator.next();
      console.log(`${menuItem.getName()}, ${menuItem.getPrice()} -- ${menuItem.getDescription()}`);
    }
  }
}
```

### 반복자 패턴의 장점

1. **단일 책임 원칙(SRP)**: 컬렉션 순회 로직을 별도의 객체로 분리
2. **캡슐화**: 컬렉션의 내부 구현을 숨김
3. **유연성**: 새로운 컬렉션 타입이 추가되더라도 클라이언트 코드 변경 없음
4. **일관성**: 서로 다른 컬렉션을 동일한 방식으로 순회

---
## 컴포지트 패턴(Composite Pattern)

> 컴포지트 패턴
> 
> 컴포지트 패턴으로 객체를 트리구조로 구성해서 부분-전체 계층 구조를 구현한다. 컴포지트 패턴을 사용하면 클라이언트에서 개별 객체와 복합 객체를 똑같은 방식으로 다룰 수 있다.

### 문제 상황: 복잡한 메뉴 구조

메뉴에 서브메뉴가 포함될 수 있는 더 복잡한 구조를 관리해야 할 때, 반복자 패턴만으로는 한계가 있다.

### 컴포지트 패턴 적용하기

#### MenuComponent 추상 클래스 정의 (Component)

```typescript
abstract class MenuComponent {
  // 복합 객체에서 사용하는 메소드
  add(menuComponent: MenuComponent): void {
    throw new Error("지원하지 않는 연산입니다");
  }

  remove(menuComponent: MenuComponent): void {
    throw new Error("지원하지 않는 연산입니다");
  }

  getChild(i: number): MenuComponent {
    throw new Error("지원하지 않는 연산입니다");
  }

  // 잎 노드에서 사용하는 메소드
  getName(): string {
    throw new Error("지원하지 않는 연산입니다");
  }

  getDescription(): string {
    throw new Error("지원하지 않는 연산입니다");
  }

  getPrice(): number {
    throw new Error("지원하지 않는 연산입니다");
  }

  isVegetarian(): boolean {
    throw new Error("지원하지 않는 연산입니다");
  }

  // 잎과 복합 객체 모두에서 사용하는 메소드
  print(): void {
    throw new Error("지원하지 않는 연산입니다");
  }
}
```

#### MenuItem 클래스 구현 (Leaf)

```typescript
class MenuItem extends MenuComponent {
  private name: string;
  private description: string;
  private vegetarian: boolean;
  private price: number;

  constructor(name: string, description: string, vegetarian: boolean, price: number) {
    super();
    this.name = name;
    this.description = description;
    this.vegetarian = vegetarian;
    this.price = price;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  isVegetarian(): boolean {
    return this.vegetarian;
  }

  print(): void {
    let text = ` ${this.getName()}`;
    if (this.isVegetarian()) {
      text += "(v)";
    }
    console.log(`${text}, ${this.getPrice()}`);
    console.log(` -- ${this.getDescription()}`);
  }
}
```

#### Menu 클래스 구현 (Composite)

```typescript
class Menu extends MenuComponent {
  private menuComponents: MenuComponent[] = [];
  private name: string;
  private description: string;

  constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
  }

  add(menuComponent: MenuComponent): void {
    this.menuComponents.push(menuComponent);
  }

  remove(menuComponent: MenuComponent): void {
    const index = this.menuComponents.indexOf(menuComponent);
    if (index >= 0) {
      this.menuComponents.splice(index, 1);
    }
  }

  getChild(i: number): MenuComponent {
    return this.menuComponents[i];
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  print(): void {
    console.log(`\n${this.getName()}, ${this.getDescription()}`);
    console.log("---------------------");

    // 모든 자식 메뉴 컴포넌트에 대해 print() 호출
    for (const menuComponent of this.menuComponents) {
      menuComponent.print();
    }
  }
}
```

#### 종업원 코드 개선 (Client)

```typescript
class Waitress {
  private allMenus: MenuComponent;

  constructor(allMenus: MenuComponent) {
    this.allMenus = allMenus;
  }

  printMenu(): void {
    this.allMenus.print();
  }
}
```

#### 메뉴 구성 예제

```typescript
// 메뉴 생성
const pancakeHouseMenu = new Menu("팬케이크 하우스 메뉴", "아침 메뉴");
const dinerMenu = new Menu("객체마을 식당 메뉴", "점심 메뉴");
const cafeMenu = new Menu("카페 메뉴", "저녁 메뉴");
const dessertMenu = new Menu("디저트 메뉴", "디저트를 즐겨 보세요");

// 전체 메뉴 생성 (최상위 복합 객체)
const allMenus = new Menu("전체 메뉴", "전체 메뉴");

// 메뉴 구조 구성
allMenus.add(pancakeHouseMenu);
allMenus.add(dinerMenu);
allMenus.add(cafeMenu);

// 메뉴 항목 추가
pancakeHouseMenu.add(new MenuItem(
  "K&B 팬케이크 세트",
  "스크램블 에그와 토스트가 곁들여진 팬케이크",
  true,
  2.99
));

dinerMenu.add(new MenuItem(
  "파스타",
  "마리나라 소스 스파게티, 효모빵도 드립니다.",
  true,
  3.89
));

// 서브메뉴 추가
dinerMenu.add(dessertMenu);

// 서브메뉴에 항목 추가
dessertMenu.add(new MenuItem(
  "애플 파이",
  "바삭바삭한 크러스트에 바닐라 아이스크림이 얹혀 있는 애플 파이",
  true,
  1.59
));

// 종업원 생성
const waitress = new Waitress(allMenus);
waitress.printMenu();
```

### 컴포지트 패턴의 장점

1. **일관된 인터페이스**: 개별 객체(MenuItem)와 복합 객체(Menu)를 모두 동일하게 다룰 수 있다.
2. **계층 구조 표현**: 트리 구조의 메뉴 시스템을 자연스럽게 표현할 수 있다.
3. **확장성**: 새로운 메뉴 유형이나 구성 요소를 쉽게 추가할 수 있다.
4. **클라이언트 코드 단순화**: 클라이언트는 개별 객체와 복합 객체를 구분할 필요가 없다.

### 컴포지트 패턴의 트레이드오프

컴포지트 패턴은 단일 책임 원칙(SRP)을 위반하는 대신 **투명성(transparency)** 을 제공한다. 여기서 투명성이란 클라이언트가 복합 객체와 잎 노드의 차이를 알 필요 없이 동일하게 다룰 수 있다는 것을 의미한다.

## 디자인 원칙: 단일 책임 원칙(SRP)

> 어떤 클래스가 바뀌는 이유는 하나뿐이어야 한다.

클래스는 하나의 책임만 가져야 하며, 그 책임을 완전히 캡슐화해야 한다. 이는 응집도(cohesion)와 관련이 있다

- 응집도가 높다 = 서로 연관된 기능이 묶여있다.
- 응집도가 낮다 = 서로 상관 없는 기능이 묶여있다.

반복자 패턴은 이 원칙을 잘 따르고 있다. 컬렉션 순회라는 책임을 Iterator 객체에게 위임함으로써 컬렉션 클래스의 응집도를 높인다.

반면, 컴포지트 패턴은 투명성을 위해 이 원칙을 일부 희생한다. Component 클래스는 잎과 복합 객체의 인터페이스를 모두 포함하기 때문에 두 가지 책임을 갖는다. 이는 설계 상의 트레이드오프로, 상황에 따라 적절한 선택이 필요하다.
