//当前登录用户
var user;
var count = 0;//我的任务条数
var eventCount = 0;//未处理的风险事件的条数
var notpassCount = 0;//未审批的设备申请条数
var flag = false;//判断用户是否是能通知审批记录的角色
var recordCount = 0;//违章条数
var menuData;//目录数据
var shortMenuData = [];//目录数据

/**
 * 功能:动态加载树形菜单
 * 参数：无
 */
$(function () {
    //查找当前登录用户
    $.ajax({
        url: basePath + "/frame_sysrole_finduser.json",
        type: "post",
        async: false,
        success: function (data) {
            user = data.user;
            $("#userName").text(user.userName);
            $("#deptName").text(user.deptName);
            //$("#roleNameList").text(user.deptName+"/"+user.roleNameList);
        }
    });
    //动态加载标题
    $.ajax({
        url: basePath + "/apron_punish_sysparam_findbyid.json",
        data: {paramId: "frame.title"},
        type: "post",
        success: function (data) {
            document.title = data.param.paramValue;
        }
    });
    //查找菜单数据
    $.ajax({
        url: basePath + "/frame_menu_findAllUserUsedMenu.json",
        type: "post",
        async: false,
        data: {roleList: user.roleList},
        success: function (data) {
            menuData = data.data;
        }
    });
    //加载菜单
    $.desktop.load();
    $.desktop.loadMenu();
    //加载快捷菜单
    $.desktop.loadShortMenu();
    $.contenttab.init();
    //初始化加载模块蓝白
    $.AdminLTE.change_skin('skin-blue-light', this);

    //设置欢迎标语
    $.ajax({
        url: basePath + "/frame_mainframe_welcome.json",
        type: "post",
        success: function (data) {
            $("#welcome").text(user.userName + " " + data.welcome);
        }
    });
    //每隔60秒自动调用updateLastAccessTime函数,让服务端更新最近访问时间
    window.setInterval(updateLastAccessTime, 60 * 1000);
    //$(".logo").css("background-image","url("+basePath+"/"+getIcons('03.jpg')+")");

    //设置版权信息
    /*$("#frameTitle").text(copyright('frame.title'));
    $("#frameCopyright").text(copyright('frame.copyright'));
    $(".divHead_title").css("background-image","url("+basePath+"/"+getIcons('03.jpg')+")");*/

});

/**
 * 每隔60秒钟调用一下这个函数，去向服务器发送一个请求，让服务端更新最近访问时间
 */
function updateLastAccessTime() {
    try {
        $.ajax({
            url: basePath + "/frame_mainframe_updateLastAccessTime.json",
            type: "post",
            success: function (data) {

            }
        });
    } catch (e) {

    }
}

/**
 * 修改密码弹窗
 */
function modifyPwd() {
    $("#userName_form").text(user.userName);
    $("[name='userId']").val(user.userId);
    pwdValid();
    $("#changePwd").show().dialog({
        title: "修改密码",
        modal: true,
        buttons: "#btns_dlg",
        iconCls: "icon-edit",
        onClose: function () {
            $("#form_changePwd").form('reset');
        }
    });
};

/**
 * 保存
 */
function doSave() {
    if ($("#form_changePwd").form('validate')) {
        var formData = $("#form_changePwd").serializeObject();
        formData.logicId = "09.01.05";
        $.ajax({
            url: logicUrl,
            type: "post",
            data: formData,
            dataType: "json",
            success: function (data) {
                if (data.resultCode == 1) {
                    doClose();
                } else if (data.resultCode == 2) {
                    $.messager.alert("提示信息", "密码输入错误！", "info");
                } else {
                    $.messager.alert("提示信息", "密码修改失败！", "info");
                }
            }
        });
    }
}

/**
 * 密码输入验证
 */
function pwdValid() {
    $("[name='oldPassword']").validatebox({
        required: true,
        missingMessage: "请输入原密码"
    });
    $("[name='password']").validatebox({
        required: true,
        missingMessage: "请输入新密码",
        invalidMessage: "密码的最小长度不能小于6位",
        validType: "minLength[6]"
    });
    $("[name='surePassword']").validatebox({
        required: true,
        missingMessage: "请再次输入新密码",
        invalidMessage: "两次密码不一致",
        validType: "equals['#password']"
    });
}

/**
 * 关闭密码修改对话框
 */
