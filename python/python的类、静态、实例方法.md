## 类中静态、实例、类方法的区别
### 实例方法
指的是类中定义方法时，必须传入self参数的方法（self指的就是当前对象，参考Java中的this）
- 当你通过实例（self指的是当前实例）去取这个方法时，Python 会自动把 self 塞进第一个参数。
- 如果你通过类名（MyClass.method）去取，它就是一个普通函数（Function），不会自动传 self（因为没有使用实例来调用）

### 类方法
类方法创建后第一个参数是cls代指调用该方法的类，是通过类名调用的，但是他不是静态方法，哪个类调用这个方法，cls就指向哪个类。
- 创建时要在方法上加@classmethod注解

### 静态方法
- 创建时加@staticmethod注解，并且不需要任何参数
- 与java的静态概念一致，是属于所有类共用的方法，直接类名.方法调用

### 举例如下
```python
class Parent:
    name = "Parent"
    
    def instance_method(self):
        print(f"实例: {self.name}")
    
    @classmethod
    def class_method(cls):
        print(f"类方法, 当前类名: {cls.name}")
    
    @staticmethod
    def static_method():
        print("静态方法, 无法自动获取类名")

class Child(Parent):
    name = "Child"

# 调用
Child.class_method()   # 输出: 类方法, 当前类名: Child (多态生效!)
Child.static_method()  # 输出: 静态方法, 无法自动获取类名
```