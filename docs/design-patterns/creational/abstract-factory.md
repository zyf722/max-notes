---
sidebar_position: 2
---

# 抽象工厂模式
**抽象工厂**将多个工厂方法组合在一起，以创建一系列相关或依赖对象。它保证了这一系列对象之间具有某种**关联性**。

## 结构

![抽象工厂示意图](https://refactoringguru.cn/images/patterns/diagrams/abstract-factory/structure.png)

相较于 [工厂方法模式](./factory-method.md)，抽象工厂模式提供了对**一组相关的产品**（属于同一个系列且在高层主题或概念上具有相关性）对应的工厂方法的封装。

## 应用场景

- 当有一系列相关的产品需要被创建，且这些产品都具有相应的变体时

## 优缺点
其优缺点基本上和 [工厂方法模式](./factory-method.md) 一致，同时还能够保证一组产品之间的关联性。

## 代码示例

下面的示例展示了一个抽象工厂模式的实现，其中每个工厂都产出 `Door` 和 `DoorFitter` 对象，且只有对应的 `DoorFitter` 才能安装对应的 `Door`。

```python
# [x] Pattern: Abstract Factory
# A class that has multiple method that creates objects of another class
# The factory class has a pair of object types

# Why we use it
# When there are interrelated dependencies with not only one object

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Door(ABC):
    width: int
    height: int

    def area(self):
        return self.width * self.height
    
    @abstractmethod
    def _cut_material(self):
        raise NotImplementedError

    @abstractmethod
    def _install_components(self):
        raise NotImplementedError

@dataclass
class IronDoor(Door):
    def _cut_material(self):
        print('Cutting iron sheets')

    def _install_components(self):
        print('Installing iron components')

@dataclass
class DoorFitter(ABC):
    name: str

    def hello(self):
        print(f"Hello, I'm {self.name}")
    
    @abstractmethod
    def fit_door(self, door: Door):
        raise NotImplementedError

@dataclass
class IronDoorFitter(DoorFitter):

    def fit_door(self, door: IronDoor):
        print(f"Fitting iron door with area {door.area()}")

class DoorFactory(ABC):
    @staticmethod
    @abstractmethod
    def make_door(self, width: int, height: int) -> Door:
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def make_fitter(self, name: str) -> DoorFitter:
        raise NotImplementedError

class IronDoorFactory:
    @staticmethod
    def make_door(width: int, height: int) -> IronDoor:
        door = IronDoor(width, height)
        door._cut_material()
        door._install_components()
        return door

    @staticmethod
    def make_fitter(name: str) -> IronDoorFitter:
        return IronDoorFitter(name)



def main():
    iron_door = IronDoorFactory.make_door(100, 200)
    print(f"Now we have an iron door with area {iron_door.area()}")
    iron_fitter = IronDoorFactory.make_fitter('John')
    iron_fitter.hello()
    iron_fitter.fit_door(iron_door)

if __name__ == '__main__':
    main()
```