function doClose() {
    $("#changePwd").dialog("close");
}

/**
 * 添加操作日志
 * @param userId 当前登录用户编号
 * @param moduleId 模块编号
 */
function addOperationLog(moduleId, moduleName) {
    $.ajax({
        url: logicUrl,
        type: "post",
        data: {moduleName: moduleName, moduleId: moduleId, logicId: "09.05.01"},
        dataType: "json"
    });
}

$.extend($.fn.validatebox.defaults.rules, {
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字符.'
    },
    equals: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: 'Field do not match.'
    }
});

/**
 * 退出系统
 */
function logout() {
    if (window.confirm("请确认是否现在就退出系统？")) {
        $.ajax({
            url: basePath + "/frame_mainframe_logout.json",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.resultCode == 1) {
                    window.location = basePath;
                }
                else
                    $.messager.alert("错误", "退出过程中出现问题!", "error");
            },
            error: function () {
                $.messager.alert("错误", "服务器内部错误!", "error");
            }
        });
    }
}

/**
 * 查询版权信息
 * @param paramId 系统参数
 */
function copyright(paramId) {
    var param = "";
    $.ajax({
        url: basePath + "/apron_punish_sysparam_findbyid.json",
        type: "post",
        async: false,
        data: {paramId: paramId},
        success: function (data) {
            param = data.param.paramValue;
        }
    });
    return param;
}

/**
 * 转换日期格式的日期时间显示
 * 以yyyy-MM-dd HH:mm格式
 */
function timeformatter(value) {
    if (Date.parse(value)) {
        return new Date(Date.parse(value)).pattern("yyyy-MM-dd HH:mm ");
    }
}

/**
 * 获取icon
 * @param iconId
 * @returns {String}
 */
function getIcons(iconId) {
    var iconPath = '';
    //获取icon
    $.ajax({
        url: basePath + "/frame_mainframe_findicons.json",
        type: "post",
        data: {iconsId: iconId},
        dataType: "json",
        async: false,
        success: function (data) {
            iconPath = data.icons.rows.userFilePath;
        }
    });
    return iconPath;
}

/**
 * 页面调用的方法
 */
