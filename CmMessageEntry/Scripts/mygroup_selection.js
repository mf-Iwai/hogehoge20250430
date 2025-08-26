
var myGroupSelection = {};

myGroupSelection.deviceType = "";
myGroupSelection.addressGroupClass = "1";    //[1:共通 2:個人]
myGroupSelection.editLinkDispMode = "0";

myGroupSelection.selectItems = {};           //選択リスト情報

$(function () {

    //Html5のPostMessageの受付
    window.addEventListener("message", myGroupSelection.receiveMessage, false);

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString("CmMessageEntry", strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            myGroupSelection.deviceType = objArgument["DeviceType"];
            myGroupSelection.addressGroupClass = objArgument["AddressGroupClass"];
            myGroupSelection.editLinkDispMode = objArgument["EditLinkDispMode"];
        }
    }

    if (myGroupSelection.addressGroupClass == "1") {
        //宛先グループ=[共通]の場合
        $("#spanDeleteFlg").hide();
    }

    // リスト表示
    myGroupSelection.dispList();
});

/**************************************************************** 
* 編　集： 2016.08.23 M.Matsuo Add
* 機　能： 【Html5】PostMessage受信
* 引　数： メッセージ
* 戻り値： なし
****************************************************************/
myGroupSelection.receiveMessage = function (event) {

    var data = event.data;

    if ("refreshMyGroupEdit" == data.message) {
        // 再表示
        myGroupSelection.dispList();
    }
}

/**************************************************************** 
* 編　集： 2015.01.28 T.Kusumoto Add
* 機　能： 画面レイアウト設定
          （画面幅を基準としてモバイル用とPC用の処理へ分岐）
* 引　数： なし
* 戻り値： なし
****************************************************************/
function editPageLayout() {

    // 画面の高さを取得して、変数wHに代入
    var wH = $(window).height();
    // メイン以外の高さを取得
    var otherHeight = $('#header').outerHeight(true) + $('#header_container').outerHeight(true) + $('#footer_container').outerHeight(true);
    var contentHeight = wH - otherHeight;
    // #main_contaienrに高さを加える
    $('#main_container').css('height', contentHeight + 'px');

    /* 選択リスト高さ設定 */
    var select_containerHeight = $('#main_container').outerHeight(true);
    var otherHeight = $('#selectList_label').outerHeight(true);
    var contentHeight = select_containerHeight - otherHeight;
    $('#select_container').css('height', contentHeight + 'px');

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

window.onload = function () {
    editPageLayout();
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： OK
* 引　数： なし
* 戻り値： なし
****************************************************************/
myGroupSelection.select = function () {
    if (window == parent) { //単独起動した場合
    } else {                // ﾀﾞｲｱﾛｸﾞ表示した場合
        //リスト選択項目を取得
        var result = new Array;
        var cnt = 0;
        for (var key in myGroupSelection.selectItems) {
            result[cnt] = {
                AddresssGroupId: key,
                AddresssGroupName: myGroupSelection.selectItems[key]
            }
            cnt = cnt + 1;
        }
        //呼出元コールバック
        parent.getAddressGroupSelectionResult(result);
    }
    myGroupSelection.close();
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 閉じる
* 引　数： なし
* 戻り値： なし
****************************************************************/
myGroupSelection.close = function () {
    if (window == parent) {
        //単独起動した場合
        commonscript.exitProgram();
    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
}

myGroupSelection.selectListItem = function (id) {

    //クリックされたリストの背景色を変更
    $("ul.selectList li").each(function () { $(this).removeClass("active"); });
    $("#" + id).addClass("active");

    //クリックされた項目を退避
    myGroupSelection.selectItems[id] = $("#" + id).attr("data-name");
}

myGroupSelection.editListItem = function (id) {

    var objdata = new Object();
    objdata["DeviceType"] = myGroupSelection.deviceType;
    objdata["AddressGroupId"] = id;
    var includeDel = 0;
    if ($("#grDeleteFlg").prop('checked')) {
        includeDel = 1;
    }
    objdata["IncludeDelGroup"] = includeDel;
    var encryptQueryString = commonscript.getEncryptQueryString("CmMessageEntry", objdata);

    //マイグループ編集
    //commonscript.openPopUpSpecifyId("/CmMessageEntry/MyGroup/MyGroupEdit", "マイグループ編集", encryptQueryString, 450, 700, "commonscript.popupclose()", true, "-mygroupEntry");
    var prgUrl = "/CmMessageEntry/MyGroup/MyGroupEdit?" + encryptQueryString;
    var prgTitle = "マイグループ編集"
    var multiFlg = "0";
    commonscript.startProgram("CmMessageEntry", "MyGroupSelection", "CmMessageEntry", "MyGroupEdit", prgUrl, prgTitle, "0", 700, 500, "", "");

}

myGroupSelection.dispList = function () {

    //リストクリア
    $("#selectList > li").remove();

    //リスト選択値をクリア
    myGroupSelection.selectItems = {};

    //削除されたグループを表示するチェック
    var includeDel = 0;
    if ($("#grDeleteFlg").prop('checked')) {
        includeDel = 1;
    }

    //データ取得
    var data = {
        "addressGroupClass": myGroupSelection.addressGroupClass,
        "includeDel": includeDel
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

                //リストクリア
                $("#selectList > li").remove();

                // ul要素取得
                var ulElem = document.getElementById("selectList");

                for (var i = 0; i < serverResponse.length; i++) {

                    var addressGroupId = serverResponse[i].AddressGroupId;
                    var addressGroupName = serverResponse[i].AddressGroupName;
                    var delFlg = serverResponse[i].DelFlg;

                    //<li>
                    //    <span>テストグループ</span>
                    //    <span class="edit_icon"></span>
                    //</li>

                    var list = document.createElement('li');
                    list.setAttribute("id", addressGroupId);
                    list.setAttribute("data-name", addressGroupName);
                    list.setAttribute("data-delflg", delFlg);
                    list.setAttribute("onclick", "myGroupSelection.selectListItem('" + addressGroupId + "');");

                    var span = document.createElement('span');
                    span.innerHTML = addressGroupName;

                    list.appendChild(span);

                    if (myGroupSelection.editLinkDispMode == 1) {
                        if ((myGroupSelection.addressGroupClass == "2") && (myGroupSelection.deviceType == 1)) {
                            //宛先グループ=[個人]の場合、マイグループ編集へのリンクアイコンを表示
                            span = document.createElement('span');
                            span.setAttribute("class", "edit_icon");
                            span.setAttribute("onclick", "myGroupSelection.editListItem('" + addressGroupId + "');");
                            list.appendChild(span);
                        }
                        
                    }

                    // LIST項目を追加
                    ulElem.appendChild(list);

                }
            }
        },
        error: function () {
        }
    });
}