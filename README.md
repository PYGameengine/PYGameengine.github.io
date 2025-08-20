# UOS热更新项目使用说明

## 项目结构
- `InstanceClass.cs`: 热更新DLL中的测试类
- `HotFixLoader.cs`: 负责热更新流程控制的Unity脚本
- `UOSHotUpdateManager.cs`: UOS热更新管理器，负责版本检查、下载和本地缓存管理
- `README.md`: 使用说明文档

## 前提条件
1. 安装ILRuntime插件到Unity项目
2. 确保已注册UOS账号并创建Bucket
3. 准备Unity UI元素用于显示热更新进度和状态

## 核心类说明

### UOSHotUpdateManager
这是热更新系统的核心管理器，提供以下功能：
- 版本检查（从UOS CDN获取版本文件并与本地版本比较）
- 热更新DLL下载（支持进度反馈）
- 本地缓存管理（保存下载的DLL和版本信息）
- 提供单例访问模式

### HotFixLoader
负责协调热更新流程并与ILRuntime交互：
- 初始化UOSHotUpdateManager
- 控制热更新流程（检查更新 -> 下载更新 -> 加载DLL）
- 处理热更新UI显示
- 加载DLL并初始化ILRuntime环境
- 调用热更新代码

### InstanceClass
热更新DLL中的测试类，用于验证热更新是否成功。

## 使用UOS CDN

### 1. 下载并安装
通过Package使用UOS CDN

### 2. 操作简介
UOS CDN的主要功能模块分为四个部分：Bucket、Entry、Release、Badge。

#### 创建和管理Bucket
- 点击Bucket左下方的「New」按钮创建新的Bucket
- 点击「Load」加载所有Bucket
- 选中需要继续操作的Bucket

#### 上传Entry文件
- 点击Entry右侧的「Choose」按钮选择要上传的文件所在的路径
- 点击「Sync」完成上传（Sync包含了新建、更新和删除操作）
- 需要上传的文件：
  - `HotFix_Project.dll`: 热更新DLL文件
  - `version.txt`: 版本文件（内容为版本号，如1.0.0）
- 推荐使用提供的凭证上传：
  ```
  uas auth login --uos_app_id a4be4856-ee80-4661-aa58-95cbe8c142b9 --uos_app_secret 8a27681633ef49edb0bb60c80454e11a
  uas entries sync --bucket e5beb414-0bfe-4eeb-8295-495e5518f7f1 /path/to/your/dll/folder
  ```

#### 创建和管理Release
- Entry上传成功后，可新建Release
- 通过「Promote」将当前Bucket中选中的Release放到其它Bucket中

#### 创建和管理Badge
- 可为指定Release新建Badge
- 用「Update」更新指向
- Badge左下角的「Load Url (Badge)」可获取基于当前选中的Badge所构建的Url
- 这个URL将作为`CDN_URL`配置到`UOSHotUpdateManager.cs`中

## 配置Unity项目

### 1. 设置CDN URL
在`UOSHotUpdateManager.cs`中修改`CDN_URL`常量为您从UOS控制台获取的实际CDN URL：
```csharp
private const string CDN_URL = "https://your-uos-cdn-url/";
```

### 2. 设置热更新UI

#### 创建热更新UI元素
在Unity编辑器中创建以下UI元素：

1. **创建Canvas**
   - 在Hierarchy窗口右键 -> UI -> Canvas
   - 将Canvas的Render Mode设置为"Screen Space - Overlay"
   
2. **创建热更新面板**
   - 在Canvas下创建一个Panel作为热更新面板的根物体
   - 调整面板的大小、位置和样式（建议居中显示）
   - 添加背景图片或设置BackgroundColor使其清晰可见
   
3. **添加状态文本**
   - 在Panel下创建一个Text组件
   - 命名为"StatusText"
   - 设置合适的字体大小、颜色和对齐方式
   - 初始文本可以设为"正在检查更新..."
   
4. **添加进度条**
   - 在Panel下创建一个Slider组件
   - 命名为"ProgressSlider"
   - 设置Direction为"Left To Right"
   - 调整大小和位置，使其位于状态文本下方
   - 可以自定义Slider的外观（如背景、填充区域的颜色）
   
5. **添加可选的UI元素（推荐）**
   - **取消按钮**：添加Button组件，命名为"CancelButton"
   - **版本文本**：添加Text组件，命名为"VersionText"，用于显示版本信息
   - **提示图标**：添加Image组件，用于显示不同状态的图标