$.contenttab = {
    requestFullScreen: function () {
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    },
    exitFullscreen: function () {
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    },
    refreshTab: function () {
        var currentId = $('.page-tabs-content').find('.active').attr('data-id');
        var target = $('.LRADMS_iframe[data-id="' + currentId + '"]');
        var url = target.attr('src');
        //$.loading(true);
        target.attr('src', url).load(function () {
            //$.loading(false);
        });
    },
    activeTab: function () {
        var currentId = $(this).data('id');
        if (!$(this).hasClass('active')) {
            $('.mainContent .LRADMS_iframe').each(function () {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.LRADMS_iframe').hide();
                    return false;
                }
            });
            $(this).addClass('active').siblings('.menuTab').removeClass('active');
            $.contenttab.scrollToTab(this);
        }
    },
    closeOtherTabs: function () {
        $('.page-tabs-content').children("[data-id]").find('.fa-times-circle').parents('a').not(".active").each(function () {
            $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').css("margin-left", "0");
    },
    closeTab: function () {
        var closeTabId = $(this).parents('.menuTab').data('id');
        var currentWidth = $(this).parents('.menuTab').width();
        if ($(this).parents('.menuTab').hasClass('active')) {
            if ($(this).parents('.menuTab').next('.menuTab').size()) {
                var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');

                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                if (marginLeftVal < 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: (marginLeftVal + currentWidth) + 'px'
                    }, "fast");
                }
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }
            if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }
        }
        else {
            $(this).parents('.menuTab').remove();
            $('.mainContent .LRADMS_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
            $.contenttab.scrollToTab($('.menuTab.active'));
        }
        return false;
    },
    /**
     * 通过组装数据打开新的Tab页
     * @param data 数据格式为 {
     *      id: '',         // sys_menu（菜单表）中对应的菜单编码
     *      url: '',        // sys_menu（菜单表）中对应的菜单地址
     *      title: '',      // sys_menu（菜单表）中对应的菜单名称
     *      eventData: {}   // 触发afterLoad事件并传递该数据对象
     * }
     */
    addTabFromData: function (data) {
        var link = '<a data-id="' + (data.id || '') + '" href="' + (data.url || '') + '">' + (data.title || '') + '</a>';
        $(link).appendTo($('body')).click(data.eventData, $.contenttab.addTab).click().remove();
    },
    /**
     * 打开新的标签
     * @param e 原始事件对象
     * @returns {boolean}
     */
    addTab: function (e) {
        $(".navbar-custom-menu>ul>li.open").removeClass("open");
        var dataId = $(this).attr('data-id');
        if (dataId != "") {
            //top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
        }
        var dataUrl = $(this).attr('href');
        var menuName = $.trim($(this).text()) ? $.trim($(this).text()) : $.trim($(this).attr("title"));
        var flag = true;
        if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
            return false;
        }
        $('.menuTab').each(function () {
            if ($(this).data('id') == dataId) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.menuTab').removeClass('active');
                    $.contenttab.scrollToTab(this);
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == dataId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            if (e.data) {
                                this.contentWindow.$(this.contentDocument).trigger('afterLoad', e.data);
                            }
                            return false;
                        }
                    });
                }
                flag = false;
                return false;
            }
        });
        if (flag) {
            var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataId + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            $('.menuTab').removeClass('active');
            var str1 = '<iframe class="LRADMS_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataId + '" seamless></iframe>';
            $('.mainContent').find('iframe.LRADMS_iframe').hide();
            $('.mainContent').append(str1);
            //$.loading(true);
            $('.mainContent iframe:visible').load(function () {
                //$.loading(false);
            }).one('load', function () {
                if (e.data) {
                    this.contentWindow.$(this.contentDocument).trigger('afterLoad', e.data);
                }
            });
            $('.menuTabs .page-tabs-content').append(str);
            $.contenttab.scrollToTab($('.menuTab.active'));
        }
        return false;
    },
    scrollTabRight: function () {
        var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
        var tabOuterWidth = $.contenttab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        var scrollVal = 0;
        if ($(".page-tabs-content").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".menuTab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            scrollVal = $.contenttab.calSumWidth($(tabElement).prevAll());
            if (scrollVal > 0) {
                $('.page-tabs-content').animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        }
    },
    scrollTabLeft: function () {
        var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
        var tabOuterWidth = $.contenttab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        var scrollVal = 0;
        if ($(".page-tabs-content").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".menuTab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            if ($.contenttab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).prev();
                }
                scrollVal = $.contenttab.calSumWidth($(tabElement).prevAll());
            }
        }
        $('.page-tabs-content').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    },
    scrollToTab: function (element) {
        var marginLeftVal = $.contenttab.calSumWidth($(element).prevAll()),
            marginRightVal = $.contenttab.calSumWidth($(element).nextAll());
        var tabOuterWidth = $.contenttab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        var scrollVal = 0;
        if ($(".page-tabs-content").outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
            if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                scrollVal = marginLeftVal;
                var tabElement = element;
                while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                    scrollVal -= $(tabElement).prev().outerWidth();
                    tabElement = $(tabElement).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
            scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
        }
        $('.page-tabs-content').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    },
    calSumWidth: function (element) {
        var width = 0;
        $(element).each(function () {
            width += $(this).outerWidth(true);
        });
        return width;
    },
    init: function () {
        $('.menuItem').on('click', $.contenttab.addTab);
        $('.menuTabs').on('click', '.menuTab i', $.contenttab.closeTab);
        $('.menuTabs').on('click', '.menuTab', $.contenttab.activeTab);
        $('.tabLeft').on('click', $.contenttab.scrollTabLeft);
        $('.tabRight').on('click', $.contenttab.scrollTabRight);
        $('.tabReload').on('click', $.contenttab.refreshTab);
        $('.tabCloseCurrent').on('click', function () {
            $('.page-tabs-content').find('.active i').trigger("click");
        });
        $('.tabCloseAll').on('click', function () {
            $('.page-tabs-content').children("[data-id]").find('.fa-times-circle').each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).parents('a').remove();
            });
            $('.page-tabs-content').children("[data-id]:first").each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').show();
                $(this).addClass("active");
            });
            $('.page-tabs-content').css("margin-left", "0");
        });
        $('.tabCloseOther').on('click', $.contenttab.closeOtherTabs);
        $('.fullscreen').on('click', function () {
            if (!$(this).attr('fullscreen')) {
                $(this).attr('fullscreen', 'true');
                $.contenttab.requestFullScreen();
            } else {
                $(this).removeAttr('fullscreen')
                $.contenttab.exitFullscreen();
            }
        });
    }
};
/**
 * 加载菜单目录
 */
