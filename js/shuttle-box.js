$(function () {

    // 显示弹框 及初始化
    var piece_frame;
    $(document).on("click", ".frame-btn", function () {
        piece_frame = layer.open({
            type: 1,
            title: false,
            area: ['700px', '556px'],
            closeBtn: 0,
            scrollbar: false,
            skin: 'yourclass',
            content: $('.freight-frame-wrap'),
            success:function(){
                var sourceArr = {"3": {"region_name":"\u5b89\u5fbd","region_type":1,"freight_region_id":"3","city":{"3401":{"region_name":"\u5408\u80a5","region_type":2,"freight_region_id":3401,"country":{"3402":{"region_name":"\u5e90\u9633\u533a","region_type":3,"freight_region_id":3402},"3403":{"region_name":"\u7476\u6d77\u533a","region_type":3,"freight_region_id":3403},"3404":{"region_name":"\u8700\u5c71\u533a","region_type":3,"freight_region_id":3404},"3405":{"region_name":"\u5305\u6cb3\u533a","region_type":3,"freight_region_id":3405},"3406":{"region_name":"\u957f\u4e30\u53bf","region_type":3,"freight_region_id":3406},"3407":{"region_name":"\u80a5\u4e1c\u53bf","region_type":3,"freight_region_id":3407},"3408":{"region_name":"\u80a5\u897f\u53bf","region_type":3,"freight_region_id":3408},"3412":{"region_name":"\u653f\u52a1\u533a","region_type":3,"freight_region_id":3412},"3413":{"region_name":"\u65b0\u7ad9\u533a","region_type":3,"freight_region_id":3413},"3414":{"region_name":"\u7ecf\u5f00\u533a","region_type":3,"freight_region_id":3414},"3415":{"region_name":"\u9ad8\u65b0\u533a","region_type":3,"freight_region_id":3415},"3416":{"region_name":"\u6ee8\u6e56\u533a","region_type":3,"freight_region_id":3416}},"all":1}},"all":0}, "9": {"city":{"120":{"country":{"1054": {"233": 122},"1055": {"233": 122},"1056": {"233": 122},"1057": {"233": 122}},"all":1}},"all":0}};

                for(var $province in sourceArr){
                    if(sourceArr[$province].all === 1){
                        $(".frame_left .f_list_p" + $province).parents(".f_list").parent().hide();
                    }else {
                        $(".frame_left .f_list_p" + $province).parents().show();
                    }
                    for(var $city in sourceArr[$province].city){
                        if(sourceArr[$province].city[$city].all === 1){
                            $(".frame_left .f_list_c" + $city).parents(".f_list").parent().hide();
                        }else {
                            $(".frame_left .f_list_c" + $city).parents().show();
                        }
                        for(var $area in sourceArr[$province].city[$city].country){
                            $(".frame_left .f_list_a" + $area).parents(".f_list").parent().hide();
                            $(".frame_right .f_list_a" + $area).find(".checkedInput").attr('select', 'selected').parents().show();
                            $(".frame_right .f_list_a" + $area).parents("ul").siblings(".f_list").addClass("active");
                        }
                    }
                }
            }
        });
    });

    // 点击确定按钮 返回数据给后台
    $(document).on("click", ".freight-frame .confirm", function (e) {
        var sourceArr2 = [];
        $(".frame_right .f_area .checkedInput").each(function () {
            var selected = $(this).attr('select');
            if(selected){
                var $city = parseInt($(this).parents(".f_area").siblings().find("label").prop('id')),
                    $province = parseInt($(this).parents(".f_city").siblings().find("label").prop('id'));
                sourceArr2.push($province);
                sourceArr2.push($city);
                sourceArr2.push(parseInt($(this).parent().prop('id')));
            }
        });
        $.unique(sourceArr2);
        console.log(sourceArr2);
        layer.close(piece_frame);
    });

    // 关闭弹框
    $(document).on("click", ".freight-frame .cancel, .close-frame-btn", function (e) {
        layer.close(piece_frame);
    });

    // 生成弹框数据
    $.ajax({
        url:'http://v3.apiadmin.fx551.com/api/5adf16dd4385c?flag=0',
        type:'get',
        dataType:'json',
        success:function(data){
            var $city = '<ul class="f_province">',
                $data = data.data.list[1]['_child'];
            for(var province in $data){
                $city += '<li class="f_province_list' + province + '"><span class="f_list"><label id="' + province +'" class="f_list_p' + province + '"><i></i><input class="checkedInput" type="checkbox" /></label><em>' + $data[province].region_name  + '</em></span><ul class="f_city">';
                for(var city in $data[province]._child){
                    $city += '<li><span class="f_list"><label id="' + city +'"  class="f_list_c' + city + '"><i></i><input class="checkedInput" type="checkbox" /></label><em>' + $data[province]['_child'][city].region_name + '</em></span><ul class="f_area">';
                    for(var area in $data[province]['_child'][city]._child){
                        $city += '<li><span class="f_list"><label id="' + area +'"  class="f_list_a' + area + '"><i></i><input class="checkedInput" type="checkbox" /></label><em>' + $data[province]['_child'][city]['_child'][area].region_name + '</em></span></li>';
                    }
                    $city += '</ul></li>';
                }
                $city += '</ul></li>';
            }
            $city += '</ul>';

            $("#freight-formwork").append($city);
            $("#freight-formwork_checked").append($city);

            // 全选
            function checkInputAll(selector) {
                $(selector).on("click", function () {
                    var checked = $(this).prop("checked");
                    if(checked){
                        $(this).parents(".f_list").siblings("ul").find(".checkedInput").prop("checked", true).siblings("i").addClass("checked");
                    }else {
                        $(this).parents(".f_list").siblings("ul").find(".checkedInput").prop("checked", false).siblings("i").removeClass("checked");
                    }
                });
            }
            checkInputAll(".frame-wrap .f_province > li > span .checkedInput");
            checkInputAll(".frame-wrap .f_city > li > span .checkedInput");

            // 单选
            function checkInputSolo(selector, parents, parents2) {
                $(selector).on("click", function () {
                    var $parent = $(this).parents(parents).children("li"),
                        checkedArr = [], checkedArr2 = [];
                    $parent.find(".checkedInput").each(function () {
                        var checked = $(this).prop("checked");
                        checkedArr.push(checked);
                        if(checkedArr.indexOf(false) !== -1){
                            $(this).parents(parents).siblings(".f_list").find(".checkedInput").prop("checked", false).siblings("i").removeClass("checked");
                        }else {
                            $(this).parents(parents).siblings(".f_list").find(".checkedInput").prop("checked", true).siblings("i").addClass("checked");
                        }
                    });
                    if(parents2 !== ''){
                        var $parent2 = $(this).parents(parents2).children("li");
                        $parent2.children("span").find(".checkedInput").each(function () {
                            var checked = $(this).prop("checked");
                            checkedArr2.push(checked);
                            if(checkedArr2.indexOf(false) !== -1){
                                $(this).parents(parents2).siblings(".f_list").find(".checkedInput").prop("checked", false).siblings("i").removeClass("checked");
                            }else {
                                $(this).parents(parents2).siblings(".f_list").find(".checkedInput").prop("checked", true).siblings("i").addClass("checked");
                            }
                        });
                    }
                });
            }
            checkInputSolo(".frame-wrap .f_city > li > span .checkedInput", ".frame-wrap .f_city", '');
            checkInputSolo(".frame-wrap .f_area .checkedInput", '.f_area', '.frame-wrap .f_city');
        }
    });

    // 复选框按钮
    $(document).on("click", ".checkedInput", function (e) {
        e.stopPropagation();
        var checked = $(this).prop("checked");
        if(checked){
            $(this).siblings("i").addClass("checked");
        }else {
            $(this).siblings("i").removeClass("checked");
        }
    });

    // 展开收缩
    $(document).on("click", ".frame-wrap .f_list em", function () {
        $(this).parent().toggleClass("active").siblings("ul").slideToggle();
    });

    // 右移
    $(".frame-wrap .right_btn").on("click", function () {
        $(".frame_left .checkedInput").each(function () {
            var $checked = $(this).prop("checked");
            if($checked){
                var $parents = $(this).parents("[class ^= f_province_list]").attr('class'),
                    $parent = $(this).parent().attr('class');
                $(".frame_right").find('.' + $parents).find('.' + $parent).find(".checkedInput").prop("checked", true).attr('select', 'selected').siblings("i").addClass("checked").parents(".f_list").addClass("active").parent().show().parents("ul").show().siblings(".f_list").addClass("active").parents().show();
                $(this).parents(".f_list").parent().hide();
            }
        });
    });

    // 左移
    $(".frame-wrap .left_btn").on("click", function () {
        $(".frame_right .checkedInput").each(function () {
            var $checked = $(this).prop("checked");
            if($checked){
                var $parents = $(this).parents("[class ^= f_province_list]").attr('class'),
                    $parent = $(this).parent().attr('class');
                $(".frame_left").find('.' + $parents).find('.' + $parent).parents(".f_list").addClass("active").parent().show().parents("ul").show().siblings(".f_list").addClass("active").parents().show();
                $(this).removeAttr('select').parents(".f_list").parent().hide();
            }
        });
    });

});
