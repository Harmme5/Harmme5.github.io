---
title: LeetCode Hot100
slug: leetcode-hot100-z2vo5oe
url: /post/leetcode-hot100-z2vo5oe.html
date: '2026-06-20 20:57:20+08:00'
lastmod: '2026-06-21 17:26:26+08:00'
draft: false
categories: ["Leetcode"]           # 文章分类
tags:
  - Leetcode
tocStartLevel: 1
tocEndLevel: 2
tocOrdered: false

toc: true
isCJKLanguage: true
---

# 哈希表

哈希要能想到三个数据结构：数组、set、map

大体性判断使用时机：

- 数组：哈希值小、范围可控

- set：数值很大

- map：k对应value

## 1.两数之和

### 题目描述

给定一个整数数组 `nums`​ 和一个整数目标值 `target`​，请你在该数组中找出 **和为目标值**   `target`​  的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

### 解题思路

每当我们遇到要判断元素是否出现过，第一反应就是可以用哈希法。

这道题目是需要判断一个元素是否遍历过，那如何判断它是否遍历过呢，我们就把我们遍历过的元素加到一个集合里，然后我们每次遍历一个新的位置之后，就判断我们想要寻找的这个元素是否在这个集合里出现过，如果在这个集合中出现过，就说我们之前遍历过，这个集合用一种哈希表的结构

因为要存放2个元素：元素和下标，所以用map数据结构，在python中对应的也就是**字典**​`dict`，字典在本题目中的作用：存放遍历过的元素

那为什么元素作为`key`​，下标作为`value`​呢，因为要查找的是“元素”，所以元素作为`key`

### 代码

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        self.nums = nums
        self.target = target
        records={}
        for index,value in enumerate(nums):
            if target-value in records:
                return [records[target-value],index]
            records[value]=index
        return []
```

### 复杂度分析

- 时间复杂度：O(n)
  
  只有一层 `for` 循环，遍历数组一次，循环执行 n 次；
  
  字典 `in` 查询、字典赋值都是哈希表操作，单次 (O(1))；
  
  总操作次数是常数倍 n，去掉系数后时间复杂度为 (O(n))。

- 空间复杂度：O(n)

## 242.有效的字母异位词

### 题目描述

给定两个字符串 `s`​ 和 `t`​ ，编写一个函数来判断 `t`​ 是否是 `s` 的 字母异位词。

字母异位词是通过重新排列不同单词或短语的字母而形成的单词或短语，并使用所有原字母一次。

**示例 1:**

```
输入: s = "anagram", t = "nagaram"
输出: true
```

**示例 2:**

```
输入: s = "rat", t = "car"
输出: ​false
```

### 解题思路

    数组就是一个简单哈希表**，在python中对应就是列表`List`​，而本题中只有小写字母，小写字母有26个，它们的ASCII码值为连续的。可以定义一个列表，列表大小为26，下标范围为0~25，该列表用来存储每个字母出现的次数，同时需要把字母映射到列表的下标上，比如`record[0]=1`​，`record[0]`​代表字母'a'，`=1`就代表字母'a'出现了1次。

接下来需要统计字符串s和t中每个字母出现的次数，因此需要逐个遍历，遍历的时候，以字符串s为例，**只需要将** `s[i] - ‘a’`​ ​ **所在的元素做+1 操作即可，并不需要记住字符a的ASCII，只要求出一个相对数值就可以了。** 这样就把字符串s中字符出现的次数，统计出来了。

下一步是如何检查字符串t中是否出现了这些字符，只需要在遍历字符串t的时候，对t中出现的字符映射到哈希表索引上的数值做-1操作就可以了。

最后检查一下，如果**record列表有元素不为0**，说明字符串s和字符串t一定是谁多字符或者少字符，此时`return false`​，如果record列表所有元素为0，说明字符串s和t是字母异位词，`return true`

### 代码

​`ord(单个字符)`​：返回这个字符对应的 **ASCII 码（数字）**

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        record = [0] * 26
        for i in s:
            record[ord(i)-ord("a")]+=1
        for i in t:
            record[ord(i)-ord("a")]-=1
        for i in range(26):
            if record[i]!=0:
                return False
        return True
```

### 复杂度分析

- 时间复杂度：三次for循环均为有限次数，为O(n)
- 空间复杂度：定义的数组为常量大小，所以空间复杂度为O(1)

‍

‍
