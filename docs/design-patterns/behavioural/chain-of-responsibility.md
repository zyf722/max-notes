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

下面的示例展示了一个使用责任链模式来验证门（`Door` 对象）尺寸的场景。

`Handler` 是一个抽象基类，定义了处理请求的接口和链接下一个处理器的能力。`WidthHandler` 和 `HeightHandler` 是具体的处理器，它们分别检查门的宽度和高度是否超过了设定的最大值。

在客户端代码中，我们将这些处理器链接成一个责任链。当一个 `Door` 对象被传递给链的第一个处理器时，它会依次通过链中的每个处理器进行验证。如果任何一个处理器发现验证失败，它会立即返回一个错误信息，请求处理就此中断。如果所有处理器都验证通过，请求就会成功地穿过整个链。

```python livecodes console=full
# [x] Pattern: Chain of Responsibility
# Provides a chain of processing objects, each of which can decide to either process the request or pass it on to the next handler in the chain

# Why we use it
# When you want to give more than one object a chance to handle a request

from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class Door:
    """The request object that needs to be processed."""
    width: int
    height: int

class Handler(ABC):
    """
    The Handler interface declares a method for building the chain of handlers
    and a method for executing a request.
    """
    def __init__(self) -> None:
        self._next_handler: Optional[Handler] = None

    def set_next(self, handler: Handler) -> Handler:
        """
        Sets the next handler in the chain. Returns the handler to allow for
        convenient chaining, e.g., handler1.set_next(handler2).set_next(handler3).
        """
        self._next_handler = handler
        return handler

    @abstractmethod
    def handle(self, request: Door) -> Optional[str]:
        """
        Handles the request. Concrete handlers should implement their logic here.
        The request can be passed to the next handler in the chain.
        """
        if self._next_handler:
            return self._next_handler.handle(request)
        return None  # End of chain, request is fully processed.

class WidthHandler(Handler):
    """A concrete handler that checks the door's width."""
    def __init__(self, max_width: int):
        super().__init__()
        self.max_width = max_width

    def handle(self, request: Door) -> Optional[str]:
        if request.width > self.max_width:
            return f"Validation failed: Door is wider than {self.max_width}."
        print(f"Width check (max {self.max_width}): OK")
        return super().handle(request)

class HeightHandler(Handler):
    """A concrete handler that checks the door's height."""
    def __init__(self, max_height: int):
        super().__init__()
        self.max_height = max_height

    def handle(self, request: Door) -> Optional[str]:
        if request.height > self.max_height:
            return f"Validation failed: Door is taller than {self.max_height}."
        print(f"Height check (max {self.max_height}): OK")
        return super().handle(request)

def client_code(handler: Handler, door: Door) -> None:
    """The client code that initiates the request."""
    print(f"\nChecking a door with width={door.width} and height={door.height}...")
    result = handler.handle(door)
    if result:
        print(result)
    else:
        print("Validation successful: Door meets all criteria.")

def main() -> None:
    """Main execution function."""
    # Create the chain of handlers.
    # The chain is: Width(50) -> Height(100) -> Width(30) -> Height(80)
    handler_chain = WidthHandler(50)
    handler_chain.set_next(HeightHandler(100)).set_next(WidthHandler(30)).set_next(HeightHandler(80))

    # Test with a door that should pass all checks.
    door1 = Door(25, 70)
    client_code(handler_chain, door1)

    # Test with a door that should fail the second width check.
    door2 = Door(40, 90)
    client_code(handler_chain, door2)
    
    # Test with a door that should fail the first width check.
    door3 = Door(60, 90)
    client_code(handler_chain, door3)

if __name__ == "__main__":
    main()
```