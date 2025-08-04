---
sidebar_position: 1
---

# 责任链模式
**责任链模式**为请求创建了一个处理器对象的链。如果一个对象不能处理请求，它会将请求传递给下一个处理器，直到请求被处理为止。

## 结构

![责任链模式示意图](https://refactoringguru.cn/images/patterns/diagrams/chain-of-responsibility/structure.png)

责任链模式中，客户端声明一系列处理器，并将请求传递给第一个处理器。每个处理器都包含一个指向下一个处理器的引用。如果一个处理器无法处理请求，它会将请求传递给下一个处理器。

:::info

对比责任链模式和 [装饰器模式](./../structural/decorator.md) 可以发现二者存在相似性。二者都是对某个对象的链式操作，但存在以下区别：

- 责任链的管理者可以**相互独立**地执行一切操作，还可以**随时停止**传递请求。
- 而各种**装饰器**可以在遵循基本接口的情况下**扩展对象**的行为；此外，装饰无法中断请求的传递。

:::

## 应用场景

- 需要使用不同方式处理不同种类请求， 而且请求类型和顺序预先未知时
- 当对请求的处理需要遵循特定顺序时
- 当需要动态地在运行时修改处理器的顺序时

## 优缺点
### 优点
- 可以控制请求处理的顺序
- **单一职责原则**：可对发起操作和执行操作的类进行解耦。
- **开闭原则**：可以在不修改现有处理步骤的情况下添加新的处理器。

### 缺点
- 无法保证请求一定会被处理

## 代码示例

下面的示例展示了一个门的宽度和高度验证的责任链。如果门的宽度或高度超过了规定的最大值，责任链会拒绝门的请求。

```python livecodes console=full
# [x] Pattern: Chain of Responsiblity
# Provides a chain of processing objects, each of which can decide to either process the request or pass it on to the next handler in the chain

# Why we use it
# When you want to give more than one object a chance to handle a request

from abc import ABC
from dataclasses import dataclass
from typing import Any, Dict


class Handler(ABC):
    next: "Handler"

    def set_next(self, next_handler: "Handler"):
        self.next = next_handler

    def handle_request(self, request: Dict[str, Any]):
        if self.next:
            self.next.handle_request(request)


@dataclass
class Door:
    width: int
    height: int


class WidthHandler(Handler):
    max_width: int

    def __init__(self, max_width: int):
        self.max_width = max_width

    def handle_request(self, request: Dict[str, Any]):
        if request["door"].width > self.max_width:
            print("Door is too wide")
        else:
            print("Door width accepted")
            super().handle_request(request)


class HeightHandler(Handler):
    max_height: int

    def __init__(self, max_height: int):
        self.max_height = max_height

    def handle_request(self, request: Dict[str, Any]):
        if request["door"].height > self.max_height:
            print("Door is too tall")
        else:
            print("Door height accepted")
            super().handle_request(request)


def main():
    width_handler = WidthHandler(50)
    height_handler = HeightHandler(100)
    final_width_handler = WidthHandler(30)
    final_height_handler = HeightHandler(80)

    width_handler.set_next(height_handler)
    height_handler.set_next(final_width_handler)
    final_width_handler.set_next(final_height_handler)

    door = Door(40, 90)
    width_handler.handle_request({"door": door})


if __name__ == "__main__":
    main()
```