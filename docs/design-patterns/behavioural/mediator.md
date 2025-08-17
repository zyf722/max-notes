---
sidebar_position: 4
---

# 中介者模式
**中介者模式**通过引入一个中介对象来封装同级组件之间的交互，从而减少对象之间的直接依赖关系，降低耦合度，提高系统的可维护性。

## 结构

![中介者模式示意图](https://refactoringguru.cn/images/patterns/diagrams/mediator/structure.png)

中介者模式中，**中介者**对象负责协调下级组件在同级间的交互。中介者对象通常会维护一个组件列表，用于存储所有需要协调的组件。

当**组件**需要与其他组件通信时，它会向中介者对象发送请求，中介者对象会根据请求的内容选择合适的组件进行响应。中介者对象可以根据需要将请求转发给其他组件，也可以将请求广播给所有组件。

消息的发送者不知道最终会由谁来处理自己的请求，接收者也不知道最初是谁发出了请求。

## 应用场景

- 希望消除同级对象间的直接引用，降低耦合度时
- 希望解耦业务逻辑，编写更易复用的组件代码时

## 优缺点
### 优点
- **单一职责原则**：将多个组件间的交流抽取到同一位置，使其更易于理解和维护。
- **开闭原则**：可以为组件更换中介者对象，而不需要修改组件代码。

### 缺点
- 中介者可能与过多组件通信，导致其内部负责过多功能，内聚性降低，成为“上帝对象”。

## 代码示例

下面以一个智能家居系统为例，展示了中介者模式的实现。

在这个系统中，`Light`（灯）、`Thermostat`（恒温器）和 `CoffeeMachine`（咖啡机）是**组件**。它们之间不直接通信，而是通过一个**中介者** `SmartHomeMediator` 来协调。

每个组件都持有一个对中介者的引用。当一个组件的状态发生变化时（例如，灯被打开），它会通过调用 `notify` 方法来通知中-介者。中介者接收到通知后，会根据预设的逻辑来协调其他组件（例如，当中介者收到 `light_on` 事件时，它会指示恒温器调节温度，并触发咖啡机开始煮咖啡）。

这种设计避免了组件之间复杂的网状依赖关系，使得添加新组件或修改组件间的交互逻辑变得更加容易，因为所有的协调逻辑都集中在中介者中。

```python livecodes console=full
# [x] Pattern: Mediator
# Mediator pattern provides a way to encapsulate the interaction between objects

# Why we use it
# Decouples the components from each other, making them easier to maintain and reuse

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Dict

# --- Mediator Interface ---
class Mediator(ABC):
    """
    The Mediator interface declares a method used by components to notify the
    mediator about various events. The Mediator may react to these events and
    pass the execution to other components.
    """
    @abstractmethod
    def notify(self, sender: Component, event: str) -> None:
        pass

# --- Base Component ---
class Component:
    """
    The Base Component provides the basic functionality of storing a mediator's
    instance inside component objects.
    """
    def __init__(self, mediator: Mediator | None = None) -> None:
        self._mediator = mediator

    @property
    def mediator(self) -> Mediator:
        if not self._mediator:
            raise ValueError("Mediator not set for this component.")
        return self._mediator

    @mediator.setter
    def mediator(self, mediator: Mediator) -> None:
        self._mediator = mediator

# --- Concrete Components ---
class Light(Component):
    """Concrete Component for a light."""
    def turn_on(self) -> None:
        print("Light is turning on.")
        self.mediator.notify(self, "light_on")

    def turn_off(self) -> None:
        print("Light is turning off.")
        self.mediator.notify(self, "light_off")

class Thermostat(Component):
    """Concrete Component for a thermostat."""
    def __init__(self, mediator: Mediator | None = None, temperature: float = 20.0):
        super().__init__(mediator)
        self._temperature = temperature

    @property
    def temperature(self) -> float:
        return self._temperature

    def set_temperature(self, temp: float) -> None:
        print(f"Thermostat setting temperature to {temp}°C.")
        self._temperature = temp
        self.mediator.notify(self, "temp_changed")

class CoffeeMachine(Component):
    """Concrete Component for a coffee machine."""
    def brew(self) -> None:
        print("Coffee machine is brewing coffee.")
        self.mediator.notify(self, "coffee_brewed")

# --- Concrete Mediator ---
class SmartHomeMediator(Mediator):
    """
    The Concrete Mediator implements cooperative behavior by coordinating
    concrete component objects.
    """
    def __init__(self, light: Light, thermostat: Thermostat, coffee_machine: CoffeeMachine):
        self._light = light
        self._light.mediator = self
        self._thermostat = thermostat
        self._thermostat.mediator = self
        self._coffee_machine = coffee_machine
        self._coffee_machine.mediator = self

    def notify(self, sender: Component, event: str) -> None:
        print(f"Mediator received event '{event}' from {sender.__class__.__name__}")
        if event == "light_on":
            print("Mediator reacts to light_on: setting thermostat to a comfortable morning temperature.")
            self._thermostat.set_temperature(22.0)
        elif event == "temp_changed":
            if self._thermostat.temperature > 21:
                print("Mediator reacts to temp_changed: It's warm, let's brew some coffee.")
                self._coffee_machine.brew()
        elif event == "coffee_brewed":
            print("Mediator reacts to coffee_brewed: Coffee is ready, turning off the light as we leave the kitchen.")
            self._light.turn_off()

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Mediator pattern."""
    light = Light()
    thermostat = Thermostat()
    coffee_machine = CoffeeMachine()

    mediator = SmartHomeMediator(light, thermostat, coffee_machine)

    print("--- Morning Routine Simulation ---")
    print("Turning on the light to start the day...")
    light.turn_on()

if __name__ == "__main__":
    main()
```