---
date: 2025-03-18
title: CHAPTER 06 - 호출 캡슐화하기 (커맨드 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 6장을 읽고 TS로 정리한 내용입니다.
thumbnail:
---
## 커맨드 패턴의 정의

> 커맨드 패턴을 사용하면 요청 내역을 객체로 캡슐화해서 객체를 서로 다른 요청 내역에 따라 매개변수화할 수 있다. 이를 통해 요청을 큐에 저장하거나 로그로 기록하거나 작업 취소 기능을 사용할 수 있다.

간단히 말해, 커맨드 객체는 일련의 행동을 특정 리시버와 연결함으로써 요청을 캡슐화한 것이다.

## 만능 IOT 리모컨

Weather-O-Rama의 CEO로부터 홈오토메이션 리모컨의 API 디자인을 의뢰받았다. 이 리모컨은 7개의 프로그래밍 가능한 슬롯이 있고, 각 슬롯마다 ON/OFF 버튼이 있으며, 마지막으로 누른 버튼의 명령을 취소하는 UNDO 버튼도 있다.

여러 업체로부터 공급받은 자바 클래스를 살펴보니 공통적인 인터페이스가 없고, 앞으로 새로운 클래스가 추가될 가능성도 있어 확장성 있는 디자인이 필요했다.

## 커맨드 패턴의 실제 예: 객체마을 식당

커맨드 패턴을 이해하기 위해 객체마을 식당의 주문 과정을 살펴보자

1. 고객이 종업원에게 주문을 한다.
2. 종업원은 주문을 받아서 카운터에 전달한다.
3. 주방장이 주문대로 음식을 준비한다.

이 과정에서 각 역할은

- 주문서: 주문 내용을 캡슐화하며, `orderUp()` 메소드를 통해 식사 준비를 지시한다.
- 종업원: 주문서를 받고 `orderUp()` 메소드를 호출한다.
- 주방장: 실제 식사를 준비하는 방법을 알고 있다.

이를 통해 종업원과 주방장은 완전히 분리되어 있다. 종업원은 주문서에 있는 메소드만 호출하고, 주방장은 주문서로 할 일을 전달받는다.

## 첫 번째 커맨드 객체 만들기

커맨드 인터페이스 구현

모든 커맨드 객체가 구현해야 하는 인터페이스

```typescript
interface Command {
  execute(): void;
}
```

조명을 켤 때 필요한 커맨드 클래스 구현

```typescript
class Light {
  on(): void {
    console.log("on");
  }
  
  off(): void {
    console.log("off");
  }
}

class LightOnCommand implements Command {
  private light: Light;
  
  constructor(light: Light) {
    this.light = light;
  }
  
  execute(): void {
    this.light.on();
  }
}
```

## 커맨드 객체 사용하기

간단한 리모컨 클래스를 만들어 커맨드 객체를 사용해보자

```typescript
class SimpleRemoteControl {
  private slot: Command;
  
  constructor() {}
  
  setCommand(command: Command): void {
    this.slot = command;
  }
  
  buttonWasPressed(): void {
    this.slot.execute();
  }
}
```


```typescript
function testSimpleRemote(): void {
  const remote = new SimpleRemoteControl();
  const light = new Light();
  const lightOn = new LightOnCommand(light);
  
  remote.setCommand(lightOn);
  remote.buttonWasPressed();
}
```

## 커맨드 패턴의 주요 구성 요소

- 클라이언트: 커맨드 객체를 생성하고 인보커에 설정한다.
- 인보커: 커맨드 객체의 execute() 메소드를 호출한다.
- 커맨드: `execute()` 메소드를 통해 리시버에게 특정 작업을 요청한다.
- 리시버: 실제 작업을 수행한다.

## 리모컨 코드 만들기

7개의 슬롯이 있는 리모컨 클래스를 구현해보자:

```typescript
class RemoteControl {
  private onCommands: Command[];
  private offCommands: Command[];
  
  constructor() {
    this.onCommands = Array(7);
    this.offCommands = Array(7);
    
    const noCommand = new NoCommand();
    for(let i = 0; i < 7; i++) {
      this.onCommands[i] = noCommand;
      this.offCommands[i] = noCommand;
    }
  }
  
  setCommand(slot: number, onCommand: Command, offCommand: Command): void {
    this.onCommands[slot] = onCommand;
    this.offCommands[slot] = offCommand;
  }
  
  onButtonWasPushed(slot: number): void {
    this.onCommands[slot].execute();
  }
  
  offButtonWasPushed(slot: number): void {
    this.offCommands[slot].execute();
  }
}
```

여기서 `NoCommand`는 널 객체(null object) 패턴을 적용한 것으로, 슬롯에 아무 것도 할당되지 않았을 때 사용된다.

## 작업 취소 기능 추가하기

Command 인터페이스에 `undo()` 메소드를 추가한다:

```typescript
interface Command {
  execute(): void;
  undo(): void;
}
```

리모컨 클래스를 수정하여 작업 취소 기능을 추가한다:

```typescript
class RemoteControlWithUndo {
  private onCommands: Command[];
  private offCommands: Command[];
  private undoCommand: Command;
  
  constructor() {
    const noCommand = new NoCommand();
    this.onCommands = Array(7).fill(noCommand);
    this.offCommands = Array(7).fill(noCommand);
    this.undoCommand = noCommand;
  }
  
  onButtonWasPushed(slot: number): void {
    this.onCommands[slot].execute();
    this.undoCommand = this.onCommands[slot];
  }
  
  offButtonWasPushed(slot: number): void {
    this.offCommands[slot].execute();
    this.undoCommand = this.offCommands[slot];
  }
  
  undoButtonWasPushed(): void {
    this.undoCommand.undo();
  }
}
```

## 여러 동작을 한번에 처리하기

매크로 커맨드를 통해 여러 명령을 한 번에 실행할 수 있다

```typescript
class MacroCommand implements Command {
  private commands: Command[];
  
  constructor(commands: Command[]) {
    this.commands = commands;
  }
  
  execute(): void {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].execute();
    }
  }
  
  undo(): void {
    // 역순으로 undo를 실행 (원래 실행 순서의 반대)
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}
```

## 커맨드 패턴 활용하기

커맨드 패턴은 다음과 같은 다양한 상황에서 활용할 수 있다:

- 스케줄러
- 스레드 풀
- 작업 큐

## 용어 정리

1. 커맨드(Command): 요청을 나타내는 객체로, 주로 execute() 메소드를 포함한다.
2. 컨크리트 커맨드(Concrete Command): 커맨드의 구체적인 구현이다.
3. 인보커(Invoker): 요청을 발신하는 객체로, 커맨드 객체의 execute() 메소드를 호출한다.
4. 수신자(Receiver): 요청을 수행하는 객체로, 실제 작업을 처리한다.
5. 클라이언트(Client): 인보커 객체와 수신자 객체 사이에서 커맨드 객체를 생성하고 설정한다.

커맨드 패턴을 사용하면 요청하는 객체와 그 요청을 수행하는 객체를 분리함으로써 시스템의 결합도를 낮추고 유연성을 높일 수 있다.

## 전체 코드 살펴보기

```typescript
// Command(커맨드)  
interface Command {  
  execute(): void  
  undo(): void  
}  
  
// Invoker(인보커)  
class Invoker {  
  private command: Command  
  setCommand(command: Command) {  
    this.command = command  
  }  
  executeCommand() {  
    this.command.execute()  
  }  
}  
  
// Receiver (수신자)  
class Light {  
  on():void {  
    console.log('on')  
  }  
  off():void {  
    console.log('off')  
  }  
}  
  
// Concrete Command (컨크리트 커맨드)  
class LightOnCommand implements Command {  
  private light: Light;  
  
  constructor(light: Light) {  
    this.light = light;  
  }  
  
  execute(): void {  
    this.light.on();  
  }  
  
  undo(): void {  
    this.light.off();  
  }  
}  
  
// Concrete Command (컨크리트 커맨드)  
class LightOffCommand implements Command {  
  private light: Light;  
  
  constructor(light: Light) {  
    this.light = light;  
  }  
  
  execute(): void {  
    this.light.off();  
  }  
  
  undo(): void {  
    this.light.on();  
  }  
}  
  
const invoker = new Invoker();  
const light = new Light();  
const lightOnCommand = new LightOnCommand(light);  
const lightOffCommand = new LightOffCommand(light);  
invoker.setCommand(lightOnCommand);  
invoker.executeCommand();  
invoker.setCommand(lightOffCommand);  
invoker.executeCommand();  
  
class MacroCommand implements Command {  
  private commands: Command[] = [];  
  
  constructor(commands: Command[]) {  
    this.commands = commands;  
  }  
  
  execute(): void {  
    this.commands.forEach((command) => {  
      command.execute();  
    });  
  }  
  
  undo(): void {  
    this.commands.forEach((command) => {  
      command.undo();  
    });  
  }  
}  
  
const macroCommand = new MacroCommand([lightOnCommand, lightOffCommand]);  
macroCommand.execute();  
macroCommand.undo();
```