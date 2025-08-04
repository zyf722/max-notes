---
sidebar_position: 1
---

# 适配器模式
**适配器模式**是对不兼容对象的包装，以便将其接口转换为客户端所期望的接口。适配器允许已有的类与其他类一起工作，而不需要修改其源代码。

## 结构
适配器模式通常可通过**组合**或**继承**来实现。

### 组合实现（对象适配器）

![适配器模式组合实现示意图](https://refactoringguru.cn/images/patterns/diagrams/adapter/structure-object-adapter.png)

在组合模式中，适配器包含一个适配对象，然后通过调用适配对象的方法来实现目标接口。

### 继承实现（类适配器）

![适配器模式继承实现示意图](https://refactoringguru.cn/images/patterns/diagrams/adapter/structure-class-adapter.png)

在继承模式中，适配器同时继承了适配类和目标接口，然后通过重写目标接口的方法并在其中调用适配类的方法来实现目标接口。

:::tip
由于使用了多重继承，类适配器模式在一些语言中可能无法实现。
:::

## 应用场景

- 当你希望将某个类的接口转换为客户端所期望的接口时
- 当希望为一系列具有继承关系的类扩展方法，却不想为每个类都添加扩展的方法时

## 优缺点
### 优点
- 避免创建者和具体产品之间的紧密耦合。
- **单一职责原则**。将接口或数据转换代码从程序主要业务逻辑中分离。
- **开闭原则**。只要客户端接口不发生变化，可以随意更改适配器以实现扩展。

### 缺点
- 额外的类和对象会增加代码复杂度。

## 代码示例

下面是一个使用适配器模式的示例代码，其中有一个 `Door` 接口、一个实现了该接口的 `IronDoor` 类、一个 `Window` 类、以及一个通过**组合**将 `Window` 类适配为 `Door` 接口的 `WindowAdapter` 类。

通过适配器模式，我们可以将 `Window` 类的接口转换为 `Door` 接口，使得 `Fitter` 类可以使用 `Window` 类的实例。

```python livecodes console=full
# [x] Pattern: Adapter
# To fit an object to an interface

# Why we use it
# When we want to use an existing class, and its interface does not match the one we need
# We use adapter to wrap the existing class and provide the interface we need

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
    
@dataclass
class Window:
    width: int
    height: int

    def area(self):
        return self.width * self.height
    
    def _install_components(self):
        print('Installing window components')

class WindowAdapter(Door):
    def __init__(self, window: Window):
        self.window = window

    def area(self):
        return self.window.area()

    def _cut_material(self):
        self.window._install_components()

@dataclass
class IronDoor(Door):
    def _cut_material(self):
        print('Cutting iron sheets')

@dataclass
class Fitter:
    name: str

    def hello(self):
        print(f"Hello, I'm {self.name}")
    
    def fit(self, door: Door):
        print(f"Fitting door with area {door.area()}")
        door._cut_material()

def main():
    iron_door = IronDoor(100, 200)
    fitter = Fitter('John')
    fitter.hello()
    fitter.fit(iron_door)

    window = Window(50, 100)
    window_adapter = WindowAdapter(window)
    fitter.fit(window_adapter)
    

if __name__ == '__main__':
    main()
```