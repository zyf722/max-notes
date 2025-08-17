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

下面的代码示例展示了一个使用外观模式的 Python 示例。`ConversionFacade` 类为复杂的视频处理子系统（包括 `VideoConverter`、`AudioExtractor` 和 `SubtitleManager`）提供了一个简单的接口。客户端代码只需要调用 `ConversionFacade` 的 `process_video` 方法，而无需了解底层各个组件的复杂交互，从而实现了客户端与复杂子系统的解耦。

```python livecodes console=full
# [x] Pattern: Facade
# To provide a simple interface to a complex system

# Why we use it
# When we want to provide a simple interface to a complex system

# --- Complex Subsystem Parts ---
class VideoConverter:
    """A complex part of the video conversion subsystem."""
    def convert(self, filename: str, format: str) -> str:
        print(f"Converting video '{filename}' to {format}...")
        # Simulate conversion
        converted_filename = f"{filename.split('.')[0]}.{format}"
        print(f"Conversion complete: '{converted_filename}'")
        return converted_filename

class AudioExtractor:
    """Another complex part for extracting audio."""
    def extract(self, filename: str) -> str:
        print(f"Extracting audio from '{filename}'...")
        # Simulate audio extraction
        audio_filename = f"{filename.split('.')[0]}.mp3"
        print(f"Audio extracted: '{audio_filename}'")
        return audio_filename

class SubtitleManager:
    """A part for managing subtitles."""
    def add_subtitles(self, video_file: str, subtitle_file: str) -> None:
        print(f"Adding subtitles from '{subtitle_file}' to '{video_file}'...")
        # Simulate adding subtitles
        print("Subtitles added successfully.")

# --- Facade ---
class ConversionFacade:
    """
    The Facade class provides a simple interface to the complex logic of one or
    several subsystems. The Facade delegates the client requests to the
    appropriate objects within the subsystem. The Facade is also responsible for
    managing their lifecycle.
    """
    def __init__(self) -> None:
        self._video_converter = VideoConverter()
        self._audio_extractor = AudioExtractor()
        self._subtitle_manager = SubtitleManager()

    def process_video(self, filename: str, target_format: str, subtitle_file: str | None = None) -> None:
        """
        The Facade's methods are convenient shortcuts to the sophisticated
        functionality of the subsystems.
        """
        print("--- Starting video processing ---")
        converted_video = self._video_converter.convert(filename, target_format)
        self._audio_extractor.extract(converted_video)
        if subtitle_file:
            self._subtitle_manager.add_subtitles(converted_video, subtitle_file)
        print("--- Video processing finished ---")

# --- Client Code ---
def main() -> None:
    """
    The client code works with complex subsystems through a simple interface
    provided by the Facade. When a facade manages the lifecycle of the
    subsystem, the client might not even know about the existence of the
    subsystem's classes.
    """
    facade = ConversionFacade()
    facade.process_video("my_vacation.mov", "mp4", "subtitles.srt")

if __name__ == "__main__":
    main()
```