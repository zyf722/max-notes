---
sidebar_position: 7
---

# 代理模式
**代理模式**为其他对象提供一个代理，以控制对这个对象的访问。代理对象通常在客户端和目标对象之间起到中介作用，可以用于实现延迟加载、访问控制、日志记录等功能。

:::note
读到这里也许会注意到代理模式和 [装饰器模式](./decorator.md) 有些类似，但它们存在区别：
- 代理模式为对象提供了相同的接口，装饰模式则为对象提供加强的接口
- 代理通常自行管理其服务对象的生命周期，而装饰器的生成则总是由客户端进行控制。
:::

## 结构

![代理模式示意图](https://refactoringguru.cn/images/patterns/diagrams/proxy/structure.png)

代理模式中，客户端与高层接口交互，代理和原始服务对象都实现了这个接口。代理对象持有一个对服务对象的引用，客户端通过代理对象来访问服务对象。

## 应用场景

- 延迟初始化（虚拟代理），将对象的初始化推迟到真正需要的时候
- 访问控制（保护代理），控制对对象的访问
- 本地执行远程调用（远程代理），代理对象在本地代表远程对象
- 日志记录（日志代理），记录对对象的访问
- 缓存数据（缓存代理），缓存对象的结果

## 优缺点
### 优点
- 可以在控制服务对象的同时保证对客户端透明
- 如果客户端对服务生命周期不关心，可以由代理对象自行管理
- **开闭原则**：可以在不对服务或客户端做出修改的情况下创建新代理。

### 缺点
- 引入了额外的类，增加了代码复杂度
- 可能存在性能问题，特别是在频繁访问代理对象时

## 代码示例

下面的代码示例展示了一个使用代理模式的 Python 示例，其中 `Door` 作为服务对象，`FrontDoor` 作为服务对象的实现，`DoorOpener` 作为代理对象，控制对 `FrontDoor` 的访问。

```python
# [x] Pattern: Proxy
# To provide a surrogate or placeholder for another object to control access to it

# Why we use it
# When we want to control access to an object

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Door(ABC):
    @abstractmethod
    def open(self):
        raise NotImplementedError


@dataclass
class FrontDoor(Door):
    def open(self):
        print("Opening door")


@dataclass
class DoorOpener(Door):
    door: Door
    is_open: bool = False

    def open(self):
        if not self.is_open:
            self.door.open()
            self.is_open = True
        else:
            print("Door is already open")


def main():
    front_door = FrontDoor()
    door_opener = DoorOpener(front_door)
    door_opener.open()
    door_opener.open()


if __name__ == "__main__":
    main()
```