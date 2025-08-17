---
sidebar_position: 7
---

# 代理模式
**代理模式**为其他对象提供一个代理，以控制对这个对象的访问。代理对象通常在客户端和目标对象之间起到中介作用，可以用于实现延迟加载、访问控制、日志记录等功能。

:::note
读到这里也许会注意到代理模式和 [装饰器模式](./decorator.md) 有些类似，但它们存在区别：
- 代理模式为对象提供了相同的接口，装饰模式则为对象提供加强的接口
- 代理通常自行管理其服务对象的生命周期，而装饰器的生成则总是由客户端进行控制。
:::

## 结构

![代理模式示意图](https://refactoringguru.cn/images/patterns/diagrams/proxy/structure.png)

代理模式中，客户端与高层接口交互，代理和原始服务对象都实现了这个接口。代理对象持有一个对服务对象的引用，客户端通过代理对象来访问服务对象。

## 应用场景

- 延迟初始化（虚拟代理），将对象的初始化推迟到真正需要的时候
- 访问控制（保护代理），控制对对象的访问
- 本地执行远程调用（远程代理），代理对象在本地代表远程对象
- 日志记录（日志代理），记录对对象的访问
- 缓存数据（缓存代理），缓存对象的结果

## 优缺点
### 优点
- 可以在控制服务对象的同时保证对客户端透明
- 如果客户端对服务生命周期不关心，可以由代理对象自行管理
- **开闭原则**：可以在不对服务或客户端做出修改的情况下创建新代理。

### 缺点
- 引入了额外的类，增加了代码复杂度
- 可能存在性能问题，特别是在频繁访问代理对象时

## 代码示例

下面的代码示例展示了一个使用代理模式的 Python 示例。`DatabaseExecutor` 是一个接口，`RealDatabaseExecutor` 是实现了该接口的真实服务对象，它直接执行数据库查询。

`DatabaseProxy` 是代理类，它也实现了 `DatabaseExecutor` 接口。这个代理类控制对 `RealDatabaseExecutor` 的访问。它有两个主要功能：
1.  **访问控制**：在执行查询之前，`_check_access` 方法会检查用户角色。只有 "admin" 用户才能执行查询。
2.  **延迟初始化**：`RealDatabaseExecutor` 对象直到第一次需要执行查询时才会被创建（`_lazy_init`），这可以节省资源。

客户端代码通过 `DatabaseExecutor` 接口与代理或真实对象进行交互，实现了对访问的控制和对客户端的透明。

```python livecodes console=full
# [x] Pattern: Proxy
# To provide a surrogate or placeholder for another object to control access to it

from __future__ import annotations
from abc import ABC, abstractmethod

# --- Subject Interface ---
class DatabaseExecutor(ABC):
    """
    The Subject interface declares common operations for both RealSubject and
    the Proxy. As long as the client works with RealSubject using this
    interface, you'll be able to pass it a proxy instead of a real subject.
    """
    @abstractmethod
    def execute_query(self, query: str) -> None:
        raise NotImplementedError

# --- Real Subject ---
class RealDatabaseExecutor(DatabaseExecutor):
    """
    The RealSubject contains some core business logic. Usually, RealSubjects are
    capable of doing some useful work which may also be very slow or sensitive -
    e.g. correcting input data. A Proxy can solve these issues without any
    changes to the RealSubject's code.
    """
    def execute_query(self, query: str) -> None:
        print(f"Executing query: '{query}' on the main database.")

# --- Proxy ---
class DatabaseProxy(DatabaseExecutor):
    """
    The Proxy has an interface identical to the RealSubject.
    It maintains a reference to an object of the RealSubject class. It can
    be responsible for creating and deleting it.
    """
    def __init__(self, user_role: str):
        self._user_role = user_role
        self._real_executor: RealDatabaseExecutor | None = None
        print(f"Proxy initialized for user with role: '{self._user_role}'.")

    def _check_access(self) -> bool:
        """
        A real-world proxy would perform some access control logic here.
        """
        print("Proxy: Checking access prior to firing a real request.")
        if self._user_role == "admin":
            return True
        print("Proxy: Access denied. User is not an admin.")
        return False

    def _lazy_init(self) -> None:
        """
        Lazy initialization of the RealSubject.
        """
        if self._real_executor is None:
            print("Proxy: Lazily creating a new RealDatabaseExecutor.")
            self._real_executor = RealDatabaseExecutor()

    def execute_query(self, query: str) -> None:
        """
        The most common applications of the Proxy pattern are lazy loading,
        caching, controlling the access, logging, etc. A Proxy can perform
        one of these things and then, depending on the result, pass the
        execution to the same method in a linked RealSubject object.
        """
        if self._check_access():
            self._lazy_init()
            # The proxy delegates the work to the real subject.
            assert self._real_executor is not None
            self._real_executor.execute_query(query)

# --- Client Code ---
def client_code(executor: DatabaseExecutor, query: str) -> None:
    """
    The client code is supposed to work with all objects (both subjects and
    proxies) via the Subject interface in order to support both real subjects
    and proxies.
    """
    print(f"\nClient: Attempting to execute query '{query}'.")
    executor.execute_query(query)

def main() -> None:
    """Main execution function."""
    print("Client: Executing the client code with a real subject:")
    real_executor = RealDatabaseExecutor()
    client_code(real_executor, "SELECT * FROM users")

    print("\n" + "="*30)

    print("Client: Executing the same client code with a non-admin proxy:")
    guest_proxy = DatabaseProxy(user_role="guest")
    client_code(guest_proxy, "DELETE FROM users")

    print("\n" + "="*30)

    print("Client: Executing the same client code with an admin proxy:")
    admin_proxy = DatabaseProxy(user_role="admin")
    client_code(admin_proxy, "UPDATE users SET active = TRUE")


if __name__ == "__main__":
    main()
```