---
sidebar_position: 3
---

# 迭代器模式
**迭代器模式**提供了一种方法以顺序访问一个聚合对象（Collections）中的各个元素，而不需要暴露该对象的内部表示。迭代器模式将迭代逻辑封装在一个独立的迭代器对象中，使得客户端可以独立于聚合对象遍历聚合对象中的元素。

## 结构

![迭代器模式示意图](https://refactoringguru.cn/images/patterns/diagrams/iterator/structure.png)

迭代器模式将容器和迭代方式分离，使得容器可以专注于存储数据，而迭代器可以专注于遍历数据。

迭代器模式的核心是迭代器接口，该接口定义了遍历容器的方法（获取下一个元素、判断是否还有元素等）。具体的迭代器类实现了迭代器接口，负责实现遍历容器的逻辑。

迭代器的生命周期管理由容器类负责，容器类负责创建迭代器对象，并在迭代结束后销毁迭代器对象。在特殊情况下，容器类也应当**允许客户端传入自定义的迭代器对象**。

## 应用场景

- 希望对客户端隐藏容器内部的数据结构，同时提供一种统一的遍历接口时
- 希望同种遍历逻辑可以适用于多种类似的容器时

## 优缺点
### 优点
- **单一职责原则**：将容器的遍历逻辑与容器本身分离，使得容器可以专注于存储数据。
- **开闭原则**：可以在不修改已有容器代码的情况下通过创建新的迭代器类来实现新的遍历逻辑。
- 可以存在多个迭代器对象，允许并行遍历容器。

### 缺点
- 由于迭代器模式引入了迭代器对象，可能会增加程序的复杂度和内存开销，影响迭代效率。

## 代码示例

下面以二叉树的中序遍历为例，展示了一个简单的迭代器模式的实现。

`Tree` 是一个聚合类（或集合），它包含一个树形结构。`InOrderIterator` 是一个具体的迭代器，它实现了遍历 `Tree` 的特定算法（中序遍历）。

关键在于，`Tree` 类实现了 `__iter__` 方法，这使得它成为了一个**可迭代对象**。当客户端代码（例如 `for` 循环）需要遍历 `Tree` 时，它会调用 `__iter__` 方法来获取一个 `InOrderIterator` 的实例。这个迭代器对象维护着遍历的状态（例如，使用一个栈来辅助遍历），并实现了 `__next__` 方法来逐个返回树中的节点。

这种方式将遍历的复杂逻辑从 `Tree` 类中分离出来，使得客户端可以像遍历一个简单的列表一样遍历一个复杂的树结构，而无需关心其内部实现。

:::info

值得注意的是，Python 内置对 [迭代器](https://docs.python.org/zh-cn/3.9/glossary.html#term-iterator) 有良好的支持，凡是实现了魔术方法 `__iter__` 和 `__next__` 的对象都视作实现了迭代器协议，可以当做迭代器使用。

如果我们在下面的代码中为 `Tree` 类实现 `__iter__`（内部返回 `TreeIterator` 对象），那么我们就可以直接使用 `for node in tree` 来遍历树中的所有节点，使得代码更加符合语义和可读。

:::

:::note

如果需要限制树中的节点都为同一类型的值，可以使用 `TypeVar` 和 `Generic` 来实现泛型。

:::

```python livecodes console=full
# [x] Pattern: Iterator
# Iterator pattern provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation

# Why we use it
# Decouples the client from the collection, allowing the client to traverse the collection without knowing its internal structure

from __future__ import annotations
from collections.abc import Iterable, Iterator
from dataclasses import dataclass
from typing import Any, Generic, List, Optional, TypeVar

T = TypeVar("T")

@dataclass
class TreeNode(Generic[T]):
    """A node in a binary tree."""
    value: T
    left: Optional[TreeNode[T]] = None
    right: Optional[TreeNode[T]] = None

    def __str__(self) -> str:
        return f"Node({self.value})"

class InOrderIterator(Iterator[TreeNode[T]]):
    """
    Concrete Iterator for in-order traversal of a binary tree.
    This implements Python's iterator protocol.
    """
    def __init__(self, root: Optional[TreeNode[T]]):
        self._stack: List[TreeNode[T]] = []
        self._current: Optional[TreeNode[T]] = root
        # Initially, push all left children to the stack
        self._push_left_children(self._current)

    def _push_left_children(self, node: Optional[TreeNode[T]]) -> None:
        while node:
            self._stack.append(node)
            node = node.left

    def __next__(self) -> TreeNode[T]:
        if not self._stack:
            raise StopIteration
        
        node = self._stack.pop()
        
        if node.right:
            self._push_left_children(node.right)
            
        return node

@dataclass
class Tree(Iterable[TreeNode[T]]):
    """
    The Aggregate (or Collection) class. It has a method to create an iterator.
    By implementing __iter__, it becomes compatible with Python's for-in loops.
    """
    root: Optional[TreeNode[T]]

    def __iter__(self) -> InOrderIterator[T]:
        """Creates and returns an in-order iterator for the tree."""
        return InOrderIterator(self.root)

def main() -> None:
    """Client code demonstrating the Iterator pattern."""
    # Construct a sample binary tree:
    #        1
    #       / \
    #      2   3
    #     / \ / \
    #    4  5 6  7
    root = TreeNode(
        1,
        TreeNode(2, TreeNode(4), TreeNode(5)),
        TreeNode(3, TreeNode(6), TreeNode(7)),
    )
    tree = Tree(root)

    print("Iterating through the tree using the custom in-order iterator:")
    # The Tree object is iterable, so we can use it in a for loop.
    # This implicitly calls tree.__iter__() to get the iterator.
    for node in tree:
        print(node)

    print("\nDemonstrating that multiple iterators can exist independently:")
    iterator1 = iter(tree)
    iterator2 = iter(tree)

    print(f"Iterator 1, first element: {next(iterator1)}")
    print(f"Iterator 2, first element: {next(iterator2)}")
    print(f"Iterator 1, second element: {next(iterator1)}")
    print(f"Iterator 2, second element: {next(iterator2)}")

if __name__ == "__main__":
    main()
```