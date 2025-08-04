---
sidebar_position: 6
---

# 享元模式
**享元模式**允许在对象之间共享相同的状态，从而减少内存占用。享元模式的核心思想是将对象的状态分为内部状态和外部状态，其中内部状态是可以共享的，而外部状态是不可共享的。

:::note
简而言之，**享元模式**就是将多个对象间共享的状态提取出来并封装到一个新的对象中，而原始对象则包含对这个新对象的引用，从而实现状态复用。
:::

## 结构

![享元模式示意图](https://refactoringguru.cn/images/patterns/diagrams/flyweight/structure.png)

享元模式中，`FlyweightFactory` 用于创建和管理享元对象，通过维护一个享元对象的缓存池来实现创建、维护和共享。`Flyweight` 是享元对象的接口，维护内部状态；`Context` 是上下文，代表内部状态和外部状态的组合。

:::example
如果要类比的话，枚举类型就是享元模式的一种实现。枚举类型类似于提前定义了一系列状态对象，而枚举类型本身则是享元工厂，通过枚举值来获取对应的状态对象。
:::

:::note
对享元对象的操作可以定义在享元对象内部，也可以定义在上下文中。
:::

## 应用场景

- 仅当对象的多个实例之间存在共享状态时

## 优缺点
### 优点
- 可以节省大量内存

### 缺点
- 引入了共享状态，可能会导致并发安全问题
- 牺牲执行速度来换取内存
- 代码变得不直观

## 代码示例

下面的代码示例展示了一个使用享元模式的 Python 示例，其中 `DoorSpec` 作为享元对象，`DoorSpecFactory` 作为享元工厂，`Door` 作为享元对象的上下文。`assert` 语句用于验证享元对象是否被正确共享。

```python livecodes console=full
# [x] Pattern: Flyweight
# To share common state between multiple objects

# Why we use it
# When we want to share common state between multiple objects

from dataclasses import dataclass


@dataclass
class DoorSpec:
    width: int
    height: int


class DoorSpecFactory:
    def __init__(self):
        self._door_specs = {}

    def get_door_spec(self, width: int, height: int) -> DoorSpec:
        key = (width, height)
        if key not in self._door_specs:
            self._door_specs[key] = DoorSpec(width, height)
        return self._door_specs[key]


@dataclass
class Door:
    id: int
    spec: DoorSpec

    def area(self) -> int:
        return self.width * self.height


def main():
    door_spec_factory = DoorSpecFactory()
    door1 = Door(1, door_spec_factory.get_door_spec(100, 200))
    door2 = Door(2, door_spec_factory.get_door_spec(100, 200))
    door3 = Door(3, door_spec_factory.get_door_spec(200, 300))
    assert door1.spec is door2.spec
    assert door2.spec is not door3.spec


if __name__ == "__main__":
    main()
```