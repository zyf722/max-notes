---
sidebar_position: 1
---

# 适配器模式
**适配器模式**是对不兼容对象的包装，以便将其接口转换为客户端所期望的接口。适配器允许已有的类与其他类一起工作，而不需要修改其源代码。

## 结构
适配器模式通常可通过**组合**或**继承**来实现。

### 组合实现（对象适配器）

![适配器模式组合实现示意图](https://refactoringguru.cn/images/patterns/diagrams/adapter/structure-object-adapter.png)

在组合模式中，适配器包含一个适配对象，然后通过调用适配对象的方法来实现目标接口。

### 继承实现（类适配器）

![适配器模式继承实现示意图](https://refactoringguru.cn/images/patterns/diagrams/adapter/structure-class-adapter.png)

在继承模式中，适配器同时继承了适配类和目标接口，然后通过重写目标接口的方法并在其中调用适配类的方法来实现目标接口。

:::tip
由于使用了多重继承，类适配器模式在一些语言中可能无法实现。
:::

## 应用场景

- 当你希望将某个类的接口转换为客户端所期望的接口时
- 当希望为一系列具有继承关系的类扩展方法，却不想为每个类都添加扩展的方法时

## 优缺点
### 优点
- 避免创建者和具体产品之间的紧密耦合。
- **单一职责原则**。将接口或数据转换代码从程序主要业务逻辑中分离。
- **开闭原则**。只要客户端接口不发生变化，可以随意更改适配器以实现扩展。

### 缺点
- 额外的类和对象会增加代码复杂度。

## 代码示例

下面的代码示例中，`RoundHole` 类（客户端）希望使用 `RoundPeg` 接口的对象。但现在我们有一个 `SquarePeg` 类（适配者），它的接口与 `RoundPeg` 不兼容。

为了让 `SquarePeg` 能够适配 `RoundHole`，我们创建了一个 `SquarePegAdapter`。这个适配器包装了 `SquarePeg` 对象，并实现了 `RoundPeg` 接口，使得客户端代码（`RoundHole`）可以透明地使用它。

```python livecodes console=full
# [x] Pattern: Adapter
# To fit an object to an interface

# Why we use it
# When we want to use an existing class, and its interface does not match the one we need
# We use adapter to wrap the existing class and provide the interface we need

from abc import ABC, abstractmethod

# --- Target Interface ---
class RoundPeg(ABC):
    """The Target interface, which the client code expects."""
    @abstractmethod
    def get_radius(self) -> float:
        pass

# --- Concrete Target ---
class RoundHole:
    """The client class that works with objects that implement the Target interface."""
    def __init__(self, radius: float):
        self._radius = radius

    def get_radius(self) -> float:
        return self._radius

    def fits(self, peg: RoundPeg) -> bool:
        """Checks if a round peg fits into this round hole."""
        return self.get_radius() >= peg.get_radius()

# --- Adaptee ---
class SquarePeg:
    """The Adaptee contains some useful behavior, but its interface is incompatible
    with the existing client code. The Adaptee needs some adaptation before the
    client code can use it."""
    def __init__(self, width: float):
        self._width = width

    def get_width(self) -> float:
        return self._width

# --- Adapter ---
class SquarePegAdapter(RoundPeg):
    """
    The Adapter makes the Adaptee's interface compatible with the Target's
    interface via composition.
    """
    def __init__(self, peg: SquarePeg):
        self._peg = peg

    def get_radius(self) -> float:
        """
        The Adapter calculates a radius that would allow the square peg to fit
        into a round hole. The calculation is based on the diagonal of the square.
        """
        return self._peg.get_width() * (2**0.5) / 2

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Adapter pattern."""
    # Create a round hole and a round peg.
    hole = RoundHole(5)
    rpeg = type('RoundPegImpl', (RoundPeg,), {'get_radius': lambda self: 5.0})()

    print(f"Round peg with radius {rpeg.get_radius()} fits into round hole with radius {hole.get_radius()}: {hole.fits(rpeg)}")

    # Create a square peg.
    small_sqpeg = SquarePeg(2)
    large_sqpeg = SquarePeg(20)
    # hole.fits(small_sqpeg)  # This would be a compile-time error in a statically typed language.

    # Adapt the square pegs to fit into the round hole.
    small_sqpeg_adapter = SquarePegAdapter(small_sqpeg)
    large_sqpeg_adapter = SquarePegAdapter(large_sqpeg)

    print(f"Small square peg with width {small_sqpeg.get_width()} fits into round hole with radius {hole.get_radius()}: {hole.fits(small_sqpeg_adapter)}")
    print(f"Large square peg with width {large_sqpeg.get_width()} fits into round hole with radius {hole.get_radius()}: {hole.fits(large_sqpeg_adapter)}")

if __name__ == '__main__':
    main()
```