#### 挂载脚本

有两种方式可以配置热更新UI：

**方法一：使用HotUpdateUIConfig脚本（推荐）**

1. 在热更新面板的根物体上添加`HotUpdateUIConfig`脚本
2. 在Inspector窗口中，将创建的UI元素拖拽到对应的字段中：
   - `updatePanel`：拖拽Panel对象
   - `statusText`：拖拽StatusText对象
   - `progressSlider`：拖拽ProgressSlider对象
   - （可选）`cancelButton`：拖拽CancelButton对象
   - （可选）`versionText`：拖拽VersionText对象
3. 配置进度条颜色（根据需要）
4. 这样配置后，`HotUpdateUIConfig`会在Start时自动将UI引用设置给`HotFixLoader`

**方法二：直接配置HotFixLoader脚本**

1. 在场景中找到挂载了`HotFixLoader`脚本的GameObject
2. 在Inspector窗口中，将创建的UI元素拖拽到对应的字段中：
   - `updatePanel`：拖拽Panel对象
   - `updateStatusText`：拖拽StatusText对象
   - `updateProgressSlider`：拖拽ProgressSlider对象

#### 推荐的挂载位置

- `HotFixLoader`脚本：建议挂载在一个名为"HotFixSystem"的空GameObject上，该对象应该放在游戏启动场景中
- `HotUpdateUIConfig`脚本：建议直接挂载在热更新面板的根物体（Panel）上
- `UOSHotUpdateManager`脚本：会由`HotFixLoader`自动创建，不需要手动挂载

这样的结构设计可以使热更新系统的各个组件职责明确，便于管理和维护。

### 3. 添加脚本到场景
1. 在Unity场景中创建一个空GameObject
2. 将`HotFixLoader`脚本添加到该GameObject上
3. 确保在游戏启动时会加载包含该脚本的场景

## 热更新流程

### 客户端流程
1. 游戏启动时，`HotFixLoader`会初始化`UOSHotUpdateManager`
2. 检查是否有新版本（通过比较本地版本和CDN上的version.txt）
3. 如果有新版本，下载热更新DLL到本地缓存
4. 从本地缓存加载热更新DLL
5. 初始化ILRuntime并执行热更新代码

### 服务端更新流程
1. 修改`InstanceClass.cs`或添加新的热更新代码
2. 重新编译生成`HotFix_Project.dll`
3. 更新`version.txt`中的版本号
4. 上传更新后的文件到UOS CDN
5. 在UOS控制台更新Release和Badge
6. 客户端下次启动时会自动检测并应用更新

## 调试技巧

### 查看热更新日志
所有热更新相关操作都会在Unity控制台输出日志，您可以通过这些日志了解热更新流程的执行情况。

### 清除本地缓存
如果需要测试更新效果，可以使用`UOSHotUpdateManager.Instance.ClearHotfixCache()`方法清除本地缓存。

### 检查当前版本
可以使用`UOSHotUpdateManager.Instance.GetCurrentVersion()`方法获取当前客户端的热更新版本。

## 注意事项

- 首次运行可能需要等待CDN缓存刷新（约1分钟）
- 确保ILRuntime版本与项目兼容
- 生产环境中建议完善错误处理和重试机制
- 热更新DLL的大小应尽量控制，以减少下载时间
- 在弱网络环境下，建议添加下载超时和断点续传功能
- 热更新代码应避免使用不安全的反射操作

## 扩展建议

1. **增量更新**：实现基于文件差异的增量更新，减少下载流量
2. **资源热更新**：扩展系统支持纹理、音频等资源的热更新
3. **签名验证**：为热更新DLL添加数字签名验证，提高安全性
4. **后台更新**：实现游戏运行时的后台静默更新
5. **更新策略**：根据网络状况和设备性能动态调整更新策略

## 常见问题排查

1. **热更新检查失败**：检查CDN URL是否正确，version.txt文件是否存在
2. **DLL加载失败**：确认DLL编译时使用的.NET版本与Unity兼容
3. **方法调用失败**：检查热更新代码中的类名和方法名是否正确
4. **性能问题**：热更新代码的执行效率可能略低于原生代码，应避免在性能敏感位置使用热更新

通过以上步骤，您可以实现一个完整的基于UOS CDN的Unity热更新系统。