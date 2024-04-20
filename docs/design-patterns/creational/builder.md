---
sidebar_position: 3
---

# 建造者（生成器）模式
**建造者模式**是用于解决构造函数参数过多的问题。它将一个复杂对象的构建过程与其表示分离，使得同样的构建过程可以创建不同的表示。

通过一个建造者（Builder）类，客户端可以指定要构建的对象类型，以及对象的各个部分。然后，建造者类会根据客户端的指定构建对象。

:::example

这有点像买汉堡。你走进一家快餐店，告诉服务员你想要一个汉堡。服务员会问你想要什么配料，比如生菜、番茄、黄瓜、芝士等。然后，服务员会将这些配料放在一起，制作一个汉堡。

显然，一次性把所有的需求告诉服务员会让你的点单过于冗长；因此，一般来说，你会先告诉服务员你想要什么类型的汉堡，然后再**一步步地**告诉他你想要什么配料。

:::

## 结构

![建造者示意图](https://refactoringguru.cn/images/patterns/diagrams/builder/structure.png?id=fe9e23559923ea0657aa5fe75efef333)

建造者模式包括以下几个部分：
- 产品（Product）：产品是最终构建的对象。它通常包含多个部分，这些部分可以是简单的对象，也可以是复杂的对象。
- 建造者（Builder）：建造者是一个接口，它定义了一系列构建产品的方法。这些方法通常设置某个属性的值并返回 `self`，以便可以函数式地调用它们。
- 具体建造者（Concrete Builder）：具体建造者是实现建造者接口的类。它负责构建产品的各个部分。
- 主管（Director）：主管是一个类，它负责指导建造者构建产品。主管类通常包含一个构建方法，该方法接受一个建造者对象作为参数，并使用该建造者对象构建产品。主管类不是采取建造者模式所必须的，在建造过程并不复杂时客户端可以直接调用建造者对象的方法。

## 应用场景

- 当某个产品类具有较多的属性，为了避免构造函数参数过多时
- 当产品的构造步骤中某些步骤需要延迟或跳过时

## 优缺点
### 优点
- 允许分步创建对象，暂缓创建步骤或递归运行创建步骤
- 不同创建步骤间分离，修改造成的影响较小
- **单一职责原则。** 复杂构造代码从产品的业务逻辑中分离出来

### 缺点
- 引入新的类，增加代码复杂度

## 代码示例
下面展示了一个没有主管类的建造者模式的实现，其中 `DoorBuilder` 类负责构建 `Door` 对象。

```python
# [x] Pattern: Builder
# To prevent constructor pollution, we use a builder class to create an object
# This will enable you to write functional-programming-style code

# Why we use it
# When you need to give object creation more flexibility, and you want to seperate the construction of a complex object from its representation
from abc import abstractmethod
from dataclasses import field
from enum import Enum


class DoorColor(Enum):
    RED = 1
    BLUE = 2
    GREEN = 3

class DoorBuilder:
    @abstractmethod
    def set_width(self, width: int) -> 'DoorBuilder':
        self.width = width
        return self

    @abstractmethod
    def set_height(self, height: int) -> 'DoorBuilder':
        self.height = height
        return self

    @abstractmethod
    def set_color(self, color: DoorColor) -> 'DoorBuilder':
        self.color = color
        return self

    @abstractmethod
    def set_window(self, window: bool) -> 'DoorBuilder':
        self.window = window
        return self

    @abstractmethod
    def set_handle(self, handle: bool) -> 'DoorBuilder':
        self.handle = handle
        return self

    @abstractmethod
    def build(self) -> 'Door':
        return Door(self)

class Door:
    width: int
    height: int

    color: DoorColor = field(default=DoorColor.RED)
    window: bool = field(default=False)
    handle: bool = field(default=False)

    def __init__(self, builder: DoorBuilder):
        self.width = builder.width
        self.height = builder.height
        self.color = builder.color
        self.window = builder.window
        self.handle = builder.handle
    
    def __str__(self):
        return f'Door: width={self.width}, height={self.height}, color={self.color}, window={self.window}, handle={self.handle}'

def main():
    door = DoorBuilder()
        .set_width(100)
        .set_height(200)
        .set_color(DoorColor.BLUE)
        .set_window(True)
        .set_handle(True)
        .build()
    print(door)
    

if __name__ == '__main__':
    main()
```