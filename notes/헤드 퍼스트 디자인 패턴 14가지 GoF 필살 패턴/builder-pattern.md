---
date: 2025-06-09
title: CHAPTER 14 - 다양한 패턴 빠르게 알아보기 (빌더 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 14장을 읽고 정리한 내용입니다.
thumbnail:
---
## 빌더 패턴이란?

> #빌더패턴(Builder Pattern)은  복잡한 객체의 생성 과정을 단계별로 나누어 구성하는 생성 디자인 패턴이다.

## 빌더 패턴 사용하기

반복자 패턴([[iterator-pattern-composite-pattern|iterator-pattern]])을 사용하면 반복 작업을 별도의 객체로 캡슐화해서 컬렉션의 내부 구조를 클라이언트로부터 보호할 수 있다. 여기에서도 똑같은 아이디어를 사용한다.

예를들어, 계획표 작성을 객체(builder, 빌더)에 캡슐화해서 클라이언트가 빌더에게 계획표 구조를 만들어 달라고 요청하는 것이다.

![[Pasted image 20250609013611.png]]

## 예시 코드 : 휴가 계획표

```typescript
// 최종 제품 - 휴가 계획  
class Planner {  
  public days: string[] = [];  
  public hotels: string[] = [];  
  public reservations: string[] = [];  
  public specialEvents: string[] = [];  
  public tickets: string[] = [];  
  
  toString(): string {  
    return `휴가 계획:  
- 일정: ${this.days.join(', ')}  
- 호텔: ${this.hotels.join(', ')}  
- 예약: ${this.reservations.join(', ')}  
- 특별 이벤트: ${this.specialEvents.join(', ')}  
- 티켓: ${this.tickets.join(', ')}`;  
  }  
}  
  
// 추상 빌더  
abstract class AbstractBuilder {  
  protected planner = new Planner();  
  
  abstract buildDay(date: string): AbstractBuilder;  
  abstract addHotel(date: string, hotel: string): AbstractBuilder;  
  abstract addReservation(place: string): AbstractBuilder;  
  abstract addSpecialEvent(event: string): AbstractBuilder;  
  abstract addTickets(show: string): AbstractBuilder;  
  
  getVacationPlanner(): Planner {  
    return this.planner;  
  }  
}  
  
// 구체적인 빌더  
class VacationBuilder extends AbstractBuilder {  
  buildDay(date: string): VacationBuilder {  
    this.planner.days.push(date);  
    return this;  
  }  
  
  addHotel(date: string, hotel: string): VacationBuilder {  
    this.planner.hotels.push(`${date}: ${hotel}`);  
    return this;  
  }  
  
  addReservation(place: string): VacationBuilder {  
    this.planner.reservations.push(place);  
    return this;  
  }  
  
  addSpecialEvent(event: string): VacationBuilder {  
    this.planner.specialEvents.push(event);  
    return this;  
  }  
  
  addTickets(show: string): VacationBuilder {  
    this.planner.tickets.push(show);  
    return this;  
  }  
}  
  
// 클라이언트  
class Client {  
  constructPlanner(): Planner {  
    const builder = new VacationBuilder();  
  
    // 다이어그램의 예시 코드  
    builder.buildDay("2024-07-15");  
    builder.addHotel("2024-07-15", "Grand Facadian");  
    builder.addTickets("Patterns on Ice");  
  
    // 완성된 계획 반환  
    return builder.getVacationPlanner();  
  }  
}  
  
// 사용 예시  
const client = new Client();  
const yourPlanner:Planner = client.constructPlanner();  
  
console.log(yourPlanner.toString());  
  
// 직접 빌더 사용 예시  
const customPlan = new VacationBuilder()  
  .buildDay("2024-08-01")  
  .buildDay("2024-08-02")  
  .addHotel("2024-08-01", "Beach Resort")  
  .addReservation("Seafood Restaurant")  
  .addSpecialEvent("Surfing Lesson")  
  .addTickets("Ocean Theater Show")  
  .getVacationPlanner();  
  
console.log("\n" + customPlan.toString());
```

```txt
휴가 계획:
- 일정: 2024-07-15
- 호텔: 2024-07-15: Grand Facadian
- 예약: 
- 특별 이벤트: 
- 티켓: Patterns on Ice

휴가 계획:
- 일정: 2024-08-01, 2024-08-02
- 호텔: 2024-08-01: Beach Resort
- 예약: Seafood Restaurant
- 특별 이벤트: Surfing Lesson
- 티켓: Ocean Theater Show
```

## 정리

>[!example] 빌더패턴의 활용법  
>- 복합 객체 구조를 구축하는 용도로 많이 쓰인다.

>[!success] 빌더 패턴의 장점
>- 복합 객체 생성 과정을 캡슐화 한다.
>- 여러 단계와 다양한 절차를 거쳐 객체를 만들 수 있다.
>- 제품의 내부 구조를 클라이언트로부터 보호
>- 클라이언트는 추상 인터페이스만 볼 수 있기에 제품을 구현한 코드를 쉽게 변경할 수 있다.

>[!fail] 빌더 패턴의 단점
>- 팩토리([[factory-pattern]])를 사용할 때 보다 객체를 만들 때 클라이언트에 관해 더 많이 알아야한다.
