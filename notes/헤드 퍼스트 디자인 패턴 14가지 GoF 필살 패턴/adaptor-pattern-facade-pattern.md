---
date: 2025-04-11
title: CHAPTER 07 - 적응시키기 (어댑터 패턴과 퍼사드 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 7장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
## 어댑터 패턴(Adapter Pattern)

> 어댑터 패턴
> 
> **특정 클래스 인터페이스를 다른 클라이언트에서 요구하는 다른 인터페이스로 변환**한다. 인터페이스가 호환되지 않아 같이 쓸 수 없었던 클래스를 사용할 수 있게 도와준다.

### 어댑터의 역할

일상에서 접하는 전원 어댑터와 같이, 객체지향 어댑터도 한 인터페이스를 클라이언트에서 요구하는 형태로 적응시키는 역할을 한다.

예를 들어, 한국에서 사용하던 충전기를 영국에서 사용하려면 플러그 모양을 바꿔주는 어댑터가 필요한 것처럼, 객체지향 프로그래밍에서도 기존 코드를 변경하지 않고 서로 다른 인터페이스를 연결해주는 어댑터가 필요하다.

### 어댑터 사용 예제

다음은 오리(Duck)와 칠면조(Turkey)라는 서로 다른 인터페이스를 가진 객체들을 어댑터를 통해 연결하는 예제입니다:

```typescript
// 타깃 인터페이스
interface Duck {  
  quack(): void;
  fly(): void;  
}  

// 어댑티 인터페이스
interface Turkey {  
  gobble(): void;  
  fly(): void;  
}  

// 구체적인 타깃 클래스
class MallardDuck implements Duck {  
  quack() {  
    console.log("꽥");  
  }  
  
  fly() {  
    console.log("날고있습니다.");  
  }  
}  

// 구체적인 어댑티 클래스
class WildTurkey implements Turkey {  
  gobble() {  
    console.log("골골");  
  }  
  
  fly() {  
    console.log("짧은 거리를 날고 있습니다.");  
  }  
}  

// 어댑터: Turkey를 Duck으로 변환
class TurkeyAdapter implements Duck {  
  private _turkey: Turkey;  
  
  constructor(turkey: Turkey) {  
    this._turkey = turkey;  
  }  
  
  quack() {  
    // Turkey의 gobble을 Duck의 quack으로 변환
    this._turkey.gobble();  
  }  
  
  fly() {  
    // 칠면조는 오리보다 적게 날 수 있으므로 5번 호출하여 보완
    for(let i=0; i < 5; i++) {  
      this._turkey.fly();  
    }  
  }  
}  

// 테스트 코드
function testDuck(duck: Duck) {  
  duck.quack();  
  duck.fly();  
}  

const duck = new MallardDuck();  
const turkey = new WildTurkey();  
const turkeyAdapter = new TurkeyAdapter(turkey);  

console.log("칠면조가 말하길");
turkey.gobble();
turkey.fly();

console.log("오리가 말하길");
testDuck(duck);

console.log("칠면조 어댑터가 말하길");
testDuck(turkeyAdapter);
```

#### 클라이언트에서 어댑터를 사용하는 방법

1. 클라이언트에서 타깃 인터페이스로 메소드를 호출해서 어댑터에 요청을 보낸다.
2. 어댑터는 어댑티 인터페이스로 그 요청을 어댑티에 관한 (하나 이상의) 메소드 호출로 변환한다.
3. 클라이언트는 호출 결과를 받긴 하지만 중간에 어댑터가 있다는 사실을 모른다.

#### 객체 어댑터와 클래스 어댑터

1. **객체 어댑터**: 구성(Composition)을 사용하여 어댑티를 감싸는 방식
2. **클래스 어댑터**: 다중 상속을 사용하는 방식 (Java에서는 지원하지 않음)

## 퍼사드 패턴(Facade Pattern)

> 퍼사드 패턴
> 
> 서브시스템에 있는 일련의 인터페이스를 통합 인터페이스로 묶어줍니다. 또한 고수준의 인터페이스도 정의하므로 서브시스템을 더 편리하게 사용할 수 있습니다.

### 퍼사드의 역할

퍼사드(facade)는 '겉 모양이나 외관'이라는 뜻으로, 복잡한 서브시스템을 간단한 인터페이스로 제공하여 사용하기 쉽게 만드는 역할을 한다.

다시 말해, 퍼사드 패턴은 인터페이스를 단순하게 바꾸려고 인터페이스를 변경한다.

#### 홈시어터 만들기

홈시어터 시스템은 팝콘 기계, 조명, 스크린, 프로젝터, 앰프, 스트리밍 플레이어 등 여러 장치로 구성되어 있다. 이 모든 장치를 하나씩 제어하는 것은 매우 복잡한 작업이다. 퍼사드 패턴을 사용하면 이런 복잡한 시스템을 간단하게 사용할 수 있다.

```typescript
// 서브시스템 클래스들
class PopcornPopper {
  on() {
    console.log("팝콘 기계가 켜졌습니다.");
  }
  
  off() {
    console.log("팝콘 기계가 꺼졌습니다.");
  }
  
  pop() {
    console.log("팝콘 기계에서 팝콘을 튀기고 있습니다.");
  }
}

class TheaterLights {
  on() {
    console.log("조명이 켜졌습니다.");
  }
  
  off() {
    console.log("조명이 꺼졌습니다.");
  }
  
  dim(level: number) {
    console.log(`조명을 ${level}% 밝기로 조절합니다.`);
  }
}

class Screen {
  up() {
    console.log("스크린이 올라갑니다.");
  }
  
  down() {
    console.log("스크린이 내려옵니다.");
  }
}

class Projector {
  on() {
    console.log("프로젝터가 켜졌습니다.");
  }
  
  off() {
    console.log("프로젝터가 꺼졌습니다.");
  }
  
  wideScreenMode() {
    console.log("프로젝터를 와이드 스크린 모드로 설정합니다.");
  }
}

class Amplifier {
  on() {
    console.log("앰프가 켜졌습니다.");
  }
  
  off() {
    console.log("앰프가 꺼졌습니다.");
  }
  
  setStreamingPlayer(player: StreamingPlayer) {
    console.log("앰프의 입력을 스트리밍 플레이어로 설정합니다.");
  }
  
  setSurroundSound() {
    console.log("앰프를 서라운드 사운드 모드로 설정합니다.");
  }
  
  setVolume(level: number) {
    console.log(`앰프 볼륨을 ${level}로 설정합니다.`);
  }
}

class StreamingPlayer {
  on() {
    console.log("스트리밍 플레이어가 켜졌습니다.");
  }
  
  off() {
    console.log("스트리밍 플레이어가 꺼졌습니다.");
  }
  
  play(movie: string) {
    console.log(`스트리밍 플레이어에서 "${movie}"를 재생합니다.`);
  }
  
  stop() {
    console.log("스트리밍 플레이어가 재생을 멈춥니다.");
  }
}

// 퍼사드 클래스
class HomeTheaterFacade {
  private popper: PopcornPopper;
  private lights: TheaterLights;
  private screen: Screen;
  private projector: Projector;
  private amp: Amplifier;
  private player: StreamingPlayer;
  
  constructor(
    popper: PopcornPopper, 
    lights: TheaterLights, 
    screen: Screen, 
    projector: Projector, 
    amp: Amplifier, 
    player: StreamingPlayer
  ) {
    this.popper = popper;
    this.lights = lights;
    this.screen = screen;
    this.projector = projector;
    this.amp = amp;
    this.player = player;
  }
  
  // 영화 감상을 위한 간단한 메서드
  watchMovie(movie: string) {
    console.log("영화 감상 준비를 시작합니다...");
    this.popper.on();
    this.popper.pop();
    this.lights.dim(10);
    this.screen.down();
    this.projector.on();
    this.projector.wideScreenMode();
    this.amp.on();
    this.amp.setStreamingPlayer(this.player);
    this.amp.setSurroundSound();
    this.amp.setVolume(5);
    this.player.on();
    this.player.play(movie);
  }
  
  // 영화 감상 종료를 위한 간단한 메서드
  endMovie() {
    console.log("홈시어터를 종료합니다...");
    this.popper.off();
    this.lights.on();
    this.screen.up();
    this.projector.off();
    this.amp.off();
    this.player.stop();
    this.player.off();
  }
}

// 퍼사드 사용 예
const popper = new PopcornPopper();
const lights = new TheaterLights();
const screen = new Screen();
const projector = new Projector();
const amp = new Amplifier();
const player = new StreamingPlayer();

const homeTheater = new HomeTheaterFacade(popper, lights, screen, projector, amp, player);

// 영화 보기 - 복잡한 과정이 간단한 메서드 호출로 단순화됨
homeTheater.watchMovie("인디아나 존스: 잃어버린 성궤");
// 영화 감상 종료
homeTheater.endMovie();
```

#### 퍼사드 패턴의 장점

1. **인터페이스 단순화**: 복잡한 서브시스템에 대한 간단한 인터페이스를 제공
2. **클라이언트와 서브시스템 분리**: 클라이언트 구현과 서브시스템을 분리
3. **유연한 사용**: 클라이언트는 필요에 따라 퍼사드를 사용하거나 서브시스템 클래스를 직접 사용할 수 있다.

#### 어댑터 패턴과 퍼사드 패턴의 차이점

|패턴|용도|
|---|---|
|어댑터|하나의 인터페이스를 다른 인터페이스로 변환|
|퍼사드|인터페이스를 간단하게 변경|

#### 최소 지식 원칙

퍼사드 패턴은 객체지향 설계의 중요한 원칙인 "최소 지식 원칙"(Principle of Least Knowledge)을 따른다.이 원칙은 다음과 같이 정의된다.

> 진짜 절친에게만 이야기해야 한다.

이 원칙에 따르면 객체 간의 상호작용은 가까운 '친구' 사이에서만 허용하는 것이 좋다.
객체는 다음 유형의 객체에만 메서드를 호출해야 한다.

1. 객체 자체
2. 메소드에 매개변수로 전달된 객체
3. 메소드를 생성하거나 인스턴스를 만든 객체
4. 객체에 속하는 구성 요소(인스턴스 변수로 참조되는 객체)

이 원칙을 따르면 시스템의 한 부분을 변경했을 때 다른 부분까지 영향을 받는 것을 최소화할 수 있다.