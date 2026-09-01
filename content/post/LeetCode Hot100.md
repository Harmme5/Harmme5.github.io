---
title: LeetCode Hot100
slug: leetcode-hot100-z2vo5oe
url: /post/leetcode-hot100-z2vo5oe.html
date: '2026-06-20 20:57:20+08:00'
lastmod: '2026-09-01 20:51:48+08:00'
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



# 哈希表

## 哈希理论基础

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

`ord(单个字符)`​：返回这个字符对应的 **ASCII 码（数字）**

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

- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

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

- `0 <= i, j, k, l < n`
- `nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0`

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

- `n == nums1.length`
- `n == nums2.length`
- `n == nums3.length`
- `n == nums4.length`
- `1 <= n <= 200`

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

## 15.三数之和

### 题目描述

给你一个整数数组 `nums`​ ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]`​ 满足 `i != j`​、`i != k`​ 且 `j != k`​ ，同时还满足 `nums[i] + nums[j] + nums[k] == 0`​ 。请你返回所有和为 `0` 且不重复的三元组。

**注意：** 答案中不可以包含重复的三元组。

**示例 1：**

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
```

**示例 2：**

```
输入：nums = [0,1,1]
输出：[]
解释：唯一可能的三元组和不为 0 。
```

**示例 3：**

```
输入：nums = [0,0,0]
输出：[[0,0,0]]
解释：唯一可能的三元组和为 0 。
```

**提示：**

- 3 <= nums.length <= 3000
- -10<sup>5</sup> \<\= nums[i] \<\= 10<sup>5</sup>

### 解题思路

最直接的方法就是暴力三重循环，三层循环枚举 i \< j \< k，遍历所有三元组合，求和判断是否等于 0。

- 时间复杂度：(O(n<sup>3</sup>))，n 很大时直接超时
- 额外问题：会产出大量重复三元组，去重成本极高

缺陷：n\=1000 时，循环次数上亿，完全无法通过测试用例，必须优化。

另一种方法是降维：把三数之和转为两数之和，这里就很容易想到用哈希法，但是无序数组去重困难，因此用有序数组，也就是先对数组排序。

思路上，三数之和是用一个for循环来控制i，接着在for循环里控制left和right双指针

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260627232743-sl0cs5n.png)

什么时候不能用双指针：双指针求解两数之和的**前提条件**：数组有序。如果数组不能排序（需要保留原下标，如 LeetCode 1 两数之和），则只能用哈希表，无法双指针。而三数之和不要求下标、只要求数值组合，排序无副作用，因此双指针是最优解。

### 代码

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        result = []
        # 数组排序（从小到大）
        nums.sort()
        for i in range(len(nums)):
            if nums[i]>0:
                return result
            # 跳过相同的元素以避免重复
            if i>0 and nums[i]==nums[i-1]:
                continue
            # 双指针
            left = i+1
            right= len(nums)-1
            while right > left:
                sum_ = nums[i]+nums[left]+nums[right]
                if sum_>0:
                    right-=1
                elif sum_<0:
                    left +=1
                else:
                    result.append([nums[i],nums[left],nums[right]])

                     # 跳过相同的元素以避免重复
                    while right > left and nums[right] == nums[right - 1]:
                        right -= 1
                    while right > left and nums[left] == nums[left + 1]:
                        left += 1
                        
                    right -= 1
                    left  += 1

        return result
```

### 复杂度分析

- 时间复杂度：O(n<sup>2</sup>)
- 空间复杂度：O(1)

## 18.四数之和

### 题目描述

给你一个由 `n`​ 个整数组成的数组 `nums`​ ，和一个目标值 `target`​ 。请你找出并返回满足下述全部条件且**不重复**的四元组 `[nums[a], nums[b], nums[c], nums[d]]` （若两个四元组元素一一对应，则认为两个四元组重复）：

- `0 <= a, b, c, d < n`
- `a`​、`b`​、`c`​ 和 `d`​ **互不相同**
- `nums[a] + nums[b] + nums[c] + nums[d] == target`

你可以按 **任意顺序** 返回答案 。

**示例 1：**

```
输入：nums = [1,0,-1,0,-2,2], target = 0
输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

**示例 2：**

```
输入：nums = [2,2,2,2,2], target = 8
输出：[[2,2,2,2]]
```

**提示：**

- 1 <= nums.length <= 200
- -10<sup>9</sup> \<\= nums[i] \<\= 10<sup>9</sup>
- -10<sup>9</sup> \<\= target \<\= 10<sup>9</sup>

### 解题思路

大体思路与15.三数之和一致，不同之处在于，三数之和这道题，和为0，而本题和为`target`，也就是本题中target可以为负数，并且主要细节在剪枝和去重的部分。

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260627232941-ms02mac.png)

如图，与三数之和不同的是，三数之和只有一个for循环来控制i，而四数之和，我们还需要在这个for循环外再加一层for循环来控制

### 代码

