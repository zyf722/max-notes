---
sidebar_position: 6
---

# 享元模式
**享元模式**允许在对象之间共享相同的状态，从而减少内存占用。享元模式的核心思想是将对象的状态分为内部状态和外部状态，其中内部状态是可以共享的，而外部状态是不可共享的。

:::note
简而言之，**享元模式**就是将多个对象间共享的状态提取出来并封装到一个新的对象中，而原始对象则包含对这个新对象的引用，从而实现状态复用。
:::

## 结构

![享元模式示意图](https://refactoringguru.cn/images/patterns/diagrams/flyweight/structure.png)

享元模式中，`FlyweightFactory` 用于创建和管理享元对象，通过维护一个享元对象的缓存池来实现创建、维护和共享。`Flyweight` 是享元对象的接口，维护内部状态；`Context` 是上下文，代表内部状态和外部状态的组合。

:::example
如果要类比的话，枚举类型就是享元模式的一种实现。枚举类型类似于提前定义了一系列状态对象，而枚举类型本身则是享元工厂，通过枚举值来获取对应的状态对象。
:::

:::note
对享元对象的操作可以定义在享元对象内部，也可以定义在上下文中。
:::

## 应用场景

- 仅当对象的多个实例之间存在共享状态时

## 优缺点
### 优点
- 可以节省大量内存

### 缺点
- 引入了共享状态，可能会导致并发安全问题
- 牺牲执行速度来换取内存
- 代码变得不直观

## 代码示例

下面的代码示例展示了一个使用享元模式的 Python 示例。在这个例子中，我们要在森林里画很多树。每棵树都有一些**内部状态**（`name`, `color`, `texture`，这些是可以共享的）和**外部状态**（`x`, `y` 坐标，每棵树都不同）。

`TreeType` 类是享元对象，它存储了树的内部状态。`TreeFactory` 是享元工厂，它确保具有相同内部状态的 `TreeType` 对象只被创建一次并被共享。`Tree` 类是上下文对象，它包含了外部状态（坐标）以及对一个 `TreeType` 享元对象的引用。

客户端代码（`Forest`）通过工厂获取享元对象来创建树，从而大大减少了内存占用，因为许多树可以共享同一个 `TreeType` 对象。

```python livecodes console=full
# [x] Pattern: Flyweight
# To share common state between multiple objects

# Why we use it
# When we want to share common state between multiple objects

from typing import Dict, List, Tuple

# --- Flyweight ---
class TreeType:
    """
    The Flyweight stores a common portion of the state (intrinsic state) that
    belongs to multiple real business entities. The Flyweight accepts the rest of
    the state (extrinsic state, unique for each entity) via its method's
    parameters.
    """
    def __init__(self, name: str, color: str, texture: str):
        self._name = name
        self._color = color
        self._texture = texture

    def draw(self, canvas: List[str], x: int, y: int) -> None:
        print(f"Drawing a '{self._name}' tree with color '{self._color}' at ({x}, {y})")
        # In a real app, this would draw on a canvas object.
        # For this example, we'll just print.

# --- Flyweight Factory ---
class TreeFactory:
    """
    The Flyweight Factory creates and manages the Flyweight objects. It ensures
    that flyweights are shared correctly. When the client requests a flyweight,
    the factory either returns an existing instance or creates a new one, if it
    doesn't exist yet.
    """
    _tree_types: Dict[str, TreeType] = {}

    @staticmethod
    def get_tree_type(name: str, color: str, texture: str) -> TreeType:
        key = f"{name}_{color}_{texture}"
        if key not in TreeFactory._tree_types:
            print(f"TreeFactory: Can't find a flyweight for key '{key}', creating new one.")
            TreeFactory._tree_types[key] = TreeType(name, color, texture)
        else:
            print(f"TreeFactory: Reusing existing flyweight for key '{key}'.")
        return TreeFactory._tree_types[key]

# --- Context ---
class Tree:
    """
    The Context class contains the extrinsic state, unique across all original
    objects. When a context is paired with one of the Flyweight objects, it
    represents the full state of the original object.
    """
    def __init__(self, x: int, y: int, type: TreeType):
        self._x = x
        self._y = y
        self._type = type

    def draw(self, canvas: List[str]) -> None:
        self._type.draw(canvas, self._x, self._y)

# --- Client Code ---
class Forest:
    """
    The client code usually creates a bunch of pre-populated flyweights in the
    initialization stage of the application.
    """
    def __init__(self) -> None:
        self._trees: List[Tree] = []

    def plant_tree(self, x: int, y: int, name: str, color: str, texture: str) -> None:
        tree_type = TreeFactory.get_tree_type(name, color, texture)
        tree = Tree(x, y, tree_type)
        self._trees.append(tree)

    def draw(self, canvas: List[str]) -> None:
        for tree in self._trees:
            tree.draw(canvas)

def main() -> None:
    """Main execution function."""
    forest = Forest()
    
    print("Planting some trees...")
    forest.plant_tree(10, 20, "Oak", "Green", "Rough")
    forest.plant_tree(30, 50, "Pine", "Dark Green", "Needles")
    forest.plant_tree(60, 80, "Oak", "Green", "Rough") # This should reuse the flyweight
    forest.plant_tree(90, 10, "Birch", "White", "Smooth")
    
    print("\nDrawing the forest:")
    canvas: List[str] = [] # A mock canvas
    forest.draw(canvas)

if __name__ == "__main__":
    main()
```