---
sidebar_position: 7
---

# 状态模式
**状态模式**通过将对象所属的状态抽象成类，并利用继承和多态性质来实现状态的切换，从而使得对象在不同状态下能够动态地表现出不同的行为。

## 结构

![状态模式示意图](https://refactoringguru.cn/images/patterns/diagrams/state/structure-zh.png)

状态模式中，**上下文**（Context）对象为客户端提供了一个接口，用于在不同状态下调用不同的行为。**状态**（State）接口定义了所有具体状态类的通用方法。**具体状态**（Concrete State）类实现了状态接口，并定义了在该状态下的行为。

对客户端而言，调用上下文对象的方法就像调用一个普通的对象一样，但得益于多态性质，上下文对象能够根据状态的不同表现出不同的行为。

## 应用场景

- 当对象需要根据自身当前状态进行不同行为，且状态的数量非常多、与状态相关的代码会频繁变更时
- 当对象的行为取决于其状态，且需要在运行时动态改变状态时

## 优缺点
### 优点
- **单一职责原则**：状态与状态对应的行为被封装在同一类中，而与状态无关的行为被封装在其他类中。
- **开闭原则**：可以在不修改上下文的情况下扩展状态与对应的行为。
- 消除大量条件语句。

### 缺点
- 在状态、行为较少时没有必要使用状态模式。

## 代码示例

下面通过一个自动售货机的例子来展示状态模式的实现。

`VendingMachine` 是**上下文**对象，它维护着当前的状态（`_state`）、商品库存和投入的硬币数量。它将所有与状态相关的操作（如 `insert_coin`, `select_item`）委托给当前的状态对象来处理。

`State` 是一个抽象基类，定义了所有具体状态必须实现的接口。`NoCoinState`, `HasCoinState`, `SoldState`, 和 `SoldOutState` 是**具体的状态类**。每个类都实现了在特定状态下，当用户执行操作时应该发生的行为。

关键在于，**状态的转换是由状态对象自身管理的**。例如，在 `NoCoinState` 下，当用户投入硬币（`insert_coin`）时，状态会切换到 `HasCoinState`。在 `HasCoinState` 下，当用户选择商品（`select_item`）且硬币足够时，状态会切换到 `SoldState`。

这种设计将每种状态的行为和转换逻辑封装在各自的类中，使得 `VendingMachine` 类本身不包含任何复杂的 `if/else` 逻辑来判断当前状态，从而使代码更加清晰和易于维护。

:::note
值得注意的是，这里的 `change_state` 方法实际上是切换状态和状态的工厂方法的结合。这种方式可以避免在客户端代码中直接创建状态对象，从而降低了耦合度。

同时，该方法的类型标注中使用了 `Literal` 类型用于指定参数的取值范围。由此可以编写更加类型安全的代码。在更高版本的 Python 中，还可以对类型使用 * 运算符解包，以避免重复书写。

此外，为实现此机制还声明了一个字符串到状态类型的映射，以便在 `change_state` 方法中根据字符串创建对应的状态对象。该字典被声明为 `ClassVar` 以避免 `dataclass` 将其视为实例变量。
:::

```python livecodes console=full
# [x] Pattern: State
# State pattern allows an object to alter its behavior when its internal state changes

# Why we use it
# Allows an object to change its behavior when its internal state changes

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

# --- Context ---
class VendingMachine:
    """
    The Context defines the interface of interest to clients. It also maintains
    a reference to an instance of a State subclass, which represents the current
    state of the Context.
    """
    def __init__(self, items: List[str], price: int):
        self._items = items
        self._price = price
        self._state: State = NoCoinState(self)
        self._coins = 0
        print(f"Vending machine initialized with {len(items)} items at price {price}.")

    def change_state(self, state: State) -> None:
        """Allows changing the State object at runtime."""
        print(f"VendingMachine: Changing state to {state.__class__.__name__}")
        self._state = state

    # --- State-dependent actions delegated to the current state object ---
    def insert_coin(self) -> None:
        self._state.insert_coin()

    def select_item(self) -> None:
        self._state.select_item()

    def dispense_item(self) -> None:
        self._state.dispense_item()

    # --- Helper methods ---
    def add_coin(self) -> None:
        self._coins += 1
        print(f"Coin inserted. Total coins: {self._coins}")

    def has_enough_coins(self) -> bool:
        return self._coins >= self._price

    def has_items(self) -> bool:
        return len(self._items) > 0

    def release_item(self) -> None:
        if self.has_items():
            item = self._items.pop(0)
            self._coins -= self._price
            print(f"Dispensing {item}. Remaining coins: {self._coins}")
        else:
            print("Error: No items left to dispense.")

# --- State Interface and Concrete States ---
class State(ABC):
    """
    The base State class declares methods that all Concrete State should
    implement and also provides a backreference to the Context object,
    associated with the State.
    """
    def __init__(self, context: VendingMachine):
        self._context = context

    @abstractmethod
    def insert_coin(self) -> None:
        pass

    @abstractmethod
    def select_item(self) -> None:
        pass

    @abstractmethod
    def dispense_item(self) -> None:
        pass

class NoCoinState(State):
    """Concrete State: No coins have been inserted."""
    def insert_coin(self) -> None:
        self._context.add_coin()
        self._context.change_state(HasCoinState(self._context))

    def select_item(self) -> None:
        print("Please insert a coin first.")

    def dispense_item(self) -> None:
        print("Cannot dispense. Please insert a coin and select an item.")

class HasCoinState(State):
    """Concrete State: At least one coin has been inserted."""
    def insert_coin(self) -> None:
        self._context.add_coin()

    def select_item(self) -> None:
        if self._context.has_enough_coins():
            print("Item selected.")
            self._context.change_state(SoldState(self._context))
            self._context.dispense_item()
        else:
            print(f"Not enough coins. Please insert more. Price is {self._context._price}")

    def dispense_item(self) -> None:
        print("Please select an item first.")

class SoldState(State):
    """Concrete State: An item has been selected and is being dispensed."""
    def insert_coin(self) -> None:
        print("Please wait, item is being dispensed.")

    def select_item(self) -> None:
        print("Already dispensing an item.")

    def dispense_item(self) -> None:
        self._context.release_item()
        if not self._context.has_items():
            self._context.change_state(SoldOutState(self._context))
        elif self._context.has_enough_coins():
             self._context.change_state(HasCoinState(self._context))
        else:
            self._context.change_state(NoCoinState(self._context))

class SoldOutState(State):
    """Concrete State: The machine is out of items."""
    def insert_coin(self) -> None:
        print("Sorry, the machine is sold out.")

    def select_item(self) -> None:
        print("Sorry, the machine is sold out.")

    def dispense_item(self) -> None:
        print("Sorry, the machine is sold out.")

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the State pattern."""
    machine = VendingMachine(items=["Cola", "Chips"], price=2)

    print("\n--- Scenario 1: Successful purchase ---")
    machine.insert_coin()
    machine.insert_coin()
    machine.select_item()

    print("\n--- Scenario 2: Not enough money ---")
    machine.select_item() # Should fail
    machine.insert_coin()
    machine.select_item() # Should still fail
    machine.insert_coin()
    machine.select_item() # Should succeed

    print("\n--- Scenario 3: Sold out ---")
    machine.select_item() # Should fail, no items left

if __name__ == "__main__":
    main()
```