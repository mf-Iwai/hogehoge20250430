
var myGroupEdit = {};

myGroupEdit.myPrjId = "CmMessageEntry";

myGroupEdit.mobileMode = 0;
myGroupEdit.initAddressGroupId = "";
myGroupEdit.initIncludeDelGroup = "";

myGroupEdit.selectListItems = {};        //宛先グループ詳細情報（宛先グループ種別^項目分類^項目コード）
myGroupEdit.activeSearchFunction = "";   //現在検索中の機能

myGroupEdit.editFlg = false;
myGroupEdit.lastSelectedMyGroupId = "";

$(function () {

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString("CmMessageEntry", strQval, strQdata);
        if (retObj != "ERR") {
            objArgument = $.extend(true, {}, retObj);
            myGroupEdit.initAddressGroupId = objArgument["AddressGroupId"];
            myGroupEdit.initIncludeDelGroup = objArgument["IncludeDelGroup"];
        }
    }
    myGroupEdit.mobileMode = document.getElementById("MobileMode").value;

    if (commonscript.getNativeMode() == 1) {
        // CloseFlgを0: 終了拒否に変更
        window.top.calledJS.changeCloseFlg("0");
    }

    // 画面初期化
    myGroupEdit.initForm();

    if (myGroupEdit.initIncludeDelGroup == 1) {
        //削除チェックボックスON
        $("#grDeletedDispFlg").prop('checked', true);
    }
    
    //マイグループドロップダウン作成
    myGroupEdit.makeMyGroupDropDownList(myGroupEdit.initAddressGroupId);

});

/**************************************************************** 
* 編　集： 2015.01.28 T.Kusumoto Add
* 機　能： 画面レイアウト設定
          （画面幅を基準としてモバイル用とPC用の処理へ分岐）
* 引　数： なし
* 戻り値： なし
****************************************************************/
function editPageLayout() {

    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------

        // 画面の高さを取得して、変数wHに代入
        var wH = $(window).height();
        // メイン以外の高さを取得
        var otherHeight = $('#header').outerHeight(true) + $('#header_container').outerHeight(true) + $('#footer_container').outerHeight(true);
        var contentHeight = wH - otherHeight;
        // #main_contaienrに高さを加える
        $('#main_container').css('height', contentHeight + 'px');

        /* 選択リスト高さ設定 */
        var select_containerHeight = $('#main_container').outerHeight(true);
        var otherHeight = $('#menu_container').outerHeight(true) + $('#selectList_label').outerHeight(true);
        var contentHeight = select_containerHeight - otherHeight;
        $('#select_container').css('height', contentHeight + 'px');

        /* マイグループ:ドロップダウン調整 */
        var contentWidth = $('.row03').outerWidth(true);
        var otherWidth = $('#grSort_btn').outerWidth(true) + 20;
        contentWidth = contentWidth - otherWidth;
        $('.myGroupName_drpdwn').css('width', contentWidth + 'px');

    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------

        // 画面の高さを取得して、変数wHに代入
        var wH = $(window).height();
        // メイン以外の高さを取得
        var otherHeight = $('#header').outerHeight(true) + $('#header_container').outerHeight(true) + $('#footer_container').outerHeight(true) + 8;
        var contentHeight = wH - otherHeight;
        // #col_containerに高さを加える
        $('#col_container').css('height', contentHeight + 'px');


        /* マイグループ高さ設定 */
        var left_columnHeight = $('#left_column').outerHeight(true);
        // リスト以外の高さを取得
        var otherHeight = $('#leftMenu_container').outerHeight(true);
        var contentHeight = left_columnHeight - otherHeight;
        // #main_containerに高さを加える
        $('#group_container').css('height', contentHeight - 4 + 'px');


        /* 選択リスト高さ設定 */
        var right_columnHeight = $('#right_column').outerHeight(true);
        $('#select_container').css('height', right_columnHeight - 4 + 'px');

        /* マイグループ:ドロップダウン調整 */
        var contentWidth = $('.row02.posLeft').outerWidth(true);
        var otherWidth = $('.myGroupName_label').outerWidth(true) + $('#grSort_btn').outerWidth(true) + 20;
        contentWidth = contentWidth - otherWidth;
        $('.myGroupName_drpdwn').css('width', contentWidth + 'px');

    }

}

