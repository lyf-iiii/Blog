# leetcode

## 动态规划

### 55. 跳跃游戏

```js
/**
 * @title 跳跃游戏
 * @param {number[]} nums
 * @return {boolean}
 * 思路 topdown 动态规划
 * 2 3 1 1 4
 * 0 0 0 0 1
 * 0 1 1 1 1
 */
let canJump = function (nums) {
  const totalLength = nums.length;
  const memo = Array(totalLength).fill(0);
  memo[totalLength - 1] = 1;
  function jump(position) {
    if (memo[position] === 1) {
      return true;
    } else if (memo[position] === -1) {
      return false;
    }
    const maxJump = Math.min(position + nums[position], totalLength - 1);
    for (let i = position + 1; i <= maxJump; i++) {
      const jumpResult = jump(i);
      if (jumpResult === true) {
        memo[position] = 1;
        return true;
      }
    }
    memo[position] = -1;
    return false;
  }
  let res = jump(0);
  return res;
};
/**
 * 思路 bottomUp 动态规划 后往前
 * 3 1 0 2 4
 * 0 0 0 0 1
 * 0 0 0 1 1
 * 0 -1 -1 1 1
 * 1 -1 -1 1 1
 */
/**
 * @title 跳跃游戏
 * @param {number[]} nums
 * @return {boolean}
 * 思路 bottomUp 贪心
 * 3 1 0 2 4 maxjump = 4
 * 3 1 0 2 4 maxjump = 3
 * 3+0 >= maxjump  maxjump = 0
 * maxjump === 0 && true
 */
var canJump = function (nums) {
  const totalLength = nums.length;
  let maxJump = totalLength - 1;
  for (let i = totalLength - 2; i >= 0; i--) {
    if (nums[i] + i >= maxJump) {
      maxJump = i;
    }
  }
  return maxJump === 0;
};
console.log(canJump([2, 3, 1, 1, 4]));
```

### 62. 不同路径

```js
/**
 * @title 不同路径
 * @param {number} m
 * @param {number} n
 * @return {number}
 * 思路 动态规划
 * 假设机器人从左上角走到位置i,j
 * 那么可以从该位置的上方 i-1，j或者左方i，j-1过来
 * 那么到达i,j位置的路径和等于 i-1，j 和 i，j-1的路径数之和
 * 我们用dp[i][j]标识i，j的不同路径数
 * 动态规划转移方程
 * dp[i][j] = dp[i-1][j] + dp[i][j-1]
 * 注意 第一行第一列
 * 1 1 1 1 1 1 1
 * 1 2 3 4 5 6 7
 * 1 3 6 10 15 21 28
 */
var uniquePaths = function (m, n) {
  const dp = new Array(m).fill().map(() => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};
// var uniquePaths = function (m, n) {
//   const dp = new Array(n).fill(1);
//   for (let i = 1; i < m; i++) {
//     for (let j = 1; j < n; j++) {
//       dp[j] += dp[j - 1];
//     }
//   }
//   return dp[n - 1];
// };

console.log(uniquePaths(3, 7));
```

### 70. 爬楼梯

```js
/**
 * @title 爬楼梯
 * @param {number} n
 * @return {number}
 * 思路 动态规划 o3
 *
 */
var climbStairs = function (n) {
  let q = 0,
    p = 0,
    r = 1;
  for (let i = 0; i < n; i++) {
    q = p;
    p = r;
    r = p + q;
  }
  return r;
};
console.log(climbStairs(3));
// console.log(2);

/**
 * @title 爬楼梯
 * @param {number} n
 * @return {number}
 * 思路 动态规划
 * memo[i] = memo[i - 2] + memo[i - 1]
 */
var climbStairs = function (n) {
  const memo = [];
  memo[1] = 1;
  memo[2] = 2;
  for (let i = 3; i <= n; i++) {
    memo[i] = memo[i - 2] + memo[i - 1];
  }
  return memo[n];
};
```

### 300.最长上升子序列

```js
/**
 * @title 最长上升子序列
 * @param {number[]} nums
 * @return {number}
 * 思路 动态规划
 * 记录dp[i]是以给定数组元素num[i]结尾的递增子序列的长度。
 * 则状态转移方程为当j<i，并且num[j] < num[i]时，
 * 有：dp[i] = max(dp[j]) +1
 */
var lengthOfLIS = function (nums) {
  let dp = Array(nums.length).fill(1);
  let result = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    result = Math.max(result, dp[i]);
    console.log(result);
  }
  return result;
};
console.log(lengthOfLIS([1, 3, 2, 5, 6, 4, 7]));
```

