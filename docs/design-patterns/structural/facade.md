---
sidebar_position: 5
---

# 外观模式
**外观模式**为复杂子系统提供了一个简单的接口，使得客户端可以更容易地使用该子系统。简单地来说，就是将一系列不必为外界访问的行为封装到一个包装类中，使得客户端只需要与这个包装类交互。

## 结构

![外观模式示意图](https://refactoringguru.cn/images/patterns/diagrams/facade/structure.png)

外观模式中，客户端通过**外观**类来访问子系统。外观类为客户端提供了复杂子系统的简单接口，客户端通过这个接口来访问子系统，从而隔离了客户端本身对子系统及其依赖的依赖。

## 应用场景

- 当某些依赖仅在特定功能中使用时
- 当客户端仅需要与子系统的一部分交互时

## 优缺点
### 优点
- 可以让自己的代码独立于复杂子系统。

### 缺点
- 保持复杂子系统高内聚具有难度
  - 在某些情况下可能会导致外观类变得庞大，成为低内聚的、包含多个不相关行为的“上帝类”

## 代码示例

下面的代码示例展示了一个使用外观模式的 Python 示例，其中 `Fitter` 和 `Installer` 作为不同功能的子系统，但用户不需要知道这两个类之间是如何协调的，而只关心门最后能被安装，因此 `BuildingTeam` 作为外观类，将 `Fitter` 和 `Installer` 封装在一起，提供了一个简单的接口 `build`。

```python livecodes console=full
# [x] Pattern: Facade
# To provide a simple interface to a complex system

# Why we use it
# When we want to provide a simple interface to a complex system

from dataclasses import dataclass


@dataclass
class Door:
    width: int
    height: int

    def area(self) -> int:
        return self.width * self.height


@dataclass
class Fitter:
    door: Door

    def fit(self) -> None:
        print(f"Fitting door of area {self.door.area()}")


@dataclass
class Installer:
    door: Door

    def install(self) -> None:
        print(f"Installing door of area {self.door.area()}")


@dataclass
class BuildingTeam:
    fitter: Fitter
    installer: Installer

    def build(self) -> None:
        self.fitter.fit()
        self.installer.install()


def main():
    door = Door(100, 200)
    fitter = Fitter(door)
    installer = Installer(door)
    building_team = BuildingTeam(fitter, installer)
    building_team.build()


if __name__ == "__main__":
    main()
```