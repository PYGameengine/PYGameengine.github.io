# DLL生成方法扩展

本指南补充了<mcfile name="DLL生成与上传指南.md" path="e:\Fps demo\fps\Assets\HotFix\DLL生成与上传指南.md"></mcfile>中未涵盖的其他DLL生成方法，为您提供更多选择。

## 方法三：使用命令行工具生成DLL

命令行方式适合自动化构建流程，也可以在没有安装Visual Studio的环境中使用。

### 使用MSBuild命令行工具

1. **确保MSBuild可用**
   - 如果你安装了Visual Studio，可以在Developer Command Prompt中直接使用MSBuild
   - 或者下载并安装[.NET Build Tools](https://dotnet.microsoft.com/download)

2. **创建热更新项目文件**
   - 创建一个名为`HotFix_Project.csproj`的文件，内容如下：
   ```xml
   <Project Sdk="Microsoft.NET.Sdk">
     <PropertyGroup>
       <TargetFramework>net472</TargetFramework> <!-- 选择与Unity兼容的.NET版本 -->
       <OutputType>Library</OutputType>
       <AssemblyName>HotFix_Project</AssemblyName>
     </PropertyGroup>
     <ItemGroup>
       <!-- 添加UnityEngine引用 -->
       <Reference Include="UnityEngine">
         <HintPath>$(UnityEditorPath)Editor\Data\Managed\UnityEngine.dll</HintPath>
         <Private>False</Private>
       </Reference>
       <Reference Include="UnityEngine.CoreModule">
         <HintPath>$(UnityEditorPath)Editor\Data\Managed\UnityEngine.CoreModule.dll</HintPath>
         <Private>False</Private>
       </Reference>
       <!-- 可选：添加ILRuntime引用 -->
       <Reference Include="ILRuntime">
         <HintPath>$(UnityProjectPath)Assets\Plugins\ILRuntime\lib\ILRuntime.dll</HintPath>
         <Private>False</Private>
       </Reference>
     </ItemGroup>
     <ItemGroup>
       <!-- 添加源文件 -->
       <Compile Include="InstanceClass.cs" />
     </ItemGroup>
   </Project>
   ```

3. **创建源代码文件**
   - 创建`InstanceClass.cs`文件，内容与之前的指南相同

4. **执行构建命令**
   - 打开命令提示符或PowerShell
   - 导航到项目文件所在目录
   - 执行以下命令（替换为实际路径）：
   ```cmd
   msbuild HotFix_Project.csproj /p:UnityEditorPath="C:\Program Files\Unity\Hub\Editor\2021.3.0f1\" /p:UnityProjectPath="E:\Fps demo\fps\" /p:Configuration=Release
   ```

5. **获取生成的DLL**
   - DLL文件将位于项目目录的`bin\Release\net472\HotFix_Project.dll`路径下

### 使用.NET CLI命令行工具

1. **安装.NET SDK**
   - 从[微软官网](https://dotnet.microsoft.com/download)下载并安装.NET SDK

2. **创建类库项目**
   ```cmd
   dotnet new classlib -n HotFix_Project -f net472
   cd HotFix_Project
   ```

3. **添加必要的引用**
   - 创建一个`Directory.Build.props`文件，内容如下（**重要：确保文件格式正确，使用UTF-8无BOM编码**）：
   ```xml
   <Project>
     <PropertyGroup>
       <UnityEditorPath>C:\Program Files\Unity\Hub\Editor\2021.3.0f1\</UnityEditorPath> <!-- 替换为实际的Unity编辑器路径 -->
       <UnityProjectPath>E:\Fps demo\fps\</UnityProjectPath> <!-- 替换为实际的Unity项目路径 -->
     </PropertyGroup>
   </Project>
   ```
   - 在`.csproj`文件中添加UnityEngine引用，如方法三中所示

   **注意**：如果遇到`Data at the root level is invalid. Line 1, position 1`错误，说明Directory.Build.props文件格式有问题。解决方案：
   - 删除现有文件，使用记事本创建新文件
   - 确保文件以UTF-8无BOM格式保存
   - 复制上面的XML内容（不含多余的空格或隐藏字符）

4. **添加热更新代码**
   - 替换默认生成的`Class1.cs`为`InstanceClass.cs`，内容与之前相同

5. **构建项目**
   ```cmd
   dotnet build -c Release
   ```

## 方法四：使用JetBrains Rider IDE生成DLL

如果您使用JetBrains Rider作为主要IDE，可以按照以下步骤生成热更新DLL：

1. **创建热更新项目**
   - 打开Rider
   - 选择 `File -> New Solution`
   - 选择 `Class Library (.NET Framework)`
   - 选择目标框架（推荐`.NET Framework 4.x`）
   - 设置项目名称为`HotFix_Project`，点击 `Create`

2. **添加Unity引用**
   - 在Solution Explorer中，右键点击 `References` -> `Add Reference...`
   - 点击 `Browse` 按钮，导航到Unity编辑器安装目录
   - 添加`UnityEngine.dll`和`UnityEngine.CoreModule.dll`
   - 可选：添加ILRuntime相关DLL

3. **添加热更新代码**
   - 创建`InstanceClass.cs`文件，内容与之前相同

4. **构建项目**
   - 点击顶部菜单的 `Build -> Build Solution`
   - 或使用快捷键 `Ctrl+Shift+B`
   - 生成的DLL文件将位于`bin\Debug`或`bin\Release`目录下

## 方法五：使用MonoDevelop IDE生成DLL

MonoDevelop是Unity官方推荐的跨平台IDE，适合Linux和macOS用户：

1. **创建热更新项目**
   - 打开MonoDevelop
   - 选择 `File -> New -> Solution`
   - 选择 `C# -> Library`
   - 设置项目名称为`HotFix_Project`，点击 `Next` -> `Create`

2. **添加Unity引用**
   - 在Solution Pad中，右键点击 `References` -> `Edit References...`
   - 切换到 `.Net Assembly` 标签页
   - 点击 `Browse` 按钮，导航到Unity编辑器安装目录
   - 添加`UnityEngine.dll`和`UnityEngine.CoreModule.dll`

3. **添加热更新代码**
   - 创建`InstanceClass.cs`文件，内容与之前相同

4. **构建项目**
   - 点击顶部菜单的 `Build -> Build All`
   - 或使用快捷键 `F8`
   - 生成的DLL文件将位于项目目录下的`bin`文件夹中

## 方法六：使用自动化构建脚本

对于团队开发或持续集成环境，可以使用自动化构建脚本：

### PowerShell构建脚本（Windows）

创建一个名为`Build-HotFix.ps1`的脚本：

```powershell
# 配置参数
$unityEditorPath = "C:\Program Files\Unity\Hub\Editor\2021.3.0f1\"
$outputDir = "E:\Fps demo\fps\Assets\StreamingAssets\HotFix"
$version = "1.0.0"

# 创建输出目录
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# 构建热更新DLL（假设项目已创建）
Set-Location "E:\Path\To\HotFix_Project"
dotnet build -c Release

# 复制DLL到输出目录
Copy-Item -Path "bin\Release\net472\HotFix_Project.dll" -Destination "$outputDir\HotFix_Project.dll" -Force

# 创建版本文件
Set-Content -Path "$outputDir\version.txt" -Value $version

Write-Host "热更新文件构建完成！版本：$version"
Write-Host "输出目录：$outputDir"
```

### Bash构建脚本（macOS/Linux）

创建一个名为`build-hotfix.sh`的脚本：

```bash
#!/bin/bash

# 配置参数
unity_editor_path="/Applications/Unity/Hub/Editor/2021.3.0f1/"
output_dir="/path/to/unity/project/Assets/StreamingAssets/HotFix"
version="1.0.0"

# 创建输出目录
mkdir -p "$output_dir"

# 构建热更新DLL
cd /path/to/hotfix/project
dotnet build -c Release

# 复制DLL到输出目录
cp "bin/Release/net472/HotFix_Project.dll" "$output_dir/HotFix_Project.dll" -f

# 创建版本文件
echo -n "$version" > "$output_dir/version.txt"

# 输出结果
 echo "热更新文件构建完成！版本：$version"
 echo "输出目录：$output_dir"
```

## 方法七：使用Unity的Assembly Definition文件

对于简单的热更新需求，可以直接在Unity项目中使用Assembly Definition文件来生成DLL：

1. **创建热更新代码目录**
   - 在Unity项目的`Assets`目录下创建一个名为`HotFixCode`的文件夹

2. **创建Assembly Definition文件**
   - 在`HotFixCode`文件夹上右键，选择 `Create -> Assembly Definition`
   - 将其命名为`HotFix_Project`
   - 在Inspector面板中，添加必要的引用（如`UnityEngine.CoreModule`）

3. **添加热更新代码**
   - 在`HotFixCode`文件夹中创建`InstanceClass.cs`文件
   - 编写热更新代码（与之前相同）

4. **构建DLL**
   - 当Unity编译项目时，会自动在`Library/ScriptAssemblies`目录下生成`HotFix_Project.dll`
   - 注意：这种方法生成的DLL可能包含Unity编辑器相关代码，不适合所有热更新场景

## 不同方法的优缺点比较

| 生成方法 | 优点 | 缺点 | 适用场景 |
|---------|------|------|---------|
| Visual Studio | 功能完整，调试方便 | 安装体积大 | Windows用户，需要完整IDE功能 |
| ILRuntime插件 | 与热更新框架集成紧密 | 需要购买插件 | 使用ILRuntime的Unity项目 |
| MSBuild命令行 | 自动化友好，轻量级 | 配置复杂 | 构建脚本，CI/CD环境 |
| .NET CLI | 跨平台，配置简单 | 不支持某些旧版.NET功能 | 跨平台开发环境，现代.NET项目 |
| JetBrains Rider | 功能强大，跨平台 | 商业软件需付费 | 专业开发环境，JetBrains用户 |
| MonoDevelop | 免费，跨平台 | 功能相对简单 | Linux/macOS用户，轻量级开发 |
| 自动化构建脚本 | 适合团队协作，重复执行 | 初始配置复杂 | 团队开发，持续集成环境 |
| Unity Assembly Definition | 与Unity无缝集成 | 可能包含编辑器代码 | 简单热更新需求，快速测试 |

## 推荐的工作流程

根据项目规模和团队情况，推荐以下工作流程：

1. **个人开发者**：使用方法二（ILRuntime插件）或方法一（Visual Studio）
2. **小型团队**：使用方法二（ILRuntime插件）结合方法六（自动化脚本）
3. **大型项目**：使用方法六（自动化脚本）结合CI/CD系统
4. **跨平台开发**：使用方法四（JetBrains Rider）或方法三（.NET CLI）

## 注意事项

1. 无论使用哪种方法，确保生成的DLL文件名为`HotFix_Project.dll`
2. 确保使用与Unity兼容的.NET Framework版本（通常为4.x系列）
3. 避免在热更新DLL中引用过多的外部依赖，保持DLL体积小
4. 定期备份生成的DLL文件和对应的源代码版本
5. 在上传到CDN前，建议使用工具（如IL2CPP Inspector）检查DLL的兼容性

通过这些扩展方法，您可以根据自己的开发环境和需求选择最适合的热更新DLL生成方式，提高开发效率。