## 队列

### 102.二叉树层序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @title 二叉树层序遍历
 * @param {TreeNode} root
 * @return {number[][]}
 * 思路 队列 循环
 * 创建一个队列 将跟节点加入
 * 创建结果数组 result
 * 当queue 有元素时开启while循环
 * 创建 len = queue.length
 * 创建 level 某层的所有元素
 * for循环 每一层
 * 从队列弹出 node
 * 收集val 到level
 * 如果有左节点 加入queue
 * 如果有右节点 加入queue
 * for循环结束 将level 加入 result
 * 最后返回result
 */
var levelOrder = function (root) {
  if (!root) return [];
  const queue = [root];
  const result = [];
  while (queue.length) {
    let level = [];
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let node = queue.shift();
      level.push(node.val);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    result.push(level);
  }
  return result;
};
```

## 二叉树

### 144. 二叉树的前序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @title 144. 二叉树的前序遍历
 * @param {TreeNode} root
 * @return {number[]}
 *
 */
var preorderTraversal = function (root) {
  let res = [];
  const dfs = (root) => {
    if (!root) return;
    res.push(root.val);
    dfs(root.left);
    dfs(root.right);
  };
  dfs(root);
  return res;
};
```

### 94. 二叉树的中序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 *
 * 思路 回溯算法
 * 前序 中左右
 * 中序 左中右
 * 后序 左右中
 */
var inorderTraversal = function (root, array = []) {
  if (root) {
    inorderTraversal(root.left, array);
    array.push(root.val);
    inorderTraversal(root.right, array);
  }
  return array;
};
```

### 101. 对称二叉树

```js
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function (root) {
  return fn(root, root);
};
const fn = (l, r) => {
  if (!l && !r) return true;
  if (!l || !r) return false;
  return l.val === r.val && fn(l.left, r.right) && fn(l.right, r.left);
};
```

### 104. 二叉树的最大深度

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) {
    return 0;
  } else {
    const left = maxDepth(root.left);
    const right = maxDepth(root.right);
    return Math.max(left, right) + 1;
  }
};
```

### 226. 翻转二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  let tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  invertTree(root.left);
  invertTree(root.right);
  return root;
};
```

### 543. 二叉树的直径

```js
/**
 * 思路 直径等于 左侧最大路径数+右侧最大路径数+1
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
  if (root === null || (root.left === null && root.right === null)) return 0;
  let res = 0;
  const dfs = (root) => {
    if (root === null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    res = Math.max(res, left + right + 1);
    return Math.max(left, right) + 1;
  };
  dfs(root);
  return res - 1;
};
```

### 617. 合并二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 * 思路 递归 把root2 加到 root1上 返回root1
 */
var mergeTrees = function (root1, root2) {
  if (!root1 && !root2) return null;
  if (!root1) return root2;
  if (!root2) return root1;
  root1.val = root1.val + root2.val;
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);
  return root1;
};
```

## 滑动窗口

### 643.子数组最大平均值

```js
/**
 * @title 643.子数组最大平均值
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 * 思路 滑动窗口
 * 设置 sum 准备滑动窗口 ans为平均数 默认0
 * 计算初始 sum ans
 * 然后进行滑动窗口
 * sum = sum +i - （i-k）位置的值
 * ans 更新最大值
 * 返回ans
 */
var findMaxAverage = function (nums, k) {
  let ans = 0,
    sum = 0;
  for (let i = 0; i < k; i++) {
    sum += nums[i];
  }
  ans = sum / k;
  for (let i = k; i < nums.length; i++) {
    sum = sum + nums[i] - nums[i - k];
    ans = Math.max(ans, sum / k);
  }
  return ans;
};
```

## 回溯

### 17. 电话号码的字母组合

```js
/**
 * @title 电话号码的字母组合
 * @param {string} digits
 * @return {string[]}
 * 思路 回溯算法
 * 递归
 * map 二维数组
 * s 当前组合
 * res 结果数组
 * fun 函数递归
 * digits的长度等于 索引值 递归结束 将s推入res
 * 获取当前letter 数字对应的字母字符串
 * push fun pop
 */
