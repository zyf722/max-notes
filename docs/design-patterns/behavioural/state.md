---
sidebar_position: 7
---

# 状态模式
**状态模式**通过将对象所属的状态抽象成类，并利用继承和多态性质来实现状态的切换，从而使得对象在不同状态下能够动态地表现出不同的行为。

## 结构

![状态模式示意图](https://refactoringguru.cn/images/patterns/diagrams/state/structure-zh.png)

状态模式中，**上下文**（Context）对象为客户端提供了一个接口，用于在不同状态下调用不同的行为。**状态**（State）接口定义了所有具体状态类的通用方法。**具体状态**（Concrete State）类实现了状态接口，并定义了在该状态下的行为。

对客户端而言，调用上下文对象的方法就像调用一个普通的对象一样，但得益于多态性质，上下文对象能够根据状态的不同表现出不同的行为。

## 应用场景

- 当对象需要根据自身当前状态进行不同行为，且状态的数量非常多、与状态相关的代码会频繁变更时
- 当对象的行为取决于其状态，且需要在运行时动态改变状态时

## 优缺点
### 优点
- **单一职责原则**：状态与状态对应的行为被封装在同一类中，而与状态无关的行为被封装在其他类中。
- **开闭原则**：可以在不修改上下文的情况下扩展状态与对应的行为。
- 消除大量条件语句。

### 缺点
- 在状态、行为较少时没有必要使用状态模式。

## 代码示例

下面通过一个简单的音乐播放器示例展示了状态模式的实现。在这个示例中，`Player`类代表了上下文对象，`State`类代表了状态接口，`PlayingState`和`PausedState`类代表了具体状态类。

:::note
值得注意的是，这里的 `change_state` 方法实际上是切换状态和状态的工厂方法的结合。这种方式可以避免在客户端代码中直接创建状态对象，从而降低了耦合度。

同时，该方法的类型标注中使用了 `Literal` 类型用于指定参数的取值范围。由此可以编写更加类型安全的代码。在更高版本的 Python 中，还可以对类型使用 * 运算符解包，以避免重复书写。

此外，为实现此机制还声明了一个字符串到状态类型的映射，以便在 `change_state` 方法中根据字符串创建对应的状态对象。该字典被声明为 `ClassVar` 以避免 `dataclass` 将其视为实例变量。
:::

```python livecodes console=full
# [x] Pattern: State
# State pattern allows an object to alter its behavior when its internal state changes

# Why we use it
# Allows an object to change its behavior when its internal state changes

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import ClassVar, Dict, List, Literal


@dataclass
class State(ABC):
    player: "Player"

    @abstractmethod
    def play(self):
        pass

    @abstractmethod
    def pause(self):
        pass

    @abstractmethod
    def next(self):
        pass


@dataclass
class Player:
    name: str
    state: State
    current_song_index: int
    song_list: List[str]

    @dataclass
    class PlayingState(State):
        def play(self):
            print(f"{self.player.name} is already playing {self.player.current_song}")

        def pause(self):
            print(f"{self.player.name} paused {self.player.current_song}")
            self.player.change_state("paused")

        def next(self):
            self.player.current_song_index += 1
            print(
                f"{self.player.name} is playing the next song {self.player.current_song}"
            )

    @dataclass
    class PausedState(State):
        def play(self):
            print(f"{self.player.name} resumed {self.player.current_song}")
            self.player.change_state("playing")

        def pause(self):
            print(f"{self.player.name} is already paused")

        def next(self):
            print(f"{self.player.name} is paused, cannot play the next song")

    states: ClassVar[Dict[str, type]] = {
        "playing": PlayingState,
        "paused": PausedState,
    }

    @property
    def current_song(self):
        return self.song_list[self.current_song_index]

    def __init__(self, name: str, song_list: List[str]):
        self.name = name
        self.state = Player.PausedState(self)
        self.current_song_index = 0
        self.song_list = song_list

    def change_state(self, state: Literal["playing", "paused"]):
        if state not in self.states:
            raise ValueError(f"Invalid state {state}")
        self.state = self.states[state](self)

    def play(self):
        self.state.play()

    def pause(self):
        self.state.pause()

    def next(self):
        self.state.next()


def main():
    player = Player("Alice", ["Song 1", "Song 2", "Song 3"])
    player.play()
    player.next()
    player.pause()
    player.next()
    player.play()
    player.next()


if __name__ == "__main__":
    main()
```