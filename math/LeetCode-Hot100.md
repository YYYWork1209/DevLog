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
---

# 239.滑动窗口最大值
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回 滑动窗口中的最大值 。

示例 1：

输入：nums = [1,3,-1,-3,5,3,6,7],    k = 3  
输出：[3,3,5,5,6,7]  
解释：  
滑动窗口的位置：                   
[1  3  -1] -3  5  3  6  7       最大值：3  
 1 [3  -1  -3] 5  3  6  7       最大值：3  
 1  3 [-1  -3  5] 3  6  7       最大值：5  
 1  3  -1 [-3  5  3] 6  7       最大值：5  
 1  3  -1  -3 [5  3  6] 7       最大值：6  
 1  3  -1  -3  5 [3  6  7]      最大值：7  

示例 2：

输入：nums = [1], k = 1
输出：[1]


## 解题方法
双端队列与优先队列都是 Java 标准库里已经定义好的接口/实现类，不用自己手写
### 1.优先队列

#### 1.1前置知识点 - 优先队列
**优先队列**：PriorityQueue 是类可以直接new出来
```java
import java.util.PriorityQueue;

PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
```

底层是二叉堆，offer / poll 是 O(log n)，peek 是 O(1)，
**默认是小根堆，传比较器可以变成大根堆**,优先队列后续排列依据比较器的返回值进行排序规则的判断。

#### 1.2 优先队列常用方法
优先队列 PriorityQueue 的特点是：每次出队的都是当前优先级最高（或最低）的元素，跟插入顺序无关。

他的底层是二叉堆：
- 默认是小顶堆：堆顶是最小元素。
- 如果传了比较器，可以变成大顶堆，堆顶就是最大元素。
- 它不保证整个队列有序，只保证堆顶是当前最优先的元素
- 只能访问和弹出堆顶，插入后堆会自动调整，保证堆顶最优先

优先队列内部是堆，不是普通队列。
它没有严格的“首部”和“尾部”这种线性结构概念。

- 插入：offer(e) 或 add(e)，元素进入堆，然后自动调整。
- 查看：peek() 看堆顶，也就是最优先的元素。
- 出队：poll() 弹出堆顶，然后自动调整堆。

|方法	      |作用	          |失败时
|:--|:--|:--|
|offer(e)|	插入元素	        |返回 false
|add(e)	|   插入元素	        |抛异常
|peek()	|   查看堆顶，不删除	| 返回 null
|element() |查看堆顶，不删除	| 抛异常
|poll()	|   弹出堆顶	        |返回 null
|remove()	| 弹出堆顶	        |抛异常
|size()	|   元素个数	        |-
|isEmpty() |是否为空	        |-


#### 1.3关于比较器
这里的比较器指的是创建优先队列时传入的 Comparator 比较器，队列的排序规则是依据传入的比较器的返回值确定的。

Java 的 Comparator 接口文档里明确规定了 compare(a, b) 返回值的含义：

- 返回负数：表示 a 小于 b，a 应该排在 b 前面。
- 返回 0：表示 a 等于 b，顺序无所谓。
- 返回正数：表示 a 大于 b，a 应该排在 b 后面。

**这是 Java 官方规定的约定，所有排序、堆、比较相关的东西都遵守这个规则**

**只看返回值，与具体比较器内部代码无关（例如是 a-b,还是 b-a）。**


PriorityQueue 有一个构造方法可以接收比较器：
```java
PriorityQueue(Comparator<? super E> comparator)
```
Comparator 是一个函数式接口，所以可以用 lambda 简写。

这个 lambda 有两个参数 a 和 b：

因为队列元素类型是 int[]，所以 a 和 b 都是 int[]，也就是数组。

- a[0] 表示数组 a 的第 0 个元素。

- b[0] 表示数组 b 的第 0 个元素。

#### 解题思路
前置知识结束，我们来看具体思路：

使用优先队列的大顶堆，也就是最大值始终在最顶端进行窗口内数据的存储，我们只需把窗口内数据存入优先队列即可，他会自动进行排序，然后把最大值排到队顶。

- 先把初次窗口内的几个数据存入优先队列，这时窗口内的数据最大值会在队列顶部，直接把顶部值存入结果数组即可
- 然后后续的窗口移动都只涉及到窗口首尾两个数据，我们使用for循环从k开始`for(int i =k;i<nums.length;i++)`这里因为初始的数据我们已经存入优先队列了，后续只需要移动右边界，同时判断左边界移出的是否是上一个窗口的最大值即可。所以窗口每次移动中的新值只有右边界进入的数据，之前的数据都是排序好的
    - 如果移出不是最大值，直接存入优先队列即可（他会自动排序最大值放队顶），然后把最大值放入结果数组即可
    - 如果移出的是最大值，我们就把队顶的元素移除即可