var letterCombinations = function (digits) {
  if (digits.length < 1) return [];
  let s = [],
    res = [];
  const map = [
    null,
    null,
    'abc',
    'def',
    'ghi',
    'jkl',
    'mno',
    'pqrs',
    'tuv',
    'wxyz',
  ];
  const fun = (digits, index) => {
    if (digits.length === index) {
      res.push(s.join(''));
      return null;
    }
    let digit = digits[index] - 0;
    let letter = map[digit];
    for (let i = 0; i < letter.length; i++) {
      s.push(letter[i]);
      fun(digits, index + 1);
      s.pop();
    }
  };
  fun(digits, 0);
  return res;
};
console.log(letterCombinations('23'));
```

### 46.全排列

```js
/**
 * @title 46.全排列
 * @param {number[]} nums
 * @return {number[][]}
 * 思路 回溯
 * 二维数组 for循环 横向 回溯纵向
 * 如果深度和nums 一样长 那么加入res
 * for循环 先记录 当前 然后 回溯 出来 取消记录
 * 最后返回res
 */
var permute = function (nums) {
  let res = [],
    path = [];
  let dfs = (nums, k, used) => {
    if (path.length === k) {
      res.push([...path]);
    }
    for (let i = 0; i < k; i++) {
      if (used[i] === true) continue;
      path.push(nums[i]);
      used[i] = true;
      dfs(nums, k, used);
      path.pop();
      used[i] = false;
    }
  };
  dfs(nums, nums.length, []);
  return res;
};
```

### 78.子集

```js
/**
 * @title 子集
 * @param {number[]} nums
 * @return {number[][]}
 * 思路 回溯 模版
 */
// subSets(nums) {
//   result = []
//   backtrack(start, curr){
//     把curr添加入result数组
//     for(let i = start;i<nums.length;i++){
//       1. 把nums[i]加入curr数组
//       2.backTrack（i+1，curr）
//       3.把curr数组的最后一个元素移除
//     }
//   }
//   backtrack（0，【[]）
//   return result
// }
var subsets = function (nums) {
  let res = [];
  const backtrack = (start, curr) => {
    res.push([...curr]);
    for (let i = start; i < nums.length; i++) {
      curr.push(nums[i]);
      backtrack(i + 1, curr);
      curr.pop();
    }
  };
  backtrack(0, []);
  return res;
};
console.log(subsets([1, 2, 3]));
```

### 113. 路径总和 II

```js
/**
 * @title 113. 路径总和 II
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 * 思路 回溯 遍历整棵树 因此不需要返回值
 * dfs 遍历的时候维护 curPath 当前数组 和 count 当前值
 * 如果 到叶子节点 且count 为0 将curPath 加入 resPath
 * 如果有left 递归
 * 如果有right 递归
 * 一条分支结束 回显count
 */
var pathSum = function (root, targetSum) {
  let resPath = [],
    curPath = [];
  const dfs = (root, count) => {
    curPath.push(root.val);
    count -= root.val;
    if (!root.left && !root.right && count === 0) {
      resPath.push([...curPath]);
    }
    root.left && dfs(root.left, count);
    root.right && dfs(root.right, count);
    curPath.pop();
    // const cur = curPath.pop();
    // count -= cur;
  };
  if (!root) return resPath;
  dfs(root, targetSum - root.val);
  return resPath;
};
```

### 236.二叉树的最近公共祖先

```js
/**
 * @title 236.二叉树的最近公共祖先 找到p q 两个节点的公共祖先 本身也是自己的祖先
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 * 思路 回溯
 * 二叉树后序遍历
 * 我们使用递归 遍历整棵树，当节点为null或者节点等于p或q向上返回此节点。
 */
var lowestCommonAncestor = function (root, p, q) {
  const dfs = (root, p, q) => {
    if (root === null || root === p || root === q) {
      return root;
    }
    let left = lowestCommonAncestor(root.left, p, q);
    let right = lowestCommonAncestor(root.right, p, q);
    if (left !== null && right !== null) return root;
    if (left === null) return right;
    return left;
  };
  return dfs(root, p, q);
};
```

## 链表

### 2.两数相加

```js
/**
 * @title 两数相加
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 * 给两个非空链表 [2,4,3], [5,6,4] 返回 [7,0,8]
 * 思路 链表对应位相加 满10flag为1 不满为0 计算p3每级的结果
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
var addTwoNumbers = function (l1, l2) {
  let l3 = new ListNode(-1),
    p1 = l1,
    p2 = l2,
    p3 = l3,
    flag = 0;
  while (p1 || p2 || flag) {
    let num1 = p1 ? p1.val : 0;
    let num2 = p2 ? p2.val : 0;
    let sum = num1 + num2 + flag;
    if (sum > 9) {
      p3.next = new ListNode(sum % 10);
      flag = 1;
    } else {
      p3.next = new ListNode(sum);
      flag = 0;
    }
    if (p1) p1 = p1.next;
    if (p2) p2 = p2.next;
    p3 = p3.next;
  }
  return l3.next;
};
```

### 19. 删除链表的倒数第 N 个结点

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @title 删除链表的倒数第n个节点
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 * 思路
 *  快慢指针
 *  设置dummy
 *  fast先到n
 *  fast与slow 向后
 *  fast到底 slow 刚好是倒数第n
 *  执行删除 返回
 */
