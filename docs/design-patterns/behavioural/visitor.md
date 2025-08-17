---
sidebar_position: 10
---

# 访问者模式
**访问者模式**定义了一种在不改变对象结构的前提下，对对象中的元素进行操作的方法。访问者模式将数据结构和数据操作分离，使得数据结构可以在不改变的情况下增加新的操作。

:::info
可以使用访问者对整个 [组合模式](../structural/composite.md) 树执行操作。

可以同时使用访问者和 [迭代器模式](./iterator.md) 来遍历复杂数据结构并对其中的元素执行所需操作，即使这些元素所属的类完全不同。
:::

## 结构

![访问者模式示意图](https://refactoringguru.cn/images/patterns/diagrams/visitor/structure-zh.png)

访问者模式将判断类对应的行为交给了被访问的对象（**元素**，Element）。元素对象调用访问者对象（**访问者**，Visitor）中与自己类型对应的访问方法，而在访问方法中又反过来调用元素对象的方法以实现具体逻辑。

## 应用场景

- 当需要对一个复杂对象结构（例如对象树）中的所有元素执行某些操作，而这些元素所需要进行的操作又不完全一致时
- 当某个行为仅在类层次结构中的一些类中有意义， 而在其他类中没有意义时

## 优缺点
### 优点
- **单一职责原则**：访问者模式将访问行为从元素类中分离出来，使得元素类只需关注自身的业务逻辑
- **开闭原则**：可以引入在不同类对象上执行的新行为，且无需对这些类做出修改。

### 缺点
- 每当元素增加一个子类时，必须更新所有访问者类

## 代码示例

下面结合了图形（Shape）的例子展示了访问者模式的实现。

`Shape` 是一个**元素**接口，它定义了一个 `accept` 方法，该方法接受一个**访问者**对象作为参数。`Dot`, `Circle`, 和 `Rectangle` 是具体的元素类，它们实现了 `accept` 方法。

`Visitor` 是访问者接口，它为每种具体的元素类型（`Dot`, `Circle`, `Rectangle`）都声明了一个 `visit` 方法。`XMLExportVisitor` 和 `DrawVisitor` 是具体的访问者类，它们为不同的操作（导出为 XML 和绘图）提供了具体的实现。

关键的交互在于**双重分派**：
1.  客户端代码调用一个元素（如 `Circle`）的 `accept` 方法，并将一个访问者（如 `XMLExportVisitor`）传递给它。
2.  `Circle` 的 `accept` 方法会立即调用访问者的 `visit_circle` 方法，并将自己（`self`）作为参数传回。

这样，访问者就能知道它正在访问的是一个 `Circle` 对象，并执行相应的操作。这种模式允许我们在不修改 `Shape` 类层次结构的情况下，添加新的操作（只需创建一个新的访问者类），从而将数据结构（`Shape`）与作用于其上的操作（`Visitor`）解耦。

:::note
这里为 `visit_file` 和 `visit_directory` 扩展参数 `parent`，以便在访问文件时能够知道其父目录，从而通过参数构造出的隐式栈实现打印文件绝对路径。
:::

```python livecodes console=full
# [x] Pattern: Visitor
# Visitor pattern represents an operation to be performed on the elements of an object structure

# Why we use it
# Allows for one or more operations to be applied to a set of objects at runtime without modifying the objects themselves

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

# --- Element Interface and Concrete Elements ---
class Shape(ABC):
    """
    The Element interface declares an `accept` method that should take the base
    visitor interface as an argument.
    """
    @abstractmethod
    def accept(self, visitor: Visitor) -> None:
        pass

class Dot(Shape):
    """Concrete Element: Dot."""
    def accept(self, visitor: Visitor) -> None:
        visitor.visit_dot(self)

    def draw(self) -> None:
        print("Drawing a dot.")

class Circle(Shape):
    """Concrete Element: Circle."""
    def accept(self, visitor: Visitor) -> None:
        visitor.visit_circle(self)

    def draw(self) -> None:
        print("Drawing a circle.")

class Rectangle(Shape):
    """Concrete Element: Rectangle."""
    def accept(self, visitor: Visitor) -> None:
        visitor.visit_rectangle(self)

    def draw(self) -> None:
        print("Drawing a rectangle.")

# --- Visitor Interface and Concrete Visitors ---
class Visitor(ABC):
    """
    The Visitor Interface declares a set of visiting methods that correspond to
    element classes. The signature of a visiting method allows the visitor to
    identify the exact class of the element that it's dealing with.
    """
    @abstractmethod
    def visit_dot(self, dot: Dot) -> None:
        pass

    @abstractmethod
    def visit_circle(self, circle: Circle) -> None:
        pass

    @abstractmethod
    def visit_rectangle(self, rectangle: Rectangle) -> None:
        pass

class XMLExportVisitor(Visitor):
    """
    Concrete Visitors implement several versions of the same algorithm, which
    can work with all concrete element classes.
    """
    def visit_dot(self, dot: Dot) -> None:
        print("Exporting Dot to XML.")

    def visit_circle(self, circle: Circle) -> None:
        print("Exporting Circle to XML.")

    def visit_rectangle(self, rectangle: Rectangle) -> None:
        print("Exporting Rectangle to XML.")

class DrawVisitor(Visitor):
    """Another Concrete Visitor for drawing shapes."""
    def visit_dot(self, dot: Dot) -> None:
        dot.draw()

    def visit_circle(self, circle: Circle) -> None:
        circle.draw()

    def visit_rectangle(self, rectangle: Rectangle) -> None:
        rectangle.draw()

# --- Client Code ---
def client_code(elements: List[Shape], visitor: Visitor) -> None:
    """

    The client code can run visitor operations over any set of elements without
    figuring out their concrete classes. The accept operation directs a call to
    the appropriate operation in the visitor object.
    """
    for element in elements:
        element.accept(visitor)

def main() -> None:
    """Main execution function."""
    shapes: List[Shape] = [Dot(), Circle(), Rectangle()]

    print("Exporting shapes to XML:")
    export_visitor = XMLExportVisitor()
    client_code(shapes, export_visitor)

    print("\nDrawing shapes:")
    draw_visitor = DrawVisitor()
    client_code(shapes, draw_visitor)

if __name__ == "__main__":
    main()
```