总结的话就是，每次窗口移动都只是有一个新值进来，上一次窗口中的值都是排序好的，最大值就在队顶，所以后续新窗口移动时，我们只需要注意左边界移动时丢弃的那个值是不是上一次窗口的最大值，如果是我们就把队顶的最大值移除，避免影响后续窗口中数据排序，如果不是最大值，直接把新元素存入即可，优先队列排序后就会把当前窗口最大值放到队顶。

这里需要注意的就是，左边窗口移出的是不是最大值，以及保存时如何确定最大值是不是上一个窗口的最左侧的数据（其实就是下一次窗口移动时是不是把最大值移出去了）。

解决办法是优先队列保存数据时，把数据连同数据对应的索引位置（作为一个数组）一并存入优先队列中。

#### 解题代码
```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        PriorityQueue<int[]> pq = new PriorityQueue<int[]>(new Comparator<int[]>() {
            public int compare(int[] pair1, int[] pair2) {
                return pair1[0] != pair2[0] ? pair2[0] - pair1[0] : pair2[1] - pair1[1];
            }
        });
        for (int i = 0; i < k; ++i) {
            pq.offer(new int[]{nums[i], i});
        }
        int[] ans = new int[n - k + 1];
        ans[0] = pq.peek()[0];
        for (int i = k; i < n; ++i) {
            pq.offer(new int[]{nums[i], i});
            while (pq.peek()[1] <= i - k) {
                pq.poll();
            }
            ans[i - k + 1] = pq.peek()[0];
        }
        return ans;
    }
}

```


### 2.单调队列（双端队列）
#### 2.1前置知识点 - 双端队列
**双端队列**：Deque 接口 + ArrayDeque / LinkedList

```java
import java.util.Deque;
import java.util.ArrayDeque;
import java.util.LinkedList;
```

- Deque 是接口，不能直接 new。
- 常用实现类是 ArrayDeque 和 LinkedList。

写法如下：
```java
Deque<Integer> deque = new ArrayDeque<>();
Deque<Integer> deque = new LinkedList<>();
```
推荐用 ArrayDeque，更快

#### 2.2双端队列常用方法
双端队列两端都能进出，方法分两组：

| 操作 | 队首 |队尾 |
|:--|:--|:--|
| 添加 | offerFirst(e) / addFirst(e) | offerLast(e) / addLast(e) |  
| 删除 |pollFirst() / removeFirst()| pollLast() / removeLast() |
| 查看 |peekFirst() / getFirst()| peekLast() / getLast() |

两个方法的区别是失败的时候：
- offer、poll、peek: 返回null空值 
- add、remove、get: 直接抛出异常

常见简写：
```java
deque.offer(e);    // 等价于 offerLast
deque.poll();      // 等价于 pollFirst
deque.peek();      // 等价于 peekFirst
```

#### 解题思路
这里的思路是与上述的优先队列类似的，不同的地方是我们这里采用的是，只用队列存储索引值，然后排序依据队列中的索引对应的数据的大小进行递减排序，这样的话同样第一个数据也是最大值，若是新加入窗口的值大于队列末尾的值，就把队列末尾的值排出，若是移出窗口的索引刚好是最大值对应的索引，就把该索引从队列中移除，整体思路与优先队列基本一致

#### 代码如下
```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {

        int [] result = new int[nums.length - k +1];

        //用双端队列Deque
        Deque<Integer> deque = new ArrayDeque<>();

        //双端队列可以当堆（队列）也可以当栈用，两端都能进出
        //使用单调队列，本题用大顶堆来做

        //先把当前窗口数据保存到单调递减队列中，注意若是当前存入的元素比前面的元素都大，直接把前面的所有元素都弹出，这样就确保了当前窗口的最大值始终在队顶
        for(int i= 0;i<k;i++){

          //判断加入的元素是否比前面的元素大
            while(!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]){
                //把前面的元素移出去
                deque.pollLast();
            }
            //这样维持了一个单调递减的队列，后续只要窗口移动没有把这个最大值移出窗口，栈顶的值就是当前窗口的最大值
            deque.offerLast(i);

            }

            //把当前窗口最大值加入结果中
            result[0] = nums[deque.peekFirst()];


            //遍历窗口右边界的同时，判断最大值是否被移出了窗口
            for(int i=k;i<nums.length;i++){

                if(deque.peekFirst() <= i-k){
                    deque.pollFirst();
                }

                while(!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]){
                    deque.pollLast();
                }

                deque.offerLast(i);

                result[i-k+1] = nums[deque.peekFirst()];
            }

            return result;
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