var removeNthFromEnd = function (head, n) {
  let dummy = new ListNode(0);
  dummy.next = head;
  let fast = dummy,
    slow = dummy;
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }
  while (fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
};
// console.log(
//   removeNthFromEnd(
//     {
//       val: 1,
//       next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5, next: null } } } },
//     },
//     2
//   )
// );
console.log(
  removeNthFromEnd(
    {
      val: 1,
      next: null,
    },
    1,
  ),
);
```

### 21.合并两个有序链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @title 合并两个有序链表
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 * 定义头部 curr
 * 创建dummy为curr
 * l1 与 l2 都存在的情况
 * 比较值谁小 小的加到 curr.next 并且往后移
 * curr 往后移
 * while 结束 把剩余的接上
 * 返回 dummy。next
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
var mergeTwoLists = function (l1, l2) {
  let curr = new ListNode();
  const dummy = curr;

  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 ? l1 : l2;
  return dummy.next;
};
console.log(
  mergeTwoLists(
    {
      val: 1,
      next: {
        val: 2,
        next: { val: 4, next: null },
      },
    },
    {
      val: 1,
      next: {
        val: 3,
        next: { val: 4, next: null },
      },
    },
  ),
);
```

### 83.删除排序链表中的重复元素

```js
/**
 * @title 83.删除排序链表中的重复元素
 * @param {ListNode} head
 * @return {ListNode}
 * 思路 因为排序好了 随意比较前后两个val是否相等就好了
 * 不相等就指针向下
 */
var deleteDuplicates = function (head) {
  let dummy = head;
  while (head && head.next) {
    if (head.val === head.next.val) {
      head.next = head.next.next;
    } else {
      head = head.next;
    }
  }
  return dummy;
};
console.log(
  deleteDuplicates({
    val: 1,
    next: {
      val: 1,
      next: {
        val: 2,
        next: {
          val: 3,
          next: {
            val: 3,
            next: null,
          },
        },
      },
    },
  }),
);
```

### 82.删除排序链表中的重复元素 II

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @title 82.删除排序链表中的重复元素 II
 * @param {ListNode} head
 * @return {ListNode}
 * 思路
 * 设置dummy 作为head头部节点
 * 设置cur 来进行循环
 * 找到相邻的重复值 把值记录为del_val 然后对cur进行循环删除del_val
 * 如果没有相邻重复 cur 往后推
 * 返回 dummy.next
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
var deleteDuplicates = function (head) {
  if (!head || !head.next) return head;
  let dummy = new ListNode(0);
  dummy.next = head;
  let cur = dummy;
  while (cur.next && cur.next.next) {
    if (cur.next.val === cur.next.next.val) {
      const del_val = cur.next.val;
      while (cur?.next.val === del_val) {
        cur.next = cur.next.next;
      }
    } else {
      cur = cur.next;
    }
  }
  return dummy.next;
};
```

### 206. 反转链表

```js
var reverseList = function (head) {
  let pre = null;
  let cur = head;
  while (cur !== null) {
    let tmp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = tmp;
  }
  return pre;
};
console.log(
  reverseList({
    val: 1,
    next: {
      val: 2,
      next: { val: 3, next: { val: 4, next: { val: 5, next: null } } },
    },
  }),
);
```

### 92.反转链表 II

```js
/**
 * @title 92.反转链表II
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 * 思路
 * 设置dummy
 * 设置leftHead 并循环到left - 1
 * 设置start = left位置
 * 设置pre left位置
 * 设置cur left+1位置
 * 开始 在 left-right 区间内反转
 * 反转结束 leftHead.next 连接pre
 * start.next就是尾 连接cur
 */
