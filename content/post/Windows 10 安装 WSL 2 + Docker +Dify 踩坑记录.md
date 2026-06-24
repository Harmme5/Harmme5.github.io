---
title: Windows 10 安装 WSL 2 + Docker +Dify 踩坑记录
slug: install-wsl-2-docker-dify-on-windows-10-oscqk
url: /post/install-wsl-2-docker-dify-on-windows-10-oscqk.html
date: '2026-06-23 21:04:42+08:00'
lastmod: '2026-06-24 10:16:19+08:00'
tags:
  - 搞七捻三
keywords: 搞七捻三
toc: true
isCJKLanguage: true
---

# Windows 10 安装 WSL 2 + Docker +Dify 踩坑记录

# WSL2安装与迁移

## 基础安装

```bash
# 安装 Ubuntu
wsl --install -d Ubuntu
```

## 迁移到其他盘

由于硬盘空间不足，选择将WSL迁移到F盘

```bash
# 1. 创建目标目录
mkdir F:\WSL

# 2. 导出 Ubuntu
wsl --export Ubuntu F:\WSL\ubuntu-backup.tar

# 3. 注销 C 盘的 Ubuntu
wsl --unregister Ubuntu

# 4. 导入到 F 盘
mkdir F:\WSL\Ubuntu
wsl --import Ubuntu F:\WSL\Ubuntu F:\WSL\ubuntu-backup.tar

# 5. 设置默认用户（重要！否则会变成 root）
ubuntu config --default-user harme

# 6. 验证
wsl --list --verbose
```

## 升级到WSL2

需要先启动“虚拟机平台”功能

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260624095442-vwfdccy.png)

```bash
使用命令更新
wsl --update

# 设置默认版本为 WSL 2
wsl --set-default-version 2

# 转换已安装的 Ubuntu
wsl --set-version Ubuntu 2

# 验证（VERSION 应该显示 2）
wsl --list --verbose
```

# Docker安装与配置

## 安装Docker Engine

```bash
# 使用阿里云镜像安装
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 添加用户到 docker 组
sudo usermod -aG docker $USER

# 刷新用户组
newgrp docker
```

## iptables兼容性报错

**问题：** Docker 启动失败，报错：

```bash
iptables v1.8.10 (nf_tables): CHAIN_ADD failed (No such file or directory)
```

**解决方案：** 切换到iptables-legacy

```bash
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
```

## 配置Docker镜像加速

**问题**：无法连接到 Docker Hub（`dial tcp: i/o timeout`）

​**解决方案**：配置国内镜像源

```bash
# 创建配置文件（注意：不要用 heredoc，会多出 EOF）
echo '{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://hub.rat.dev"
  ]
}' | sudo tee /etc/docker/daemon.json

# 重启 Docker
sudo service docker restart

# 验证
docker info | grep -A 5 "Registry Mirrors"
```

​**重要**​：配置文件格式必须正确，不能有多余的 `EOF` 等内容，否则 Docker 无法启动。

## 启动Docker

```bash
# 启动服务
sudo service docker start
```

```bash
# 检查状态
sudo service docker status
```

```bash
# 测试
docker run hello-world
```

# Dify安装

## 代理

7897是在clash verge中查看的端口（需要打开clash verge 允许局域网连接），配置到了bashrc中，后续需要代理就方便了

```bash
export http_proxy="http://${hostip}:7897"
export https_proxy="http://${hostip}:7897"
curl -I https://www.google.com
```

下载dify

```bash
cd ~
git clone https://github.com/langgenius/dify.git
```

## 启动docker

```bash
# 1. 启动 Docker 服务
sudo service docker start
```

```bash
cd ~/dify/docker
docker compose up -d
```

启动完成后，访问http://localhost

‍