/**************************************************************** 
* 編　集： 2015.01.28 T.Kusumoto Add
* 機　能： ﾘｻｲｽﾞ時処理
* 引　数： なし
* 戻り値： なし
* 注意）共通処理の為、必ず配置する事！
****************************************************************/
function resizePageLayout() {
    //  画面レイアウト（PC・タブレット版）の再調整
    editPageLayout();
}

/**************************************************************** 
* 編　集： 2015.01.28 T.Kusumoto Add
* 機　能： Windowクローズイベント取得(カラ)
* 引　数： e:イベント
* 戻り値： なし
****************************************************************/
function closingWindow(e) {

}

/**************************************************************** 
* 編　集： 2016.08.23 M.Matsuo Add
* 機　能： クロージングイベント
* 引　数： なし
* 戻り値： なし
****************************************************************/
function procBeforeClosing() {
    //操作不能になった場合は強制終了
    if (commonscript.checkDBConnect("CmMessageEntry") == "0") {
        commonscript.forcedTerminate();
        return false;
    }

    //画面終了時処理
    myGroupEdit.closeConfirm();
}

window.onload = function () {
    editPageLayout();
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 画面初期化
* 引　数： なし
* 戻り値： なし
****************************************************************/
myGroupEdit.initForm = function () {

    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------
        //リストクリア
        $("#selectList > li").remove();
    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------
        //リストクリア
        $("#groupList > li").remove();
        $("#selectList > li").remove();
    }

    $('#txtGroupName').val('');

    //選択値リスト退避用配列クリア
    myGroupEdit.selectListItems = {};

    //編集フラグOFF
    myGroupEdit.editFlg = false;        
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 画面終了時処理
* 引　数： なし
* 戻り値： なし
****************************************************************/
myGroupEdit.closeConfirm = function () {

    // 編集中をチェックする　
    if (myGroupEdit.editFlg) {
        //変更有り
        commonscript.dispMessage("CmMessageEntry", "CmMessage", 4, "", "commonscript.dialogclose();myGroupEdit.close();", "commonscript.dialogclose();", "", "");
    } else {
        //変更無し
        myGroupEdit.close('Cancel');
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 閉じる
* 引　数： なし
* 戻り値： なし
****************************************************************/
myGroupEdit.close = function () {
    if (window == parent) {
        //単独起動した場合

        ////親画面へメッセージ送信
        //var message = "WindowClose_CmMessageEntry||" + result;
        //calledJS.sendProgramMessage(message);

        // 画面を閉じる
        window.top.calledJS.changeCloseFlg("1");
        commonscript.exitProgram();

    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合

        // 呼出元コールバック
        if (typeof parent.getMyGroupEditResult == "function") {
            parent.getMyGroupEditResult(result);
        }

        // 自身を閉じる
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [マイグループ]ドロップダウン変更イベント
****************************************************************/
myGroupEdit.changeGroupName = function () {

    //マイグループID
    var addressGroupId = $("#myGroupName_drpdwn").val();
    var delFlg = $("#myGroupName_drpdwn :selected").attr('data-delflg');

    if (myGroupEdit.lastSelectedMyGroupId == addressGroupId) {
        return;
    }

    if (myGroupEdit.editFlg) {     // 変更あり！
        // 確認メッセージの表示
        var func1 = "commonscript.dialogclose();"
                    + "myGroupEdit.dispAddressGroupMstData(\'" + addressGroupId + "\', \'" + delFlg + "\');";
        var func2 = "commonscript.dialogclose();"
                    + "$('#myGroupName_drpdwn').val('" + myGroupEdit.lastSelectedMyGroupId + "');";
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", "4", "", func1, func2, "", 0);
        return;
    }

    //  マイグループIDより詳細データ表示
    myGroupEdit.dispAddressGroupMstData(addressGroupId, delFlg);

};

myGroupEdit.dispAddressGroupMstData = function (addressGroupId, delFlg) {

    //画面初期化
    myGroupEdit.initForm();

    //選択されたテキストを得る
    var txt = $("#myGroupName_drpdwn :selected").text();
    //選択されたテキストを入力エリアに設定する
    $('#txtGroupName').val(txt);

    //選択されたマイグループより詳細を表示
    if (addressGroupId != "") {
    
        //マイグループの詳細を取得し、リストへ追加
        var list = messageCommon.getAddressGroupDetailList(addressGroupId);
        if (list != "ERR") {
            for (var i = 0; i < list.length; i++) {
                var dispName = "";
                if (list[i].ItemClass.length > 0) {
                    dispName = list[i].ItemClassName;
                } else if (list[i].ItemCode.length > 0) {
                    dispName = list[i].ItemCodeName;
                }
                myGroupEdit.addItemToSelectedList(list[i].AddressGroupClass,
                                                  list[i].ItemClass,
                                                  list[i].ItemCode,
                                                  dispName);
            }
        }

        //修正モードに変更
        $('#editStatusLabel').removeClass('editStatus_new');
        $('#editStatusLabel').addClass('editStatus_modify');

        //削除チェックボックス編集可
        $('#grDeleteFlg').attr('disabled', false);

        if (delFlg == 1) {
            $("#grDeleteFlg").prop('checked', true);
        } else {
            $("#grDeleteFlg").prop('checked', false);
        }
        

    } else {
        //新規モードに変更
        $('#editStatusLabel').removeClass('editStatus_modify');
        $('#editStatusLabel').addClass('editStatus_new');

        //削除チェックボックス編集不可
        $('#grDeleteFlg').attr('disabled', true);

    }

    //マイグループ名選択値を退避
    myGroupEdit.lastSelectedMyGroupId = addressGroupId;

    //編集フラグOFF
    myGroupEdit.editFlg = false;
    
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 並び替えボタンクリックイベント
****************************************************************/
myGroupEdit.onClickSort = function () {
    //マイグループ並び替え
    commonscript.openPopUp("/CmMessageEntry/MyGroup/MyGroupSort", "マイグループ並び替え", "", 450, 700, "commonscript.popupclose()");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [削除]チェックボックスクリックイベント
****************************************************************/
myGroupEdit.onCheckDeleteFlg = function () {
    //編集フラグON
    myGroupEdit.editFlg = true;
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [削除されたグループを表示する]チェックボックスクリックイベント
****************************************************************/
myGroupEdit.onCheckDeleteDispFlg = function () {
    //マイグループ名ドロップダウンの再作成
    myGroupEdit.makeMyGroupDropDownList(myGroupEdit.lastSelectedMyGroupId);
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [職員検索]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickStaffSearch = function () {
    //職員検索画面起動
    messageCommon.openStaffSearch("", 99, "MessageEdit");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [共通グループ]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickCommonGroup = function () {

    myGroupEdit.activeSearchFunction = "CmGroup";

    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------
        //共通グループ選択画面起動
        messageCommon.openGroupSelection(messageCommon.addressGroupClass.Common, 0);

    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------
        //対象リスト（左）を表示
        myGroupEdit.dispAddressGroupList(messageCommon.addressGroupClass.Common);
    }

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [マイグループ]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickMyGroup = function () {
    myGroupEdit.activeSearchFunction = "MyGroup";
    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------
        //マイグループ選択画面起動
        messageCommon.openGroupSelection(messageCommon.addressGroupClass.Personal, 0);
    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------
        //対象リスト（左）を表示
        myGroupEdit.dispAddressGroupList(messageCommon.addressGroupClass.Personal);
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [医師]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickDoctor = function () {
    myGroupEdit.activeSearchFunction = "Doctor";
    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------
        //診療科検索画面起動
        messageCommon.openGeneralSearch("MessageCommon", "Department");
    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------
        //対象リスト（左）を表示
        myGroupEdit.dispPostList(2);
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [看護師]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickNurse = function () {
    myGroupEdit.activeSearchFunction = "Nurse";
    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------
        //所属部署検索画面起動
        messageCommon.openGeneralSearch("MessageCommon", "AssignPost");
    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------
        //対象リスト（左）を表示
        myGroupEdit.dispPostList(1);
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [その他]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickOther = function () {
    if (myGroupEdit.mobileMode == 1) {
        //---------------
        // ﾓﾊﾞｲﾙ
        //---------------
        messageCommon.openGeneralSearch("MessageCommon", "OtherCreatorLicense");
    } else {
        //---------------
        // PC・ﾀﾌﾞﾚｯﾄ
        //---------------
        //対象リスト（左）を表示
        messageCommon.openGeneralSearch("MessageCommon", "OtherCreatorLicense");
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [自分]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickMe = function () {
    myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Other,
                                      messageCommon.addressGroupClassOtherItemClass.Oneself,
                                      "",
                                      "自分");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [新規作成]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickNewMake = function () {
    //マイグループ名を未選択にする
    $('#myGroupName_drpdwn').val("");
    myGroupEdit.changeGroupName();
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [OK]ボタンクリックイベント
****************************************************************/
myGroupEdit.onClickOK = function () {

    var addressGroupId = $('#myGroupName_drpdwn').val();

    if ($("#grDeleteFlg").prop('checked')) {
        // *** 削除フラグON ***

        //宛先ｸﾞﾙｰﾌﾟﾏｽﾀ削除
        if (!messageCommon.deleteAddressGroup(addressGroupId)) {
            //更新失敗
            return;
        }

    } else {
        // *** 削除フラグOFF ***

        // 入力値ﾁｪｯｸ
        var addressGroupName = $('#txtGroupName').val().trim();
        if (!commonscript.NullChk(addressGroupName)) {
            commonscript.dispMessage(myGroupEdit.myPrjId, "CmMessage", 13, "", "commonscript.dialogclose();$('#txtGroupName').focus();", "", "");
            return;
        }

        //選択リストをループ
        var detailInfoList = new Array;
        $('ul#selectList li').each(function () {
            //戻り値配列に挿入
            var detailInfo = $(this).attr('data-detailinfo');   //宛先ｸﾞﾙｰﾌﾟ種別^項目分類^項目ｺｰﾄﾞ
            detailInfoList.push(detailInfo);
        });
        if (detailInfoList.length == 0) {
            commonscript.dispMessage(myGroupEdit.myPrjId, "CmMessage", 14, "", "commonscript.dialogclose();", "", "");
            return;
        }

        //宛先ｸﾞﾙｰﾌﾟﾏｽﾀ保存
        var dispNo = "";
        if (!messageCommon.setAddressGroup(addressGroupId, addressGroupName, dispNo, detailInfoList)) {
            //更新失敗
            return;
        }
    }

    // 画面初期化
    myGroupEdit.initForm();

    //マイグループドロップダウン作成
    myGroupEdit.makeMyGroupDropDownList("");
    
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [マイグループ名]入力イベント
****************************************************************/
myGroupEdit.onInputGroupName = function () {
    myGroupEdit.editFlg = true;
}

/**************************************************************** 
* 機　能： 「マイグループ」ドロップダウンリスト作成
* 引　数： piArrayResult:利用者検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
myGroupEdit.makeMyGroupDropDownList = function (addressGroupId) {

    //削除されたグループを表示するチェック
    var includeDel = 0;
    if ($("#grDeletedDispFlg").prop('checked')) {
        includeDel = 1;
    }

    //データ取得
    var data = {
        "addressGroupClass": 2,
        "includeDel": includeDel
    };
    var jsonString = JSON.stringify(data);

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/GetAddressGroupList/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if ((serverResponse == null) || (serverResponse.length == 0)) {
        //データなし

    } else if (serverResponse[0].LoginCheckResult.ErrorHandle > 0) {

        //エラー
        //ボタン押下時の処理を記述
        func1 = 'commonscript.dialogclose();';
        func2 = '';
        func3 = '';
        //ポップアップダイアログの表示
        commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
        commonscript.opendialog();

    } else {

        //リストクリア
        $("#myGroupName_drpdwn > option").remove();

        // select要素作成
        var select = document.getElementById("myGroupName_drpdwn");

        for (var i = 0; i < serverResponse.length; i++) {

            if (i == 0) {
                //先頭に空白行を作成
                var option = document.createElement("option");
                option.value = "";
                option.setAttribute('data-delflg', '0');
                var text = document.createTextNode("");
                option.appendChild(text);       // テキストノードをoption要素に追加
                select.appendChild(option);     // option要素をselect要素に追加
            }

            // option要素作成
            var option = document.createElement("option");
            // option要素のvalue属性に選択項目データ
            option.value = serverResponse[i].AddressGroupId;
            option.setAttribute('data-delflg', serverResponse[i].DelFlg);
            // テキストノードをoption要素に追加
            var text = document.createTextNode(serverResponse[i].AddressGroupName);
            option.appendChild(text);
            // option要素をselect要素に追加
            select.appendChild(option);     
        }

        //マイグループ名を選択にする
        $("#myGroupName_drpdwn").val(addressGroupId);
        myGroupEdit.changeGroupName();

    }
    
}

/**************************************************************** 
* 機　能： 利用者検索戻り処理(共通callback関数)
* 引　数： piArrayResult:利用者検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
function getCmStaffSearchResult(piArrayResult) {
    for (var i = 0; i < piArrayResult.length; i++) {
        var staffId = piArrayResult[i]["StaffId"];
        var staffName = piArrayResult[i]["StaffName"];
        //リスト追加
        myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Personal,
                                          "",
                                          staffId,
                                          staffName);
    }
}

/**************************************************************** 
* 機　能： グループ選択戻り処理(共通callback関数)
* 引　数： piArrayResult:グループ選択画面で選択した値（Array）
****************************************************************/
function getAddressGroupSelectionResult(piArrayResult) {
    for (var i = 0; i < piArrayResult.length; i++) {
        if (myGroupEdit.activeSearchFunction == "MyGroup") {
            var addresssGroupId = piArrayResult[i].AddresssGroupId;
            //マイグループの詳細を取得し、リストへ追加
            var list = messageCommon.getAddressGroupDetailList(addresssGroupId);
            if (list != "ERR") {
                for (var i = 0; i < list.length; i++) {
                    var dispName = "";
                    if (list[i].ItemClass.length > 0) {
                        dispName = list[i].ItemClassName;
                    } else if (list[i].ItemCode.length > 0) {
                        dispName = list[i].ItemCodeName;
                    }
                    myGroupEdit.addItemToSelectedList(list[i].AddressGroupClass,
                                                      list[i].ItemClass,
                                                      list[i].ItemCode,
                                                      dispName);
                }
            }
        } else if (myGroupEdit.activeSearchFunction == "CmGroup") {
            //共通グループの選択値をリストへ追加
            myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Common,
                                              piArrayResult[i].AddresssGroupId,
                                              "",
                                              piArrayResult[i].AddresssGroupName);
        }
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [マイグループ]or[共通グループ]リスト表示
****************************************************************/
myGroupEdit.dispAddressGroupList = function (addressGroupClass) {

    //リストクリア
    $("#groupList > li").remove();

    //データ取得
    var data = {
        "addressGroupClass": addressGroupClass,
        "includeDel": 0
    };
    var jsonString = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/GetAddressGroupList/',
        data: jsonString,
        success: function (serverResponse) {

            if ((serverResponse == null) || (serverResponse.length == 0)) {
                //データなし

            } else if (serverResponse[0].LoginCheckResult.ErrorHandle > 0) {

                //エラー
                //ボタン押下時の処理を記述
                func1 = 'commonscript.dialogclose();';
                func2 = '';
                func3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();

            } else {

                for (var i = 0; i < serverResponse.length; i++) {

                    var addressGroupId = serverResponse[i].AddressGroupId;
                    var addressGroupName = serverResponse[i].AddressGroupName;
                    var delFlg = serverResponse[i].DelFlg;

                    //リスト要素作成
                    myGroupEdit.addItemToList(addressGroupId, addressGroupName);

                }
            }
        },
        error: function () {
        }
    });
}

myGroupEdit.dispPostList = function (postClass) {

    //リストクリア
    $("#groupList > li").remove();

    //部署マスタ情報取得
    var list = messageCommon.getPostDataList("CmMessageEntry_MyGroupEdit", postClass);
    if (list != "ERR") {
        for (var i = 0; i < list.length; i++) {
            //リスト要素作成
            myGroupEdit.addItemToList(list[i].PostCode, list[i].PostName);
        }
    }
}

myGroupEdit.dispCreatorLicenseList = function () {

    //リストクリア
    $("#groupList > li").remove();

    //部署マスタ情報取得
    var list = messageCommon.getPostDataList("CmMessageEntry_MyGroupEdit");
    if (list != "ERR") {
        for (var i = 0; i < list.length; i++) {
            //リスト要素作成
            myGroupEdit.addItemToList(list[i].PostCode, list[i].PostName);
        }
    }
}

myGroupEdit.addItemToList = function (id, dispName) {

    //<li>
    //    <span>テストグループ</span>
    //</li>

    var list = document.createElement('li');
    list.setAttribute("id", id);
    list.setAttribute("data-name", dispName);
    //list.setAttribute("data-delflg", delFlg);
    list.setAttribute("onclick", "myGroupEdit.selectListItem('" + id + "');");

    var span = document.createElement('span');
    span.innerHTML = dispName;

    list.appendChild(span);

    // LIST項目を追加
    document.getElementById("groupList").appendChild(list);
}

/**************************************************************** 
* 機　能： 汎用検索戻り処理(共通callback関数)
* 引　数： piArrayResult:汎用検索で選択した値（Array）
****************************************************************/
function getGeneralSearchResult(piClassName, piClassificationCode, piArrayResult) {
    for (var i = 0; i < piArrayResult.length; i++) {
        if ((piClassName == "MessageCommon") && (piClassificationCode == "Department")) {
            //医師（診療科）リスト追加
            myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Doctor,
                                              "",
                                              piArrayResult[i].ItemCode,
                                              piArrayResult[i].ItemName);
        } else if ((piClassName == "MessageCommon") && (piClassificationCode == "AssignPost")) {
            //看護師（所属部署）リスト追加
            myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Nurse,
                                              "",
                                              piArrayResult[i].ItemCode,
                                              piArrayResult[i].ItemName);
        } else if ((piClassName == "MessageCommon") && (piClassificationCode == "OtherCreatorLicense")) {
            //看護師（所属部署）リスト追加
            myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Other,
                                              "",
                                              piArrayResult[i].ItemCode,
                                              piArrayResult[i].ItemName);
        }
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： リスト（左）選択
* 引　数： 選択行(li)id
****************************************************************/
myGroupEdit.selectListItem = function (id) {

    //クリックされたリストの背景色を変更
    //$("ul#selectList li").each(function () { $(this).removeClass("active"); });
    //$("#" + id).addClass("active");

    var dispName = $("#" + id).attr("data-name");

    if ((myGroupEdit.activeSearchFunction == "CmGroup") || (myGroupEdit.activeSearchFunction == "MyGroup")) {
        //【共通グループ or マイグループ】
        var arrayResult = new Array;
        arrayResult.push({
            AddresssGroupId: id,
            AddresssGroupName: $("#" + id).attr("data-name")
        });
        //宛先グループ検索の戻り値としてコールする
        getAddressGroupSelectionResult(arrayResult);

    } else if (myGroupEdit.activeSearchFunction == "Doctor") {
        //【医師（診療科）】
        myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Doctor, "", id, dispName);

    } else if (myGroupEdit.activeSearchFunction == "Nurse") {
        //【看護師（所属部署）】
        myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Nurse, "", id, dispName);

    } else if (myGroupEdit.activeSearchFunction == "Other") {
        if (id == "Everyone") {
            //【その他（全員）】
            myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Other, id, "", dispName);
        } else {
            //【その他（職種）】
            myGroupEdit.addItemToSelectedList(messageCommon.addressGroupClass.Other, "", id, dispName);
        }
    }

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 選択リスト項目削除
* 引　数： 選択行(li)id
****************************************************************/
myGroupEdit.delSelectedListItem = function (id) {

    //選択値リストより対象のキーを削除
    var detailInfo = $("#" + id).attr('data-detailinfo');
    delete myGroupEdit.selectListItems[detailInfo];

    //表示リストから削除
    $("#" + id).remove();

    //編集フラグON
    myGroupEdit.editFlg = true;

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 選択リスト項目追加
* 引　数： addressGroupClass 宛先グループ種別[1:共通 2:個人 3:診療Gr 4:医師 5:看護師 6:その他]
*          itemClass         項目分類
*          itemCode          項目コード
*          dispName          表示名称
****************************************************************/
myGroupEdit.addItemToSelectedList = function (addressGroupClass, itemClass, itemCode, dispName) {

    //宛先グループ詳細情報（宛先グループ種別^項目分類^項目コード）
    // 設定例）共通　：1^00005^
    //　　　　 個人　：2^^SYS19
    //　　　　 診療Gr：3^001^001
    //　　　　 医師　：4^^001
    //　　　　 看護師：5^^01E
    //　　　　 その他：6^Oneself^
    //　　　　 その他：6^Everyone^
    //　　　　 その他：6^^80
    var detailInfo = addressGroupClass + "^" + itemClass + "^" + itemCode;

    if (myGroupEdit.selectListItems[detailInfo] != null) {
        // 既に選択中の項目はリストへ追加しない
        return;
    }

    // 表示名称
    if (addressGroupClass == 4) {
        dispName = "医師（" + dispName + "）";
    } else if (addressGroupClass == 5) {
        dispName = "看護師（" + dispName + "）";
    }

    //↓↓↓↓↓↓ 動的に作成する要素イメージ ↓↓↓↓↓↓
    //<li>
    //  <input type="checkbox" class="floatLeft" id="chk001" data-id="001">
    //    <span>看護師長グループ</span>
    //    <span class="delete_icon"></span>
    //</li>
    //↑↑↑↑↑↑ 動的に作成する要素イメージ ↑↑↑↑↑↑

    var id = addressGroupClass + "_" + itemClass + "_" + itemCode;

    // --- アイテム項目作成 START --------------------

    //LI要素作成
    var list = document.createElement('li');
    list.setAttribute("id", id);
    list.setAttribute("data-detailinfo", detailInfo);
    list.setAttribute("class", "modifycheck");

    //SPAN①要素作成
    span = document.createElement('span');
    span.innerHTML = dispName;
    list.appendChild(span);     //LISTへ追加

    //SPAN②要素作成
    span = document.createElement('span');
    span.setAttribute("class", "delete_icon");
    span.setAttribute("onclick", "myGroupEdit.delSelectedListItem('" + id + "');");
    list.appendChild(span);     //LISTへ追加

    // --- アイテム項目作成 END ----------------------

    // UL要素へ追加
    var ulElem = document.getElementById("selectList");
    ulElem.appendChild(list);

    // 選択値リストへ退避
    myGroupEdit.selectListItems[detailInfo] = dispName;

    //編集フラグON
    myGroupEdit.editFlg = true;
}



