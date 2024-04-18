# SOLID 原则

SOLID 是面向对象设计的五个基本原则的首字母缩写。这五个原则是：

## 单一职责原则（S）
> **单一职责原则**（**S**ingle Responsibility Principle, **SRP**）：一个类应该有且仅有一个功能或职责。功能被定义为**引起类变化的原因**。

如果你能够想到多于一个的动机去改变一个类，那么这个类就具有多于一个的职责。

把有不同的改变原因的事物耦合在一起的设计是糟糕的；将其分离开来，使得每个类或模块只有一个改变的理由，能够使得各个功能更加独立，更容易维护。

### 代码示例
```python
class Door:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def paint(self, color):
        return f'Painting the door in {color}'

    def install(self):
        return 'Installing the door'
```

在上面的代码中，`Door` 类有三个职责：计算门的面积、涂漆和安装。这**违反**了单一职责原则。为了遵守这个原则，我们可以将这三个职责分别放在三个不同的类 `Door`, `DoorPainter` 和 `DoorInstaller` 中。

:::tip
一个通俗的判断方式就是问自己：

> 类的某个方法是否是这个类的*所能做*的事？

如果不是，那么这个方法应该被移到另一个类中。
:::

## 开闭原则（O）
> **开闭原则**（**O**pen/Closed Principle, **OCP**）：一个类应该对扩展开放，对修改关闭。

开闭原则鼓励利用继承和多态来实现代码的可扩展性。这样，当需要添加新功能时，不需要修改现有代码，而是通过添加新的代码来实现。

与之相反的是，开闭原则反对直接修改现有代码来添加新功能。这样做可能会导致不可预测的副作用，甚至破坏现有功能。

### 代码示例
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Door(ABC):
    label: str

    @abstractmethod
    def area(self):
        raise NotImplementedError

@dataclass
class RectangleDoor(Door):
    width: int
    height: int

    def area(self):
        return self.width * self.height

@dataclass
class CircleDoor(Door):
    radius: int

    def area(self):
        return 3.14 * self.radius ** 2

@dataclass
class AdvancedCircleDoor(CircleDoor):    
    def alert(self):
        return 'Alert!'

```

在上面的代码中，`Door` 类是一个抽象类，声明了门的基本属性 `label` 和计算面积的方法 `area`。

`RectangleDoor` 和 `CircleDoor` 类继承自 `Door` 类，并实现了 `area` 方法。这样，就可以通过统一的接口 `area` 来计算不同形状的门的面积。

`AdvancedCircleDoor` 类继承自 `CircleDoor` 类，并添加了一个新的方法 `alert`。由此，我们扩展了 `CircleDoor` 现有的功能，且没有修改现有代码，使用 CircleDoor 对象的接口仍然可以正常工作（这一点与下文的 [里氏替换原则](#里氏替换原则l) 也有关）。

## 里氏替换原则（L）
> **里氏替换原则**（**L**iskov Substitution Principle, **LSP**）：子类必须能够替换其基类。换言之，程序中的对象应该是可以在不改变程序正确性的前提下被它的子类所替换的。

里氏替换原则描述了继承关系的基本特征。如果一个子类不能完全替换其基类，那么继承关系可能存在问题。

### 代码示例
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Door(ABC):
    label: str

    @abstractmethod
    def area(self):
        raise NotImplementedError

@dataclass
class RectangleDoor(Door):
    width: int
    height: int

    def area(self):
        return self.width * self.height

def print_area(door: Door):
    print(f'The area of the door is {door.area()}')

```

在 `print_area` 函数中，我们接受一个 `Door` 类型的参数，并调用其 `area` 方法，而并不用知道具体是哪个子类（这一点与下文的 [依赖反转原则](#依赖反转原则d) 也有关）。这样，我们可以传入任何继承自 `Door` 类的子类对象，而不用担心会出现问题。

## 接口隔离原则（I）
> **接口隔离原则**（**I**nterface Segregation Principle, **ISP**）：不应该强迫客户端使用其不会使用的功能，多个特定客户端接口要好于一个宽泛用途的接口。

接口隔离原则鼓励将大接口拆分成多个小接口，以便客户端只需知道与其相关的方法。其目的在于降低系统的耦合度，提高系统的内聚性。

### 代码示例
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Door(ABC):
    label: str

    @abstractmethod
    def area(self):
        raise NotImplementedError

# Concrete classes omitted for brevity
# ...

@dataclass
class DoorHelper:
    door: Door

    def paint_door(self, color: str):
        return f'Painting the door {self.door.label} in {color}'

    def install_door(self):
        return f'Installing the door {self.door.label}'

    def close_door(self):
        return f'Closing the door {self.door.label}'

```

这个例子就**违反**了接口隔离原则。`DoorHelper` 类包含了三个方法，按照设计，当用户只希望安装门时，他也必须初始化这个包含了所有方法的类。这样，用户就被迫使用了他不需要的功能。

为了遵守接口隔福原则，我们可以将 `DoorHelper` 类拆分成三个类：`DoorPainter`, `DoorInstaller` 和 `DoorCloser`。

## 依赖反转原则（D）
> **依赖反转原则**（**D**ependency Inversion Principle, **DIP**）：高层模块不应该依赖于底层模块，二者都应该依赖于抽象；抽象不应该依赖于实现，实现应该依赖于抽象。

依赖反转原则鼓励使用接口或抽象类来定义模块之间的依赖关系，而不是直接依赖于具体实现。这样，当需要更换底层模块时，只需更换其实现，而不需要修改高层模块。

### 依赖注入
依赖注入（Dependency Injection）是依赖反转原则的一种实现方式。它通过将依赖关系传递给调用者，而不是由调用者创建依赖关系，来实现模块之间的解耦。

更通俗易懂的表述方法是：**将依赖对象的创建从方法内部移到方法的外部，这样，调用者可以自由地选择依赖对象的实现。**

### 代码示例
以依赖注入为例，注入前：

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

from accessory_market import screw_type, screw_size

@dataclasses
class Accessory:
    actype: str
    size: int

    def __init__(self):
        self.actype = screw_type  # Dependency
        self.size = screw_size  # Dependency

@dataclasses
class Door:
    def __init__(self):
        self.accessory = Accessory()  # Dependency

    def install(self):
        print(f'Installing the door with {self.accessory.type} {self.accessory.size}')

if __name__ == "__main__":
    door = Door()
    door.install()
```

我们可以注意到，`Accessory` 类对象与 `screw_type` 和 `screw_size` 两个全局变量耦合在一起。这样，当我们需要更换螺丝的类型或尺寸时，就需要修改 `Accessory` 类的实现。

同样的情况也发生在 `Door` 类中。`Door` 类的实例化过程中，我们直接创建了一个 `Accessory` 类对象，这样，`Door` 类与 `Accessory` 类耦合在一起。

为了解耦，我们可以将依赖关系移至方法的参数中，从而使得具体的值仅在**类的外部**确定：

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

from accessory_market import screw_type, screw_size

@dataclasses
class Accessory:
    actype: str
    size: int

    def __init__(self, actype: str, size: int):
        self.type = actype
        self.size = size

@dataclasses
class Door:
    def __init__(self, accessory: Accessory):
        self.accessory = accessory

    def install(self):
        print(f'Installing the door with {self.accessory.type} {self.accessory.size}')

if __name__ == "__main__":
    door = Door(
        Accessory(screw_type, screw_size)
    )
    door.install()
```
