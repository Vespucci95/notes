---
date: 2025-05-21
title: CHAPTER 11 - 객체 접근 제어하기 (프록시 패턴)
stage: sub
categories: DesignPattern
description: 헤드퍼스트 디자인 패턴 11장을 읽고 정리한 내용입니다.
thumbnail:
---
## 프록시 패턴

>  특정 객체로의 접근을 제어하는 대리인(특정 객체를 대변하는 객체)을 제공한다.

- 원격 프록시를 써서 원격 객체로의 접근을 제어할 수 있다.
- 가상 프록시를 써서 생성하기 힘든 자원으로의 접근을 제어할 수 있다.
- 보호 프록시를 써서 접근 권한이 필요한 자원으로의 접근을 제어할 수 있다.

## 모니터링 코드 만들기 + 기능 테스트

>[!quote] 주식회사 왕뽑기 CEO
>
>뽑기 기계의 상태를 조금 더 확실히 파악하고 싶습니다. 모든 뽑기 기계의 재고와 현재 상태를 알려주는 기능을 추가해 주시겠습니까?

```java
// 현재 위치를 알려주는 기능이 추가된 뽑기 기계
public class GumballMachine {
    private String location;
    private int count = 0;
    
    public GumballMachine(String location, int count) {
        this.location = location;
        this.count = count;
    }
    
    public String getLocation() {
        return this.location;
    }
    
    public int getCount() {
        return this.count;
    }
	// 기타 메소드
}
```

```java
// 기계의 위치, 재고, 현재 상태를 가져와 보고서를 출력해주는 클래스
public class GumballMonitor {
    private GumballMachine machine;
    
    public GumballMonitor(GumballMachine machine) {
        this.machine = machine;
    }
    
    public void report() {
        System.out.println("뽑는 기계 위치: " + this.machine.getLocation());
        System.out.println("현재 재고: " + this.machine.getCount() + " 개");
        System.out.println("현재 상태: " + this.machine.getState());
    }
}
```

```java
// 기능테스트
public class GumballMachineTestDrive {
    public static void main(String[] args) {
        int count = 0;
        
        GumballMachine machine = new GumballMachine("서울", count);
        GumballMonitor monitor = new GumballMonitor(machine);
        
        monitor.report();
    }
}
```

간단하게 `GumballMonitor` 를 구현하였다. 그런데 다시 다음과 같은 요구사항이 온다.

>[!quote] 주식회사 왕뽑기 CEO
>
>제가 제대로 이야기 못했네요. 저는 뽑기 기계를 원격으로 모니터링 하고싶어요.

## 원격 프록시의 역할

#원격프록시 는 원격 객체[^1]의 로컬 대변자[^2] 역할을 한다.

[^1]:  원격 객체 : 다른 주소 공간에서 돌아가고 있는 객체 (다른 자바 가상 머신의 힙에서 살고 있는 객체)
[^2]: 로컬 대변자 역할 : 어떤 메소드를 호출하면, 다른 원격 객체에게 그 메소드 호출을 전달해 주는 객체

