# 42.接雨水
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

**示例 1：**
![](/public/imgs/接雨水.png)

  输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]  
  输出：6  
  解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 

**示例 2：**

输入：height = [4,2,0,3,2,5]  
输出：9
 
提示：  
n == height.length  
1 <= n <= 2 * 104  
0 <= height[i] <= 105  

## 解题思路
### 1.动态规划
对于位置i能存水量的大小，取决于它左边与右边的最大高度的最小值与当前位置高度的差值。

求高度时，我们可以依据该位置的前一个位置的值来进行推算。

例如我们求位置i的左边的最大高度leftMax，可以用max(height[i],leftMax[i-1])来得出。  
1. 首先最左边的第一个元素height[0]的高度肯定就是他的leftMax，因为他是第一个元素，他的右边没有高度值。
2. 当我们计算第二个元素的leftMax时，我们只需要对比当前位置height[1]的高度值是否大于上一个元素height[0]的leftMax。
3. 如果不大于，那就说明位置height[1]的leftMax的值与前一个是一样的，则不需要改变。
4. 如果大于，我们就把该位置的leftMax的值设定为该位置的高度值heightp[1]，因为当前位置的高度已经大于上一个元素height[0]的最大左边高度leftMax了，说明该位置的最大左边高度就是它本身。
5. 计算当前位置i可以保存的雨水量时公式如下：min(leftMax[i],right[i])-height[i]

## 代码如下
### 1.动态规划
```java
class Solution {
    public int trap(int[] height) {

        int[] leftMax = new int[height.length];
        int[] rightMax = new int[height.length];

        for(int left=0;left<height.length;left++){
            if(left == 0){
                leftMax[left] = height[left];
                continue;
            }
            leftMax[left] = Math.max(leftMax[left-1],height[left]);
        }

        for(int right = height.length-1;right>=0;right--){
            if(right == height.length-1){
                rightMax[right]=height[right];
                continue;
            }
            rightMax[right] = Math.max(rightMax[right+1],height[right]);
        }

        int rainArea = 0;
        for(int i=0;i<height.length;i++){
        
            rainArea += Math.min(leftMax[i],rightMax[i]) - height[i];

        }

        return rainArea;
        
    }
}
```




# 53.最大子数组和
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组是数组中的一个连续部分。

示例 1：

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
示例 2：

输入：nums = [1]
输出：1
示例 3：

输入：nums = [5,4,-1,7,8]
输出：23
 

提示：

1 <= nums.length <= 105
-104 <= nums[i] <= 104
 

进阶：如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的 分治法 求解。

## 思路如下

首先明确一下：求的是最大连续子数组的和。

我们以 f(i) 来表示以元素 nums[i] 为连续子数组结尾时的最大值，要求的就是f(i)的最大值，公式表示为：`Max（0=<i<nums.length）f(i)`

现有一个数组为：nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]  
```f(i) = 以第 i 个数结尾的最大子数组和 ```

f（0）：以第0个元素为结尾的连续子数组为：[-2] ===> f（0）= [-2] = -2  
f（1）：以第1个元素为结尾的连续子数组为：[-2,1],[1] ===> f（1）= [1] = 1  
f（2）：以第2个元素为结尾的连续子数组为：[-2,1,-3],[1,-3],[-3] ===> f（2）=[1,-3]=-2  
f（3）：以第3个元素为结尾的连续子数组为：[-2,1,-3,4],[1,-3,4],[-3,4],[4] ===> f（3）= [4] = 4

观察上述结果我们可以得出:

每一个f(i)都是以当前元素为结尾时的所有连续子数组中的最大值，以下一个元素（i+1）为结尾的所有连续子数组本质上就是在以前一个元素(元素i)为结尾的连续子数组的末尾都加上nums[i+1],外加一个单独的nums[i+1]就得出了所有的以元素i+1为结尾的连续子数组。

所以`f(i+1) = Max(f(i)+nums[i+1],nums(i+1))`

从这个结论出发，当我们求一个以当前元素i为结尾的连续子数组的最大和时，本质上就是比较以前一个元素（i-1）为结尾的最大连续子数组的和加上nums[i]与nums[i]本身的大小，最大的那个就是以当前元素i为结尾的最大连续子数组的和

## 代码如下
```java
class Solution {
    public int maxSubArray(int[] nums) {

        //先处理特殊情况
        if(nums == null || nums.length == 0){
            return 0;
        } 

        // int prefixSum = Integer.MIN_VALUE;
        int prefixSum = 0;
        int maxResult = nums[0];

        for(int num: nums){

            prefixSum = Math.max(prefixSum+num,num);
            maxResult = Math.max(prefixSum,maxResult);

        }

        return maxResult;
    }

}
```

# 560. 和为k的子数组
给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

子数组是数组中元素的连续非空序列。

 

示例 1：

输入：nums = [1,1,1], k = 2
输出：2
示例 2：

输入：nums = [1,2,3], k = 3
输出：2
 

提示：

1 <= nums.length <= 2 * 104
-1000 <= nums[i] <= 1000
-107 <= k <= 107

## 思路分析
### 1.枚举所有连续子数组
题目要求得到连续子数组和为k的个数，我们可以使用循环嵌套，外层循环固定连续子数组末尾，内层循环确定连续子数组起始位置。

这样我们就可以遍历到以任意元素为结尾的连续子数组，依次判断和是否为k即可。

### 2.使用前缀和加哈希解决
思路是这样，我们要找到和为k的连续子数组的数量，同时对于从索引0开始的连续子数组很好确定，我们使用从索引0开始的连续子数组进行做差，就可得到所有不是以索引0开头的连续子数组的值。

由此我们可以通过在遍历的同时进行求从索引0到当前位置的前缀和，然后用当前前缀和减去k，然后去判断hash表中是否有对应的前缀和等于这个差值，若有就表明有符合和为k的子数组。

1. hash表中保存的是 前缀和的值：该数值出现的次数 ，同时遍历之前要先初始化存入一个（0，1）  

    >表示前缀和为0的值出现一次，这里指的是当prefixSum-k刚好等于0时，代表当前位置的前缀和刚好等于k，如果不提前初始化一次，因为是先判断再存入hash表的，if语句判断时便查找不到，会漏掉这个符合条件的数据  

    >这里不用担心会多算，因为若有前缀和刚好等于k的情况出现，刚好算上这次的值，若没有也根本用不上这个，自然也就不会多算

    >保存时保存的是prefixSum的值而不是prefixSum -k的值所以也不会重复计算
2. 遍历时，计算当前位置的前缀和。
3. 然后查找hash表中是否有和为 prefixSum - k的值，若有，count加上该值出现的次数，没有则不做处理
4. 把当前位置的前缀和存入hash表中，保存时若是hash中还没有该值，则默认出现次数设为0然后进行+1处理

## 代码如下
```java
class Solution {
    public int subarraySum(int[] nums, int k) {

        //连续非空序列，和为k,也就是找和为k的非空连续子数组的个数
        //依旧是前缀和思想
        HashMap<Integer,Integer> prefix = new HashMap<>();

        prefix.put(0,1);
        int prefixSum =0;
        int count =0;
        for(int i=0;i<nums.length;i++){
            prefixSum+=nums[i];

            if(prefix.containsKey(prefixSum - k)){
                count+=prefix.get(prefixSum - k);
            }

             prefix.put(prefixSum,prefix.getOrDefault(prefixSum,0)+1);
        }

        return count;
    }
}

```