---
sidebar_position: 3
---

# 组合模式
**组合模式**允许开发者将对象组合成树状结构以表示**部分-整体**层次结构。组合能让客户端统一对待单个对象和对象组合。

:::example

最常见的组合模式例子莫过于**文件-文件夹系统**。文件夹可以包含文件和其他文件夹，而文件夹本身也是一种文件。这种层次结构与组合模式完全吻合。

:::

## 结构

![组合模式示意图](https://refactoringguru.cn/images/patterns/diagrams/composite/structure-zh.png)

组合模式中，客户端仅直接与高层接口**组件**交互，而组件则可以是**叶节点**（单个对象）或**容器**（包含其他组件的对象）。组件接口定义了对于叶节点和容器的通用操作。

:::note
一个值得思考的点是**容器中的添加与删除操作是否应当在组件接口中定义**。

如果定义在接口中，那么所有组件都需要实现这两个方法，但对于叶节点来说，这两个方法是没有意义的。这会违反**接口隔离原则**，但同时也使得客户端可以完全统一对待叶节点和容器。

如果只在容器中定义这两个方法，那么客户端在需要对叶节点进行添加和删除操作时，就需要进行类型检查。这在一定程度上违反了**依赖倒置原则**，但同时也使得接口更加清晰。

:::

## 应用场景

- 当需要实现树状对象结构，且对于叶节点和容器有相同的操作时

## 优缺点
### 优点
- 利用多态和递归机制更方便地处理复杂树结构。
- **开闭原则**：无需更改现有代码，你就可以在应用中添加新元素，使其成为对象树的一部分。

### 缺点
- 当组件功能差异较大时，强行统一接口可能会适得其反

## 代码示例

下面的代码示例展示了组合模式的实现。`Graphic` 是一个组件接口，定义了简单对象（叶节点）和复杂对象（容器）的通用操作。`Dot` 是一个叶节点类，代表一个简单的图形。`CompositeGraphic` 是一个容器类，可以包含其他 `Graphic` 对象（包括 `Dot` 和其他 `CompositeGraphic`）。客户端代码可以通过 `Graphic` 接口统一处理这些对象，而无需关心它们是简单对象还是组合对象。

```python livecodes console=full
# [x] Pattern: Composite
# To treat a group of objects the same way as a single instance of the object

# Why we use it
# Sometimes some interface might return a single object or a group of objects
# We want to not care about if it is an object or a container of objects

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

# --- Component Interface ---
class Graphic(ABC):
    """
    The base Component class declares common operations for both simple and
    complex objects of a composition.
    """
    @abstractmethod
    def render(self) -> str:
        """
        The base Component may implement some default behavior or leave it to
        concrete classes.
        """
        pass

    def add(self, graphic: Graphic) -> None:
        """
        A component can add or remove other components from its list of children.
        """
        raise NotImplementedError("This method is not supported by this component.")

    def remove(self, graphic: Graphic) -> None:
        raise NotImplementedError("This method is not supported by this component.")

# --- Leaf ---
class Dot(Graphic):
    """
    The Leaf class represents the end objects of a composition. A leaf can't
    have any children.
    """
    def __init__(self, x: int, y: int):
        self._x = x
        self._y = y

    def render(self) -> str:
        return f"Dot at ({self._x}, {self._y})"

# --- Composite ---
class CompositeGraphic(Graphic):
    """
    The Composite class represents the complex components that may have
    children. Usually, the Composite objects delegate the actual work to their
    children and then "sum-up" the result.
    """
    def __init__(self) -> None:
        self._children: List[Graphic] = []

    def add(self, graphic: Graphic) -> None:
        self._children.append(graphic)

    def remove(self, graphic: Graphic) -> None:
        self._children.remove(graphic)

    def render(self) -> str:
        results = []
        for child in self._children:
            results.append(child.render())
        return f"Composite([\n  " + ",\n  ".join(results) + "\n])"

# --- Client Code ---
def main() -> None:
    """
    The client code works with all of the components via the base interface.
    """
    # Create a complex graphic composed of other graphics
    all_graphics = CompositeGraphic()
    all_graphics.add(Dot(1, 2))
    all_graphics.add(Dot(3, 4))

    # Create another composite graphic
    group = CompositeGraphic()
    group.add(Dot(5, 6))
    group.add(Dot(7, 8))

    # Add the second group to the first one
    all_graphics.add(group)

    print("Rendering the entire graphic structure:")
    print(all_graphics.render())

if __name__ == '__main__':
    main()
```