자바에서는 원격 메소드 호출 ( #RMI : Remote Method Invocation ) 이 쓰인다.
RMI를 사용하면 원격 JVM에 있는 객체를 찾아 메소드를 호출할 수 있다.

RMI는 **클라이언트 보조 객체**(스텁:stub)와 **서비스 보조 객체**(스켈레톤:skeleton)를 만들어 준다. 또한, 원격 객체를 찾아서 접근할 때 쓸 수 있는 룩업(lookup) 서비스도 제공한다.

## GumballMachine 클래스를 원격 서비스로 바꾸기

원격 프록시를 쓸 수 있도록 코드를 바꿀 때 가장 먼저 할 일은 클라이언트로부터 전달된 원격 요청을 처리하도록 바꾸기이다.

```java
import java.rmi.*;
  
public interface GumballMachineRemote extends Remote {  
    public int getCount() throws RemoteException;  
    public String getLocation() throws RemoteException;  
    public State getState() throws RemoteException;  
}
```

State의 인터페이스는 아래와 같이 수정

```java
import java.io.*;  
  
public interface State extends Serializable {  
    public void insertQuarter();  
    public void ejectQuarter();  
    public void turnCrank();  
    public void dispense();  
}
```

```java
public class NoQuarterState implements State {
    private static final long serialVersionUID = 2L;
    transient GumballMachine gumballMachine; // transient 키워드가 추가 시 JVM에서 직렬화 하지 않는다.
    
    public NoQuarterState(GumballMachine gumballMachine) {
        this.gumballMachine = gumballMachine;
    }
    
    public void insertQuarter() {
        System.out.println("동전을 넣으셨습니다.");
        gumballMachine.setState(gumballMachine.getHasQuarterState());
    }
    
    public void ejectQuarter() {
        System.out.println("동전을 넣어주세요.");
    }
    
    public void turnCrank() {
        System.out.println("동전을 넣어주세요.");
    }
    
    public void dispense() {
        System.out.println("동전을 넣어주세요.");
    }
    
    public String toString() {
        return "동전 투입 대기중";
    }
}

// 다른 상태 클래스들 (HasQuarterState, SoldState, SoldOutState)도 비슷한 방식으로 구현
```

GumballMachine 클래스를 네트워크로 들어온 요청을 처리하는 서비스로 고쳐야한다. 아래와 같이 수정

```java
import java.rmi.*;
import java.rmi.server.*;

// 원격으로 접근 가능한 GumballMachine 구현
public class GumballMachine extends UnicastRemoteObject implements GumballMachineRemote {
    private static final long serialVersionUID = 2L;
    // 기타 인스턴스 변수
    
    public GumballMachine(String location, int numberGumballs) throws RemoteException {
	    // 생성자 코드
    }
	// 기타 메소드
}
```

## RMI 레지스트리 등록하기

클라이언트가 찾을 수 있게 뽑기 기계를 RMI 레지스트리에 등록한다.

```java
import java.rmi.*;
import java.rmi.registry.*;

public class GumballMachineTestDrive {
    public static void main(String[] args) {
        GumballMachineRemote gumballMachine = null;
        int count;
        
        if (args.length < 2) {
            System.out.println("GumballMachine <name> <inventory>");
            System.exit(1);
        }
        
        try {
            count = Integer.parseInt(args[1]);
            
            gumballMachine = new GumballMachine(args[0], count);
            Naming.rebind("//" + args[0] + "/gumballmachine", gumballMachine);
            
            System.out.println(gumballMachine);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## GumballMonitor 클라이언트 코드 고치기

```java
import java.rmi.*;

public class GumballMonitor {
    GumballMachineRemote machine;
    
    public GumballMonitor(GumballMachineRemote machine) {
        this.machine = machine;
    }
    
    public void report() {
        try {
            System.out.println("뽑기 기계 위치: " + machine.getLocation());
            System.out.println("현재 재고: " + machine.getCount() + " 개");
            System.out.println("현재 상태: " + machine.getState());
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
```

## 새로운 모니터링 기능 테스트

```java
import java.rmi.*;
import java.util.*;

public class GumballMonitorTestDrive {
    public static void main(String[] args) {
	    // 모니터링할 위치를 배열로 저장
        String[] locations = {"rmi://santafe.mightygumball.com/gumballmachine",
                             "rmi://boulder.mightygumball.com/gumballmachine",
                             "rmi://seattle.mightygumball.com/gumballmachine"};
        
        ArrayList<GumballMonitor> monitors = new ArrayList<GumballMonitor>();
        
        for (int i = 0; i < locations.length; i++) {
            try {
                GumballMachineRemote machine = (GumballMachineRemote) Naming.lookup(locations[i]);
                monitors.add(new GumballMonitor(machine));
                System.out.println(locations[i] + " 에 연결됨");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        System.out.println("\n모니터링 시작...\n");
        
        for (GumballMonitor monitor : monitors) {
            monitor.report();
            System.out.println();
        }
    }
}
```