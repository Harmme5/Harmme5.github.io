---
title: ROS1 noetic学习
slug: ros-study-1p5djp
url: /post/ros-study-1p5djp.html
date: '2026-03-06 20:58:44+08:00'
lastmod: '2026-03-29 15:39:40+08:00'
toc: true
isCJKLanguage: true
---

# ROS学习

# 1.Ros是什么

谷歌在Arm和Linux基础上，做了安卓系统，只需要开发一次，就能在大多数安卓机上运行。

以前，机器人没有统一的操作系统，每做一个机器人，都要软件-硬件重新来一遍

ROS:An Open-Source Robot Operating System

单片机可以控制的东西，Ros都可以控制，Ros和安卓一样，**本质由很多功能不同的APP组成**，通过不同APP组合，得到不同效果,ROS+GMapping=扫描建图机器人，Ros+Movebase=自主导航机器人

![](http://127.0.0.1:7319/assets/2-20260210205844-rosntqy.png)

Ros个launch相当于乐高房子，每个Node相当于乐高砖块，比如雷达_node,机械臂-node

![](http://127.0.0.1:7319/assets/1-20260210205844-gxwj6e9.png)

![](http://127.0.0.1:7319/assets/3-20260210205844-jv4smh0.png)

# 2.如何学习Ros

首先，安装Ubuntu和ROS

## Ros版本选择

- 项目要求
  
  尽量选择项目原版本的ROS
  
  尽量最新ROS

- 找实验对象（实践），不动手操作听完就忘了
  
  https://github.com/6-robot
  
  若没有实体机器人，用仿真平台，Ros许多功能是独立分支，前后无继承关系

# 3.安装Ros软件包

就像是安装安卓APP

ros-ROS版本名-Name，Name是ros index的软件包名

以rqt_robot_steering为例，

```
sudo apt install ros-noetic-rqt-robot-steering
```

# 4.启动ROS

启动安卓APP，需要先启动安卓

新建一个终端，先**启动ROS核心**

```
roscore
```

> [!NOTE]
> 启动roscore的同时，ros系统里会自带话题rosout和rosout_agg
> 
> rosout :<span data-type="text" style="white-space:pre">    </span>所有话题的日志
> 
> rosout_agg :  统一的聚合日志

![image](http://127.0.0.1:7319/assets/image-20260303154534-66wprhf.png)

**两个话题的核心区别**

- /rosout：原始实时日志流
  
  - 各个节点直接往这里发 rosgraph\_msgs/Log 消息。
  - 你订阅 /rosout 时，只能看到从你订阅之后产生的新日志。
  - 更“底层”、更接近每个节点原始输出。

- /rosout\_agg：聚合后的日志流（带历史）
  
  - 由 /rosout 节点发布，也是 rosgraph\_msgs/Log 类型，但：
  - 会带上已经缓存的一段历史日志（所以你一 rostopic echo /rosout\_agg，往往能立刻看到之前的几条/几十条日志）。
  - 专门给 rqt\_console、rxconsole 这类日志工具用，方便一次性看到“过去 + 现在”的日志。
  - 有点像是：系统级“日志汇总出口”。

**启动速度控制程序**

```
rosrun rqt_robot_steering rqt_robot_steering 
        包名称                节点名称
```

安装ROS仿真小乌龟

```
sudo apt install ros-noetic-turtlesim 
```

**启动ROS仿真小乌龟**

```
rosrun turtlesim turtlesim_node
```

# 5.Github下载包

## **Step1 设置工作空间**

以软件包wpr_simulation为例

```
mkdir catkin_ws && cd catkin_Ws
```

```
mkdir src && cd src
```

```
git clone https://github.com/6-robot/wpr_simulation.git
```

在scripts文件夹里找到.***.sh，这个是依赖安装脚本文件，运行即可自动安装所需要的依赖![](http://127.0.0.1:7319/assets/4-20260210205844-rbp27s6.png)

安装完依赖，可以开始编译

```
cd ~/catkin_ws/ && catkin_make //对src目录的所有源代码进行编译
```

用source指令载入工作空间的环境设置，否则运行指令会提示找不到里边的软件包，用roslaunch运行编译好的ros程序

```
source ~/catkin_ws/devel/setup.bash
```

```
roslaunch wpr_simulation wpb_simple.launch
```

![](http://127.0.0.1:7319/assets/5-20260210205844-liocbgl.png)

可以用速度控制软件控制其移动

**启动速度控制程序**

**Tips**

1.source指令添加到.bashrc，每次启动终端就可以直接运动ros程序了

2.git clone得来的小乌龟，默认是ros2.0，这样可以切换为ros1.0

![](http://127.0.0.1:7319/assets/6-20260210205844-mjx7ktx.png)

**Github搜索引擎的强大，学习如何过滤**

# 6.Terminator超级终端

## 快捷键

Ctrl+Shift+E 垂直分屏

Ctrl+Shift+O 水平分屏

Alt+左箭头，切换到左边的终端

Ctrl+Shift+W 刚刚的窗口关闭，回退状态

# 7.Node节点和Package包

## Package包

与安卓不同，无法下载单个Node，而是以“包”为单位安装，**可以将包理解为节点的容器**，节点不能脱离包单独存在

### 创建Package包(视频有总结)

```
cd catkin_ws/src/
catkin_create_pkg ssr_pkg rospy roscpp std_msgs
```

catkin_create_pkg    <包名>    <依赖项列表>

[^依赖项]: 关系密切的节点会放在一个包里，但是有些节点，通用性很强，与多数节点强关联，放在哪个包都不合适。类似C语言中的“stdio.h”，依赖项尽量选择系统中已经存在的包，防止报错
[^rospy、roscpp]: 对两种语言的支持
[^std_msgs]: 标准消息包,

当看到package.xml，该文件夹即有可能是一个package包

### 回访依赖项

```
roscd roscpp或rospy
```

### ros包存放位置

/opt/ros/<ros版本>/share

来源：sudo apt-get install ros-<ros版本>-desktop-full 基础包

    sudo apt-get install ros-<ros版本>-xxx 独立扩展包

#### 与Catkin文件夹中包的区别

ros包里都是可执行程序，而catkin里的是源码文件，需要编译为可执行程序才能运行

![](http://127.0.0.1:7319/assets/7-20260210205844-zrgintp.jpg)

上图是./bashrc文件，第一条指令代表apt下载的软件包地址，第二条指令是catkin工作空间的软件地址

安卓手机由许多APP组成，使用ROS实际上使用ROS的一些节点，导航、控制底盘、驱动雷达

## 节点的基本结构

### 创建Node节点

以超声波节点为例子，在ssr_pkg/ssr中新建chao_node.cpp

![](http://127.0.0.1:7319/assets/8-20260210205844-3jraa3m.jpg)

# 8.Topic话题与Message消息

节点与节点之间通讯

## 常用工具

![](http://127.0.0.1:7319/assets/13-20260210205844-scqwao7.jpg)

![](http://127.0.0.1:7319/assets/9-20260210205844-ytxc3zd.jpg)

主动发布话题：Publisher（左边）        被刷屏的右边：订阅者Subscriber

![](http://127.0.0.1:7319/assets/10-20260210205844-0otes7u.jpg)

![](http://127.0.0.1:7319/assets/11-20260210205844-s3d6edc.jpg)

## std_msgs

类型：http://docs.ros.org/en/noetic/api/std_msgs/html/index-msg.html

## C++实现

### Publisher和subscriber的C++实现结构图

![](http://127.0.0.1:7319/assets/14-20260210205844-yt7wk9a.jpg)

### Publisher的C++实现

![](http://127.0.0.1:7319/assets/12-20260210205844-j4wuw9w.jpg)

![image](http://127.0.0.1:7319/assets/image-20260303145755-sqqqmua.png)

### Subscriber的C++实现

![image](http://127.0.0.1:7319/assets/image-20260303155157-2aj13gi.png)

```c++
sub = nh.subscribe("话题名称" , 缓存长度 , 回调函数);
```

## PY实现

### Publisher的PY实现

> [!NOTE] ✏️ 新建软件包后只编译1次
> 编译后，软件包就能进入ros软件包列表
> 
> 后续都无需再编译 **（这是与C++不同的地方）**

1. ![image](http://127.0.0.1:7319/assets/image-20260303145832-4e6bp0d.png)
   
   ‍

2. 代码写完后，更改chao_node.py的权限
   
   > chmod : change mod
   > 
   > +x <span data-type="text" style="white-space:pre">    </span>  : execute
   
   ```undefined
   cd ~/.catkin_ws/scripts
   chmod +x chao_node.py
   ```

### Subscriber的PY实现

![image](http://127.0.0.1:7319/assets/image-20260303155235-yf505ah.png)

## 话题不只属于发布者或订阅者

而由ROS系统创建管理，只要Node向NodeHandle大管家提出的话题发布需求或者话题订阅需求，话题就会被自动创建

## 话题的订阅步骤/查看节点网络

![](http://127.0.0.1:7319/assets/15-20260210205844-9oze4um.jpg)

[^spinonce函数]: 不局限于while函数内，必要时即可调用，回头看一眼消息
[^rqt_graph]: 图形化显示正在运行的节点间，通讯话题关系

# 9.launch文件启动节点

## 机制

launch文件是一种遵循XML语法的描述文件

![](http://127.0.0.1:7319/assets/16-20260210205844-ykh7ku8.jpg)

如上图，上下分行，是为了方便阅读，但第二个小纸盒是空的，就可以写成

```
<大纸盒>
<小纸盒 颜色= “黄色” />
</大纸盒>
```

**如果有两个小纸盒**

```
<大纸盒>
<小纸盒      颜色= “黄色” />
<又一个小纸盒 颜色= “黄色” />
</大纸盒>
```

![](http://127.0.0.1:7319/assets/17-20260210205844-vhk5cjl.jpg)

![](http://127.0.0.1:7319/assets/18-20260210205844-2wix9wh.jpg)

![](http://127.0.0.1:7319/assets/19-20260210205844-95ap5rm.jpg)

[^roscore]: launch文件没有roscore的描述，因为其不是独立节点，而launch文件的机制：只要包含了节点的描述，都会自动启动roscore

## 编写运行launch文件

### 存放位置

某个软件包的文件夹里，哪怕是子目录，为了直观和便于管理，新建launch文件夹

```xml
<launch>
    <node pkg="ssr_pkg" type="yao_node"  name="yao_node"/>

    <node pkg="ssr_pkg" type="chao_node" name="chao_node" />

    <node pkg="atr_pkg" type="ma_node"   name="ma_node" />
</launch>
```

运行结果：只有yao_node的消息

```xml
<launch>
    <node pkg="ssr_pkg" type="yao_node"  name="yao_node"/>

    <node pkg="ssr_pkg" type="chao_node" name="chao_node" />

    <node pkg="atr_pkg" type="ma_node"   name="ma_node" output="screen"/>
</launch>
```

运行结果：既有Publisher的消息，也有Subscriber的消息，即所有节点的消息在一个终端里输出，如果要调试其中某个节点呢？

```xml
<launch>
    <node pkg="ssr_pkg" type="yao_node"  name="yao_node"/>

    <node pkg="ssr_pkg" type="chao_node" name="chao_node" launch.prefix = "gnome-terminal -e"/>

    <node pkg="atr_pkg" type="ma_node"   name="ma_node" output="screen"/>

</launch>
```

```xml
<node pkg="ssr_pkg" type="chao_node" name="chao_node" launch.prefix = "gnome-terminal -e"/>
```

gnome-terminal是ubuntu自带的终端程序，"gnome-terminal -e"的意思是使用一个新的终端程序去运行这个节点

运行结果：yao_node和

**运行**

```bash
roslaunch atr_pkg kai_hei.launch
```

## 小结

![](http://127.0.0.1:7319/assets/20-20260210205844-7kb3djz.jpg)

用途：阅读新包时，可以通过launch文件入手，看里面要运行哪些节点

# 9.ROS机器人运动控制C++实现

## 坐标系正方向

![](http://127.0.0.1:7319/assets/21-20260210205844-mff95lg.jpg)

![](http://127.0.0.1:7319/assets/22-20260210205844-rs1npjw.jpg)

## 速度量纲

矢量运动：m/s

旋转运动：rad/s ，弧度每秒

![](http://127.0.0.1:7319/assets/23-20260210205844-7c6x9q5.jpg)

## 软件包示例-geometey_msgs

​    当拿到一个机器人，其配套程序源码中会有一个机器人的核心节点，该核心节点能直接驱动机器人的底层硬件，同时该节点会向上订阅一个**速度话题**，只需要编写一个新的节点，向速度话题(/cmd_vel)发送消息包，即可实现对机器人的速度控制

![](http://127.0.0.1:7319/assets/24-20260210205844-s561aj2.jpg)

## C++实现

---

运行及结果

```bash
roslaunch wpr_simulation wpb_simple.launch
```

```bash
rosrun wpr_simulation demo_vel_ctrl
```

借助wpr_simulation来仿真

![](http://127.0.0.1:7319/assets/25-20260210205844-qdqrqg6.jpg)

# 10.Rviz观测传感器数据

The Robot Visualization Tool，方便对机器人状态实时观测的辅助工具

## 与gazebo区别

gazebo模拟真实环境，rviz只接收传感器数据，并对其做可视化

## 使用方法

法一、打开终端，输入以下代码运行rviz

```bash
rviz
```

法二、在launch文件里自动加载rviz配置文件

```bash
roslaunch wpr_simulation wpb_rviz.launch
```

# 11.激光雷达消息包格式

## 如何查看

```bash
rostopic echo /scan --noarr
```

用rostopic echo查看/scan话题的内容，--noarr：折叠数组

## sensor_msgs数据格式说明

![](http://127.0.0.1:7319/assets/26-20260210205844-qa3ge0x.jpg)

[^相邻两次测距]: 激光射出去再回来，完成一次测距行为，然后雷达旋转一个角度，再来一次测距
[^angle_increment、time_increment]: 在无人机、赛车上用的多，主要用来修正运动过程中雷达测距点阵的形变，低速运动的机器人来说，可以不考虑该形变的影响
[^scan_time]: 由于相邻的两次扫描首尾相连，该值为**单次扫描的持续时间/雷达转一周耗费时间**，主要用来计算雷达的扫描频率，1/scan_time
[^ranges数组]: 最重要的数据，排列顺序：起始角度～终止角度，有些数据无穷大，是测不到
[^intensities数组]: 数据越大，信号强度越强，得到的测距数值更可信

# 12.获取激光雷达数据的C++节点

## 例程

```bash
roslaunch wpr_simulation wpb_simple.launch
```

```bash
rosrun wpr_simulation demo_lidar_data
```

## 实现

### 思路

    激光雷达节点（通常由雷达厂商提供），雷达测距数值从电路系统传递到雷达节点，被封装为一个消息包，发布到一个topic话题（/scan）中

![](http://127.0.0.1:7319/assets/27-20260210205844-p2teny0.jpg)

### 步骤

![](http://127.0.0.1:7319/assets/28-20260210205844-qtzvqov.jpg)

```bash
catkin_create_pkg lidar_pkg roscpp rospy sensor_msgs
```

![](http://127.0.0.1:7319/assets/29-20260210205844-75y80d7.jpg)

[^正前方]: ranges[180]

# 13.激光雷达避障的C++节点

<div>
<!--既是发布者，又是订阅者-->
</div>

## 目前已经实现的效果

![](http://127.0.0.1:7319/assets/30-20260210205844-m2nxhof.jpg)

## 实现步骤

![](http://127.0.0.1:7319/assets/31-20260210205844-v7xjfd7.jpg)

## 运行

```bash
roslaunch wpr_simulation wpb_simple.launch
```

```bash
rosrun lidar_pkg lidar_node
```

# 14.IMU惯性测量单元消息包sensor_msgs

![](http://127.0.0.1:7319/assets/32-20260210205844-xeqh1i7.jpg)

[^orientation]: 数值融合得到的空间姿态描述，若不满意，可以自行融合，描述的是yaw、roll、pitch角
[^angular_velocity]: 角速度
[^linear_acceleration]: 线性加速度

![](http://127.0.0.1:7319/assets/33-20260210205844-1dclg76.jpeg)

[^Quaternion类型]:
[^x，y，z，w]: 四元数描述法，只有xyz会出现万向锁问题

# 15.获取IMU数据的C++节点

## IMU的三个话题

![](http://127.0.0.1:7319/assets/34-20260210205844-j5r2ct0.jpg)

[^imu/data_raw]: 裸数据消息
[^imu/data]: 用的较多
[^imu/mag]: 九轴才有

## 实现思路

![](http://127.0.0.1:7319/assets/35-20260210205844-ql6rov4.jpg)

## 步骤

![](http://127.0.0.1:7319/assets/36-20260210205844-vcvcn6z.jpg)

# 16.IMU航向锁定的C++节点

使一个节点在订阅IMU数据的同时，还能发布运动控制指令，使机器人能够对姿态的变化作出反应，实现航向锁定的效果

在IMU数据C++节点基础上更改

---

## 思路

![](http://127.0.0.1:7319/assets/37-20260210205844-0nxf6k5.jpg)

## 步骤

![](http://127.0.0.1:7319/assets/38-20260210205844-wnwtd0u.jpg)

# 17.标准消息包std_msgs

## 标准消息包分类

![](http://127.0.0.1:7319/assets/39-20260210205844-4kcz55x.jpg)

[^基础类型Empty]: 不传输任何数据，只把消息包当作一个信号来使用
[^结构体类型]: 把一些互相关联的数据整合在一起，放置到一些比较复杂的消息格式里，起到简化消息结构的作用
[^ColorRGBA]: 包含了红绿蓝、透明度，四个分量的结构体
[^Duration]: 相对时间，可正和负
[^TIme]: J绝对时间，是无符号类型
[^Header]: J记录了时间戳和坐标系名称的结构体，后面遇到的所有包含“Stamped”关键词的消息类型，都会包含Header结构体
[^MulitArrayDimension/Layout]: Y用来描述数组内容的结构体，数组类型消息包里都会包含这两个结构体

# 18.geometry_msgs & sensor_msgs

## 常用消息包类型

![](http://127.0.0.1:7319/assets/40-20260210205844-8jewwl2.jpg)

最常用：geometry_msgs、sensor_msgs

## 几何消息包

![](http://127.0.0.1:7319/assets/41-20260210205844-vctxnxl.jpg)

[^Stamped]: S这些消息包带有“Header”，多了时间和坐标系ID

## 传感消息包

![](http://127.0.0.1:7319/assets/42-20260210205844-0lu67hc.jpg)

[^激光雷达]: 单线、多线
[^单点测距]: 超声、红外测距传感器
[^流体压力]: 液压、气压测量数值
[^全球定位]: 通过北斗、GPS等得到的经纬度数值
[^运动关节]: 关节名称、关节角度、关节运动速度
[^控制手柄]: 手柄上的摇杆位置、按钮状态
[^电池状态]: 电池电压、温度、充放电状态等一系列信息
[^时钟源]: 有些机器人为了更高的控制精度，选择使用外部时钟源

# 19.自定义消息类型

## 步骤

### 创建消息包及依赖

```bash
catkin_create_pkg **_msgs roscpp rospy message_generation message_runtime
```

[^message_generation message_runtime]: 消息包生成和运行时所需要的依赖项

### .msg文件内容构建

qq_msgs/msg/carry.msg，新建msg文件夹，并新建.msg文件，内容如下图所示

```.msg文件
string grade //段位信息
int64 star     //星数
string data  //消息
```

![](http://127.0.0.1:7319/assets/43-20260210205844-5091t55.jpg)

### 编译文件构建

![](http://127.0.0.1:7319/assets/44-20260210205844-rxjs1tg.png)

改为

![](http://127.0.0.1:7319/assets/46-20260210205844-lbef1cb.png)

若有多的消息类型，往下排列即可

---

![](http://127.0.0.1:7319/assets/45-20260210205844-s44x3cg.png)

改为

![](http://127.0.0.1:7319/assets/47-20260210205844-tiym3xd.png)

表明新的消息类型需要依赖的其他消息包列表，因为只用了std_msgs的string和int类型，所以只写了std_msgs

---

![](http://127.0.0.1:7319/assets/48-20260210205844-mq1jhzb.png)

改为

![](http://127.0.0.1:7319/assets/49-20260210205844-u5y8ekk.png)

确认“message_runtime”的存在，是为了让依赖咱们这个新建消息包的其他软件包，能够在运行时使用新定义的消息类型

---

### 检验package.xml文件

![](http://127.0.0.1:7319/assets/50-20260210205844-wbifqsa.png)

确保“build_depend"和”exec_depend“都列出了"**message_generation**"和"**message_runtime**"，缺失的话就补全，如图

![](http://127.0.0.1:7319/assets/51-20260210205844-v2yuzon.png)

### 编译

```
cd catkin_ws
catkin_make
```

### 查看消息类型是否进入ROS消息列表

```
rosmsg show qq_msgs/Carry
```

![](http://127.0.0.1:7319/assets/52-20260210205844-rmzu1ul.png)

和自定义的一模一样，至此，新的消息类型诞生。

### 步骤小结

![](http://127.0.0.1:7319/assets/53-20260210205844-x11jqhb.jpg)

# 20.在ROS中使用自定义消息类型-C++实现（视频36.）

基于视频13（Publisher发布者的C++实现）和视频14（Subscriber订阅者的C++实现），将原来使用的std_msgs的String消息包替换为Carry消息包

## 发布者节点修改

### 步骤一：更改chao_node.cpp

![](http://127.0.0.1:7319/assets/53-20260210205844-szjayjy.png)

### 步骤二：修改编译规则

![](http://127.0.0.1:7319/assets/54-20260210205844-2nmpwv7.png)

表明编译顺序：先编译qq_msgs，再编译ssr_pkg

### 步骤三：添加add_dependencies

![](http://127.0.0.1:7319/assets/55-20260210205844-q9b9pje.png)

解释：先让qq_msgs创建好新的消息类型，再来编译chao_node

### 步骤四：package.xml文件修改

![](http://127.0.0.1:7319/assets/56-20260210205844-ndc5wra.png)

添加两行代码

### 步骤五：编译

```
catkin_make
```

## 订阅者节点修改

### 步骤一：修改ma_node.cpp

![](http://127.0.0.1:7319/assets/57-20260210205844-kmez3w7.png)

### 步骤二：修改编译规则

![](http://127.0.0.1:7319/assets/58-20260210205844-r7zvxam.png)

文件末尾添加

```cmake
add_dependencies(ma_node qq_msgs_generate_messages_cpp) 
```

### 步骤三：package.xml文件修改

添加如下两行代码

```xml
<build_depend>qq_msgs</build_depend>
<exec_depend>qq_msgs</exec_depend>
```

### 步骤四：编译

## 小结

![](http://127.0.0.1:7319/assets/59-20260210205845-rkx2x29.jpg)

# 21.ROS中的地图数据格式（视频38.）

机器人导航使用的地图数据，是ROS导航软件包里的map_server节点在话题/map中发布的消息数据，消息类型是nav_msgs::OccupancyGrid

![](http://127.0.0.1:7319/assets/60-20260210205845-ig3yo45.jpg)

[^OccupancyGrid]: 占据栅格，就是由正方形小格子组成的地图，每个格子填入一个数值，表示障碍物占据情况
[^栅格尺寸]: 一个小格子的单边尺寸，体现了地图的精细程度，常被用来表示**栅格地图的分辨率**，**ros系统里，栅格地图的默认分辨率是0.05米**

## 理解

![](http://127.0.0.1:7319/assets/63-20260210205845-494b51m.png)

![](http://127.0.0.1:7319/assets/64-20260210205845-uc7r423.png)

**有了该数组，再+上栅格的行列数等信息，就能够通过具体数值，描述清楚这个地图**

## ros官网的解释

### nav_msgs/OccupancyGrid Message

![](http://127.0.0.1:7319/assets/61-20260210205845-gchefhh.png)

[^行优先]:

### nav_msgs/MapMetaData Message

![](http://127.0.0.1:7319/assets/62-20260210205845-i00kxki.png)

[^地图原点（0,0）]: 地图左下角

# 22.ROS发布地图的C++实现

1.发布地图消息包 2.在Rviz中显示是什么效果

---

## 实现目标

两行四列4*2的地图    ;    只对第一行赋值，第二行空白

![](http://127.0.0.1:7319/assets/66-20260210205845-s1mkeku.png)

## 实现步骤

![](http://127.0.0.1:7319/assets/65-20260210205845-dc57y7v.png)

1.构建软件包

```bash
cd catkin_ws/src
catkin_create_pkg map_pub_node roscpp rospy nav_msgs
```

2.创建节点，发布话题

```c++
#头文件

int main()
{
    ros::init
    ros::NodeHandle
    ros::Publisher pub = n.advertiser<nav_msgs::OccupancyGrid>("map",10)//发布话题
}
...
```

7.Rviz中显示地图

先添加坐标系

![](http://127.0.0.1:7319/assets/67-20260210205845-p7zzdxp.png)

添加地图

![](http://127.0.0.1:7319/assets/68-20260210205845-m0bum4n.png)

设置地图 Topic为/map

# 23.什么是SLAM

ROS中，地图是通过SLAM生成的

全称：Simultaneous Locallization And Mapping，同时**定位**与**建图**，这两个操作同时进行的

找参照物-建图

## 视觉SLAM

相机的位置、视觉图像中提取的特征点就是地图中参照物

实际应用中，参照物还可以是二维码、颜色标记、电子标签

## 激光雷达SLAM

分为三个状态，建图前、建图中、建完图了

建图前：所有栅格值都是-1，不知道哪里有障碍物，就像RTS游戏中的战争迷雾

可以合并的参照物特征：不是物体的外观，而是障碍物栅格的排布形状

# 24.Hector_Mapping，ROS中实现SLAM

## 规划需要的节点

![](http://127.0.0.1:7319/assets/69-20260210205845-149swm3.png)

框选部分，在前面的实验已经实现

## ROSAPI

![](http://127.0.0.1:7319/assets/70-20260210205845-stbal8t.png)

[^输入]: scan话题
[^输出]: map话题

## 动手动手

安装Hector_Mapping

```bash
sudo apt install ros-noetic-hector-mapping
```

运行仿真环境

```bash
roslaunch wpr_simulation wpb_stage_slam.launch
```

运行SLAM节点

```bash
rosrun hector_mapping hector_mapping
```

通过Rviz窗口查看输出的地图

```bash
rosrun rviz rviz
```

在Rviz中添加

机器人模型 Add-RobotModel

激光雷达扫描测距点 Add - LaserScan，点太小可以调大

添加地图    Add-Map

# 25.通过launch文件启动Hector_Mapping建图功能

## 复习launch文件实验

![](http://127.0.0.1:7319/assets/71-20260210205845-4bqpn4y.png)

## 实操

![](http://127.0.0.1:7319/assets/72-20260210205845-rf89v9s.png)

### 新建软件包slam_pkg

```bash
catkin_create_pkg slam_pkg roscpp rospy std_msgs
```

打开vscode，在slam_pkg文件夹里新建文件夹launch，

### 在launch文件夹里新建hector.launch文件

```launch
<launch>
    <include file="$(find wpr_simulation)/launch/wpb_stage_slam.launch"/>
    <node pkg="hector_mapping"     type="hector_mapping"      name="hector_mapping"/>
    <node pkg="rviz"               type="rviz"                name="rviz"/>
    <node pkg="rqt_robot_steering" type="rqt_robot_steering"  name="rqt_robot_steering"/>
</launch>
```

[^$(find wpr_simulation)]: rospack指令获取wpr_simulation软件包的完整路径，= ~/catkin_ws/src/wpr_simulation

**运行launch前，需要编译slam_pkg软件包**

[^为什么没有编写节点，还需要编译slam_pkg]: 为了让slam_pkg进入ROS的软件包列表

### 在launch中加载rviz配置文件

先保存rviz配置到catkin_ws/src/slam_pkg/rviz

测试运行

```bash
rosrun rviz rviz -d /home/zyl/catkin_ws/src/slam_pkg/rviz/slam.rviz
```

更改launch文件

![](http://127.0.0.1:7319/assets/73-20260210205845-at2ad62.png)

# 26.Hector_Mapping的参数设置

## 参数说明

[参数说明传送门](https://wiki.ros.org/hector_mapping#ROS_API)，本实验挑几个容易看出差别的参数来设置

![](http://127.0.0.1:7319/assets/74-20260210205845-tsxcg5i.png)

## launch文件编写

![](http://127.0.0.1:7319/assets/75-20260210205845-gpzfuis.png)

## 体会各个参数的作用

wpr_simulation/launch/wpb_hector_comparison.launch

![](http://127.0.0.1:7319/assets/76-20260210205845-qumii2q.png)

更改上述框内参数，并观察rviz内的变化即可

```bash
roslaunch wpr_simulation wpb_hector_comparison.launch
```

# 27.ROS的TF系统

抛出问题：上一节中，通过ROS的SLAM节点，得到了栅格地图，**那么机器人的定位信息，该如何获得呢？**

![](http://127.0.0.1:7319/assets/77-20260210205845-sj268dg.png)

---

## 定位信息的描述方法

机器人在地图中的位置->机器人和坐标系原点间的空间关系，为了便于描述，给机器人和地图各自定义一个坐标系，**地图坐标系作为父坐标系，机器人坐标系作为子坐标系**

两个坐标系的空间关系---子坐标系在父坐标系中XYZ三个轴的距离偏移量

### 地图坐标系：map

原点在机器人建图的初始位置，坐标轴方向遵循ROS的右手法则

![](http://127.0.0.1:7319/assets/78-20260210205845-86jhhv2.png)

### 机器人坐标系：base_footprint

![](http://127.0.0.1:7319/assets/79-20260210205845-vc2tlvc.png)

![](http://127.0.0.1:7319/assets/80-20260210205845-qdi8ezd.png)

## 如何获取具体的定位数值呢？

### 什么是TF

TF是TransForm的缩写，主要描述的是两个坐标系的空间关系，可以理解为**坐标系变换**

### 消息结构

在[Ros Index](https://index.ros.org/p/tf2_msgs/#noetic)中查询消息结构

![](http://127.0.0.1:7319/assets/83-20260210205845-xtm0367.png)

![](http://127.0.0.1:7319/assets/84-20260210205845-2e8rnb9.png)

### 示例

```bash
roslaunch wpr_simulation wpb_hector_comparison.launch
```

移动机器人，在Rviz中Add-TF，修改Marker Scale为5，同时设置Frame，只显示**base_footprint**和**map**

```bash
rostopic list
```

![](http://127.0.0.1:7319/assets/81-20260210205845-tlbuisu.png)

```bash
rostopic type /tf
```

![](http://127.0.0.1:7319/assets/82-20260210205845-6c87hkz.png)

```bash
rostopic echo /tf
```

![](http://127.0.0.1:7319/assets/85-20260210205845-yz7k6rw.png)

上图中，除了/base_footprint和/map，还夹杂了很多TF关系，如何理清楚呢？

```bash
rosrun rqt_tf_tree rqt_tf_tree
```

# 28.里程计在激光雷达SLAM中的作用

## Hector Mapping建图

```bash
roslaunch wpr_simulation wpb_corridor_hector.launch
```

直接将雷达点云贴合障碍物轮廓，所得出的机器人位置，作为最终的定位结果，在TF树中，体现为map到scanmatcher_frame

![](http://127.0.0.1:7319/assets/87-20260210205845-ka50fo8.png)

```bash
roslaunch wpr_simulation wpb_corridor_gmapping.launch
```

## Gmapping建图

1.里程计推算机器人的位移

2.通过雷达点云贴合障碍物轮廓，修正里程计误差

## 两种算法的区别

Gmapping

- 机器人的位移主要由里程计推算，雷达点云的配准算法是为了修正里程计出现的误差。

Hector_Mapping

- 不考虑里程计的数据，只用雷达点云和障碍物配准的方法定位
- 而为了rviz里能够显示机器人模型，强行输出一段map到odom的TF，来抵消不断增长的里程计TF，使得scanmatcher_frame和base_footprint的位置始终保持一致

> [!NOTE]（这是与C++不同的地方）
> 
> 如想在Rviz中显示地图和机器人模型，必须实现map到base_footprint的TF，这样才能将机器人本身的TF和map接上，形成完整的TF树，所以Hector_Mapping还会输出一段map到odom的TF，这样就能和里程计的TF组合成完整的map到base_footprint的TF

7：30：障碍物点云配准算法

                                为什么存在差异？

原因：对于激光雷达来说，缺少参照物特征的变化，无法估计自己的位移

解决方法：电机里程计

> [!NOTE]
> 
> 里程计不是一种硬件，而是一种软件算法，通过电机的速度计算出位移，但存在误差
> 
> 运行在机器人的驱动节点中

![](http://127.0.0.1:7319/assets/86-20260210205845-zee0h2h.png)

激光雷达SLAM输出的是map到base_footprint的TF，靠的是map-odom的TF，再加上odom-base_footprint的TF

里程计输出的是odom到base_footprint的TF

[^odom]: odometry，里程计的缩写

## 困扰很久的点

- 在hector_mapping建图的过程中，在rviz中打开TF关系，为什么odom坐标系会在找不到点云特征时后退？

hector的定位结果，是map到scanmatcher_frame的TF关系，而为了在rviz中能够显示出地图和机器人模型，必须实现map到base_footprint的TF，而map到base_footprint间还存在一个odom

1. hector认为机器人没有动，因为长廊特征退化
2. 底盘节点仍在发布odom到base_footprint的TF，假如hector没有反向输出odom的TF，则会出现scanmatcher_frame仍在原地，base_footprint向前移动的情况，导致scanmatcher_frame与base_footprint位置不一致，所以hector输出odom的反向TF，可以抵消base_footprint的向前移动，使得base_footprint和scanmatcher_frame保持一致
3. 这样既实现了map-scanmatcher_frame作为定位结果，又实现了map-odom-base_footprint，保证了map与base_footprint的正常连接，能够形成完整的TF树。
