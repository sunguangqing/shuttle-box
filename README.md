### 省市区穿梭框

https://sunguangqing.github.io/shuttle-box/shuttle-box.html


### `注意事项`
> 有时引用了别的jQuery库会导致关闭弹框后，内容还显示在页面中，需要如下修改：
```javascript
var $ = layui.$;
```

#### 自定义一个打开弹窗方法，方便后续调用：
```javascript
(function () {
    // 弹窗
    // sel：触发弹窗的选择器，popBox：弹窗选择器, _class如需特殊效果加的类名
    var $ = layui.$;
    function layerPop(sel, popBox, _class){
        _class = (_class == null) ?  '' :  _class;
        $(document).on("click", sel, function (e) {
            e.preventDefault();
            layer.open({
                shadeClose: true,
                type: 1,
                title: false,
                closeBtn: 0,
                area: ["auto", "auto"],
                // scrollbar: false,   //弹框打开时是否允许浏览器滚动，默认为true 允许滚动
                skin: _class,
                content: $(popBox),
            });
        });
    }
    // 关闭弹窗
    $(document).on("click", ".close-pop", function () {
        layer.closeAll();
    });

    // 调用弹窗
    layerPop(".a-add-bank", ".a-addbank-pop");   //法币交易添加银行卡
    layerPop(".a-del-bank", ".a-delbank-pop");   //法币交易删除银行卡
})();
```
