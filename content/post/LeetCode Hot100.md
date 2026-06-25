---
title: LeetCode Hot100
slug: leetcode-hot100-z2vo5oe
url: /post/leetcode-hot100-z2vo5oe.html
date: '2026-06-20 20:57:20+08:00'
lastmod: '2026-06-25 09:45:11+08:00'
tags:
  - Leetcode
categories:
  - Leetcode
keywords: Leetcode

tocStartLevel: 1
tocEndLevel: 2
tocOrdered: false

toc: true
isCJKLanguage: true
---

# LeetCode Hot100

# 哈希表

哈希要能想到三个数据结构：数组、set、map

大体性判断使用时机：

- 数组：哈希值小、范围可控，对应Python中列表`List`

- set：数值很大，对应Python`set`

- map：k对应value，对应Python`dict`

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

**每当我们遇到要判断元素是否出现过，第一反应就是可以用哈希法。**

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

**数组就是一个简单哈希表**，在python中对应就是列表`List`​，而本题中只有小写字母，小写字母有26个，它们的ASCII码值为连续的。可以定义一个列表，列表大小为26，下标范围为0~25，该列表用来存储每个字母出现的次数，同时需要把字母映射到列表的下标上，比如`record[0]=1`​，`record[0]`​代表字母'a'，`=1`就代表字母'a'出现了1次。

接下来需要统计字符串s和t中每个字母出现的次数，因此需要逐个遍历，遍历的时候，以字符串s为例，**只需要将** **​`s[i] - ‘a’`​** ​ **所在的元素做+1 操作即可，并不需要记住字符a的ASCII，只要求出一个相对数值就可以了。** 这样就把字符串s中字符出现的次数，统计出来了。

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

## 349.两个数组的交集

### 题目描述

题意：给定两个数组，编写一个函数来计算它们的交集。

**示例 1:**

```
输入: nums1= [1,2,2,1]  nums2=[2,2]
输出: [2]
```

**示例 2:**

```
输入: nums1= [4,9,5]  nums2=[9,4,9,8,4]
输出: [9,4]
```

**说明：**  输出结果中的每个元素一定是唯一的。 我们可以不考虑输出结果的顺序。

**提示：**

- ​`1 <= nums1.length, nums2.length <= 1000`
- ​`0 <= nums1[i], nums2[i] <= 1000`

### 解题思路

c++中set结构有三种：set、unordered set、multi set，其中底层由哈希表实现的unordered set做映射、做取值操作时效率是最高的，因为另外两个底层实现是树，取值时还有一个查找的过程

但是要注意，**使用数组来做哈希的题目，是因为题目都限制了数值的大小。** 本题中，限制了数组的大小小于1000，因此也可以用数组来做；如果没有限制数组的大小，并且**哈希值比较少、特别分散、跨度非常大，使用数组就造成空间的极大浪费。**

### 代码

#### 使用字典和集合

```python
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        #定义字典，作为哈希表，存储一个数组的所有元素
        table={}
        #将nums1数组中的元素存到哈希表中，key为数组的元素，value为出现的次数
        for num in nums1:
            table[num]=table.get(num,0)+1
        #定义集合，用于存储结果
        res = set()
        for num in nums2:
            if num in table:
                res.add(num)
                del table[num]

        return list(res)
```

#### 使用数组

```python
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        count1 = [0]*1001
        count2 = [0]*1001
        result = []
        for i in range(len(nums1)):
            count1[nums1[i]]+=1
        for j in range(len(nums2)):
            count2[nums2[j]]+=1
        for k in range(1001):
            if count1[k]*count2[k]>0:
                result.append(k)
        return result
```

#### 使用集合

```python
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        return list(set(nums1) & set(nums2))
```

### 复杂度分析

- 时间复杂度：O(n+m)
- 空间复杂度：O(n)

‍

## 454.四数相加II

### 题目描述

给你四个整数数组 `nums1`​、`nums2`​、`nums3`​ 和 `nums4`​ ，数组长度都是 `n`​ ，请你计算有多少个元组 `(i, j, k, l)` 能满足：

- ​`0 <= i, j, k, l < n`
- ​`nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0`

**示例 1：**

```
输入：nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2]
输出：2
解释：
两个元组如下：
1. (0, 0, 0, 1) -> nums1[0] + nums2[0] + nums3[0] + nums4[1] = 1 + (-2) + (-1) + 2 = 0
2. (1, 1, 0, 0) -> nums1[1] + nums2[1] + nums3[0] + nums4[0] = 2 + (-1) + (-1) + 0 = 0
```

**示例 2：**

```
输入：nums1 = [0], nums2 = [0], nums3 = [0], nums4 = [0]
输出：1
```

  **提示：**

- ​`n == nums1.length`
- ​`n == nums2.length`
- ​`n == nums3.length`
- ​`n == nums4.length`
- ​`1 <= n <= 200`

### 解题思路

首先能想到的就是最暴力的解法，直接遍历4个数组，同时定义一个count，每有求和为0时就count++，但是这种方法的时间复杂度是O(n<sup>4</sup>)，因此我们要寻找一种能够降低时间复杂度的方法。

更优的解法是，先遍历数组1和数组2，设数组1中的元素a，数组2中的元素b，算出`a+b`​的所有取值，存起来；接着遍历数组3和数组4，设数组3中的元素c，数组4中的元素d，**通过**​**​`0-(c+d)=a+b`​**​**找出有多少个**​**​`c+d`​**​**满足等式，** 最终目标是找出元组的个数，其实就是`a+b`​*`满足等式的c+d个数`​；到这里其实这道题已经转换成了：**给定一个数值 target，快速查询这个值之前出现过多少次**，给定的数值target，就是`a+b的相反数`​，在`c+d`​中寻找其出现的次数，因此我们采用哈希表的方法；因为需要记录`a+b`​的值，以及出现的次数，所以用`dict`，对应map方法。

### 代码

```python
class Solution(object):
    def fourSumCount(self, nums1, nums2, nums3, nums4):
        # 使用字典存储nums1和nums2中的元素及其和
        hashmap = dict()
        for n1 in nums1:
            for n2 in nums2:
                hashmap[n1+n2] = hashmap.get(n1+n2, 0) + 1

        # 如果 -(n1+n2) 存在于nums3和nums4, 存入结果
        count = 0
        for n3 in nums3:
            for n4 in nums4:
                key = - n3 - n4
                if key in hashmap:
                    count += hashmap[key]
        return count
```

### 复杂度分析

- 时间复杂度：O(n<sup>2</sup>)，两个for循环，时间复杂度为n<sup>2</sup>
- 空间复杂度：O(n<sup>2</sup>)，代码里唯一额外占用大量内存的是哈希字典 `ab`​，用来存 `nums1 + nums2`​ 所有两数之和。设每个数组长度为 `n`​（题目四个数组长度相同，都是 n）。最坏情况是所有两数之和都不重复，此时总共有`n*n`​种不同的和，字典要存n<sup>2</sup>个键值对。
