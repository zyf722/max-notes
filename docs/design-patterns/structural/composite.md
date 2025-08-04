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

下面是一个使用组合模式的 Python 示例，其中有一个 `FileObject` 抽象类，`File` 和 `Directory` 类分别实现了该抽象类。`FileSizeCalculator` 类接受一个 `FileObject` 对象，计算其大小。

```python livecodes console=full
# [x] Pattern: Composite
# To treat a group of objects the same way as a single instance of the object

# Why we use it
# Sometimes some interface might return a single object or a group of objects
# We want to not care about if it is an object or a container of objects

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List



@dataclass
class FileObject(ABC):
    name: str
    
    @property
    @abstractmethod
    def size(self):
        pass


@dataclass
class File(FileObject):
    _size: int
    
    @property
    def size(self):
        return self._size

@dataclass
class Directory(FileObject):
    files: List[FileObject]

    @property
    def size(self):
        return sum([f.size for f in self.files])

@dataclass
class FileSizeCalculator:
    file: FileObject

    def calculate(self) -> int:
        return self.file.size

def main():
    file1 = File("file1", 100)
    file2 = File("file2", 200)
    file3 = File("file3", 300)

    directory = Directory("directory", [file1, file2, file3])

    file_size_calculator = FileSizeCalculator(directory)
    print(file_size_calculator.calculate())

if __name__ == '__main__':
    main()
```