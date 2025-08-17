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

:::ref
有关单例模式与测试，可参见：
- [Singletons are Pathological Liars](https://testing.googleblog.com/2008/08/by-miko-hevery-so-you-join-new-project.html)
- [TotT: Using Dependency Injection to Avoid Singletons](https://testing.googleblog.com/2008/05/tott-using-dependancy-injection-to.html)

:::

## 代码示例
以下代码以现实中的美国总统为例，展示了单例模式的实现。

:::info

在 Python 中，由于不能直接使用私有构造函数，因此我们使用元类来实现单例模式。通过元类拦截对类的实例化，我们可以确保一个类只有一个实例。

:::

```python livecodes console=full
# [x] Pattern: Singleton
# Ensure a class has only one instance and provide a global point of access to it

# Why we use it
# To maintain a single instance of a class and to provide a global point of access to that instance

from __future__ import annotations
import threading
from typing import Any, Dict, Type

# Using a lock to make it thread-safe, which is crucial for singletons in multi-threaded apps.
_lock = threading.Lock()

class Singleton(type):
    """
    A thread-safe Singleton metaclass to ensure only one instance of a class is created.
    """
    _instances: Dict[Type, Any] = {}

    def __call__(cls, *args: Any, **kwargs: Any) -> Any:
        # The initial check is performed without a lock for performance.
        if cls not in cls._instances:
            # If the instance does not exist, acquire a lock and perform a double-check.
            # This double-checked locking pattern prevents race conditions during the first instantiation.
            with _lock:
                if cls not in cls._instances:
                    instance = super().__call__(*args, **kwargs)
                    cls._instances[cls] = instance
        return cls._instances[cls]

class President(metaclass=Singleton):
    """
    The President class, representing the single office of the President.
    This class is a Singleton. The `__init__` method is only called once
    during the creation of the very first instance.
    """
    def __init__(self, name: str) -> None:
        # This initializer runs only when the first instance is created.
        self.name = name

    def __str__(self) -> str:
        return f"The current and only President is {self.name}."

def main() -> None:
    """Client code demonstrating the Singleton pattern."""
    print("Creating the first instance of President.")
    president_one = President("George Washington")
    print(president_one)

    print("\nAttempting to create a second instance of President.")
    president_two = President("John Adams")
    print("The 'new' instance is actually the existing one:")
    print(president_two)

    print(f"\nIs president_one the same object as president_two? {president_one is president_two}")
    assert president_one is president_two
    # The name was not updated because __init__ was not called for the second time.
    assert president_one.name == "George Washington"

    # The state of the singleton can be modified, and it will be reflected everywhere.
    print("\nUpdating the name of the President.")
    president_one.name = "Abraham Lincoln"
    print(f"President_one: {president_one}")
    print(f"President_two: {president_two}")
    assert president_two.name == "Abraham Lincoln"

if __name__ == '__main__':
    main()
```