var reverseBetween = function (head, left, right) {
  let dummy = new ListNode(0, head);
  let leftHead = dummy;

  for (let i = 0; i < left - 1; i++) {
    leftHead = leftHead.next;
  }

  let start = leftHead.next;
  let pre = start;
  let cur = pre.next;

  for (let j = left; j < right; j++) {
    let temp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = temp;
  }

  leftHead.next = pre;
  start.next = cur;
  return dummy.next;
};
```

### 141. 环形链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow === fast) {
      return true;
    }
  }
  return false;
};
console.log(hasCycle([]));
// var hasCycle = function (head) {
//   let res = [];
//   while (head) {
//     if (res.includes(head)) {
//       return true;
//     }
//     res.push(head);
//     head = head.next;
//   }
//   return false;
// };
```

### 142. 环形链表 II

```js
/**
 * @title 142. 环形链表 II
 * @param {ListNode} head
 * @return {ListNode}
 * 思路
 * 快慢指针 fast slow 可以判断是否有环
 * 有环之后 index1从链表起点 index2 在相遇点 再次相遇就是 环的起点
 *
 * 1. 设置快慢指针
 * 2. 找环
 * 3. 找到环 slow 回到head
 * 4. 快慢指针再次相遇 就是起点
 */
var detectCycle = function (head) {
  if (!head || !head.next) return null;
  let fast = head.next.next,
    slow = head.next;
  while (fast && fast.next && fast !== slow) {
    fast = fast.next.next;
    slow = slow.next;
  }
  if (!fast || !fast.next) return null;
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }
  return slow;
};
```

### 160. 相交链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  const visited = new Set();
  let temp = headA;
  while (temp) {
    visited.add(temp);
    temp = temp.next;
  }
  temp = headB;
  while (temp) {
    if (visited.has(temp)) {
      return temp;
    }
    temp = temp.next;
  }
  return null;
};
```

### 234. 回文链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function (head) {
  let arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }
  for (let i = 0, j = arr.length - 1; i < j; ++i, --j) {
    if (arr[i] !== arr[j]) {
      return false;
    }
  }
  return true;
};
console.log(
  isPalindrome({
    val: 1,
    next: {
      val: 2,
      next: {
        val: 2,
        next: {
          val: 1,
        },
      },
    },
  }),
);
```

## 数组

### 1.两数之和

```js
/**
 * @title 两数之和
 * @param {*} nums
 * @param {*} target
 * @returns
 * 给一串数字 和一个数字 找到合为目标数字的两个数字组成的数组
 * 思路
 *   哈希存储
 *   存下 key = target - cur ， val = cur
 *   循环过程中 如果 i === key 表示 找到 返回两个数组成的数组
 */
var twoSum = function (nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i])) {
      return [map.get(nums[i]), i];
    }
    map.set(target - nums[i], i);
  }
  return false;
};
console.log(twoSum([2, 7, 11, 15], 9));
console.log(twoSum([3, 2, 4], 6));
console.log(twoSum([2, 5, 5, 11], 10));
```

### 88. 合并两个有序数组

```js
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  let l1 = nums1.slice(0, m),
    l2 = nums2.slice(0, n),
    q1 = 0,
    q2 = 0,
    res = [];

  while (l1[q1] != undefined && l2[q2] != undefined) {
    if (l1[q1] < l2[q2]) {
      res.push(l1[q1]);
      q1++;
    } else {
      res.push(l2[q2]);
      q2++;
    }
  }

  res = l1[q1] ? res.concat(l1.slice(q1)) : res.concat(l2.slice(q2));
  for (let i = 0; i < res.length; i++) {
    nums1[i] = res[i];
  }
};
// 反向双指针
var merge = function (nums1, m, nums2, n) {
  let i = m - 1,
    j = n - 1,
    k = m + n - 1;
  while (i >= 0 && j >= 0) {
    if (nums1[i] >= nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  while (j >= 0) {
    nums1[k--] = nums2[j--];
  }
};
// console.log(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3)); // [1,2,2,3,5,6]
```

### 448. 找到所有数组中消失的数字

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function (nums) {
  nums = nums.sort((a, b) => a - b);
  let res = [];
  for (let i = 1; i <= nums.length; i++) {
    if (!nums.includes(i)) {
      res.push(i);
    }
  }
  return res;
};
// console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1]));
console.log(findDisappearedNumbers([1, 1]));
```

## 栈

### 20. 有效的括号

```js
/**
 * @title 有效的括号
 * @param {string} s
 * @return {boolean}
 * 思路
 * 创建map配对
 * 创建stack array
 * for循环
 * map有key stack 存 val
 * 如果没有 弹出stack 和 str对比 如果不想等 返回false
 * 结束之后 返回stack的length 区反
 */
