---
title: ''
slug: leetcode-hot100-z2vo5oe
url: /post/leetcode-hot100-z2vo5oe.html
date: '2026-07-02 23:20:10+08:00'
lastmod: '2026-07-02 23:20:10+08:00'
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