```python
class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        result = []
        n = len(nums)
        nums.sort()
        for k in range(n):
            if nums[k] > target and nums[k] > 0 and target > 0:# 剪枝（可省）
                break
            # sum_不可能等于target的情况
            if nums[k]>target and nums[k]>0:
                continue
            # 跳过相同的元素以避免重复
            if k>0 and nums[k]==nums[k-1]:
                continue
            for i in range(k+1,n):
                if nums[k] + nums[i] > target and target > 0: #剪枝（可省）
                    break
                # 跳过相同的元素以避免重复
                if i>k+1 and nums[i]==nums[i-1]:#i>0防止数组越界
                    continue
                left=i+1
                right = n-1
                while right>left:
                    sum_=nums[k]+nums[i]+nums[left]+nums[right]
                    if sum_<target:
                        left +=1
                    elif sum_>target:
                        right-=1
                    else:
                        result.append([nums[k],nums[i],nums[left],nums[right]])
                        # 跳过相同的元素以避免重复
                        while right > left and nums[right] == nums[right - 1]:
                            right -= 1
                        while right > left and nums[left] == nums[left + 1]:
                            left += 1
                            
                        right -= 1
                        left  += 1
        return result
```

#### 去重逻辑

```python
if i>0 and nums[i]==nums[i-1]:
	continue
```

为什么要用`nums[i]==nums[i-1]`​而不是`nums[i+1]==nums[i]`​呢，因为当遍历到数组最后一个元素时，此时用`i+1`，数组就越界了

#### 剪枝

**这条分支往下走不可能得到合法答案**，就直接 `break`​/`continue`​ 终止这条分支，不用继续循环遍历，减少无效计算，这个操作就叫**剪枝**。

#### 踩坑点

- 9-10行去重没加，仅有该处错误的情况下，会导致当输入`nums =[2,2,2,2,2]`​时，输出为空列表`[[2,2,2,2],[2,2,2,2]]`
- 13行`i>k+1`​才是正确的，而我写成了`i>0`​，导致当输入`nums =[2,2,2,2,2]`​时，输出为空列表`[]`
- 26-32行少缩进一次

### 复杂度分析

- 时间复杂度：O(n<sup>3</sup>)
- 空间复杂度：O(1)

# 数组

数组的内存地址是连续的，数组中的元素不能删除，只能覆盖，删除一个元素，就要把后面的元素向前移动进行覆盖。

## 704.二分查找法

### 题目描述

给定一个 `n`​ 个元素有序的（升序）整型数组 `nums`​ 和一个目标值 `target`​  ，写一个函数搜索 `nums`​ 中的 `target`​，如果 `target`​ 存在返回下标，否则返回 `-1`。

你必须编写一个具有 `O(log n)` 时间复杂度的算法。

**示例 1:**

```
nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
```

**示例 2:**

```
nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1
```

**提示：**

1. 你可以假设 `nums` 中的所有元素是不重复的。
2. `n`​ 将在 `[1, 10000]`之间。
3. `nums`​ 的每个元素都将在 `[-9999, 9999]`之间。

### 解题思路

二分法，要注意对区间的定义，不同区间定义会有不同的写法

- 左闭右闭，[left,right]
- 左闭右开，[left,right)

### 代码

#### 常规解法

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        n=range(len(nums))
        for i in n:
            if nums[i]==target:
                return i
        return -1
```

- 时间复杂度：O(n)
- 空间复杂度：O(1)

#### 二分法

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left = 0
        right = len(nums) -1
        while left<=right:
            middle = left + (right-left) // 2
            if nums[middle] < target:# 在右区间
                left = middle + 1
            elif nums[middle] > target:# 在左区间
                right = middle - 1
            else :
                return middle
        return -1
```

- 时间复杂度：O(log<sub>2</sub>n)
- 空间复杂度：O(1)

## 27.移除元素

### 题目描述

给你一个数组 `nums`​  和一个值 `val`​，你需要**原地**移除所有数值等于 `val`​  的元素。元素的顺序可能发生改变。然后返回 `nums`​ 中与 `val` 不同的元素的数量。

假设 `nums`​ 中不等于 `val`​ 的元素数量为 `k`，要通过此题，您需要执行以下操作：

- 更改 `nums`​ 数组，使 `nums`​ 的前 `k`​ 个元素包含不等于 `val`​ 的元素。`nums`​ 的其余元素和 `nums` 的大小并不重要。
- 返回 `k`。

**示例 1：**

```
输入：nums = [3,2,2,3], val = 3
输出：2, nums = [2,2,_,_]
解释：你的函数应该返回 k = 2, 并且 nums​ ​中的前两个元素均为 2。
你在返回的 k 个元素之外留下了什么并不重要（因此它们并不计入评测）。
```

**示例 2：**

```
输入：nums = [0,1,2,2,3,0,4,2], val = 2
输出：5, nums = [0,1,4,0,3,_,_,_]
解释：你的函数应该返回 k = 5，并且 nums 中的前五个元素为 0,0,1,3,4。
注意这五个元素可以任意顺序返回。
你在返回的 k 个元素之外留下了什么并不重要（因此它们并不计入评测）。
```

**提示：**

- `0 <= nums.length <= 100`
- `0 <= nums[i] <= 50`
- `0 <= val <= 100`

### 解题思路

双指针

用一层for循环做到了暴力解法中两个for循环做的事

快指针：新数组所需要的元素

慢指针：新数组的下标值，用于获取新数组中需要更新的位置

### 代码

#### 库函数

```python
 class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        i = 0
        while i < len(nums):
            if nums[i] == val:
                del nums[i]
            else:
                i += 1
        return len(nums)
```