var isValid = function (s) {
  const map = new Map();
  map.set('(', ')');
  map.set('[', ']');
  map.set('{', '}');
  const stack = [];
  for (let str of s) {
    if (map.has(str)) {
      stack.push(map.get(str));
    } else if (stack.pop() !== str) {
      return false;
    }
  }
  return !stack.length;
};
console.log(isValid('()[]{}'));
console.log(isValid('(}'));
```

### 739.每日温度

```js
/**
 * @title 739.每日温度
 * @param {number[]} temperatures
 * @return {number[]}
 * 思路 单调栈 [73, 74, 75, 71, 71, 72, 76, 73] [1, 1, 4, 2, 1, 1, 0, 0]
 * n 数组长度
 * 初始化res n个0的数组
 * stack 单调栈
 * stack 加0
 * for循环从第1个开始
 * 如果进来的数 小于等于栈顶元素 进栈
 * 如果进来的数 大于栈顶元素 执行所有比进来数小的元素出栈 while 出栈的时候记录对应res 为 i-top
 * 返回res
 */
var dailyTemperatures = function (temperatures) {
  let n = temperatures.length;
  let res = Array(n).fill(0);
  const stack = [];
  stack.push(0);
  for (let i = 1; i < n; i++) {
    const top = stack[stack.length - 1];
    if (temperatures[i] <= temperatures[top]) {
      stack.push(i);
    } else {
      while (
        stack.length &&
        temperatures[i] > temperatures[stack[stack.length - 1]]
      ) {
        const top = stack.pop();
        res[top] = i - top;
      }
      stack.push(i);
    }
  }
  return res;
};
```

## 字符串

### 3.无重复字符的最长子串

```js
/**
 * @title 无重复自负最长子串 输入一个字符串返回 最长的没有重复字母的子串长度
 * @param {string} 
 * @return {number}
 * 思路 
 * 设计l r两个指针 当没有出现重复的时候 l不懂 r右移 当 出现重复的时候 l右移 期间重复计算maxLen
 * 判断重复的方法用charcodeAt为key 2就是重复
 * 声明中间变量chars来记录字符串每个字符的出现频率（这类题，涉及字符串的，常见的标记数组）
   遍历这个字符串
   如果遇见chars.At(win_r) === 2,说明当前字符串终于出现了重复字符，当前字符串不符合要求，开始移动左指针win_l，直到chars.At(win_r) === 1
 */
var lengthOfLongestSubstring = function (s) {
  let l = 0;
  let maxLen = 0;
  let chars = new Array(128).fill(0);
  for (let r = 0; r < s.length; r++) {
    chars[s.charCodeAt(r)]++;
    while (chars[s.charCodeAt(r)] === 2) {
      chars[s.charCodeAt(l)]--;
      l++;
    }
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
};
// console.log(lengthOfLongestSubstring('abcabcbb'));
console.log(lengthOfLongestSubstring('pwwkew'));
```

### 680.验证回文串

```js
/**
 * @title 680.验证回文串 II
 * @param {string} s
 * @return {boolean}
 * 思路
 * 回文len
 * 双指针 i j
 *
 */
var validPalindrome = function (s) {
  if (s.length < 3) return s;
  let i = 0,
    j = s.length - 1;
  for (let len = 2; len < s.length; len++) {
    if (s[i] != s[j]) {
      if (isPalindrome(s.slice(i + 1, j + 1))) {
        return true;
      }
      if (isPalindrome(s.slice(i, j))) {
        return true;
      }
      return false;
    }
    i++;
    j--;
  }
  return true;
};
const isPalindrome = (str) => {
  return str.split('').reverse().join('') === str;
};
```

### 5. 最长回文子串

```js
/**
 * @param {string} s
 * @return {string}
 * 思路
 * 如果字符串长度小于2 直接返回
 * 定义start 和 maxlength= 1
 * 创建expandAroundCenter函数 判断 left right边界 和 left与right位置的字母一样 当right-left +1 大于maxlength赋值 更新start = left
 * 然后 遍历s 将回文 有奇偶数的情况分别处理
 * 返回 回文串
 */
var longestPalindrome = function (s) {
  if (s.length < 2) {
    return s;
  }
  let start = 0,
    maxLength = 1;
  const expandAroundCenter = (left, right) => {
    while (left >= 0 && right <= s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLength) {
        maxLength = right - left + 1;
        start = left;
      }
      left--;
      right++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i - 1, i + 1);
    expandAroundCenter(i, i + 1);
  }
  return s.substring(start, start + maxLength);
};
// var longestPalindrome = function (s) {
//   if (!s) return null;
//   let longest = '',
//     str,
//     l,
//     i,
//     len;
//   const isPalindrom = (left, right) => {
//     while (left < right && s[left] === s[right]) {
//       left++;
//       right++;
//     }
//     return left >= right;
//   };

