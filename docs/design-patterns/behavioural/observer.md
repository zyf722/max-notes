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

下面通过一个简单的新闻订阅系统展示了观察者模式的实现。在这个示例中，`NewsPress`类代表了发布者，`NewsReader`类代表了订阅者。

```python
# [x] Pattern: Subscriber
# Subscriber pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically

# Why we use it
# Allows an object to notify multiple objects when its state changes

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, List


@dataclass
class Publisher(ABC):
    observers: List["Subscriber"]

    def __init__(self):
        self.observers = []

    def add_observer(self, observer: "Subscriber"):
        self.observers.append(observer)

    def remove_observer(self, observer: "Subscriber"):
        self.observers.remove(observer)

    def notify_observers(self, data: Any):
        for observer in self.observers:
            observer.update(data)


@dataclass
class Subscriber(ABC):
    @abstractmethod
    def update(self, data: Any):
        pass


@dataclass
class NewsPress(Publisher):
    def __init__(self):
        self.observers = []


@dataclass
class NewsReader(Subscriber):
    name: str

    def update(self, data: Any):
        print(f"{self.name} reads: {data}")


def main():
    news_press = NewsPress()
    reader1 = NewsReader("Alice")
    reader2 = NewsReader("Bob")
    news_press.add_observer(reader1)
    news_press.add_observer(reader2)

    news_press.notify_observers("Breaking news: The sun is shining")

    news_press.remove_observer(reader1)

    news_press.notify_observers("Breaking news: It's raining")


if __name__ == "__main__":
    main()
```