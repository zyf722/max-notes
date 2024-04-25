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

下面以二叉树的中序遍历为例，展示了一个简单的迭代器模式的实现。在这个示例中，`TreeNode`类代表了树的节点，`Tree`类代表了树，`TreeIterator`类代表了迭代器，`main`函数代表了客户端。

:::info

值得注意的是，Python 内置对 [迭代器](https://docs.python.org/zh-cn/3.9/glossary.html#term-iterator) 有良好的支持，凡是实现了魔术方法 `__iter__` 和 `__next__` 的对象都视作实现了迭代器协议，可以当做迭代器使用。

如果我们在下面的代码中为 `Tree` 类实现 `__iter__`（内部返回 `TreeIterator` 对象），那么我们就可以直接使用 `for node in tree` 来遍历树中的所有节点，使得代码更加符合语义和可读。

:::

:::note

如果需要限制树中的节点都为同一类型的值，可以使用 `TypeVar` 和 `Generic` 来实现泛型。

:::

```python
# [x] Pattern: Iterator
# Iterator pattern provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation

# Why we use it
# Decouples the client from the collection, allowing the client to traverse the collection without knowing its internal structure

from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class TreeNode:
    value: Any
    left: Optional["TreeNode"]
    right: Optional["TreeNode"]

    def __str__(self):
        return f"Node({self.value})"


@dataclass
class Tree:
    root: TreeNode

    # def __iter__(self):
    #     return TreeIterator(self)

@dataclass
class TreeIterator:
    """
    In-order traversal of a binary tree
    """

    tree: Tree
    stack: List[TreeNode]

    def __init__(self, tree: Tree):
        self.tree = tree
        self.stack = [self.tree.root]

    def __iter__(self):
        return self

    def __next__(self):
        if not self.stack:
            raise StopIteration

        node = self.stack.pop()
        if node.right:
            self.stack.append(node.right)
        if node.left:
            self.stack.append(node.left)

        return node


def main():
    root = TreeNode(
        1,
        TreeNode(2, TreeNode(4, None, None), TreeNode(5, None, None)),
        TreeNode(3, TreeNode(6, None, None), TreeNode(7, None, None)),
    )
    tree = Tree(root)

    iterator = TreeIterator(tree)
    for node in iterator:
        print(node)

    # for node in tree:
    #     print(node)


if __name__ == "__main__":
    main()
```