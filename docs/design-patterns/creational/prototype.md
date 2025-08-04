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
以下代码展示了一个简单的原型模式解释。要注意的是，以下代码严格来说并不是原型模式的实现，而是通过 Python 的 `copy` 模块实现了对象的深拷贝。

```python livecodes console=full
# [x] Pattern: Prototype
# Create object based on an existing object through cloning

# Why we use it
# When you want to avoid the overhead of creating a new object in the standard way (e.g., using the new keyword), and you want to create a new object based on an existing object

from copy import deepcopy
from dataclasses import dataclass


@dataclass
class Door:
    width: int
    height: int


def main():
    door =  Door(100, 200)
    print(door)
    door2 = deepcopy(door)
    print(door2)
    door2.width = 300
    print(door2)
    print(door)

if __name__ == '__main__':
    main()
```