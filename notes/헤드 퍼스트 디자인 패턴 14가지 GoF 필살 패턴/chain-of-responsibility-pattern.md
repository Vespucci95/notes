---
date: 2025-06-16
title: CHAPTER 14 - 다양한 패턴 빠르게 알아보기 (책임 연쇄 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 14장을 읽고 정리한 내용입니다.
thumbnail:
---
## 책임 연쇄 패턴

> #책임연쇄패턴(Chain Of Responsibility)은 요청을 처리할 수 있는 객체들을 체인으로 연결하여, 요청이 처리될 때까지 체인을 따라 전달하는 행동 패턴이다.

1개의 요청을 2개 이상의 객체에서 처리해야 할때 사용한다.

## 책임 연쇄 패턴 사용하기

우선 주어진 요청을 검토하는 객체 사슬을 생성한다.  
그 사슬에 속해 있는 각 객체는 자기가 받은 요청을 검사해서 직접 처리하거나 사슬에 들어있는 다른 객체에게 넘긴다.

![[Pasted image 20250616140341.png]]

이메일이 수신되면 SpamHandler에 전달된다. SpamHandler가 처리할 수 없으면 FanHandler로 넘긴다.
이처럼 사슬을 따라 요청이 전달되면서 적절한 핸들러가 메일을 분류하는식이다.

```md
요청 접수 → SpamHandler → FanHandler → ComplaintHandler → NewLocHandler
```

## 예시코드 : 주식회사 왕뽑기 메일분류

>[!info] 시나리오  
>뽑기 기계 출시 이후, 주식회사 왕뽑기에는 감당하기 힘들 정도로 많은 이메일이 날아오기 시작했다.  
>분석에 의하면 이메일은 크게 4가지(팬메일, 항의메일, 설치문의메일, 스팸메일)로 분류할 수 있다.  


```typescript
const MAIL_TYPE = {  
  SPAM: 'SPAM',  
  FAN_MAIL: 'FAN_MAIL',  
  COMPLAINT: 'COMPLAINT',  
  NEW_LOCATION: 'NEW_LOCATION'  
} as const;  
  
type MailType = typeof MAIL_TYPE[keyof typeof MAIL_TYPE];  
  
interface Mail {  
  type: MailType  
  content: string;  
}  
  
abstract class Handler<T> {  
  protected nextHandler?: Handler<T>;  
  
  /**  
   * 체인 연결: 다음 핸들러 설정 부분  
   * @param handler 다음에 실행될 핸들러  
   * @returns 메서드 체이닝을 위해 return  
   */
  setNext(handler: Handler<T>): Handler<T> {  
    this.nextHandler = handler;  
    return handler;  
  }  
  
  /**  
   * 요청을 처리하거나 다른 핸들러로 전달하는 부분  
   */  
  handleRequest(request: T): string {  
    // 처리가 가능하다면 직접 처리한다.  
    if (this.canHandle(request)) {  
      return this.process(request);  
    }  
  
    // 처리할 수 없다면 다음 핸들러로 전달한다.  
    if (this.nextHandler) {  
      return this.nextHandler.handleRequest(request)  
    }  
  
    // 처리할 수 없는 경우  
    return '처리할 수 없는 요청' + request.content  
  }  
  
  // 요청을 처리할 수 있는지 확인  
  protected abstract canHandle(request: T): boolean;  
  
  // 실제 처리 로직  
  protected abstract process(request: T): string;  
}  
  
class SpamHandler extends Handler<Mail> {  
  protected canHandle(request: Mail): boolean {  
    return request.type === MAIL_TYPE.SPAM;  
  }  
  
  protected process(request: Mail): string {  
    return `[스팸 메일]: ${request.content}`;  
  }  
}  
  
class FanMailHandler extends Handler<Mail> {  
  protected canHandle(request: Mail): boolean {  
    return request.type === MAIL_TYPE.FAN_MAIL;  
  }  
  
  protected process(request: Mail): string {  
    return `[팬 메일]: ${request.content}`;  
  }  
}  
  
class ComplaintHandler extends Handler<Mail> {  
  protected canHandle(request: Mail): boolean {  
    return request.type === MAIL_TYPE.COMPLAINT;  
  }  
  
  protected process(request: Mail): string {  
    return `[항의 메일]: ${request.content}`;  
  }  
}  
  
class NewLocationHandler extends Handler<Mail> {  
  protected canHandle(request: Mail): boolean {  
    return request.type === MAIL_TYPE.NEW_LOCATION;  
  }  
  
  protected process(request: Mail): string {  
    return `[신규 설치 요청 메일]: ${request.content}`;  
  }  
}  
  
const spamHandler = new SpamHandler();  
  
spamHandler  
  .setNext(new FanMailHandler())  
  .setNext(new ComplaintHandler())  
  .setNext(new NewLocationHandler());  
  
const requests: Mail[] = [  
  { type: 'SPAM', content: '광고 메일입니다' },  
  { type: 'FAN_MAIL', content: '좋은 서비스 제공해줘서 감사해요' },  
  { type: 'COMPLAINT', content: '서비스가 느려요' },  
  { type: 'NEW_LOCATION', content: '서울에 의뢰 요청드립니다.' }  
];  
  
requests.forEach(request => console.log(spamHandler.handleRequest(request)));
```


>[!example] 책임 연쇄 패턴 활용법  
>- 윈도우 시스템에서 마우스 클릭과 키보드 이벤트를 처리할 때 흔히 쓰인다.

>[!success] 책임 연쇄 패턴의 장점
>- 요청을 보낸 쪽과 받는 쪽을 분리할 수 있다.
>- 객체는 사슬의 구조를 몰라도 되고 그 사슬에 들어있는 다른 객체의 직접적인 레퍼런스를 가질 필요도 없으므로 객체를 단순하게 만들 수 있다.
>- 사슬에 들어가는 객체를 바꾸거나 순서를 바꿈으로써 역할을 동적으로 추가하거나 제거할 수 있다.

>[!fail] 책임 연쇄 패턴의 단점
>- 요청이 반드시 수행된다는 보장이 없다. 사슬 끝까지 갔는데도 처리되지 않을 수 있다. (이런 특성이 장점이 될 수도 있다.)
>- 실행 시 과정을 살펴보거나 디버깅하기가 힘들어진다는 단점이 있다.
