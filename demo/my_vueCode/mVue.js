const { deprecationHandler } = require("moment");

class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.getOldValue()
    }
    getOldValue(){
        Dep.target = this // 该处创建了一个观察者，因为当前数据初始化的时候肯定调用了这个方法
        let oldValue = compileUtil.getVal(this.expr,this.vm)
        Dep.target = null // 记得要将之前的观察者删除，否则数组中会出现很多观察者
        return oldValue
    }
    update(){
        let newVal = compileUtil.getVal(this.expr,this.vm)
        if(newVal !== this.oldValue){
            this.cb(newVal)
        }
    }
}

class Dep{
    constructor(){
        // 观察者容器
        this.subs = []
    }
    // 收集观察者
    addSub(watcher){
        this.subs.push(watcher)
    }
    // 通知观察者更新
    notify(){
        this.subs.forEach(w=>w.update())
    }
}

class Observer{
    constructor(data){
        this.observer(data)
    }
    observer(data){
        if(data && typeof data === 'object'){
            Object.key(data).forEach((key)=>{
                this.defineProperty(data,key,data[key])
            })
        }
    }
    defineProperty(data,key,value){
        // 递归遍历
        this.observer(key)
        const dep = new Dep()
            Object.defineProperty(this,key,{
                enumerable: true,
                configurable: true,
                get(){
                    // 数据初始化时，向dep中添加观察者
                    Dep.target && dep.addSub(Dep.target)
                    return value
                },
                set(newV){
                    if(newV !== value){
                        // 值发生变化再次对其进行劫持
                        this.observer(newV)
                        data[key] = newV
                    }
                    dep.notify()
                }
            })
    }
}