#### 暴力循环

```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k=0
        i=0
        n =len(nums)
        while i<n:
            if nums[i]==val:
                k+=1
                # 元素前移
                for j in range(i+1,n):
                    if nums[j]==nums[j-1]:# 出现连续目标值
                        i-=1 # 循环次数-1
                    nums[j-1]=nums[j]
                n-=1
                i+=1
        return n    
```

#### 双指针思路

```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        slow =0
        fast =0
        for fast in range(len(nums)):
            if nums[fast]!=val:
                nums[slow]=nums[fast]
                slow +=1
        return slow
```

#### 踩坑点

写库函数和暴力循环解法时候，首先想到的都是for循环，这就导致在使用暴力循环解法的时候，for 循环 i 不能手动回退，想重复检查必须用 while；

内层循环不要随便修改外层循环变量，极易下标越界；

### 复杂度分析

双指针思路

- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 977.有序数组的平方

### 题目描述

给你一个按 **非递减顺序** 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 **非递减顺序** 排序。

示例 1：

- 输入：nums \= [-4,-1,0,3,10]
- 输出：[0,1,9,16,100]
- 解释：平方后，数组变为 [16,1,0,9,100]，排序后，数组变为 [0,1,9,16,100]

示例 2：

- 输入：nums \= [-7,-3,2,3,11]
- 输出：[4,9,9,49,121]

### 解题思路

- 暴力解法

所有元素平方之后，再排序；时间复杂度为O(nlogn)

- 双指针思路

由于是非递减顺序，平方之后的最大元素一定在两边，不可能在中间，可以定义双指针，从数组两边向中间合拢，以下图数组为例，第一次循环，判断`-5`​和`3`的平方大小，-5大，把-5的平方存到新数组的末尾，接着i++。

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260702231403-x1vdtya.png)

### 代码

```python
class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        k = len(nums) -1
        result = [0] * len(nums)
        i = 0
        j = k
        while i<=j:
            if nums[i]*nums[i]>nums[j]*nums[j]:
                result[k] = nums[i]*nums[i]
                k-=1
                i+=1
            else:
                result[k] = nums[j]*nums[j]
                k-=1
                j-=1
        return result
```

### 踩坑点

1. ```python
   k = len(nums)
   result = [0] * (k-1)  # 错
   ```

原数组有 `k`​ 个元素，结果也要存 `k`​ 个数，只开辟 `k-1` 个位置，数组少一格，后续下标直接越界。

2. 只定义了空列表

```python
result = []
result[3] = 16  # 直接报错 IndexError
```

空列表没有预先分配下标空间，不能直接给指定下标赋值，必须先创建固定长度数组 `[0]*n`。

### 复杂度分析

- 时间复杂度：O(n)

## 209.长度最小的子数组

### 题目描述

给定一个含有 `n`​  个正整数的数组和一个正整数 `target`​   **。**

  找出该数组中满足其总和大于等于`target`​的长度最小的**子数组**并返回其长度 **。** 如果不存在符合条件的子数组，返回 `0` 。

> 子数组：是数组中 **连续** 的 **非空** 元素序列。

 **示例 1：**

```
输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
```

**示例 2：**

```
输入：target = 4, nums = [1,4,4]
输出：1
```

**示例 3：**

```
输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0
```

### 解题思路

用滑动窗口的思想，结合双指针

窗口：满足其总和大于等于`target`​的长度最小的**子数组**

如何移动窗口的起始位置：如果当前窗口的值大于等于`target`了，窗口就要向前移动了（也就是该缩小了）。

如何移动窗口的结束位置：窗口的结束位置就是遍历数组的指针，也就是for循环里的索引。

### 代码

```python
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        n = len(nums)
        left = 0 
        right = 0
        min_len = float("inf")
        cur_sum = 0
        for right in range(n):
            cur_sum += nums[right]
            while cur_sum>=target:
                cur_len = right-left + 1
                min_len = min(min_len,cur_len)
                cur_sum -= nums[left]
                left +=1
        return min_len if min_len != float('inf') else 0
```

### 复杂度分析

- 时间复杂度：O(n)

  看每一个元素被操作的次数，每个元素在滑动窗后进来操作一次，出去操作一次，每个元素都是被操作两次，所以时间复杂度是 2 × n 也就是O(n)。
- 空间复杂度：O(1)

## 59.螺旋矩阵II

### 题目描述

给你一个正整数 `n`​ ，生成一个包含 1 到n<sup>2</sup>所有元素，且元素按顺时针顺序螺旋排列的 `n x n`​ 正方形矩阵 `matrix` 。

- `1 <= n <= 20`

### 解题思路

用循环不变量的原则

不变量：对每条边的处理规则，要坚持一个规则处理每条边，如：左闭右开、左闭右闭

### 代码

