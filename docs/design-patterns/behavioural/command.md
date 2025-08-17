---
sidebar_position: 2
---

# 命令模式
**命令模式**将命令对应的动作封装成对象，以便在不同的上下文中使用。命令模式的关键是将请求的发送者和接收者解耦，将二者沟通的细节封装在单独的命令对象中。

## 结构

![命令模式示意图](https://refactoringguru.cn/images/patterns/diagrams/command/structure.png)

命令模式中，**客户端**将命令对象与触发者对象绑定（若有必要，在创建命令对象前先创建接收者并将其与命令对象关联），触发者对象存储一个命令对象的引用，当触发者对象接收到请求时，会调用命令对象的方法。

**发送者**触发命令，而不向接收者直接发送请求。发送者只能通过命令接口与其命令进行交互。发送者并不负责创建命令对象，而是通过依赖注入的方式接收命令对象。

**命令对象**并不实际执行命令，而是在内部调用一系列**接收者**的方法。绝大部分命令只处理如何将请求传递到接收者的细节，接收者自己会完成实际的工作。接收者所需的命令参数也在命令对象中存储。

## 应用场景

- 希望将方法调用转换为对象，以便在不同的上下文中使用或存储在栈式历史中

## 优缺点
### 优点
- 可以控制请求处理的顺序。
- **单一职责原则**：可以解耦触发和执行操作的类。
- **开闭原则**：可以在不修改已有客户端代码的情况下在程序中创建新的命令。
- 由于调用被封装成对象，可以将调用参数化，延迟调用、将调用存储在队列中，或将多个调用组合。

### 缺点
- 由于发送者与接收者之间的关系是通过命令对象建立的，所以在程序中可能会出现大量的命令类。
- 命令对象的创建和管理可能会增加程序的复杂度和内存开销。

## 代码示例

下面的示例展示了一个简单的命令模式的实现。在这个示例中，`Light` 是**接收者**，它知道如何执行具体的操作（开灯和关灯）。`Command` 是命令接口，`TurnOnCommand` 和 `TurnOffCommand` 是具体的命令对象，它们封装了对 `Light` 对象的操作请求。

`RemoteControl` 是**调用者**，它持有一个命令对象，但并不知道这个命令具体会做什么。当 `press_button` 方法被调用时，它只是执行该命令。这种设计将“请求一个操作”和“知道如何执行该操作”这两个关注点解耦了。

此外，这个例子还展示了命令模式的一个常见扩展：通过维护一个命令历史记录来实现撤销（undo）功能。

```python livecodes console=full
# [x] Pattern: Command
# Command pattern turns a request into a stand-alone object that contains all information about the request

# Why we use it
# Decouples sender and receiver while allowing them to be easily extended

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

# --- Receiver ---
class Light:
    """The Receiver class, which knows how to perform the operations."""
    def turn_on(self) -> None:
        print("The light is ON")

    def turn_off(self) -> None:
        print("The light is OFF")

# --- Command Interface ---
class Command(ABC):
    """The Command interface declares a method for executing a command."""
    @abstractmethod
    def execute(self) -> None:
        pass

    @abstractmethod
    def undo(self) -> None:
        """A method to undo the command, useful for history/rollback features."""
        pass

# --- Concrete Commands ---
class TurnOnCommand(Command):
    """A Concrete Command to turn on the light."""
    def __init__(self, light: Light):
        self._light = light

    def execute(self) -> None:
        self._light.turn_on()

    def undo(self) -> None:
        self._light.turn_off()

class TurnOffCommand(Command):
    """A Concrete Command to turn off the light."""
    def __init__(self, light: Light):
        self._light = light

    def execute(self) -> None:
        self._light.turn_off()

    def undo(self) -> None:
        self._light.turn_on()

# --- Invoker ---
class RemoteControl:
    """
    The Invoker is associated with one or several commands. It sends a request
    to the command.
    """
    def __init__(self) -> None:
        self._command: Command | None = None
        self._history: List[Command] = []

    def set_command(self, command: Command) -> None:
        self._command = command

    def press_button(self) -> None:
        if self._command:
            self._command.execute()
            self._history.append(self._command)

    def press_undo(self) -> None:
        if self._history:
            last_command = self._history.pop()
            print("Undoing the last action...")
            last_command.undo()
        else:
            print("Nothing to undo.")

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Command pattern."""
    # Create receiver, commands, and invoker
    light = Light()
    turn_on = TurnOnCommand(light)
    turn_off = TurnOffCommand(light)
    remote = RemoteControl()

    # Turn the light on
    remote.set_command(turn_on)
    print("Pressing button to turn light on:")
    remote.press_button()

    # Turn the light off
    remote.set_command(turn_off)
    print("\nPressing button to turn light off:")
    remote.press_button()

    # Undo the last action (turn off), which should turn the light back on
    print("\nPressing undo button:")
    remote.press_undo()

    # Undo again (turn on), which should turn the light off
    print("\nPressing undo button again:")
    remote.press_undo()
    
    # Try to undo with no history
    print("\nPressing undo button one more time:")
    remote.press_undo()

if __name__ == "__main__":
    main()
```