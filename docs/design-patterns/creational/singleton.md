---
sidebar_position: 5
---

# 单例模式
**单例模式**确保了类实例化对象的唯一性，即在同一时间只能有一个类的实例存在。

## 结构

![单例模式示意图](https://refactoringguru.cn/images/patterns/diagrams/singleton/structure-zh.png?id=207b153c1abb131ee4eb37dee6097e60)

为确保不产生更多的实例，单例模式通常会将类的构造函数设为私有，以防止外部代码直接实例化对象。同时，单例模式会提供一个静态方法，用于获取类的唯一实例。

## 应用场景

- 当某个类只应存在一个实例时
- 跨越整个应用程序的某些对象需要共享数据

## 优缺点
单例模式非常具有争议性。一方面，它为全局变量提供了一个优雅的解决方案；另一方面，它也可能会导致代码的耦合性增加，同时导致不便测试的情况。

### 优点
- 可以保证类只有一个实例
- 某些情况下可以跨组件获取共享对象
- 初始化一次，多次使用

### 缺点
- 违反了**单一职责原则**，类同时负责自身的职责和管理自己的实例
- 可能无意间增加不同组件间的耦合性
- 多线程环境下需要额外注意以避免多次实例化
- **单例类难以被模拟，因此可能会导致测试困难**

:::info
有关单例模式与测试，可参见：
- [Singletons are Pathological Liars](https://testing.googleblog.com/2008/08/by-miko-hevery-so-you-join-new-project.html)
- [TotT: Using Dependancy Injection to Avoid Singletons](https://testing.googleblog.com/2008/05/tott-using-dependancy-injection-to.html)

:::

## 代码示例
以下代码以现实中的美国总统为例，展示了单例模式的实现。

:::info

在 Python 中，由于不能直接使用私有构造函数，因此我们使用元类来实现单例模式。通过元类拦截对类的实例化，我们可以确保一个类只有一个实例。

:::

```python
# [x] Pattern: Singleton
# Ensure a class has only one instance and provide a global point of access to it

# Why we use it
# To maintain a single instance of a class and to provide a global point of access to that instance

from dataclasses import dataclass


# Using metaclass in Python to implement singleton elegantly
class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

@dataclass
class President(metaclass=Singleton):
    name: str

    def __str__(self):
        return self.name

def main():
    president = President("George Washington")
    print(president)
    president2 = President("Donald Trump") # This should not change the president to Donald Trump
    print(president2)
    assert president is president2

if __name__ == '__main__':
    main()
```