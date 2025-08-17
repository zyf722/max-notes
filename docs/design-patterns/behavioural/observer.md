---
sidebar_position: 6
---

# 观察者模式
**观察者模式**定义了一种一对多的订阅关系，当一个对象的状态发生变化时，所有订阅它的对象都会得到通知。

## 结构

![观察者模式示意图](https://refactoringguru.cn/images/patterns/diagrams/observer/structure.png)

观察者模式中，**发布者**（Publisher）对象维护了一个订阅者列表，并提供了订阅、退订和通知订阅者的方法。发布者对象在特定事件发生时会通知所有订阅者对象。**具体订阅者**对象通过实现**订阅者**（Subscriber）接口来接收通知。

:::note
事实上，也可以将业务代码与发布者解耦，使得发布者仅负责通知订阅者，而不关心具体的业务逻辑。这样可以使得发布者对象更加通用，更易于复用。
:::

:::info
不难注意到观察者模式和 [中介者模式](./mediator.md) 的相似之处。两者都是用于解耦组件之间的通信，但存在以下不同：
- 中介者的主要目标是**消除一系列系统组件之间的相互依赖**。观察者的目标是在对象之间建立**动态的单向连接**， 使得部分对象可作为其他对象的附属发挥作用。
- 中介者模式可以基于观察者模式实现，但是也可采用其他方式来实现。
- 中介者常常是中心化的，而观察者模式中的发布者可以是分布式、去中心化的。
:::

## 应用场景

- 当一个对象状态的改变需要动态改变其他对象时

## 优缺点
### 优点
- **开闭原则**：你无需修改发布者代码就能引入新的订阅者类。
- 在运行时建立对象之间的动态联系。

### 缺点
- 观察者模式不保证通知的顺序。

## 代码示例

下面通过一个简单的新闻订阅系统展示了观察者模式的实现。

`NewsAgency` 是**发布者**（也叫主题或可观察者），它维护一个订阅者列表，并有一个 `_state` 属性来存储最新的新闻。当 `publish_news` 方法被调用时，它的状态会改变，然后它会调用 `notify` 方法来通知所有已注册的**观察者**。

`Observer` 是一个接口，定义了所有具体观察者必须实现的 `update` 方法。`NewsReader` 是一个具体的观察者，它实现了 `update` 方法，以便在收到发布者的通知时做出反应（在这里是打印新闻）。

客户端代码创建了发布者和多个观察者，并将观察者附加到发布者上。当发布者发布新消息时，所有附加的观察者都会自动收到通知并更新自己的状态，而发布者和观察者之间没有紧密的耦合关系。

```python livecodes console=full
# [x] Pattern: Observer
# Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically

# Why we use it
# Allows an object to notify multiple objects when its state changes

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

# --- Subject (Publisher) ---
class Subject(ABC):
    """
    The Subject interface declares a set of methods for managing subscribers.
    """
    @abstractmethod
    def attach(self, observer: Observer) -> None:
        """Attach an observer to the subject."""
        pass

    @abstractmethod
    def detach(self, observer: Observer) -> None:
        """Detach an observer from the subject."""
        pass

    @abstractmethod
    def notify(self) -> None:
        """Notify all observers about an event."""
        pass

class NewsAgency(Subject):
    """
    The Concrete Subject owns some important state and notifies observers when
    the state changes.
    """
    _state: str | None = None
    _observers: List[Observer] = []

    def attach(self, observer: Observer) -> None:
        print("NewsAgency: Attached an observer.")
        self._observers.append(observer)

    def detach(self, observer: Observer) -> None:
        print("NewsAgency: Detached an observer.")
        self._observers.remove(observer)

    def notify(self) -> None:
        """Trigger an update in each subscriber."""
        print("NewsAgency: Notifying observers...")
        for observer in self._observers:
            observer.update(self)

    def publish_news(self, news: str) -> None:
        """
        A business logic method that changes the state and notifies observers.
        """
        print(f"\nNewsAgency: Publishing news: '{news}'")
        self._state = news
        self.notify()

    @property
    def state(self) -> str | None:
        return self._state

# --- Observer (Subscriber) ---
class Observer(ABC):
    """

    The Observer interface declares the update method, used by subjects.
    """
    @abstractmethod
    def update(self, subject: Subject) -> None:
        """Receive update from subject."""
        pass

class NewsReader(Observer):
    """
    Concrete Observers react to the updates issued by the Subject they had been
    attached to.
    """
    def __init__(self, name: str):
        self._name = name

    def update(self, subject: Subject) -> None:
        if isinstance(subject, NewsAgency) and subject.state is not None:
            print(f"{self._name} received news: '{subject.state}'")

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Observer pattern."""
    # The client code.
    agency = NewsAgency()

    reader1 = NewsReader("Alice")
    reader2 = NewsReader("Bob")

    agency.attach(reader1)
    agency.attach(reader2)

    agency.publish_news("Python 3.12 is out!")
    agency.publish_news("New design patterns article available.")

    agency.detach(reader1)

    agency.publish_news("Copilot now supports voice commands.")

if __name__ == "__main__":
    main()
```