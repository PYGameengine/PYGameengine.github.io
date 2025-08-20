# DLL生成与上传指南

## 问题分析

根据错误信息：`下载版本文件失败: 404 Not Found`，这表明UOS CDN服务器上没有找到所需的`version.txt`文件。要解决这个问题，您需要完成以下两个关键步骤：

1. **生成热更新DLL文件**
2. **上传文件到UOS CDN**

下面提供详细的操作指南。

## 第一步：生成热更新DLL文件

### 方法一：使用Visual Studio创建热更新项目

1. **创建C#类库项目**
   - 打开Visual Studio
   - 选择 `文件 -> 新建 -> 项目`
   - 选择 `类库(.NET Framework)`，框架版本建议选择 `.NET Framework 4.x`（与Unity兼容）
   - 项目名称设置为 `HotFix_Project`，点击 `创建`

2. **添加必要的引用**
   - 在解决方案资源管理器中，右键点击 `引用` -> `添加引用`
   - 点击 `浏览` -> `浏览`
   - 导航到Unity编辑器安装目录下的 `Editor\Data\Managed` 文件夹
   - 添加以下 DLL：
     - `UnityEngine.dll`
     - `UnityEngine.CoreModule.dll`
     - 如果使用了ILRuntime，还需要添加ILRuntime的DLL

3. **添加热更新代码**
   - 在项目中创建`InstanceClass.cs`文件，内容如下：
   ```csharp
   namespace HotFix_Project
   {
       public class InstanceClass
       {
           private int id;
           
           public InstanceClass()
           {
               UnityEngine.Debug.Log("!!! InstanceClass::InstanceClass()");
               this.id = 0;
           }
           
           public InstanceClass(int id)
           {
               UnityEngine.Debug.Log("!!! InstanceClass::InstanceClass() id = " + id);
               this.id = id;
           }
           
           public int ID
           {
               get { return id; }
           }
           
           // static method
           public static void StaticFunTest()
           {
               UnityEngine.Debug.Log("Hotfix v1 : Execute HotFix_Project::InstanceClass.StaticFunTest()");
           }
       }
   }
   ```

4. **生成DLL文件**
   - 右键点击项目，选择 `生成` 或 `重新生成`
   - 生成成功后，DLL文件会位于 `项目目录\bin\Debug\HotFix_Project.dll` 或 `项目目录\bin\Release\HotFix_Project.dll`

### 方法二：在Unity中使用热更新插件（推荐）

1. **安装ILRuntime插件**
   - 从Asset Store或官网下载并安装ILRuntime插件到Unity项目中
   - 确保插件正确导入并可用

2. **创建热更新C#项目**
   - ILRuntime通常会提供创建热更新项目的工具
   - 找到ILRuntime的Tools目录，运行创建热更新项目的脚本或工具
   - 按照向导完成热更新项目的创建

3. **添加热更新代码**
   - 在生成的热更新项目中添加`InstanceClass.cs`文件（内容同上）
   - 可以根据需要添加其他热更新类和方法

4. **编译生成DLL**
   - 使用ILRuntime提供的编译工具或直接在Visual Studio中编译项目
   - 确保生成的DLL文件名为`HotFix_Project.dll`

## 第二步：创建版本文件

1. **创建version.txt文件**
   - 在与DLL文件相同的目录下，创建一个名为`version.txt`的文本文件
   - 文件内容为版本号，例如：`1.0.0`
   - 注意：文件内容中不要包含空格、换行符或其他多余字符

## 第三步：上传文件到UOS CDN

根据您提供的UOS CDN使用说明，以下是详细的上传步骤：

### 使用UOS CDN客户端上传

1. **下载并安装UOS CDN客户端**
   - 通过Package Manager安装UOS CDN客户端
   - 确保客户端版本与Unity项目兼容

2. **登录UOS CDN**
   - 打开UOS CDN客户端
   - 使用提供的凭证登录：
     - App ID: `a4be4856-ee80-4661-aa58-95cbe8c142b9`
     - App Secret: `8a27681633ef49edb0bb60c80454e11a`
   - 或者使用命令行登录：
     ```bash
     uas auth login --uos_app_id a4be4856-ee80-4661-aa58-95cbe8c142b9 --uos_app_secret 8a27681633ef49edb0bb60c80454e11a
     ```

3. **创建和管理Bucket**
   - 点击Bucket左下方的「New」按钮创建新的Bucket
   - 点击「Load」加载所有Bucket
   - 选中需要上传文件的Bucket：`e5beb414-0bfe-4eeb-8295-495e5518f7f1`

4. **上传Entry文件**
   - 点击Entry右侧的「Choose」按钮选择DLL和version.txt文件所在的路径
   - 确保以下文件在选择的路径中：
     - `HotFix_Project.dll`
     - `version.txt`
   - 点击「Sync」完成上传（Sync包含了新建、更新和删除操作）
   - 或者使用命令行上传：
     ```bash
     uas entries sync --bucket e5beb414-0bfe-4eeb-8295-495e5518f7f1 /path/to/your/dll/folder
     ```
   - 注意：将`/path/to/your/dll/folder`替换为实际包含DLL和version.txt文件的目录路径

5. **创建和管理Release**
   - Entry上传成功后，可新建Release
   - 为Release命名并添加描述
   - 点击「Promote」可以将当前Bucket中选中的Release放到其它Bucket中

6. **创建和管理Badge**
   - 为指定Release新建Badge
   - 点击Badge左下角的「Load Url (Badge)」可获取基于当前选中的Badge所构建的Url
   - 这个URL将作为`CDN_URL`配置到`UOSHotUpdateManager.cs`中

## 第四步：验证配置

1. **检查CDN URL配置**
   - 打开`UOSHotUpdateManager.cs`文件
   - 确保`CDN_URL`常量与从Badge获取的URL一致：
   ```csharp
   private const string CDN_URL = "https://a.unity.cn/client_api/v1/buckets/e5beb414-0bfe-4eeb-8295-495e5518f7f1/release_by_badge/latest/content//";
   ```

2. **验证文件上传是否成功**
   - 尝试使用浏览器或下载工具访问`CDN_URL + "version.txt"`
   - 如果能成功下载并看到版本号，则说明上传成功
   - 同样验证`CDN_URL + "HotFix_Project.dll"`是否可访问

## 常见问题排查

1. **404 Not Found 错误**
   - 确认文件是否正确上传到UOS CDN
   - 检查CDN URL是否正确，特别是末尾的斜杠
   - 确认Bucket ID和Badge配置是否正确
   - 等待CDN缓存刷新（通常需要1-2分钟）

2. **DLL加载失败**
   - 确保DLL编译时使用的.NET版本与Unity兼容
   - 检查DLL是否包含正确的命名空间和类名
   - 确认ILRuntime插件已正确安装

3. **上传权限问题**
   - 确认使用的App ID和App Secret具有上传权限
   - 检查Bucket的访问权限设置

4. **版本文件问题**
   - 确保version.txt文件内容仅包含版本号，没有额外字符
   - 版本号格式建议使用X.X.X（例如1.0.0）

## 完整的热更新工作流

1. 修改热更新代码
2. 重新编译生成`HotFix_Project.dll`
3. 更新`version.txt`中的版本号
4. 上传更新后的文件到UOS CDN
5. 在UOS控制台更新Release和Badge
6. 客户端下次启动时会自动检测并应用更新

通过以上步骤，您应该能够成功生成热更新DLL文件并上传到UOS CDN，解决"下载版本文件失败: 404 Not Found"的问题。