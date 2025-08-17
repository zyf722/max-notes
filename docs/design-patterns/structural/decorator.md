---
sidebar_position: 4
---

# 装饰器模式
**装饰器模式**允许你通过将对象放入包含行为的包装对象中来动态更改对象的行为（例如 prehooks 和 posthooks）。

:::info

熟悉 Python 的开发者可能会对 [*装饰器*](https://peps.python.org/pep-0318/#background) 这个词感到熟悉。装饰器为 Python 开发者提供了一种创建 [高阶函数](https://zh.wikipedia.org/wiki/%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0) 的方法，使得可以在不更改函数定义的情况下，动态地为函数添加包装。

装饰器模式正是这种思想在类层面的应用。通过将对象放入包含行为的包装对象中，我们可以动态地更改对象的行为，而不需要更改对象本身。

:::

## 结构

![装饰器模式示意图](https://refactoringguru.cn/images/patterns/diagrams/decorator/structure.png)

装饰器模式中，客户端与高层的**组件**接口交互，而具体的功能组件和装饰器则分别实现了该接口。功能组件为功能提供了实现，而装饰器则通过**组合**的方式接受功能组件作为成员变量，在实现的方法中调用功能组件的方法，并在其前后添加额外的行为。

如果装饰器接受的组件的类型为抽象的**组件**接口，那么还能实现**嵌套装饰器**，从而形成一个装饰器链。

## 应用场景

- 当希望在不修改对象本身的情况下，动态地添加功能时

## 优缺点
### 优点
- 可以用多个装饰封装对象来组合几种行为。
- **开闭原则**：无需创建新子类即可扩展对象的行为。
- **单一职责原则**：可以将实现了许多不同行为的一个大类拆分为多个较小的类。

### 缺点
- 当组成装饰器链（栈式结构）后，对非栈顶的装饰器的访问可能会变得困难

## 代码示例

下面的代码示例展示了装饰器模式的实现。`Notifier` 是一个组件接口，`EmailNotifier` 是一个具体的功能组件。`BaseDecorator` 是所有装饰器的基类，它也实现了 `Notifier` 接口。`SMSDecorator` 和 `SlackDecorator` 是具体的装饰器，它们包装了 `Notifier` 对象，并在调用其 `send` 方法的基础上添加了额外的通知功能。

客户端代码可以通过 `Notifier` 接口与简单组件（`EmailNotifier`）和装饰后的组件进行交互，而无需关心其具体实现。装饰器可以嵌套使用，从而动态地组合不同的行为。

```python livecodes console=full
# [x] Pattern: Decorator
# To add behavior to an object without affecting its class

# Why we use it
# When we want to add behavior to an object without changing its class

from __future__ import annotations
from abc import ABC, abstractmethod

# --- Component Interface ---
class Notifier(ABC):
    """
    The base Component interface defines operations that can be altered by
    decorators.
    """
    @abstractmethod
    def send(self, message: str) -> None:
        pass

# --- Concrete Component ---
class EmailNotifier(Notifier):
    """
    Concrete Components provide default implementations of the operations. There
    might be several variations of these classes.
    """
    def send(self, message: str) -> None:
        print(f"Sending email with message: '{message}'")

# --- Base Decorator ---
class BaseDecorator(Notifier):
    """
    The base Decorator class follows the same interface as the other
    components. The primary purpose of this class is to define the wrapping
    interface for all concrete decorators.
    """
    def __init__(self, wrappee: Notifier):
        self._wrappee = wrappee

    def send(self, message: str) -> None:
        """
        The Decorator delegates all work to the wrapped component.
        """
        self._wrappee.send(message)

# --- Concrete Decorators ---
class SMSDecorator(BaseDecorator):
    """
    Concrete Decorators call the wrapped object and alter its result in some
    way.
    """
    def send(self, message: str) -> None:
        """
        Decorators can execute their behavior either before or after the call to
        a wrapped object.
        """
        super().send(message)
        print(f"Sending SMS with message: '{message}'")

class SlackDecorator(BaseDecorator):
    """Another Concrete Decorator."""
    def send(self, message: str) -> None:
        super().send(message)
        print(f"Sending Slack message: '{message}'")

# --- Client Code ---
def client_code(component: Notifier, message: str) -> None:
    """
    The client code works with all objects using the Component interface. This
    way it can stay independent of the concrete classes of components it works
    with.
    """
    component.send(message)

def main() -> None:
    """Main execution function."""
    # This way the client code can support both simple components...
    simple_notifier = EmailNotifier()
    print("Client: I've got a simple component:")
    client_code(simple_notifier, "Hello, World!")
    print("-" * 20)

    # ...and decorated ones.
    # Note how decorators can wrap not only simple components but the other
    # decorators as well.
    sms_notifier = SMSDecorator(simple_notifier)
    slack_and_sms_notifier = SlackDecorator(sms_notifier)
    
    print("Client: Now I've got a decorated component:")
    client_code(slack_and_sms_notifier, "Hello, decorated World!")

if __name__ == "__main__":
    main()
```