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

下面的示例展示了一个简单的备忘录模式的实现。在这个示例中，`RandomGenerator`类代表了原发器，`RandomCaretaker`类代表了负责人，`main`函数代表了客户端。

```python
# [x] Pattern: Memento
# Memento pattern provides a way to capture and restore an object's internal state without exposing its internal structure

# Why we use it
# Allows an object to be restored to its previous state without revealing its internal structure

from dataclasses import dataclass
from random import randint
from typing import List


@dataclass
class RandomGenerator:
    current_number: int

    @dataclass
    class Memento:
        state: int

    def generate(self):
        self.current_number = randint(1, 100)
        return self.current_number

    def save(self):
        return RandomGenerator.Memento(self.current_number)

    def restore(self, memento: Memento):
        self.current_number = memento.state


@dataclass
class RandomCaretaker:
    originator: RandomGenerator
    mementos: List[RandomGenerator.Memento]

    def __init__(self, originator: RandomGenerator):
        self.originator = originator
        self.mementos = []

    def generate(self):
        num = self.originator.generate()
        self.mementos.append(self.originator.save())
        return num

    def restore(self):
        if len(self.mementos) == 0:
            return
        memento = self.mementos.pop()
        self.originator.restore(memento)


def main():
    originator = RandomGenerator(0)
    caretaker = RandomCaretaker(originator)

    for _ in range(10):
        num = caretaker.generate()
        print(f"Generated number: {num}")

    for _ in range(5):
        caretaker.restore()
        print(f"Restored number: {originator.current_number}")


if __name__ == "__main__":
    main()
```