$.desktop = {
    load: function () {
        $("body").removeClass("hold-transition")
        $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
        $(window).resize(function (e) {
            $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
        });
        // $(".sidebar-toggle").click(function () {
        //     if (!$("body").hasClass("sidebar-collapse")) {
        //         $("body").addClass("sidebar-collapse");
        //     } else {
        //         $("body").removeClass("sidebar-collapse");
        //     }
        // })
        $(window).load(function () {
            window.setTimeout(function () {
                $('#ajax-loader').fadeOut();
            }, 300);
        });
    },
    jsonWhere: function (data, action) {
        if (action == null) return;
        var reval = new Array();
        $(data).each(function (i, v) {
            if (action(v)) {
                reval.push(v);
            }
        })
        return reval;
    },
    loadMenu: function () {
        var data = menuData;
        var _html = "";
        // var dm ="[";
        $.each(data, function (i) {
            var row = data[i];
            if (row.pMenuId == "%root%") {
                // if (i == 0) {
                //     _html += '<li class="treeview active">';
                // } else {
                _html += '<li class="treeview">';
                // }
                _html += '<a href="#">'
                _html += '<i class="' + row.defaultImg + '"></i><span>' + row.menuName + '</span><i class="fa fa-angle-left pull-right"></i>'
                _html += '</a>'
                var childNodes = $.desktop.jsonWhere(data, function (v) {
                    return v.pMenuId == row.menuId
                });
                if (childNodes.length > 0) {
                    _html += '<ul class="treeview-menu">';
                    $.each(childNodes, function (i) {
                        var subrow = childNodes[i];
                        var subchildNodes = $.desktop.jsonWhere(data, function (v) {
                            return v.pMenuId == subrow.menuId
                        });
                        _html += '<li>';
                        if (subchildNodes.length > 0) {
                            _html += '<a href="#"><i class="' + subrow.defaultImg + '"></i>' + subrow.menuName + '';
                            _html += '<i class="fa fa-angle-left pull-right"></i></a>';
                            _html += '<ul class="treeview-menu">';
                            $.each(subchildNodes, function (i) {
                                var subchildNodesrow = subchildNodes[i];
                                _html += '<li><a class="menuItem" data-id="' + subchildNodesrow.menuId + '" href="' + basePath + "/" + subchildNodesrow.url + '"><i class="' + subchildNodesrow.defaultImg + '"></i>' + subchildNodesrow.menuName + '</a></li>';
                            });
                            _html += '</ul>';

                        } else {
                            _html += '<a class="menuItem" data-id="' + subrow.menuId + '" href="' + basePath + "/" + subrow.url + '"><i class="' + subrow.defaultImg + '"></i>' + subrow.menuName + '</a>';
                        }
                        _html += '</li>';
                    });
                    _html += '</ul>';
                }
                _html += '</li>'
            }
        });
        // dm+="]";
        // alert(dm);
        $("#sidebar-menu").append(_html);
    },
    loadShortMenu: function () {
        //查询用户的所有权限菜单
        var allMenuData;
        $.ajax({
            url: basePath + "/businesslogic.json",
            type: "post",
            async: false,
            data: {logicId: "09.04.10"},
            success: function (data) {
                allMenuData = data.rows;
            }
        });
        //查找快捷菜单数据
        $.ajax({
            url: basePath + "/businesslogic.json",
            type: "post",
            async: false,
            data: {logicId: "09.03.05"},
            success: function (data) {
                //过滤无权限菜单
                for (var i = 0; i < data.rows.length; i++) {
                    var flag = 0;
                    for (var j = 0; j < allMenuData.length; j++) {
                        if (data.rows[i].menuId == allMenuData[j].menu_id && data.rows[i].isUsed == '1') {
                            shortMenuData.push(data.rows[i]);
                            flag = 1;
                        }
                    }
                    if (flag == 0) {
                        //删除无权限快捷菜单
                        $.ajax({
                            url: basePath + "/dataaccess.json",
                            type: "post",
                            data: {accessId: "9415", menuId: data.rows[i].menuId, userId: user.userId},
                            success: function () {

                            }
                        });
                    }
                }
            }
        });
        var data = shortMenuData;
        var _html = "";
        var box = "<div class=\"box-body\"></div>";
        var _moreHtml = "";
        if (data.length <= 6) {
            for (var i = 0; i < data.length; i++) {
                _html = _html + "<li class=\"notifications-menu\"><a class='menuItem' data-id='" + data[i].menuId + "' href='" + basePath + '/' + data[i].url + "' title='" + data[i].menuName + "'><i class='" + data[i].defaultImg + "'></i></a> </li>";
            }
        } else {
            for (var i = 0; i < 6; i++) {
                _html = _html + "<li class=\"notifications-menu\"><a class='menuItem' data-id='" + data[i].menuId + "' href='" + basePath + '/' + data[i].url + "' title='" + data[i].menuName + "'><i class='" + data[i].defaultImg + "'></i></a> </li>";
            }
            for (var j = 6; j < data.length; j++) {
                _moreHtml = _moreHtml + "<a class=\"btn btn-block btn-default menuItem\" data-id='" + data[j].menuId + "' href='" + basePath + '/' + data[j].url + "' title='" + data[j].menuName + "'><i class='" + data[j].defaultImg + "'></i>" + data[j].menuName + "</a>";
            }
        }
        $("#shortMenu li.notifications-menu:not(:first-child)").remove();
        $("#shortMenu").find("li").eq(0).after(_html);
        $("#moreShortMenu").find("ul li").html("");
        if (_moreHtml) {
            var text = $(box).append(_moreHtml);
            $("#moreShortMenu").find("ul li").append(text);
        }
        $.contenttab.init();
    }
};