```python
from typing import List
class Solution:
    def generateMatrix(self, n: int) -> List[List[int]]:
        nums = [[0] * n for _ in range(n)]
        startx, starty = 0, 0               # 起始点
        loop, mid = n // 2, n // 2          # 迭代次数、n为奇数时，矩阵的中心点
        count = 1                           # 计数

        for offset in range(1, loop + 1) :      # 每循环一层偏移量加1，偏移量从1开始
            for i in range(starty, n - offset) :    # 从左至右，左闭右开
                nums[startx][i] = count
                count += 1
            for i in range(startx, n - offset) :    # 从上至下
                nums[i][n - offset] = count
                count += 1
            for i in range(n - offset, starty, -1) : # 从右至左
                nums[n - offset][i] = count
                count += 1
            for i in range(n - offset, startx, -1) : # 从下至上
                nums[i][starty] = count
                count += 1
            startx += 1         # 更新起始点
            starty += 1

        if n % 2 != 0 :			# n为奇数时，填充中心点
            nums[mid][mid] = count
        return nums
```

### 复杂度分析

- 时间复杂度：O(n<sup>2</sup>)
- 空间复杂度：O(1)

# 链表

## 链表理论基础

链表是一种通过指针串联在一起的线性结构，每一个节点由两部分组成，一个是数据域一个是指针域（存放指向下一个节点的指针），最后一个节点的指针域指向null（空指针的意思）。

链表的入口节点称为链表的头结点也就是head。

## 203.移除链表元素

### 题目描述

给你一个链表的头节点 `head`​ 和一个整数 `val`​ ，请你删除链表中所有满足 `Node.val == val`​ 的节点，并返回 **新的头节点** 。

### 解题思路

针对头节点和非头节点的方法是不一样的

- 删除头节点：把头节点的head移动到下一个节点，**并释放内存**
- 删除非头节点：把上一个节点的指针指向下一个节点的指针，并**释放内存**

但是这样的话，删除节点的方式不统一，有没有一种统一的方式呢？

就是**虚拟头节点**的方法，其实就是在链表的头节点前加入一个虚拟头节点(dummy head)，这样的话，如果删除的是头节点，就可以直接把虚拟头节点的指针指向第二个节点，和删除非头节点的方法就一致了

### 代码

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeElements(self, head: Optional[ListNode], val: int) -> Optional[ListNode]:
		# 创建虚拟头节点
        dummy_head = ListNode(next = head)

		# 遍历并删除值为val的节点
        current = dummy_head
        while current.next:
            if current.next.val == val:
                current.next = current.next.next
            else:
                current = current.next
        return dummy_head.next
```

### 踩坑点

- 创建虚拟头节点时，混淆 `ListNode(next=head)`​ 和 `ListNode(head)`：后者是把 head 赋值给 val，next 为空，无法生成前置虚拟节点；前者关键字传参才是正确写法。
- 混淆节点赋值逻辑：`current = dummy_head` 只是指针指向同一个节点，不是复制新节点，修改指针只会改变链表结构，不会生成副本。
- 分不清 dummy\_head 和 current 的区别：dummy\_head 全程固定不变，用来记录链表起点；current 是移动遍历指针，循环中持续后移。
- 搞混返回值，想写 `return current.next`​：循环结束时 current 停在链表末尾，`current.next`​ 恒为 None，会丢失整条链表，只能返回固定不动的 `dummy_head.next`。
- 循环判断条件写错：用 `current.val == val`​，而非 `current.next.val == val`。current 是前驱节点，待删除的是下一个节点，判断自身值完全无法正常删除目标节点。

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 707.设计链表

### 题目描述

在链表类中实现这些功能：

- get(index)：获取链表中第 index 个节点的值。如果索引无效，则返回-1。
- addAtHead(val)：在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点。
- addAtTail(val)：将值为 val 的节点追加到链表的最后一个元素。
- addAtIndex(index,val)：在链表中的第 index 个节点之前添加值为 val  的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果index小于0，则在头部插入节点。
- deleteAtIndex(index)：如果索引 index 有效，则删除链表中的第 index 个节点。

### 解题思路

使用虚拟头节点，方便对链表的增删改操作，

第0个节点就是链表的头节点

- 获取第n个节点的数值

  遍历操作，要注意不合法情况
- 头部插入节点

  这里有坑，要注意顺序问题

  先让插入的节点尾部指向下一个节点，再处理虚拟头节点指向该节点
- 尾部插入节点

  什么是尾部：下一个节点指向为`null`

  这样就可以明确遍历终止条件：`while(current.next != NULL)`
- 第n个节点前插入节点

  要先寻找第n个节点，通过第n-1个节点的指针来插入节点
- 删除节点

  与203.链表元素思路相同

### 代码

```python
# 单链表法
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
        
class MyLinkedList:
    def __init__(self):
        self.dummy_head = ListNode()
        self.size = 0

    def get(self, index: int) -> int:
        if index < 0 or index >= self.size:
            return -1
        
        current = self.dummy_head.next
        for i in range(index):
            current = current.next
            
        return current.val

    def addAtHead(self, val: int) -> None:
        self.dummy_head.next = ListNode(val, self.dummy_head.next)
        self.size += 1

    def addAtTail(self, val: int) -> None:
        current = self.dummy_head
        while current.next:
            current = current.next
        current.next = ListNode(val)
        self.size += 1

    def addAtIndex(self, index: int, val: int) -> None:
        if index < 0 or index > self.size:
            return
        
        current = self.dummy_head
        for i in range(index):
            current = current.next
        current.next = ListNode(val, current.next)
        self.size += 1

    def deleteAtIndex(self, index: int) -> None:
        if index < 0 or index >= self.size:
            return
        
        current = self.dummy_head
        for i in range(index):
            current = current.next
        current.next = current.next.next
        self.size -= 1
