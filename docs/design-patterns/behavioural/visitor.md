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

下面结合了 [组合模式](../structural/composite.md) 的示例展示了访问者模式的实现。在这个示例中，`FileObject` 抽象类代表了文件对象，`File` 和 `Directory` 类分别实现了该抽象类。`FileVisitor` 类接受一个 `FileObject` 对象，访问其所有文件。

:::note
这里为 `visit_file` 和 `visit_directory` 扩展参数 `parent`，以便在访问文件时能够知道其父目录，从而通过参数构造出的隐式栈实现打印文件绝对路径。
:::

```python
# [x] Pattern: Visitor
# Visitor pattern represents an operation to be performed on the elements of an object structure

# Why we use it
# Allows for one or more operations to be applied to a set of objects at runtime without modifying the objects themselves


from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List


@dataclass
class FileObject(ABC):
    name: str

    @abstractmethod
    def accept(self, visitor: "FileVisitor", parent: str):
        pass


@dataclass
class File(FileObject):
    def accept(self, visitor: "FileVisitor", parent: str):
        visitor.visit_file(self, parent)


@dataclass
class Directory(FileObject):
    files: List[FileObject]

    def accept(self, visitor: "FileVisitor", parent: str):
        visitor.visit_directory(self, parent)


@dataclass
class FileVisitor:
    def visit_file(self, file: File, parent: str):
        print(f"Visiting file {parent}{file.name}")

    def visit_directory(self, directory: Directory, parent: str):
        current_path = parent + directory.name + "/"
        print(f"Visiting directory {current_path} with {len(directory.files)} files")
        for file in directory.files:
            file.accept(self, current_path)


def main():
    file1 = File("file.conf")
    file2 = File("text.txt")
    file3 = File("bin")
    dir1 = Directory("dir1", [file1, file2])
    root = Directory("", [file3, dir1])

    visitor = FileVisitor()
    root.accept(visitor, "")


if __name__ == "__main__":
    main()
```