//   for (len = 2; len <= s.length; len++) {
//     for (i = 0; i < s.length; i++) {
//       j = len + i - 1;
//       if (isPalindrom(i, j)) {
//         str = s.slice(i, j + 1);
//         if (str.length > longest.length) longest = str;
//       }
//     }
//   }
//   return longest;
// };
console.log(longestPalindrome('abcabcbb'));
```

### 415. 字符串相加

```js
/**
 * @title 415. 字符串相加
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 * 思路 ~~ 两次位运算 得到数值 去小数点
 * 初始化 res， c单位的和 a拆成数组 b拆成数组
 * while循环 a长度 b长度 c
 * 计算c
 * 拼接res
 * 判断c有无进位
 */
var addStrings = function (num1, num2) {
  // return String(Number(num1) + Number(num2))
  let res = '',
    c = 0,
    a = num1.split(''),
    b = num2.split('');
  while (a.length || b.length || c) {
    // console.log(a)
    // console.log(a.pop())
    // console.log(~~a.pop())
    c += ~~a.pop() + ~~b.pop();
    res = (c % 10) + res;
    c = c > 9;
  }
  return res.replace(/^0+/, '') || '0';
};
console.log(JSON.stringify(addStrings('193', '0011')));
```

## 未知类型

### 6.N 字形变换

```js
/**
 * @title 6.N字形变换
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 * 思路
 * loc 控制左右 down向下的时候 往左+1 down向上的时候 往右+1
 * loc 是0 或者 numRows -1的时候 down 取反
 * 遍历 s
 * loc位置收集c 到 rows里
 * rows数组连起来
 */
var convert = function (s, numRows) {
  if (numRows === 1) return s; // 深度为1 直接返回
  const len = Math.min(s.length, numRows); // 字符串长度比深度小 以字符串长度为准
  const rows = Array(len).fill(''); // 制作结果数组
  let loc = 0; // 代表位置 左右
  let down = false; // 代表方向 上下

  for (let c of s) {
    rows[loc] += c;
    if (loc === 0 || loc === numRows - 1) {
      down = !down;
    }
    loc += down ? 1 : -1;
  }

  return rows.join('');
};
```

### 11. 盛最多水的容器

```js
/**
 * @title 盛水最多的容器
 * @param {number[]} height
 * @return {number}
 * 思路
 * 计算 area = min(i,j) * d
 * 双指针 首位往里 比较 ij上的height 谁大 小的往中间移 每次计算area 更新maxArea
 */
var maxArea = function (height) {
  let i = 0,
    j = height.length - 1,
    maxArea = 0;
  while (i < j) {
    let area = Math.min(height[i], height[j]) * (j - i);
    if (height[i] > height[j]) {
      j--;
    } else {
      i++;
    }
    maxArea = Math.max(area, maxArea);
  }
  return maxArea;
};
```

### 15.三数之和

```js
/**
 * @title 三数之和
 * @param {number[]} nums
 * @return {number[][]}
 * 思路
 * 1.给数组排序
 * 2.遍历数组 从0遍历到length - 2 为什么？
 * 3.如果当前的数字等于前一个数字，则跳过这个数 为什么？
 * 4.如果数字不同，则设置start = i + 1， end = length - 1，
 *    查看i，start和end三个数的和比0大还是小，如果比0小start++，如果比0大end--
 *    如果等于0把和加到结果里
 * 5.返回结果
 */