```

### 踩坑点

- get 查询核心翻车坑

  遍历起点错误：初始 `current = self.dummyhead`（虚拟头），循环 index 次会停在虚拟节点，返回默认 0，取不到真实数据
- deleteAtIndex 删除函数坑

  曾误写循环 `range(index-1)`，少走一步，删除节点下标错位

  删除节点后忘记执行 `self.size -= 1`，长度数值失真，后续越界判断全部失效
- addAtIndex 插入边界坑

  插入允许 `index == self.size`（等价尾插）

  非法拦截条件只能写 `index > self.size`​，不能写 `index >= self.size`，否则无法尾部插入
- 统一维护长度变量 size

  每一次头插、尾插、中间插入执行 `self.size += 1`

  每一次有效删除执行 `self.size -= 1`

  size 用于快速判断 index 是否越界，避免重复遍历统计链表长度

### 复杂度分析

- 时间复杂度：涉及 `index` 的相关操作为 O(index), 其余为 O(1)
- 空间复杂度：O(n)

## 206.反转链表

### 题目描述

题意：反转一个单链表。

示例: 输入: `1->2->3->4->5->NULL`

	  输出: `5->4->3->2->1->NULL`

### 解题思路

双指针法

### 代码

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        cur = head
        pre = None
        while cur:
            temp = cur.next
            cur.next = pre # 反转指针

            pre = cur 
            cur = temp
        return pre
```

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(n)

## 24.两两交换链表中的节点

### 题目描述

给你一个链表，两两交换其中相邻的节点，并返回**交换后链表的头节点**。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

**示例 1：**

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260715210625-usn9nn4.png)

```
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

**示例 2：**

```
输入：head = []
输出：[]
```

**示例 3：**

```
输入：head = [1]
输出：[1]
```

**提示：**

- 链表中节点的数目在范围 `[0, 100]` 内
- `0 <= Node.val <= 100`

### 解题思路

虚拟头节点，会方便很多，这样每次针对头节点处理时，就不用单独处理，可以用统一的方法

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260716202726-46cbmun.png)

结合代码来看，如上图

1. 步骤一：`current.next = current.next.next`，使cur的next直接指向节点2，也就是使cur指向2
2. 步骤二：`current.next.next = temp`​，`current.next.next`代表节点2，使2指向1
3. 步骤三：`temp.next=temp1`，使1指向3

### 代码

```python
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        dummy_head = ListNode(next=head)
        current = dummy_head
        
        # 必须有cur的下一个和下下个才能交换，否则说明已经交换结束了
        while current.next and current.next.next:
            temp = current.next # 防止节点修改
            temp1 = current.next.next.next
            
            current.next = current.next.next # 步骤一
            current.next.next = temp # 步骤二
            temp.next = temp1 # 步骤三
            current = current.next.next
        return dummy_head.next
```

### 踩坑点

- 执行完步骤1，此时cur指向2，以为原来的2指向1是自动断开

  实际上是，`cur.next=1`​变成`cur.next=2`​，`1.next`​ 仍然为`2`
- 认为执行步骤二时，`current.next.next`代表的是节点1

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 19.删除链表的倒数第 N 个结点

### 题目描述

给你一个链表，删除链表的倒数第 `n`  个结点，并且返回链表的头结点。

**示例 1：**

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260719225746-5chacou.png)

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

**示例 2：**

```
输入：head = [1], n = 1
输出：[]
```

**示例 3：**

```
输入：head = [1,2], n = 1
输出：[1]
```

**提示：**

- 链表中结点的数目为 `sz`
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

### 解题思路

双指针法，用快慢指针

1. 快指针fast先走n步
2. fast和slow同时移动，直到fast.next为none时，停止

### 代码

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0,head)

        fast = dummy
        slow = dummy
        for i in range(n):
            fast = fast.next
        while fast.next:
            fast = fast.next
            slow = slow.next
            
        slow.next = slow.next.next
        return dummy.next

```

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 142.环形链表 II

### 题目描述

给定一个链表的头节点  `head`​ ，返回链表开始入环的第一个节点。 *如果链表无环，则返回* *​`null`​*​ *。*

如果链表中有某个节点，可以通过连续跟踪 `next`​ 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos`​ 来表示链表尾连接到链表中的位置（​**索引从 0 开始**​）。如果 `pos`​ 是 `-1`​，则在该链表中没有环。​**注意：**​**​`pos`​**​  **不作为参数进行传递**，仅仅是为了标识链表的实际情况。

**不允许修改**   链表。

### 解题思路

用快慢指针的方法，定义fast和slow指针

fast  快指针：每次走2步

slow慢指针：每次走1步

这道题分为两问：

1. 判断是否有环

   假设有环：`fast`​会永远兜圈子，也就是`fast.next`​不存在为`none`的情况

   假设无环：随着指针持续移动，`fast`​最终将为`none`

   所以判断是否有环的条件，就是看`fast`​会不会出现`none`
2. 判断有环后，找到环的入口

   slow与fast相遇后，令slow=head，并使slow和fast的步进都为1，下次slow与fast相遇的节点，就是环的入口

### 代码

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        fast = head
        slow = head
        while fast and fast.next:
            fast = fast.next.next
            slow = slow.next
            if fast == slow:
                slow = head
                while fast != slow:
                    fast=fast.next
                    slow=slow.next
                return slow
        return None
```

