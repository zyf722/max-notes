---
sidebar_position: 2
---

# 抽象工厂模式
**抽象工厂**将多个工厂方法组合在一起，以创建一系列相关或依赖对象。它保证了这一系列对象之间具有某种**关联性**。

## 结构

![抽象工厂示意图](https://refactoringguru.cn/images/patterns/diagrams/abstract-factory/structure.png)

相较于 [工厂方法模式](./factory-method.md)，抽象工厂模式提供了对**一组相关的产品**（属于同一个系列且在高层主题或概念上具有相关性）对应的工厂方法的封装。

## 应用场景

- 当有一系列相关的产品需要被创建，且这些产品都具有相应的变体时

## 优缺点
其优缺点基本上和 [工厂方法模式](./factory-method.md) 一致，同时还能够保证一组产品之间的关联性。

## 代码示例

下面的示例展示了一个抽象工厂模式的实现。这个模式用于创建一系列**相关的**产品，而无需指定其具体的类。

在这个例子中，我们有两种产品系列：木制系列（`WoodenDoor`, `Carpenter`）和铁制系列（`IronDoor`, `Welder`）。每种系列都包含一个门（`Door`）和一个安装工（`DoorFitter`）。

`DoorFactory` 是**抽象工厂**接口，它定义了创建 `Door` 和 `DoorFitter` 的方法。`WoodenDoorFactory` 和 `IronDoorFactory` 是**具体工厂**，它们分别实现了 `DoorFactory` 接口，用于创建相应系列的产品。例如，`WoodenDoorFactory` 会创建 `WoodenDoor` 和 `Carpenter`。

客户端代码通过 `DoorFactory` 接口与工厂进行交互。这样，客户端就可以使用任何具体工厂来创建产品，而无需关心产品的具体实现。这确保了创建出的产品（如门和安装工）是相互兼容的（例如，木匠安装木门），从而保证了产品家族的一致性。

```python livecodes console=full
# [x] Pattern: Abstract Factory
# A class that has multiple method that creates objects of another class
# The factory class has a pair of object types

# Why we use it
# When there are interrelated dependencies with not only one object

from __future__ import annotations
from abc import ABC, abstractmethod

# --- Abstract Products ---

class Door(ABC):
    """Abstract Product A: Door"""
    @abstractmethod
    def get_description(self) -> str:
        pass

class DoorFitter(ABC):
    """Abstract Product B: DoorFitter"""
    @abstractmethod
    def get_description(self) -> str:
        pass

    @abstractmethod
    def fit(self, door: Door) -> None:
        """The fitter fits a door."""
        pass

# --- Concrete Products of Variant 1 (Wooden) ---

class WoodenDoor(Door):
    """Concrete Product A1: Wooden Door"""
    def get_description(self) -> str:
        return "I am a wooden door."

class Carpenter(DoorFitter):
    """Concrete Product B1: Carpenter (fits wooden doors)"""
    def get_description(self) -> str:
        return "I am a carpenter."

    def fit(self, door: Door) -> None:
        print(f"The carpenter is fitting a {door.get_description().lower()}")

# --- Concrete Products of Variant 2 (Iron) ---

class IronDoor(Door):
    """Concrete Product A2: Iron Door"""
    def get_description(self) -> str:
        return "I am an iron door."

class Welder(DoorFitter):
    """Concrete Product B2: Welder (fits iron doors)"""
    def get_description(self) -> str:
        return "I am a welder."

    def fit(self, door: Door) -> None:
        print(f"The welder is fitting an {door.get_description().lower()}")

# --- Abstract Factory ---

class DoorFactory(ABC):
    """
    The Abstract Factory interface declares a set of methods for creating each of
    the abstract products.
    """
    @abstractmethod
    def create_door(self) -> Door:
        pass

    @abstractmethod
    def create_fitter(self) -> DoorFitter:
        pass

# --- Concrete Factories ---

class WoodenDoorFactory(DoorFactory):
    """
    Concrete Factory 1: Creates a family of wooden products.
    """
    def create_door(self) -> WoodenDoor:
        return WoodenDoor()

    def create_fitter(self) -> Carpenter:
        return Carpenter()

class IronDoorFactory(DoorFactory):
    """
    Concrete Factory 2: Creates a family of iron products.
    """
    def create_door(self) -> IronDoor:
        return IronDoor()

    def create_fitter(self) -> Welder:
        return Welder()

# --- Client Code ---

def client_code(factory: DoorFactory) -> None:
    """
    The client code works with factories and products only through abstract
    types: DoorFactory, Door, and DoorFitter. This lets you pass any factory or
    product subclass to the client code without breaking it.
    """
    door = factory.create_door()
    fitter = factory.create_fitter()

    print(f"Door: {door.get_description()}")
    print(f"Fitter: {fitter.get_description()}")
    fitter.fit(door)

def main() -> None:
    """Main execution function."""
    print("Client: Testing client code with the WoodenDoorFactory type:")
    client_code(WoodenDoorFactory())
    print("-" * 20)
    print("Client: Testing the same client code with the IronDoorFactory type:")
    client_code(IronDoorFactory())

if __name__ == '__main__':
    main()
```