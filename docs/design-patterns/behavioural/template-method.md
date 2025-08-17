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

下面的示例以数据处理为例，展示了模板方法模式的实现。

`DataProcessor` 是一个抽象基类，它定义了一个名为 `process_data` 的**模板方法**。这个方法定义了数据处理算法的骨架（读取 -> 分析 ->呈现），它调用了一系列其他方法来完成这些步骤。

其中，`read_data` 和 `analyze_data` 是**抽象方法**，它们没有默认实现，必须由子类来提供具体的实现。`present_results` 是一个**钩子（hook）**，它有一个默认的实现，但子类可以选择性地覆盖它以提供不同的行为。

`TextFileProcessor` 和 `CSVFileProcessor` 是具体的子类。它们继承自 `DataProcessor` 并为抽象步骤提供了具体的实现。例如，`TextFileProcessor` 从文本文件读取和分析数据，而 `CSVFileProcessor` 则处理 CSV 文件，并覆盖了 `present_results` 钩子以提供特定的图表展示。

客户端代码通过调用 `process_data` 这个模板方法来启动整个流程，而无需关心具体的处理步骤是如何实现的。这使得算法的结构保持不变，同时允许子类灵活地定义算法的某些特定步骤。

```python livecodes console=full
# [x] Pattern: Template Method
# Template method pattern defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure

# Why we use it
# Allows subclasses to redefine certain steps of an algorithm without changing the algorithm's structure

from abc import ABC, abstractmethod

# --- Abstract Class (Template) ---
class DataProcessor(ABC):
    """
    The Abstract Class defines a template method that contains a skeleton of
    some algorithm, composed of calls to (usually) abstract primitive
    operations.
    """
    def process_data(self) -> None:
        """
        The template method defines the skeleton of an algorithm.
        """
        self.read_data()
        self.analyze_data()
        self.present_results()

    # These operations have to be implemented in subclasses.
    @abstractmethod
    def read_data(self) -> None:
        pass

    @abstractmethod
    def analyze_data(self) -> None:
        pass

    # This is a "hook." Subclasses may override them, but it's not mandatory
    # since the hook already has default (but empty) implementation.
    def present_results(self) -> None:
        print("Presenting results in a standard format.")

# --- Concrete Classes ---
class TextFileProcessor(DataProcessor):
    """
    Concrete classes have to implement all abstract operations of the base
    class. They can also override some operations with a default implementation.
    """
    def read_data(self) -> None:
        print("Reading data from a text file.")

    def analyze_data(self) -> None:
        print("Analyzing text data.")

class CSVFileProcessor(DataProcessor):
    """Another concrete class for processing CSV files."""
    def read_data(self) -> None:
        print("Reading data from a CSV file.")

    def analyze_data(self) -> None:
        print("Analyzing CSV data.")

    def present_results(self) -> None:
        """Overrides the hook to provide a specific presentation format."""
        print("Presenting results in a CSV-specific chart.")

# --- Client Code ---
def client_code(processor: DataProcessor) -> None:
    """
    The client code calls the template method to execute the algorithm. Client
    code does not have to know the concrete class of an object it works with,
    as long as it works with objects through the interface of their base class.
    """
    processor.process_data()

def main() -> None:
    """Main execution function."""
    print("Same client code can work with different subclasses:")
    client_code(TextFileProcessor())
    print("-" * 20)
    print("Same client code can work with different subclasses:")
    client_code(CSVFileProcessor())

if __name__ == "__main__":
    main()
```