### 踩坑点

1. **为什么第一次在环中相遇，slow的 步数 是 x+y 而不是 x + 若干环的长度 + y 呢？**

   可以这样理解，由于slow每次只走1步，fast每次走2步，所以在slow进入环后，slow与fast的距离一定小于环的总长度，而且会逐步接近，

   快指针速度是慢指针的两倍，慢指针跑一圈的时间快指针能跑两圈，所以慢指针在跑完一圈之前二者一定会相遇

   **相对于慢指针而言，快指针在一步一步逼近**，所以不会存在快指针超过慢指针却跨过慢指针的情况

2. 判断是否有环的条件写错，应该是`while fast and fast.next:`

   写成了`while fast:`​，这样会导致什么问题呢？假设`fast`​当前是`none`​，再次进入循环，会执行`fast = fast.next.next`，会直接报错

### 复杂度分析

- 时间复杂度：O（n）
- 空间复杂度：O（1）

# 字符串

## 344.反转字符串

### 题目描述

编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 `s` 的形式给出。

不要给另外的数组分配额外的空间，你必须 **原地 修改输入数组**、使用 O(1) 的额外空间解决这一问题。

**示例 1：**

```
输入：s = ["h","e","l","l","o"]
输出：["o","l","l","e","h"]
```

**示例 2：**

```
输入：s = ["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]
```

### 解题思路

#### 自己想的

由于规定不能定义新的数组，所以需要对字符串直接进行更改，先来模拟一次交换，以示例1为例：

第一次交换：h与o交换，这里是有顺序之分的，如果o覆盖h，那么我们就丢掉了h这个字符，因此需要一个temp来储存这个h，h覆盖o同理

#### 双指针思路

定义两个指针（也可以说是索引下标），一个从字符串前面，一个从字符串后面，两个指针同时向中间移动，并交换元素。

### 代码

```python
class Solution:
    def reverseString(self, s: List[str]) -> None:
        n = len(s)-1
        for i in range(len(s)):
            if i<n:
                temp = s[i]
                s[i]=s[n]
                s[n]=temp
                n=n-1
```

#### 双指针

```python
class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Do not return anything, modify s in-place instead.
        """
        left, right = 0, len(s) - 1
        
        # 该方法已经不需要判断奇偶数，经测试后时间空间复杂度比用 for i in range(len(s)//2)更低
        # 因为while每次循环需要进行条件判断，而range函数不需要，直接生成数字，因此时间复杂度更低。推荐使用range
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1
```

### 踩坑点

1. 不理解`s[left], s[right] = s[right], s[left]`

   Python 独有语法，无需临时变量：

   先计算等号右边 `(s[right], s[left])`，生成临时元组

   再依次赋值给左边两个下标，完成原地交换CSDN博...

### 复杂度分析

- 时间复杂度：O（n），n 为列表长度，只交换一半元素，遍历次数正比于 n
- 空间复杂度：O（1），仅使用 left、right 两个变量，没有新建数组，满足原地修改要求

## 541.反转字符串 II

### 题目描述

给定一个字符串 `s`​ 和一个整数 `k`​，从字符串开头算起，每计数至 `2k`​ 个字符，就反转这 `2k`​ 字符中的前 `k` 个字符，再重新计数。

- 如果剩余字符少于 `k` 个，则将剩余字符全部反转。
- 如果剩余字符小于 `2k`​ 但大于或等于 `k`​ 个，则反转前 `k` 个字符，其余字符保持原样。

**示例 1：**

```
输入：s = "abcdefg", k = 2
输出："bacdfeg"
```

**示例 2：**

```
输入：s = "abcd", k = 2
输出："bacd"
```

### 解题思路

题中每种情况都要反转字符，所以我们可以定义一种反转字符串的函数，也就是`reverse_substring`，和344.反转字符串的思路是一样的，需要时调用即可

剩下就是边界条件的处理

### 代码

```python
class Solution:
    def reverseStr(self, s: str, k: int) -> str:
        # 反转任意字符串
        def reverse_substring(text):
            left , right  = 0 , len(text)-1
            while left<right:
                text[left]  ,   text[right]=text[right],text[left]
                left +=1
                right -=1
            return text

        res = list(s)
        for cur in range(0,len(s),2*k):
            res[cur:cur+k]=reverse_substring(res[cur:cur+k])
        # join() 将字符列表拼接回完整字符串，作为函数返回值。
        return ''.join(res)
```

### 踩坑点

- 思路上：刚开始想着先挑出来前2k个字符，再按每个条件单独来写，最后会是一堆逻辑代码，感觉这样不好，应该是封装好一种反转的函数
- `range(0,len(s),2*k)`，从0开始，每次步进2k，到len(s)终止
- res[cur:cur+k]的含义不理解

  这是列表切片，截取当前分组**前 k 个字符**（不足 k 个就取到末尾）；

### 复杂度分析

- 时间复杂度：O（n）
- 空间复杂度：O（n）

## 151.反转字符串中的单词

### 题目描述

给你一个字符串 `s`​ ，请你反转字符串中 **单词** 的顺序。

