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

下面是一个使用桥接模式的 Python 示例，其中 `Door` 是抽象类，`DoorSpec` 是实现类。`FrontDoor` 是对 `Door` 的具体实现，`WoodenDoorSpec` 是对 `DoorSpec` 的具体实现。

```python
# [x] Pattern: Bridge
# Allows to separate an abstraction from its implementation so that the two can vary independently

# Why we use it
# When one class has some attributes that are not related to the main class
# While these attributes can be implemented in a separate class

from abc import ABC
from dataclasses import dataclass


class DoorSpec(ABC):
    width: int
    height: int
    material: str

    def area(self):
        return self.width * self.height

@dataclass
class WoodenDoorSpec(DoorSpec):
    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
        self.material = 'wood'

@dataclass
class Door(ABC):
    spec: DoorSpec

    def tell(self):
        print(f"Door with area {self.spec.area()} and material {self.spec.material}")

@dataclass
class FrontDoor(Door):
    def __init__(self, spec: DoorSpec):
        self.spec = spec


def main():
    wood_door_spec = WoodenDoorSpec(10, 20)
    front_door = FrontDoor(wood_door_spec)
    front_door.tell()


if __name__ == '__main__':
    main()
```