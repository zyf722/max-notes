---
sidebar_position: 4
---

# 中介者模式
**中介者模式**通过引入一个中介对象来封装同级组件之间的交互，从而减少对象之间的直接依赖关系，降低耦合度，提高系统的可维护性。

## 结构

![中介者模式示意图](https://refactoringguru.cn/images/patterns/diagrams/mediator/structure.png)

中介者模式中，**中介者**对象负责协调下级组件在同级间的交互。中介者对象通常会维护一个组件列表，用于存储所有需要协调的组件。

当**组件**需要与其他组件通信时，它会向中介者对象发送请求，中介者对象会根据请求的内容选择合适的组件进行响应。中介者对象可以根据需要将请求转发给其他组件，也可以将请求广播给所有组件。

消息的发送者不知道最终会由谁来处理自己的请求，接收者也不知道最初是谁发出了请求。

## 应用场景

- 希望消除同级对象间的直接引用，降低耦合度时
- 希望解耦业务逻辑，编写更易复用的组件代码时

## 优缺点
### 优点
- **单一职责原则**：将多个组件间的交流抽取到同一位置，使其更易于理解和维护。
- **开闭原则**：可以为组件更换中介者对象，而不需要修改组件代码。

### 缺点
- 中介者可能与过多组件通信，导致其内部负责过多功能，内聚性降低，成为“上帝对象”。

## 代码示例

下面以一个现实街区的例子展示了一个简单的中介者模式的实现。在这个示例中，`Resident`类代表了街区的居民（组件），`StreetOffice`类代表了街区办公室（中介者），`CallEvent`和`TransferEvent`类代表了居民之间的通信事件。

```python livecodes console=full
# [x] Pattern: Mediator
# Mediator pattern provides a way to encapsulate the interaction between objects

# Why we use it
# Decouples the components from each other, making them easier to maintain and reuse

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict


@dataclass
class Event(ABC):
    pass


@dataclass
class CallEvent(Event):
    message: str


@dataclass
class TransferEvent(Event):
    amount: int
    target_name: str


@dataclass
class Mediator(ABC):
    @abstractmethod
    def notify(self, sender: str, event: Event):
        pass


@dataclass
class Resident:
    name: str
    balance: int
    mediator: Mediator

    def call(self, message: str):
        self.mediator.notify(self.name, CallEvent(message))

    def transfer(self, amount: int, resident_name: str):
        self.mediator.notify(self.name, TransferEvent(amount, resident_name))


@dataclass
class StreetOffice(Mediator):
    residents: Dict[str, Resident]

    def __init__(self):
        self.residents = {}

    def register_resident(self, resident: Resident):
        if resident.name in self.residents:
            raise ValueError(f"Resident {resident.name} already exists")

        if resident.mediator is not self:
            raise ValueError("Resident's mediator is not the same as the street office")

        self.residents[resident.name] = resident

    def notify(self, sender: str, event: Event):
        if isinstance(event, CallEvent):
            print(f"{sender} calls: {event.message}")
        elif isinstance(event, TransferEvent):
            print(f"{sender} transfers {event.amount} to {event.target_name}")
            self.residents[sender].balance -= event.amount
            self.residents[event.target_name].balance += event.amount


def main():
    street_office = StreetOffice()
    alice = Resident("Alice", 100, street_office)
    bob = Resident("Bob", 50, street_office)
    street_office.register_resident(alice)
    street_office.register_resident(bob)

    alice.call("Hello, Bob")
    alice.transfer(20, "Bob")
    print(f"Alice's balance: {alice.balance}")
    print(f"Bob's balance: {bob.balance}")


if __name__ == "__main__":
    main()
```