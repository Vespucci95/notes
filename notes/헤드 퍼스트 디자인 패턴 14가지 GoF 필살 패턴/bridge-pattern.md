---
date: 2025-06-05
title: CHAPTER 14 - 다양한 패턴 빠르게 알아보기 (브리지 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 14장을 읽고 정리한 내용입니다.
thumbnail:
---
## 브리지 패턴 이란?

>추상화(Abstraction)와 구현부(Implementation)를 분리하여 각각을 독립적으로 변화시킬 수 있도록 하는 패턴이다.
>
>즉, 구현과 더불어 추상화 부분까지 변경해야 한다면 #브리지패턴(Bridge) 패턴을 쓴다.
## 예시 코드 : 만능 리모컨

```typescript
// 시나리오: '만능 리모컨'을 만든다고 가정
// 구현부 ( Implementation )
interface TV {  
  on(): void  
  off(): void  
  tuneChannel(channel: number): void  
  setVolume(volume: number): void  
}  
  
class RCA implements TV {  
  on(): void {  
    console.log('RCA TV on')  
  }  
  
  off(): void {  
    console.log('RCA TV off')  
  }  
  
  tuneChannel(channel: number): void {  
    console.log(`RCA TV channel ${channel}`)  
  }  
  
  setVolume(volume: number): void {  
    console.log(`RCA TV volume ${volume}`)  
  }  
}  
  
class Sony implements TV {  
  on(): void {  
    console.log('Sony TV on')  
  }  
  
  off(): void {  
    console.log('Sony TV off')  
  }  
  
  tuneChannel(channel: number): void {  
    console.log(`Sony TV channel ${channel}`)  
  }  
  
  setVolume(volume: number): void {  
    console.log(`Sony TV volume ${volume}`)  
  }  
}  
  
// 추상화 ( Abstraction )
abstract class RemoteControl {  
  protected tv: TV;  // 브리지 역할 (구성)
  constructor(tv: TV) {  
    this.tv = tv;  
  }  
  
  abstract on(): void  
  abstract off(): void  
  abstract tuneChannel(channel: number): void  
  setVolume(volume: number): void {  
    this.tv.setVolume(volume)  
  }  
}  
  
class ConcreteRemote extends RemoteControl {  
  override on() {  
    this.tv.on()  
    this.tv.setVolume(7)  
  }  
  
  override off() {  
    this.tv.off()  
  }  
  
  override tuneChannel(channel: number) {  
    this.tv.tuneChannel(channel);  
  }  
  
  mute() {  
    this.tv.setVolume(0)  
  }  
}  
  
// test
const sonyTV = new Sony();  
const remoteWithSony = new ConcreteRemote(sonyTV);  
remoteWithSony.on();  
remoteWithSony.tuneChannel(3)  
  
const rcaTV = new RCA();  
const remoteWithRCA = new ConcreteRemote(rcaTV);  
remoteWithRCA.on();  
remoteWithRCA.tuneChannel(3)  
remoteWithRCA.mute()
```

## 브리지 패턴의 장점
- 구현과 인터페이스를 완전히 결합하지 않았기에 추상화 부분을 분리할 수 있다.
- 추상화된 부분과 실제 구현 부분을 독립적으로 확장할 수 있다.
- 추상화 부분을 구현한 구상 클래스가 바뀌어도 클라이언트에는 영향을 기치지 않는다.
## 브리지 패턴의 활용법과 단점
- 여러 플랫폼에서 사용해야 하는 그래픽스와 윈도우 처리 시스템에서 자주 쓰임
- 인터페이스와 실제 구현할 부분을 서로 다른 방식으로 변경해야 할 때 유용하게 쓰인다.
- 디자인이 복잡해진다