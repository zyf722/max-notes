---
sidebar_position: 5
---

# 备忘录模式
**备忘录模式**提供了一种方法，可以在**不暴露**对象内部状态的情况下捕获和恢复对象的状态。备忘录模式的关键是将对象的状态保存到备忘录对象中，以便在需要时恢复对象的状态。

## 结构

![备忘录模式示意图](https://refactoringguru.cn/images/patterns/diagrams/memento/solution-zh.png)

备忘录模式中，**备忘录**对象存储了**原发器**（Originator）对象的内部状态。客户端可以通过**负责人**（Caretaker）对象保存和恢复原发器对象的状态，负责人对象仅能通过受限的接口访问备忘录对象，确保无法修改备忘录对象的内容。

在实际实现中，备忘录模式分为**嵌套类实现**、**中间接口实现**和**严格封装实现**三种。

### 嵌套类实现

![备忘录模式嵌套类实现示意图](https://refactoringguru.cn/images/patterns/diagrams/memento/structure1.png)

嵌套类实现将备忘录类嵌套在原发器类中，使得备忘录类只能被原发器类访问，确保了备忘录对象的内容不会被修改。备忘录类通常是仅初始化一次后不再修改的**不可变对象**。

负责人的职责是确认何时和为何需要保存和恢复原发器的状态，但实际的备忘录对象的创建和恢复是由**原发器**类完成的。

### 中间接口实现

![备忘录模式中间接口实现示意图](https://refactoringguru.cn/images/patterns/diagrams/memento/structure2.png)

中间接口模式适用于不支持嵌套类的语言，将备忘录类和原发器类分离，强制负责人通过受限接口来访问备忘录对象。

原发器通过具体备忘录类提供的接口访问备忘录对象，仍然负责创建和恢复备忘录对象。这种方法的缺点是原发器对象对备忘录对象的访问可能会变得更加复杂，如果简单地将备忘录对象的属性设为公有，则可能存在安全问题。

### 严格封装实现

![备忘录模式严格封装实现示意图](https://refactoringguru.cn/images/patterns/diagrams/memento/structure3.png)

严格封装实现将**存储和恢复的职责分离**，将备忘录对象的创建（存储）交给原发器，而将备忘录对象的恢复交给备忘录自身。这样原发器和备忘录职责对等，允许存在多对原发器-备忘录对象组。

## 应用场景

- 当需要保存和恢复对象的状态，但不希望暴露对象内部状态时

## 优缺点
### 优点
- 允许在不破坏对象封装情况的前提下创建对象状态快照

### 缺点
- 备忘录对象存在内存开销，可能会影响程序性能
- 负责人必须完整跟踪原发器的生命周期以销毁弃用的备忘录
- 动态编程语言难以确保备忘录对象的不可变性

## 代码示例

下面的示例展示了一个简单的备忘录模式的实现。

`Editor` 是**原发器**，它拥有一个可能会随时间改变的内部状态（`_state`）。它提供了 `save()` 方法来创建一个包含当前状态的**备忘录**（`Memento`）对象，以及 `restore()` 方法来从备忘录中恢复状态。

`Memento` 类负责存储原发器的状态。关键在于，它对外部（除了原发器）只暴露有限的接口（如 `get_name()`），从而保护了内部状态的完整性，防止外部直接修改。

`History` 是**负责人**，它负责管理备忘录对象列表。它知道何时需要保存（`backup()`）和恢复（`undo()`）编辑器的状态，但它不直接访问备忘录的内部状态，只是持有和管理这些备忘录对象。

客户端代码通过与负责人交互来触发状态的保存和恢复，从而实现了对编辑器状态的快照和回滚功能，而没有破坏编辑器的封装性。

```python livecodes console=full
# [x] Pattern: Memento
# Memento pattern provides a way to capture and restore an object's internal state without exposing its internal structure

# Why we use it
# Allows an object to be restored to its previous state without revealing its internal structure

from __future__ import annotations
import random
import string
from typing import List

# --- Memento ---
class Memento:
    """
    The Memento interface provides a way to retrieve the memento's metadata,
    such as creation time or name. However, it doesn't expose the Originator's
    state.
    """
    def __init__(self, state: str) -> None:
        self._state = state
        self._date = "".join(random.choices(string.ascii_uppercase, k=8)) # Simulate a timestamp

    def get_state(self) -> str:
        """The Originator uses this method when restoring its state."""
        return self._state

    def get_name(self) -> str:
        """The Caretaker uses this method to display mementos."""
        return f"({self._date}) / ({self._state[:9]}...)"

# --- Originator ---
class Editor:
    """
    The Originator holds some important state that may change over time. It also
    defines a method for saving the state inside a memento and another method
    for restoring the state from it.
    """
    def __init__(self, state: str) -> None:
        self._state = state
        print(f"Editor: My initial state is: {self._state}")

    def do_something(self) -> None:
        """Originator's business logic may affect its internal state."""
        print("Editor: I'm doing something important.")
        self._state = self._generate_random_string(30)
        print(f"Editor: and my state has changed to: {self._state}")

    def _generate_random_string(self, length: int = 10) -> str:
        return "".join(random.choices(string.ascii_letters + string.digits, k=length))

    def save(self) -> Memento:
        """Saves the current state inside a memento."""
        return Memento(self._state)

    def restore(self, memento: Memento) -> None:
        """Restores the Originator's state from a memento object."""
        self._state = memento.get_state()
        print(f"Editor: My state has changed to: {self._state}")

# --- Caretaker ---
class History:
    """
    The Caretaker doesn't depend on the Concrete Memento class. Therefore, it
    doesn't have access to the originator's state, stored inside the memento.
    It works with all mementos via the base Memento interface.
    """
    def __init__(self, originator: Editor) -> None:
        self._mementos: List[Memento] = []
        self._originator = originator

    def backup(self) -> None:
        print("\nHistory: Saving Originator's state...")
        self._mementos.append(self._originator.save())

    def undo(self) -> None:
        if not self._mementos:
            print("History: No mementos to restore from.")
            return

        memento = self._mementos.pop()
        print(f"History: Restoring state to: {memento.get_name()}")
        try:
            self._originator.restore(memento)
        except Exception:
            self.undo()

    def show_history(self) -> None:
        print("\nHistory: Here's the list of mementos:")
        for memento in self._mementos:
            print(memento.get_name())

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Memento pattern."""
    editor = Editor("Super-duper-super-puper-super.")
    history = History(editor)

    history.backup()
    editor.do_something()

    history.backup()
    editor.do_something()

    history.backup()
    editor.do_something()

    history.show_history()

    print("\nClient: Now, let's rollback!\n")
    history.undo()

    print("\nClient: Once more!\n")
    history.undo()
    
    history.show_history()

if __name__ == "__main__":
    main()
```