**单词** 是由非空格字符组成的字符串。`s`​ 中使用至少一个空格将字符串中的 **单词** 分隔开。

返回 **单词** 顺序颠倒且 **单词** 之间用单个空格连接的结果字符串。

**注意：** 输入字符串 `s`中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。

**示例 1：**

```
输入：s = "the sky is blue"
输出："blue is sky the"
```

**示例 2：**

```
输入：s = "  hello world  "
输出："world hello"
解释：反转后的字符串中不能存在前导空格和尾随空格。
```

**示例 3：**

```
输入：s = "a good   example"
输出："example good a"
解释：如果两个单词间有多余的空格，反转后的字符串需要将单词间的空格减少到仅有一个。
```

### 解题思路

#### 自己想的，难的很

从后往前遍历，遍历到1个单词，就存入新字符串开头

如何遍历多个单词呢：双指针遍历到第1个字母开始，遍历到第1个空格结束，这就找到了1个单词

如果只有1个单词：上述规则就不行了，right指针一定能找到，但left指针左移的情况下，假如遍历到了第1个单词，left再往左,s[left]就是none，所以s[left]有字母和空格的情况，

right找到字母就停止，下一个单词开始时，right先向左移动到left左侧

- s[left]是空格，s[left-1]是空格或者字母或者none；

  空格接空格，就继续遍历

  空格接字母，就代表是

  空格接none，代表这是最后一个单词

- s[left]是字母，s[left-1]是none或者字母或者空格

  字母接none，代表这是最后一个单词

  字母接字母，接着左移

  字母接空格，代表找到一个单词

多个单词：单词与单词之间要有空格，该怎么加呢？用一个变量计数单词的数量？

#### 卡尔

**不使用辅助空间，空间复杂度为O(1)。**

想一下，我们将整个字符串都反转过来，那么单词的顺序指定是倒序了，只不过单词本身也倒序了，那么再把单词反转一下，单词不就正过来了。

所以解题思路如下：

- 移除多余空格
- 将整个字符串反转
- 将每个单词反转

举个例子，源字符串为："the sky is blue "

- 移除多余空格 : "the sky is blue"
- 字符串反转："eulb si yks eht"
- 单词反转："blue is sky the"

### 代码

#### 双指针

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        # 将字符串拆分为单词，即转换成列表类型
        words = s.split()

        # 反转单词
        left, right = 0, len(words) - 1
        while left < right:
            words[left], words[right] = words[right], words[left]
            left += 1
            right -= 1

        # 将列表转换成字符串
        return " ".join(words)
```

### 复杂度分析

- 时间复杂度：O（n）

  `s.split`分割字符串：O（n），需要完整遍历一遍字符串，识别单词、过滤空格，每个字符只会访问一次。

  `while `双指针交换单词，：O(m)，m 为单词个数

  `" ".join(words)`：O（n），需要把所有单词 + 分隔空格全部写入新字符串，总字符长度等于原字符串有效字符数，遍历一次。
- 空间复杂度：O（n）

## KMP算法

解决字符串匹配的问题  
文本串 aabaabaaf  
模式串 aabaaf，检查文本串中是否出现模式串

### 前缀表

#### 前缀与后缀

前缀：包含首字母，不包含尾字母的所有子串

后缀：只包含尾字母，不包含首字母的所有子串

#### 最长相等前后缀

字符串`a`：a既是首字母也是尾字母，最长相等前后缀是0

字符串`aa`：前缀a，后缀a，最长相等前后缀是1

字符串`aab`：找不到，最长相等前后缀是0

字符串`aaba`：最长相等前后缀是1

字符串`aabaa`：前缀aa，后缀aa，最长相等前后缀是2

字符串`aabaaf`：找不到，最长相等前后缀是0

以上就是**前缀表（截止到当前位置，最长相等前后缀的长度）** ，也就是说，字符串`aabaaf`​的前缀表是`010120`

#### 使用前缀表的匹配过程

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260731223040-2ploeb7.png)

如上图所示，`2`​意味着：这有一个后缀`aa`​，前面也有一个与其相等的前缀`aa`​，我们在这个后缀的后面不匹配了，那我们就要找与其相等的前缀的后面，也就是`b`的位置开始匹配

#### next数组

为什么叫next数组：遇见冲突的地方后，next数组告诉我们要回退到哪里。

next记录的是前缀表的信息，可能会有整体右移的操作，next数组长度与模式串长度相同。

## 459.重复的子字符串

### 题目描述

给定一个非空的字符串 `s` ，检查是否可以通过由它的一个子串重复多次构成。

**示例 1:**

```
输入: s = "abab"
输出: true
解释: 可由子串 "ab" 重复两次构成。
```

**示例 2:**

```
输入: s = "aba"
输出: false
```

**示例 3:**

```
输入: s = "abcabcabcabc"
输出: true
解释: 可由子串 "abc" 重复四次构成。 (或子串 "abcabc" 重复两次构成。)
```

### 暴力匹配法

以 文本串 aabaabaaf和模式串 aabaaf为例，暴力匹配法就是逐个遍历，先从文本串的第一个字符开始判断是否与模式串匹配，如果不匹配，就从文本串的第二个字符开始匹配，以此类推，直到文本串中出现模式串或者长度达到阈值不能再后移。

这种方法的时间复杂度是O（m*n），m是文本串的长度，n是模式串的长度

### 代码

这里采用前缀表不减1的方式

```python
class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:  
        if len(s) == 0:
            return False
        nxt = [0] * len(s)
        self.getNext(nxt, s)
        if nxt[-1] != 0 and len(s) % (len(s) - nxt[-1]) == 0:
            return True
        return False
    
    def getNext(self, nxt, s):
        nxt[0] = 0
        j = 0
        for i in range(1, len(s)):
            while j > 0 and s[i] != s[j]:
                j = nxt[j - 1]
            if s[i] == s[j]:
                j += 1
            nxt[i] = j
        return nxt