var threeSum = function (nums) {
  let res = [];
  nums = nums.sort((a, b) => a - b);
  let len = nums.length;

  for (let i = 0; i < len - 2; i++) {
    if (i === 0 || nums[i] !== nums[i - 1]) {
      let start = i + 1,
        end = len - 1;
      while (start < end) {
        let sum = nums[i] + nums[start] + nums[end];
        if (sum === 0) {
          res.push([nums[i], nums[start], nums[end]]);
          start++;
          end--;
          while (start < end && nums[start] == nums[start - 1]) {
            start++;
          }
          while (start < end && nums[end] == nums[end + 1]) {
            end--;
          }
        } else if (sum < 0) {
          start++;
        } else {
          end--;
        }
      }
    }
  }

  return res;
};
console.log(JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4])));
```

### 53. 最大子数组和

```js
/**
 * @title 最大子数组和
 * @param {number[]} nums
 * @return {number}
 * 思路
 * 记录当前子数组的和 pre
 * for循环
 * 更新 pre
 * 更新 res
 * 返回res
 */
var maxSubArray = function (nums) {
  let pre = nums[0];
  let max = nums[0];
  for (let i = 0; i < nums.length; i++) {
    pre = Math.max(pre + nums[i], nums[i]);
    max = Math.max(max, pre);
  }
  return max;
};
console.log(maxSubArray([-2, -3, -1]));
```

### 56. 合并区间

```js
/**
 * @title 合并区间
 * @param {number[][]} intervals
 * @return {number[][]}
 * 思路
 * 先给数组 按照第一个元素进行升序排序
 * 如果当前区间的右端点大于下一个区间的左断点 说明两个区间有重叠
 * 将他们合并
 * 否则将当前区间加入结果数组中
 */
var merge = function (intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  let res = [],
    tmp = intervals[0];
  for (let interval of intervals) {
    if (interval[0] < tmp[1]) {
      tmp = [tmp[0], Math.max(tmp[1], interval[1])];
    } else {
      res.push([...tmp]);
      tmp = interval;
    }
  }
  res.push(tmp);
  return res;
};
console.log(
  merge([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ]),
);
```

### 121. 买卖股票的最佳时机

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let len = prices.length;
  if (len < 2) return 0;
  let res = 0,
    minPrices = prices[0];

  for (let i = 1; i < len; i++) {
    res = Math.max(res, prices[i] - minPrices);
    minPrices = Math.min(prices[i], minPrices);
  }
  return res;
};

console.log(maxProfit([7, 1, 5, 3, 6, 4]));
// console.log(maxProfit([7, 6, 4, 3, 1]));
```

### 136. 只出现一次的数字

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
// var singleNumber = function (nums) {
//   let set = new Set();
//   for (let i = 0; i < nums.length; i++) {
//     if (!set.has(nums[i])) {
//       set.add(nums[i]);
//     } else {
//       set.delete(nums[i]);
//     }
//   }
//   return [...set][0];
// };
var singleNumber = function (nums) {
  let ans = 0;
  for (const num of nums) {
    ans ^= num;
  }
  return ans;
};

console.log(singleNumber([4, 1, 2, 1, 2]));
```

### 169. 多数元素

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let map = new Map();
  let i = 0;
  while (i <= nums.length - 1) {
    if (!map.has(nums[i])) {
      map.set(nums[i], 1);
    } else {
      let count = map.get(nums[i]);
      map.set(nums[i], count + 1);
    }
    if (map.get(nums[i]) > nums.length / 2) {
      return nums[i];
    }
    i++;
  }
};
```

### 215. 数组中的第 K 个最大元素

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 * 
 * 思路 快速排序
 * 查找到的index 在 target左边 进入 [left=index+1,right]
   查找到的index 在 target右边 进入 [left, right = index -1]
 */
var findKthLargest = function (nums, k) {
  let len = nums.length,
    left = 0,
    right = len - 1,
    target = len - k;
  while (left <= right) {
    const index = partition(nums, left, right);
    if (index === target) {
      return nums[index];
    } else if (index < target) {
      left = index + 1;
    } else {
      right = index - 1;
    }
  }
  return nums[left];
};
function partition(nums, start, end) {
  const povit = nums[start]; // 以第一个数 为基准
  while (start < end) {
    while (start < end && nums[end] >= povit) {
      end--;
    }
    nums[start] = nums[end];
    while (start < end && nums[start] < povit) {
      start++;
    }
    nums[end] = nums[start];
  }
  nums[start] = povit;
  return start;
}
```

### 283. 移动零

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[j] = nums[i];
      j++;
    }
  }
  for (let i = j; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
};

console.log(moveZeroes([0, 1, 0, 3, 12]));
```
