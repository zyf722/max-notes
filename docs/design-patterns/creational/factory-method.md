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

下面的示例展示了一个简单的有关门的工厂方法。`DoorFactory` 是一个抽象的**创建者**，它定义了一个抽象的 `create_door` **工厂方法**来创建 `Door`（门）对象，并提供了一个 `deliver_door` 方法来定义交付门的通用流程。

`IronDoorFactory` 和 `WoodenDoorFactory` 是具体的创建者，它们分别实现了 `create_door` 方法，以创建特定类型的门（`IronDoor` 和 `WoodenDoor`）。

`Door` 是**产品**接口，`IronDoor` 和 `WoodenDoor` 是具体的产品。

客户端代码通过与 `DoorFactory` 交互来获取一个门对象，而无需关心具体是哪个工厂在生产，也无需知道具体创建了哪种类型的门。这使得添加新的门类型变得容易，而不会影响客户端代码。

```python livecodes console=full
# [x] Pattern: Factory method
# A class that delegates the creation of objects to its subclasses,
# allowing each subclass to decide which object to create.

# Why we use it
# When constructing a class that does not know the type of the objects it will create
# In other words, we use a universal method interface to create objects, but the specific implementation is left to the subclasses

from __future__ import annotations
from abc import ABC, abstractmethod

# --- Product Interface and Concrete Products ---

class Door(ABC):
    """
    The Product interface declares the operations that all concrete products must
    implement.
    """
    def __init__(self, width: int, height: int) -> None:
        self.width = width
        self.height = height

    def get_area(self) -> int:
        """A method that is common to all doors."""
        return self.width * self.height

    @abstractmethod
    def open(self) -> None:
        """A method that concrete doors must implement."""
        pass

class IronDoor(Door):
    """Concrete Product: An iron door."""
    def open(self) -> None:
        print("Opening the heavy iron door.")

class WoodenDoor(Door):
    """Concrete Product: A wooden door."""
    def open(self) -> None:
        print("Opening the light wooden door.")

# --- Creator (Factory) Interface and Concrete Creators ---

class DoorFactory(ABC):
    """
    The Creator class declares the factory method that is supposed to return an
    object of a Product class. The Creator's subclasses usually provide the
    implementation of this method.
    """
    @abstractmethod
    def create_door(self, width: int, height: int) -> Door:
        """The factory method."""
        pass

    def deliver_door(self, width: int, height: int) -> Door:
        """
        The Creator's primary responsibility is not creating products. Usually,
        it contains some core business logic that relies on Product objects,
        returned by the factory method. Subclasses can indirectly change that
        business logic by overriding the factory method and returning a
        different type of product from it.
        """
        print("A door is being delivered...")
        door = self.create_door(width, height)
        print("The door has been created and is being tested:")
        door.open()
        return door

class IronDoorFactory(DoorFactory):
    """
    Concrete Creators override the factory method in order to change the
    resulting product's type.
    """
    def create_door(self, width: int, height: int) -> IronDoor:
        print("Manufacturing an iron door.")
        return IronDoor(width, height)

class WoodenDoorFactory(DoorFactory):
    """
    Concrete Creators override the factory method in order to change the
    resulting product's type.
    """
    def create_door(self, width: int, height: int) -> WoodenDoor:
        print("Crafting a wooden door.")
        return WoodenDoor(width, height)

# --- Client Code ---

def client_code(factory: DoorFactory, width: int, height: int) -> None:
    """
    The client code works with an instance of a concrete creator, albeit through
    its base interface. As long as the client keeps working with the creator via
    the base interface, you can pass it any creator's subclass.
    """
    door = factory.deliver_door(width, height)
    print(f"Delivered a door with an area of {door.get_area()} square units.\n")

def main() -> None:
    """Main execution function."""
    print("App: Launched with the IronDoorFactory.")
    client_code(IronDoorFactory(), 100, 200)

    print("App: Launched with the WoodenDoorFactory.")
    client_code(WoodenDoorFactory(), 100, 200)

if __name__ == "__main__":
    main()
```