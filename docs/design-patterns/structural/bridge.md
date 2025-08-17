---
sidebar_position: 2
---

# 桥接模式
**桥接模式**将类的**抽象**部分与其**实现**部分分离，使它们可以独立变化。这种模式有助于解决**多维度变化**的问题。

:::example
这听起来比较让人难以理解，但实际上桥接模式的概念非常简单，很可能你在开发过程中已经不知不觉地使用过它。

例如，我们之前一直使用门的例子来解释设计模式。我们通常会有 `Door`, `IronDoor`, `WoodenDoor` 这几个类，但如果再引入 `Color` 的概念，那么就会有 `RedIronDoor`, `BlueIronDoor`, `RedWoodenDoor`, `BlueWoodenDoor` 等多个类——很明显，类的数量将随属性的增加而呈指数级增长。

为了避免这种情况，我们会将**继承**关系改为**组合**关系，即将 `Color` 作为一个属性，而不是一个类；对于 `Material` 也是一样。这样，我们就可以通过组合不同的对象来实现不同颜色和材质的门，而不需要为每种属性都创建一个新的类。
:::

## 结构

![桥接模式示意图](https://refactoringguru.cn/images/patterns/diagrams/bridge/structure-zh.png)

客户端直接与抽象类交互，抽象类则与实现类交互。抽象类则封装了实现类的接口和属性，使得客户端可以通过抽象类来访问实现类。

:::note
某种程度上，这也像是遥控器和电视机的关系。遥控器是抽象类，电视机是实现类，遥控器通过按钮来控制电视机。
:::

## 应用场景

- 当希望在几个独立维度上变化一个类时
- 当需要在运行时切换不同实现时

## 优缺点
### 优点
- 客户端代码仅与高层抽象部分进行互动，对具体实现不了解
- **单一职责原则**：抽象部分专注于处理高层逻辑，实现部分处理平台细节。
- **开闭原则**：可以新增抽象部分和实现部分，且它们之间不会相互影响。

### 缺点
- 抽象部分和实现部分分离，增加了代码复杂度，尤其是高内聚的系统

## 代码示例

下面是一个使用桥接模式的 Python 示例。在这个例子中，`RemoteControl`（遥控器）是**抽象**部分，它提供了控制设备的基本接口。`Device`（设备）是**实现**部分，定义了所有具体设备（如 `TV` 和 `Radio`）必须实现的接口。

`RemoteControl` 类持有一个 `Device` 对象的引用，并将所有实际工作委托给这个对象。这样，我们可以独立地扩展遥控器（例如，创建一个 `AdvancedRemoteControl`）和设备（例如，添加一个新的 `DVDPlayer` 类），而不会导致类爆炸。客户端代码可以根据需要将任何遥控器与任何设备组合使用。

```python livecodes console=full
# [x] Pattern: Bridge
# Allows to separate an abstraction from its implementation so that the two can vary independently

# Why we use it
# When one class has some attributes that are not related to the main class
# While these attributes can be implemented in a separate class

from __future__ import annotations
from abc import ABC, abstractmethod

# --- Abstraction ---
class RemoteControl:
    """
    The Abstraction defines the interface for the "control" part of the two
    class hierarchies. It maintains a reference to an object of the
    Implementation hierarchy and delegates all of the real work to this object.
    """
    def __init__(self, device: Device) -> None:
        self._device = device

    def toggle_power(self) -> None:
        if self._device.is_enabled():
            self._device.disable()
        else:
            self._device.enable()
        print(f"Power toggled. Device is now {'ON' if self._device.is_enabled() else 'OFF'}.")

    def volume_down(self) -> None:
        self._device.set_volume(self._device.get_volume() - 10)
        print(f"Volume down. Current volume: {self._device.get_volume()}")

    def volume_up(self) -> None:
        self._device.set_volume(self._device.get_volume() + 10)
        print(f"Volume up. Current volume: {self._device.get_volume()}")

# --- Refined Abstraction ---
class AdvancedRemoteControl(RemoteControl):
    """
    You can extend classes from the Abstraction hierarchy independently from
    device classes.
    """
    def mute(self) -> None:
        self._device.set_volume(0)
        print("Device muted.")

# --- Implementation Interface ---
class Device(ABC):
    """
    The Implementation defines the interface for all implementation classes.
    It doesn't have to match the Abstraction's interface.
    """
    @abstractmethod
    def is_enabled(self) -> bool:
        pass

    @abstractmethod
    def enable(self) -> None:
        pass

    @abstractmethod
    def disable(self) -> None:
        pass

    @abstractmethod
    def get_volume(self) -> int:
        pass

    @abstractmethod
    def set_volume(self, percent: int) -> None:
        pass

# --- Concrete Implementations ---
class TV(Device):
    """A concrete implementation: TV."""
    def __init__(self) -> None:
        self._enabled = False
        self._volume = 30

    def is_enabled(self) -> bool:
        return self._enabled

    def enable(self) -> None:
        self._enabled = True

    def disable(self) -> None:
        self._enabled = False

    def get_volume(self) -> int:
        return self._volume

    def set_volume(self, percent: int) -> None:
        self._volume = max(0, min(100, percent))

class Radio(Device):
    """Another concrete implementation: Radio."""
    def __init__(self) -> None:
        self._enabled = False
        self._volume = 20

    def is_enabled(self) -> bool:
        return self._enabled

    def enable(self) -> None:
        self._enabled = True

    def disable(self) -> None:
        self._enabled = False

    def get_volume(self) -> int:
        return self._volume

    def set_volume(self, percent: int) -> None:
        self._volume = max(0, min(100, percent))

# --- Client Code ---
def main() -> None:
    """Client code demonstrating the Bridge pattern."""
    tv = TV()
    remote = RemoteControl(tv)
    print("--- Testing basic remote with TV ---")
    remote.toggle_power()
    remote.volume_up()
    remote.volume_down()

    radio = Radio()
    advanced_remote = AdvancedRemoteControl(radio)
    print("\n--- Testing advanced remote with Radio ---")
    advanced_remote.toggle_power()
    advanced_remote.volume_up()
    advanced_remote.mute()

if __name__ == '__main__':
    main()
```