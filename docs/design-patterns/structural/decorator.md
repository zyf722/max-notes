---
sidebar_position: 4
---

# 装饰器模式
**装饰器模式**允许你通过将对象放入包含行为的包装对象中来动态更改对象的行为（例如 prehooks 和 posthooks）。

:::info

熟悉 Python 的开发者可能会对 [*装饰器*](https://peps.python.org/pep-0318/#background) 这个词感到熟悉。装饰器为 Python 开发者提供了一种创建 [高阶函数](https://zh.wikipedia.org/wiki/%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0) 的方法，使得可以在不更改函数定义的情况下，动态地为函数添加包装。

装饰器模式正是这种思想在类层面的应用。通过将对象放入包含行为的包装对象中，我们可以动态地更改对象的行为，而不需要更改对象本身。

:::

## 结构

![装饰器模式示意图](https://refactoringguru.cn/images/patterns/diagrams/decorator/structure.png)

装饰器模式中，客户端与高层的**组件**接口交互，而具体的功能组件和装饰器则分别实现了该接口。功能组件为功能提供了实现，而装饰器则通过**组合**的方式接受功能组件作为成员变量，在实现的方法中调用功能组件的方法，并在其前后添加额外的行为。

如果装饰器接受的组件的类型为抽象的**组件**接口，那么还能实现**嵌套装饰器**，从而形成一个装饰器链。

## 应用场景

- 当希望在不修改对象本身的情况下，动态地添加功能时

## 优缺点
### 优点
- 可以用多个装饰封装对象来组合几种行为。
- **开闭原则**：无需创建新子类即可扩展对象的行为。
- **单一职责原则**：可以将实现了许多不同行为的一个大类拆分为多个较小的类。

### 缺点
- 当组成装饰器链（栈式结构）后，对非栈顶的装饰器的访问可能会变得困难

## 代码示例

下面使用 Python 实现了一个简单的装饰器模式示例，其中有一个 `Door` 抽象类，`FrontDoor` 类实现了该抽象类，`DoorAlarm` 类则通过**组合**接受 `Door` 对象，并在其 `open` 方法中添加了额外的行为。

```python livecodes console=full
# [x] Pattern: Decorator
# To add behavior to an object without affecting its class

# Why we use it
# When we want to add behavior to an object without changing its class

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Door(ABC):
    @abstractmethod
    def open(self):
        raise NotImplementedError


@dataclass
class FrontDoor(Door):
    def open(self):
        print("Opening front door")


@dataclass
class DoorAlarm(Door):
    door: Door

    def open(self):
        print("Door alarm activated")
        self.door.open()


def open_door(door: Door):
    door.open()


def main():
    front_door = FrontDoor()
    door_alarm = DoorAlarm(front_door)
    open_door(door_alarm)


if __name__ == "__main__":
    main()
```