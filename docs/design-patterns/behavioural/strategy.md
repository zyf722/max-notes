---
sidebar_position: 8
---

# 策略模式
**策略模式**定义了一系列算法，并将每个算法封装到一个类中，使得它们可以互相替换。策略模式让算法独立于使用它的客户端。

## 结构

![策略模式示意图](https://refactoringguru.cn/images/patterns/diagrams/strategy/structure.png)

策略模式将特定算法和业务代码分离，使得算法可以独立于客户端而变化。**上下文**（Context）对象包含一个指向**策略**（Strategy）接口的引用，客户端通过上下文对象调用策略接口的方法。**具体策略**（Concrete Strategy）类实现了策略接口，并定义了具体的算法。

:::info
[状态模式](./state.md) 可被视为策略模式的扩展。

两者都基于**组合**机制：它们都通过将部分工作委派给实际执行者对象来改变其在不同情景下的行为。

其主要区别如下：
- 策略使得这些对象相互之间**完全独立**，它们不知道其他对象的存在。
- 状态模式**没有限制**具体状态之间的依赖，且允许它们自行改变在不同情景下的状态。
:::

## 应用场景

- 当需要使用对象中各种不同的算法变体，并希望能在运行时切换算法时
- 当希望多个算法中包含大量相同部分时，可以通过策略模式将这些部分提取到一个共享的父类中
  - 参见 [模板方法模式](./template-method.md)

## 优缺点
### 优点
- **单一职责原则**：业务逻辑和算法实现被分离，使得代码更加清晰。
- **开闭原则**：可以在不修改上下文的情况下扩展算法。
- 可以在运行时切换对象内的算法。

### 缺点
- 对于静态或固定的算法没有必要使用策略模式。
- 选择策略的职责被转移到客户端，可能会导致客户端代码变得复杂。
- 在许多现代编程语言中可以通过一个**函数类型的容器**来实现类似的功能。

## 代码示例

下面的示例展示了一个简单的策略模式的实现。在这个示例中，`Strategy`类代表了策略接口，`TravelStrategy`类代表了具体的策略，`WalkStrategy`和`CarStrategy`类代表了具体的策略实现。

```python
# [x] Pattern: Strategy
# Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable

# Why we use it
# Allows an object to change its behavior at runtime

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, ClassVar, Dict, Tuple


@dataclass
class Strategy(ABC):
    @abstractmethod
    def execute(self, data: Any) -> Any:
        pass


@dataclass
class TravelStrategy(Strategy, ABC):
    name: ClassVar[str]

    @abstractmethod
    def execute(self, length: int) -> Tuple[int, int]:
        """
        Args:
            length: The length of the travel
        Returns:
            Tuple[int, int]:
                The time it takes to travel the given length,
                How much it costs to travel the given length
        """
        pass


@dataclass
class WalkStrategy(TravelStrategy):
    name = "Walk"

    def execute(self, length: int) -> Tuple[int, int]:
        return (length // 5, 0)


@dataclass
class CarStrategy(TravelStrategy):
    name = "Car"

    def execute(self, length: int) -> Tuple[int, int]:
        return (length // 60, length // 10)


def main():
    strategies: Dict[str, TravelStrategy] = {
        WalkStrategy.name: WalkStrategy(),
        CarStrategy.name: CarStrategy(),
    }

    for name, strategy in strategies.items():
        time, cost = strategy.execute(100)
        print(f"{name} takes {time} hours and costs {cost} dollars to travel 100 miles")


if __name__ == "__main__":
    main()
```