```

### 复杂度分析

- 时间复杂度：O（n）
- 空间复杂度：O（n）

# 栈与队列

## 理论基础

队列是**先进先出**，栈是**先进后出**。

栈和队列是STL（C++标准库）里面的两个数据结构。

## 232.用栈实现队列

### 题目描述

请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（`push`​、`pop`​、`peek`​、`empty`）：

实现 `MyQueue` 类：

- `void push(int x)` 将元素 x 推到队列的末尾
- `int pop()` 从队列的开头移除并返回元素
- `int peek()` 返回队列开头的元素
- `boolean empty()`​ 如果队列为空，返回 `true`​ ；否则，返回 `false`

**说明：**

- 你 **只能** 使用标准的栈操作 —— 也就是只有 `push to top`​, `peek/pop from top`​, `size`​, 和 `is empty` 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。

### 解题思路

队列是先入先出，栈是先入后出

‍

![image.png](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/20260801230714948.png)

用两个栈来模拟队列

### 代码

```python
class MyQueue:

    def __init__(self):
        """
        in主要负责push，out主要负责pop
        """
        self.stack_in = []
        self.stack_out = []


    def push(self, x: int) -> None:
        """
        有新元素进来，就往in里面push
        """
        self.stack_in.append(x)


    def pop(self) -> int:
        """
        Removes the element from in front of queue and returns that element.
        """
        if self.empty():
            return None
        
        if self.stack_out:
            return self.stack_out.pop()
        else:
            for i in range(len(self.stack_in)):
                self.stack_out.append(self.stack_in.pop())
            return self.stack_out.pop()


    def peek(self) -> int:
        """
        Get the front element.
        """
        ans = self.pop()
        self.stack_out.append(ans)
        return ans


    def empty(self) -> bool:
        """
        只要in或者out有元素，说明队列不为空
        """
        return not (self.stack_in or self.stack_out)
```

### 复杂度分析

- 时间复杂度：O（1）
- 空间复杂度：O（n）

## 225.用队列实现栈

### 题目描述

请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（`push`​、`top`​、`pop`​ 和 `empty`）。

实现 `MyStack` 类：

- `void push(int x)` 将元素 x 压入栈顶。
- `int pop()` 移除并返回栈顶元素。
- `int top()` 返回栈顶元素。
- `boolean empty()`​ 如果栈是空的，返回 `true`​ ；否则，返回 `false` 。

**注意：**

- 你只能使用队列的标准操作 —— 也就是 `push to back`​、`peek/pop from front`​、`size`​ 和 `is empty` 这些操作。
- 你所使用的语言也许不支持队列。 你可以使用 list （列表）或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。

### 解题思路

两种思路：1.用两个队列实现栈；2.用一个队列实现栈，主要用2的思路，如下图，把元素1取出来，加入队列中，再把元素2取出来，加入队列中，此时再弹出元素，就是元素3 了

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260831231339-il6obu0.png)

### 代码

```python
class MyStack:

    def __init__(self):
        self.que = deque()#调用collections.deque的构造函数，创建一个空的双端队列对象

    def push(self, x: int) -> None:
        self.que.append(x)#直接把元素加到队列尾部

    def pop(self) -> int:
        if self.empty():#如果栈是空，直接返回 None，防止空队列调用popleft()抛出异常。
            return None
        for i in range(len(self.que)-1):#队列当前有 n 个元素，循环跑 n‑1 次。目的：把前面 n‑1 个元素，从头部拿出来，再追加到队列尾部。
            self.que.append(self.que.popleft()).#弹出队头并放到尾部
        return self.que.popleft()#弹出队头3并返回。

    def top(self) -> int:
        # 写法一：
        # if self.empty():
        #     return None
        # return self.que[-1]

        # 写法二：
        if self.empty():
            return None
        for i in range(len(self.que)-1):
            self.que.append(self.que.popleft())
        temp = self.que.popleft()
        self.que.append(temp)
        return temp

    def empty(self) -> bool:
        return not self.que
```

`return not self.que`，这里not是取反运算符

如果队列为空：self.que → False，not False → True → empty 返回 True，栈为空  
如果队列有元素：self.que → True，not True → False → empty 返回 False，栈不为空

等价写法：

```python
def empty(self) -> bool:
    if len(self.que) == 0:
        return True
    else:
        return False
```

### 复杂度分析

- 时间复杂度：O（n）
- 空间复杂度：O（n）

## 20.有效的括号

## 1047. 删除字符串中的所有相邻重复项

## 150. 逆波兰表达式求值

## 239. 滑动窗口最大值

## 347.前 K 个高频元素

‍
