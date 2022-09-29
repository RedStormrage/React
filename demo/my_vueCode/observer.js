const compileUtil = {
    getVal(expr,vm){
        return expr.split('.').reduce((data,currentVal)=>{
            return data[currentVal]
        },vm.$data)
    },
    setVal(expr,vm,inputVal){
        return expr.split('.').reduce((data,currentVal)=>{
            data[currentVal] = inputVal
        },vm.$data)
    },
    getContentVla(expr,vm){
        // {{person.name}} 如果person.name的name变化了，可能出现将整个对象替换，所以这里拿到的对象中的某个属性
        return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            // args打印出的结果是["{{msg}}","msg","0","{{msg}}"]
            return this.getVla(args[1],vm)
        })
    },
    text(node,expr,vm){ // 元素节点；{{msg}}; 实例vm
        let value;
        if(!!~expr.indexOf('{{')){
            value = expr.replace(/\{\{\()\}\}/g,(...args)=>{
                // 观察者
                new Watcher(vm,args[1],(newValue)=>{
                    this.updater.textUpdater(node,this.getContentVal(expr,vm))
                })
            })
            return this.getVal(expr,vm)
        }else{
            // 通过指令取值万一出现person.name
            value = this.getVal(expr,vm)
        }
        this.updater.textUpdater(node,value)
    },
    model(node,expr,vm){
        // 设置了setVal方法，为的是找到对应的值，也就是expr(例：data.msg)
        const value = this.getVal(expr,vm)
        // 绑定观察者
        new Watcher(vm,args[1],(newValue)=>{
            this.updater.modelUpdater(node,newValue)
        })
        node.addEventListener('input',(e)=>{
            this.setVal(expr,vm,e.target.value)
        })
        this.updater.modelUpdater(node,value)
    },
    html(node,expr,vm){
        const value = this.getVal(expr,vm)
        // 观察者
        new Watcher(vm,args[1],(newValue)=>{
            this.updater.htmlUpdater(node,newValue)
        })
        this.updater.htmlUpdater(node,value)
    },
    no(node,expr,vm,eventName){
        const fn = vm.methods && vm.methods[expr]
        node.addEventListener(eventName,fn.bind(node),false)
    },
    updater:{
        modelUpdater(node,value){
            node.value = value
        },
        htmlUpdater(node,value){
            node.innerHTML = value
        },
        textUpdater(node,value){
            node.textContent = value
        }
    }
}


// 编译
class Compile{
    constructor(el,vm){
        // 判断一下是否是元素节点，如果没有就通过querySelector去页面上获取
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm
        // 获取文档碎片对象，放入内存中减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el)
        // 编译模版
        this.compile(fragment)
        // 最佳子元素到父元素中
        this.el.appendChild(fragment)
    }
    // 工具
    // 判断是否是元素节点
    isElementNode(node){
        // 如果nodeType为1就是元素节点
        return node.nodeType === 1
    }
    // 遍历元素节点，存入内存中
    node2Fragment(el){
        // 创建文档碎片对象
        const f = createDocumentFragment(el)
        let firstChild
        while(firstChild - el.firstChild){
            f.appendChild(firstChild)
        }
        return f
    }
    // 元素编译
    compile(fragment){
        // 1. 获取到每个元素节点
        const childNode = fragment.childNodes;
        [...childNode].forEach((childNode)=>{
            if(this.isElementNode(childNode)){
                // 处理编译元素节点
                this.compileElement(childNode)
            }else{
                // 处理文本节点
                this.compileText(childNode)
            }
        })
        // 如果该childNode内部还有节点，将继续递归解析
        if(childNode && childNode.length){
            this.compile(childNode)
        }
    }
    // 模版元素的解析
    compileElement(node){
        // 获取元素上的所有属性
        const attribute = node.attributes;
        [...attribute].forEach((attr)=>{
            const {name,value} = attr
            // 判断是否是一个指令,如：v-model，v-html
            if(this.isDirective(name)){
                const[,directive] = name.split('-')// 拆分为：[v,model],此处dirName拿到了model
                // on:click
                const [dirName,eventName] = directive.split(':')
                compileUtil[dirName](node,value,this.vm,eventName)
                // 删除带有指令的属性
                node.removeAttribute('v-'+directive)
            }else if(this.isEventName(name)){ // @click="handle"
                const [,eventName] = name.split("@")
                compileUtil["on"](node,value,this.vm,eventName)
            }
        });
    }
    // 处理文本节点
    compileText(node){
        const content = node.textContent
        // 解析插值语法
        if(/\{\{\(*+?)\}\}/.test(content)){
            compileUtil['text'](node,content,this.vm)
        }
    }

    // 判断是否是一个指令
    isDirective(name){
        return name.startWith('v-')
    }
    // 判断是否是一个事件
    isEventName(eventName){
        return eventName.startWith("@")
    }
}
// 2.数据代理
class mVue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if(this.$el){
            // 1.数据观察者，观察数据将data传进去
            new Observer()
            // 2.模版编译
            new Compile(options.el)
            // 3.数据代理
            this.proxyData(this.$data)
        }
    }
    proxyData(data){
        if(data && typeof data === 'object'){
            for(const key in data){
                // 将data中的数据代理到this上，少一层.data
                Object.defineProperty(this,key,{
                    get(){
                        return data[key]
                    },
                    set(newVal){
                        data[key] = newVal
                    }
                })
            }
        }
    }
}