/**
 * 添加快捷菜单
 */
function addShortMenu() {
    $("#treeAuth").tree({
        url: basePath + "/businesslogic.json",
        method: "post",
        animate: true,
        checkbox: true,//显示复选框
        //cascadeCheck:false,//关闭级联检查
        loadFilter: function (data, parent) {
            var data1 = data.rows;
            for (var i in data1) {
                //删除checked属性
                delete data1[i].checked;
                for (var j in shortMenuData) {
                    if (data1[i].id == shortMenuData[j].menuId) {
                        data1[i].checked = true;
                    }
                }
            }
            return data1;
        },
        onCheck: function (node, checked) {
        },
        onBeforeLoad: function (node, param) {
            param.logicId = "09.03.04";
            if (node != null) {
                param.id = node.id;
            } else {
                param.id = "%root%";
            }
        },
        onLoadSuccess: function (node, data) {
            $(this).css("color", "#407EAC");
            //默认展开所有节点
            $('#treeAuth').tree('expandAll');
        }
    });

    $("#treeAuthDlg").show().dialog({
        width: "700px",
        height: "550px",
        title: "添加快捷菜单",
        modal: true,
        resizable: false,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        buttons: "#btn_dlg",
        onClose: function () {
        }
    });
}

/**
 *
 */
function addShortMenuY() {
    var nodes = $('#treeAuth').tree('getChecked');
    //所有叶子节点id数组
    var leafNodesId = [];
    //子节点id字符串
    var leafNodesIds = "";
    //遍历所有选中的节点
    for (var i in nodes) {
        //判断是否是子节点
        if ($('#treeAuth').tree('isLeaf', nodes[i].target)) {
            //添加子节点id到数组
            leafNodesId.push(nodes[i].id);
        }
    }
    if (leafNodesId.length > 12) {
        $.messager.alert('错误', '快捷菜单最大允许12个!', 'error');
        return;
    }
    //拼接id字符串
    for (var i in leafNodesId) {
        if (i < leafNodesId.length - 1) {
            leafNodesIds = leafNodesIds + leafNodesId[i] + ",";
        } else {
            leafNodesIds = leafNodesIds + leafNodesId[i];
        }
    }
    //添加快捷菜单数据
    $.ajax({
        url: basePath + "/businesslogic.json",
        data: {menuIds: leafNodesIds, logicId: "09.03.09"},
        type: 'post',
        success: function (data) {
            if (data.resultCode == 0) {
                $.messager.alert('错误', '服务器错误!', 'error');
            } else {
                //重新加载导航栏菜单信息
                closeTreeAuthDlg();
                $.desktop.loadShortMenu();
            }
        }
    });
}

/**
 * 关闭树形菜单授权弹窗
 */
function closeTreeAuthDlg() {
    $("#treeAuthDlg").window("close");
}