+++
date = '2023-07-13T20:20:26+08:00'
draft = false
title = 'Article01'
+++

## 记录手机第一次通过WIFI与ESP8266连接

(发送新行) 
1.发送AT，返回OK
2.AT+CWMODE=1,设置ESP8266 Station模式该模式ESP不生成WIFI信号
3.AT+RST,重启生效
4.AT+CWLAP,查询当前WIFI列表(2.4G)
5.AT+CWJAP="WIFI名","WIFI密码"  连接WIFI,成功会显示连接
6.AT+CIFSR 查询ESP的IP
7.AT+CIPMUX=1 建立多连接
8.AT+CIPSERVER=1,8080 建立服务器,端口8080
ESP Station模式配网完成

1.AT+CWMODE=2,设置ESP8266 AP模式
2.AT+RST,重启生效
3.AT+CIFSR 查询ESP的IP
4.AT+CIPMUX=1 建立多连接
5.AT+CIPSERVER=1,8080 建立服务器,端口8080
ESP AP模式配网完成

2.AT+CWMODE=3,设置ESP8266 APStation模式
3.AT+RST,重启生效
4.AT+CWLAP,查询当前WIFI列表(2.4G)
5.AT+CWJAP="WIFI名","WIFI密码"  连接WIFI,成功会显示连接
6.AT+CIFSR 查询ESP的IP
7.AT+CIPMUX=1 建立多连接
8.AT+CIPSERVER=1,8080 建立服务器,端口8080
ESP Station模式配网完成
