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

下面的示例展示了一个简单的命令模式的实现。在这个示例中，`Teller`类代表了接收者，`Command`类代表了命令对象，`TellCommand`类代表了具体的命令，`Alarm`类代表了发送者，`Class`类代表了客户端。

```python livecodes console=full
# [x] Pattern: Command
# Command pattern turns a request into a stand-alone object that contains all information about the request

# Why we use it
# Decouples sender and receiver while allowing them to be easily extended

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict


@dataclass
class Command(ABC):
    @abstractmethod
    def execute(self):
        pass


@dataclass
class Teller:
    name: str

    def say(self, message: str):
        print(f"{self.name} says: {message}")


@dataclass
class TellCommand(Command):
    sender: Teller
    message: str

    def execute(self):
        self.sender.say(self.message)


class Alarm:
    command: Command

    def set_command(self, command: Command):
        self.command = command

    def trigger(self):
        self.command.execute()


class Class:
    name: str
    students: Dict[str, Alarm]

    def __init__(self, name: str):
        self.name = name
        self.students = {}

    def add_student(self, student: str, alarm: Alarm):
        if student not in self.students:
            self.students[student] = alarm
        else:
            print(f"Student {student} already exists in the class")


def main():
    student1 = Teller("Student 1")
    student2 = Teller("Student 2")

    tell_command1 = TellCommand(student1, "Hello, dear teacher")
    tell_command2 = TellCommand(student2, "Hey, teacher")

    alarm1 = Alarm()
    alarm2 = Alarm()

    alarm1.set_command(tell_command1)
    alarm2.set_command(tell_command2)

    class1 = Class("Class 1")
    class1.add_student("Student 1", alarm1)
    class1.add_student("Student 2", alarm2)

    for _, alarm in class1.students.items():
        alarm.trigger()


if __name__ == "__main__":
    main()
```