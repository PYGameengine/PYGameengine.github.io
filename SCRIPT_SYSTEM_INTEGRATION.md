# 游戏编辑器脚本系统集成说明

本文档描述了游戏编辑器与脚本系统的集成实现方案，使得编辑器能够从项目路径中自动加载和运行脚本。

## 实现的功能

1. **项目路径传递**：游戏启动器(GameLauncher)在打开编辑器时，将项目路径作为参数传递给GameEditor
2. **脚本系统初始化**：GameEditor在初始化时，将项目路径传递给ScriptSystem
3. **自动加载脚本**：ScriptSystem接收到项目路径后，自动加载项目scripts目录下的所有Python脚本
4. **脚本执行**：编辑器运行时，会定期调用脚本的Start、Update和OnDestroy方法

## 关键修改

### 1. GameEditor类的修改

在GameEditor类的初始化方法中，添加了设置脚本系统项目路径的代码：

```python
# 初始化游戏系统
self.skybox = Skybox()
self.script_system = ScriptSystem()
# 设置脚本系统的项目路径
if self.project and 'path' in self.project:
    self.script_system.set_project_path(self.project['path'])
    print(f"脚本系统项目路径已设置: {self.project['path']}")
```

### 2. ScriptSystem类的增强

为ScriptSystem类添加了以下功能：

- `project_path`属性：用于存储项目路径
- `set_project_path(project_path)`方法：设置项目路径并自动加载项目中的脚本
- `load_project_scripts()`方法：加载项目scripts目录中的所有Python脚本

## 脚本编写约定

要在游戏编辑器中使用的脚本必须遵循以下约定：

1. 脚本文件应位于项目的`scripts`目录下
2. 脚本文件名应以`.py`结尾（但不是`__init__.py`）
3. 脚本中必须定义一个名为`Script`的类
4. Script类应包含以下方法（可选）：
   - `__init__()`：脚本初始化时调用
   - `Start()`：脚本开始执行时调用
   - `Update(delta_time)`：每一帧更新时调用，delta_time为帧时间间隔
   - `OnDestroy()`：脚本停止执行时调用

## 示例脚本

以下是一个符合约定的示例脚本：

```python
"""示例脚本，用于测试游戏编辑器的脚本系统集成"""

class Script:
    """一个简单的示例脚本类"""
    def __init__(self):
        self.name = "示例脚本"
        self.counter = 0
        print(f"{self.name} 已初始化")
        
    def Start(self):
        """脚本启动时调用"""
        print(f"{self.name} 已启动")
        
    def Update(self, delta_time):
        """每一帧更新时调用"""
        self.counter += delta_time
        if self.counter >= 1.0:  # 每秒打印一次
            print(f"{self.name} 更新中: {self.counter:.2f}秒")
            self.counter = 0
            
    def OnDestroy(self):
        """脚本停止时调用"""
        print(f"{self.name} 已停止")
```

## 测试方法

可以使用以下方法测试脚本系统集成：

### 方法1：使用测试脚本

运行`test_script_integration.py`文件，该文件会：

1. 创建一个临时测试项目
2. 在项目中创建一个测试脚本
3. 启动编辑器并传递项目路径
4. 自动加载并运行脚本

```
python test_script_integration.py
```

### 方法2：手动测试

1. 创建一个项目并在其`scripts`目录下添加脚本文件
2. 通过游戏启动器打开该项目
3. 在编辑器运行时，观察控制台输出，检查脚本是否被正确加载和执行

## 注意事项

- 脚本系统会自动创建不存在的`scripts`目录
- 脚本加载和执行过程中的错误会在控制台输出
- 重新加载脚本功能可以在不重启编辑器的情况下更新脚本