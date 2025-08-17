---
sidebar_position: 4
---

# 原型模式
通过声明一个包含 `clone` 方法的接口，**原型模式**将创建对象拷贝（克隆）的职责委派给对象所属的类。

## 结构
依照实现，可以划分为简单实现和注册表实现两种。

### 简单实现

![原型模式简单实现示意图](https://refactoringguru.cn/images/patterns/diagrams/prototype/structure.png?id=088102c5e9785ff45debbbce86f4df81)

在简单实现中，通常会定义一个包含 `clone` 方法的抽象类或接口，以及具体的实现类。具体的实现类会实现 `clone` 方法，以便返回一个当前对象的拷贝。

`clone` 方法内部通常通过调用拷贝构造函数（以自身类对象为参数的构造函数）来实现创建副本对象；如果语言不支持函数重载，也可以通过一个特殊方法或是和 [工厂方法](./factory-method.md) 模式结合使用来实现。

:::warning[注意]
需要注意的是，如果具体的实现类还有子类，那么子类也需要实现 `clone` 方法，避免错误生成父类对象。
:::

### 注册表 / 缓存实现

![原型模式注册表 / 缓存实现示意图](https://refactoringguru.cn/images/patterns/diagrams/prototype/structure-prototype-cache.png?id=609c2af5d14ed55dcbb218a00f98e7d5)

在注册表实现中，会定义一个注册表类，用于存储原型对象。注册表类会提供一个方法，用于将特定的原型对象关联到固定的标识符上；此后，可以通过这个标识符来获取原型对象的拷贝。

由于存储了多个不同的原型对象，该实现又被称作缓存实现。

## 应用场景

- 希望复制某个对象，但不希望复制的过程受到对象的具体类的限制

## 优缺点
### 优点
- 克隆对象的同时而无需与它们所属的具体类相耦合
- 可以使用一系列预生成的、 各种类型的对象作为原型，避免多次调用初始化代码
- 可以用继承以外的方式来处理复杂对象的不同配置

### 缺点
- 克隆包含**循环引用**的复杂对象可能会非常麻烦

## 代码示例
以下代码展示了一个原型模式的实现。`Prototype` 是一个接口，定义了 `clone` 方法。`Door` 是一个具体原型类，它实现了 `clone` 方法来创建自身的副本。

这个例子特别强调了**浅拷贝**和**深拷贝**的区别：
- **浅拷贝** (`copy.copy`)：只复制对象本身，而不复制其内部的嵌套对象。因此，当修改克隆对象中嵌套对象（`Address`）的属性时，原始对象中的嵌套对象也会被修改，因为它们共享同一个 `Address` 实例。
- **深拷贝** (`copy.deepcopy`)：会递归地复制对象及其所有嵌套对象。因此，修改克隆对象的嵌套对象不会影响原始对象。

客户端代码通过调用 `clone` 方法来获取 `Door` 对象的副本，而无需关心其具体的创建过程。这使得创建新对象变得高效，特别是当对象初始化过程很复杂时。

```python livecodes console=full
# [x] Pattern: Prototype
# Create object based on an existing object through cloning

# Why we use it
# When you want to avoid the overhead of creating a new object in the standard way (e.g., using the new keyword), and you want to create a new object based on an existing object

from __future__ import annotations
import copy
from abc import ABC, abstractmethod
from dataclasses import dataclass

class Prototype(ABC):
    """The Prototype interface."""
    @abstractmethod
    def clone(self) -> Prototype:
        """Creates a clone of the object."""
        pass

@dataclass
class Address:
    """A simple class to be nested."""
    street: str
    city: str

@dataclass
class Door(Prototype):
    """The Concrete Prototype."""
    width: int
    height: int
    # Contains a nested object to demonstrate deep vs. shallow copy.
    address: Address

    def clone(self, deep: bool = False) -> Door:
        """
        Creates a clone of the Door object.
        :param deep: If True, performs a deep copy. Otherwise, a shallow copy.
        """
        if deep:
            return copy.deepcopy(self)
        return copy.copy(self)
    
    def __str__(self) -> str:
        return f"Door(width={self.width}, height={self.height}, address=Address(street='{self.address.street}', city='{self.address.city}'))"

def main() -> None:
    """Client code."""
    print("Creating an original door object.")
    original_address = Address("123 Main St", "Anytown")
    original_door = Door(width=100, height=200, address=original_address)
    print(f"Original door: {original_door}")

    print("\nCloning the door using a shallow copy.")
    cloned_door_shallow = original_door.clone(deep=False)
    print(f"Shallow cloned door: {cloned_door_shallow}")

    print("\nModifying the address of the shallow cloned door.")
    cloned_door_shallow.address.street = "456 Oak Ave"
    print(f"Shallow cloned door after modification: {cloned_door_shallow}")
    print(f"Original door after modification of shallow clone: {original_door}")
    print("--> Note that the original door's address was also changed because of the shallow copy.")

    # Resetting the original door's address for the next demonstration
    original_door.address.street = "123 Main St"
    print(f"\nOriginal door reset: {original_door}")

    print("\nCloning the door using a deep copy.")
    cloned_door_deep = original_door.clone(deep=True)
    print(f"Deep cloned door: {cloned_door_deep}")

    print("\nModifying the address of the deep cloned door.")
    cloned_door_deep.address.street = "789 Pine Ln"
    print(f"Deep cloned door after modification: {cloned_door_deep}")
    print(f"Original door after modification of deep clone: {original_door}")
    print("--> Note that the original door's address remains unchanged.")

if __name__ == '__main__':
    main()
```