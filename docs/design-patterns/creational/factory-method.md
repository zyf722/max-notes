---
sidebar_position: 1
---

# 工厂方法模式
**工厂方法**在一个特定的创建者（Creator）父类中提供了一个创建对象的接口，但是允许子类决定实例化的类。这种模式的目的是将实例化的过程推迟到子类中，以便在提供相同接口的情况下，允许子类选择实例化的类。

工厂方法将**创建产品的代码**与**实际使用产品的代码**分离。

## 结构

![工厂方法示意图](https://refactoringguru.cn/images/patterns/diagrams/factory-method/structure.png)

工厂方法通常包括以下二者：
- **产品**（Product）：产品是工厂方法创建的对象的接口或抽象基类。
- **创建者**（Creator）：创建者是一个类，其中包含一个工厂方法，该方法返回一个产品对象。创建者的子类可以实现工厂方法以更改产品的类型。

而二者又拥有相应的实现，分别代表具体产品和具体的创建者。

## 应用场景

- 当构建一个类的对象却不知道对象的实际类型时
- 当创建对象时需要特定的逻辑，而该逻辑需要多态性时
- 当产品可能出现继承关系，而创建者希望通过同一接口创建所有产品时
  - 例如 UI 库（创建者）和按钮（产品）之间的关系

## 优缺点
### 优点
- 避免创建者和具体产品之间的紧密耦合。
- **单一职责原则**。创建产品的逻辑被分离到一个单独的类中，这使得代码更容易维护。
- **开闭原则**。对扩展开放，对修改关闭。可以在不更改现有代码的情况下引入新的产品类型。

### 缺点
- 可能会导致代码中的类数量激增，因为每个产品都需要一个具体的创建者类。这可能会使代码更难理解。

## 代码示例

下面的示例展示了一个简单的有关门的工厂方法。门有两种类型：铁门和木门。`DoorFactory` 是一个创建者，它有一个工厂方法 `make_door`，该方法返回一个门对象。`IronDoorFactory` 和 `WoodenDoorFactory` 是具体的创建者，它们分别返回铁门和木门。

用户可以通过调用 `deliver_door` 方法来获得一个门对象（无论是哪个工厂），并且可以使用该对象的继承方法 `area` 和多态方法 `open`。

```python
# [x] Pattern: Factory method
# A class that delegates the creation of objects to its subclasses,
# allowing each subclass to decide which object to create.

# Why we use it
# When constructing a class that does not know the type of the objects it will create
# In other words, we use a universal method interface to create objects, but the specific implementation is left to the subclasses

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Door(ABC):
    width: int
    height: int

    def area(self):
        return self.width * self.height

    @abstractmethod
    def _cut_material(self):
        raise NotImplementedError

    @abstractmethod
    def _install_components(self):
        raise NotImplementedError

    @abstractmethod
    def open(self):
        raise NotImplementedError


@dataclass
class IronDoor(Door):
    def _cut_material(self):
        print("Cutting iron sheets")

    def _install_components(self):
        print("Installing iron lock")

    def open(self):
        print("Opening iron door")


@dataclass
class WoodenDoor(Door):
    def _cut_material(self):
        print("Cutting raw timber")

    def _install_components(self):
        print("Installing wooden handle")

    def open(self):
        print("Opening wooden door")


class DoorFactory(ABC):
    @abstractmethod
    def make_door(self, width: int, height: int) -> Door:
        raise NotImplementedError

    def deliver_door(self, width: int, height: int) -> Door:
        print("Manufacturing door")
        door = self.make_door(width, height)
        print("Testing door")
        door.open()
        return door


class IronDoorFactory(DoorFactory):
    def make_door(self, width: int, height: int) -> IronDoor:
        door = IronDoor(width, height)
        door._cut_material()
        door._install_components()
        return door


class WoodenDoorFactory(DoorFactory):
    def make_door(self, width: int, height: int) -> WoodenDoor:
        door = WoodenDoor(width, height)
        door._cut_material()
        door._install_components()
        return door


def main():
    iron_factory = IronDoorFactory()
    iron_door = iron_factory.deliver_door(100, 200)
    print(f"Now we have an iron door with area {iron_door.area()}\n")
    iron_door.open()

    wooden_factory = WoodenDoorFactory()
    wooden_door = wooden_factory.deliver_door(100, 200)
    print(f"Now we have a wooden door with area {wooden_door.area()}")
    wooden_door.open()


if __name__ == "__main__":
    main()
```