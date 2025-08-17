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

下面的示例展示了一个简单的策略模式的实现。

`Sorter` 是**上下文**，它需要对一个列表进行排序，但它自己不实现排序逻辑。相反，它持有一个对 `SortStrategy` **策略**接口的引用。

`SortStrategy` 是一个抽象基类，定义了所有具体排序算法必须实现的 `sort` 方法。`BubbleSortStrategy` 和 `QuickSortStrategy` 是**具体的策略**，它们分别实现了冒泡排序和快速排序的算法。

客户端代码根据需要创建不同的策略对象（例如 `BubbleSortStrategy`），并将其传递给 `Sorter` 上下文。当 `Sorter` 的 `perform_sort` 方法被调用时，它会委托给当前设置的策略对象来完成实际的排序工作。这种设计使得算法（策略）可以独立于使用它的客户端（上下文）进行变化和替换。

```python livecodes console=full
# [x] Pattern: Strategy
# Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable

# Why we use it
# Allows an object to change its behavior at runtime

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

# --- Strategy Interface ---
class SortStrategy(ABC):
    """
    The Strategy interface declares operations common to all supported versions
    of some algorithm. The Context uses this interface to call the algorithm

    defined by Concrete Strategies.
    """
    @abstractmethod
    def sort(self, data: List[int]) -> List[int]:
        pass

# --- Concrete Strategies ---
class BubbleSortStrategy(SortStrategy):
    """Concrete Strategy for Bubble Sort."""
    def sort(self, data: List[int]) -> List[int]:
        print("Sorting using Bubble Sort")
        # A simple (and inefficient) implementation of bubble sort
        n = len(data)
        sorted_data = data[:]
        for i in range(n):
            for j in range(0, n - i - 1):
                if sorted_data[j] > sorted_data[j + 1]:
                    sorted_data[j], sorted_data[j + 1] = sorted_data[j + 1], sorted_data[j]
        return sorted_data

class QuickSortStrategy(SortStrategy):
    """Concrete Strategy for Quick Sort."""
    def sort(self, data: List[int]) -> List[int]:
        print("Sorting using Quick Sort")
        # Using Python's built-in sorted() which is highly optimized (Timsort)
        # for simplicity, instead of a full quicksort implementation.
        return sorted(data)

# --- Context ---
class Sorter:
    """
    The Context defines the interface of interest to clients. It maintains a
    reference to one of the Strategy objects.
    """
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    @property
    def strategy(self) -> SortStrategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: SortStrategy) -> None:
        """Usually, the Context allows replacing a Strategy object at runtime."""
        self._strategy = strategy

    def perform_sort(self, data: List[int]) -> None:
        """The Context delegates some work to the Strategy object."""
        print("Context: Sorting data.")
        result = self._strategy.sort(data)
        print("Context: Sorted data:", ", ".join(map(str, result)))

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Strategy pattern."""
    data_to_sort = [5, 1, 4, 2, 8]

    # The client creates a specific strategy object and passes it to the context.
    print("Client: Strategy is set to normal sorting (Bubble Sort).")
    sorter = Sorter(BubbleSortStrategy())
    sorter.perform_sort(data_to_sort)

    print("\nClient: Strategy is set to reverse sorting (Quick Sort).")
    sorter.strategy = QuickSortStrategy()
    sorter.perform_sort(data_to_sort)

if __name__ == "__main__":
    main()
```