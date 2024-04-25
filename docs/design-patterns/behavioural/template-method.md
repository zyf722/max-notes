---
sidebar_position: 9
---

# 模板方法模式
**模板方法模式**定义了一个操作中的算法的骨架，将一些步骤延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下重新定义算法的某些步骤。

:::example
最典型的场景是*几段绝大多数部分都相同的逻辑*。

复制代码显然不是一个好的做法。模板方法模式可以将这些相同的部分提取到一个父类中，子类只需要实现不同的部分即可。
:::

## 结构

![模板方法模式示意图](https://refactoringguru.cn/images/patterns/diagrams/template-method/structure.png)

模板方法将一段复杂逻辑的执行过程分为**多个步骤**，其中有些步骤是**固定的**，有些步骤是**可变的**。逻辑的共用部分（或默认实现）被放在一个父类中，而逻辑的可变部分被放在子类中。

:::info
这听起来与 [策略模式](./strategy.md) 有些相似，但有以下区别：
- 模板方法基于**继承**机制，允许通过扩展子类中的部分内容来改变部分算法。它在**类**层次上运作，因此它是**静态**的。
- 策略模式基于**组合**机制，允许通过对相应行为提供不同的策略来改变对象的部分行为。它在**对象**层次上运作，因此允许在**运行时**切换行为。
:::

## 应用场景

- 当只希望扩展某个特定算法步骤而非整个算法或其结构时
- 当多个类的算法除一些细微不同之外几乎完全一样时

## 优缺点
### 优点
- 实现代码重用，避免重复代码
- **开闭原则**：只要算法整体结构不变，逻辑子类可以通过重写父类的方法来实现自己的逻辑，而无需改变父类的代码

### 缺点
- **里氏替换原则**：逻辑子类重写父类的方法以绕开某些步骤或扩展步骤时可能会导致子类无法重现父类的行为
- 步骤与重写次数增多后难以维护

## 代码示例

下面的示例以做作业为例展示了模板方法模式的实现。在这个示例中，`Homework`类代表了作业，`MathHomework`和`PEHomework`类代表了具体的作业。具体的作业类通过重写父类的方法来实现自己的逻辑。

```python
# [x] Pattern: Template Method
# Template method pattern defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure

# Why we use it
# Allows subclasses to redefine certain steps of an algorithm without changing the algorithm's structure

from abc import ABC
from dataclasses import dataclass
from typing import List


@dataclass
class Homework(ABC):
    name: str
    questions: List[str]

    def write_down_name(self):
        print(f"Name: {self.name}")

    def answer(self, verb: str = "Answering"):
        for question in self.questions:
            print(f"{verb} {question}")

    def finish(self):
        print("Homework is finished")

    def do_homework(self):
        self.write_down_name()
        self.answer()
        self.finish()


@dataclass
class MathHomework(Homework):
    def answer(self):
        print("Solving math")
        super().answer("Solving")


@dataclass
class PEHomework(Homework):
    def answer(self):
        super().answer("Doing")

    def finish(self):
        print("Drinking water after exercise")
        super().finish()


def main():
    NAME = "Bob"
    math_homework = MathHomework(NAME, ["1+1", "2+2"])
    pe_homework = PEHomework(NAME, ["Running", "Jumping"])

    math_homework.do_homework()
    pe_homework.do_homework()


if __name__ == "__main__":
    main()
```