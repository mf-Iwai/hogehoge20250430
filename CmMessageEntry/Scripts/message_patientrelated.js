
var messagePatientRelated = {};

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//・コールバック関数：getMessagePatientRelatedResult(piArrayList)
//      piArrayList:患者診療データ情報
//          ActivityType        : アクティビティ種別
//          MedicalDataType     : 診療データ種別
//          MedicalDataTypeName : 診療データ種別名
//          KeyCode             : ID（各ｱｸﾃｨﾋﾞﾃｨ種別毎の由来ｷｰ）
//          KeyName             : ID（各ｱｸﾃｨﾋﾞﾃｨ種別毎の由来ｷｰ名）
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


messagePatientRelated.patientId = "";
messagePatientRelated.activityType = "3";

messagePatientRelated.selectItem = "";

$(function () {

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString("CmMessageEntry", strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            messagePatientRelated.patientId = objArgument["PatientId"];
            messagePatientRelated.activityType = objArgument["ActivityType"];
        }
    }

    //サーバ日付を初期表示する
    var sysDate = commonscript.getServerDateTime("CmMessageEntry").split(',');
    if (sysDate.length > 0) {
        var date = commonscript.DateFormatChg(sysDate[1]);
        //[ 要望対応：メッセージ関連情報　カレンダー表示変更] 2018-08 嶌田 Mod.S
        //$("#datepickerpopup01").val(date);
        //$("#datepickerpopup02").val(date);
        $("#datepickerpopup_single01").val(date);
        $("#datepickerpopup_single02").val(date);
        //[ 要望対応：メッセージ関連情報　カレンダー表示変更] 2018-08 嶌田 Mod.E
    }

    //患者基本情報表示
    commonscript.setPatientBasicInfo("CmMessageEntry", messagePatientRelated.patientId, "Patient-boxID");
    
    //クリア
    messagePatientRelated.clear();

    //リスト表示
    messagePatientRelated.dispList();
});

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

    /* 抽出リスト高さ設定 */
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


//
messagePatientRelated.clear = function () {
    //リストクリア
    $("#selectList > li").remove();
    //リスト選択値をクリア
    messagePatientRelated.selectItem = "";
}

//
messagePatientRelated.ok = function () {

    //選択リスト項目を取得
    var result = new Array;
    //2016.11.02 A.Fukumoto Mod.S undefinedが入らないように修正 
    if (messagePatientRelated.selectItem != "") {
        result.push({
            ActivityType: messagePatientRelated.activityType,
            MedicalDataType: $("#" + messagePatientRelated.selectItem).attr('data-datatype'),
            MedicalDataTypeName: $("#" + messagePatientRelated.selectItem).attr('data-datatypename'),
            KeyCode: messagePatientRelated.selectItem,
            KeyName: $("#" + messagePatientRelated.selectItem).attr('data-title')
        });
    }
    //2016.11.02 A.Fukumoto Mod.E 
    if (window == parent) { //単独起動した場合
    } else {                // ﾀﾞｲｱﾛｸﾞ表示した場合
        //呼出元コールバック
        parent.getMessagePatientRelatedResult(result);
    }
    //自身を閉じる
    messagePatientRelated.close();
}

//
messagePatientRelated.close = function () {
    if (window == parent) {
        //単独起動した場合
        commonscript.exitProgram();
    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
}

messagePatientRelated.reload = function () {
    //リスト表示
    messagePatientRelated.dispList();
}

//
messagePatientRelated.dispList = function (activityType) {
    //[ 要望対応：メッセージ関連情報　カレンダー表示変更] 2018-08 嶌田 Mod.S
    //var startDate = $("#datepickerpopup01").val().replace(/\//g, "");
    //var endDate = $("#datepickerpopup02").val().replace(/\//g, "");
    var startDate = $("#datepickerpopup_single01").val().replace(/\//g, "");
    var endDate = $("#datepickerpopup_single02").val().replace(/\//g, "");
    //[ 要望対応：メッセージ関連情報　カレンダー表示変更] 2018-08 嶌田 Mod.E
    if (startDate > endDate) {
        return;
    }

    //データ取得
    var data = {
        "moduleName": "CmMessageEntry",
        "startRow": 1,
        "patientId": messagePatientRelated.patientId,
        "startDate": startDate,
        "endDate": endDate,
        "activityType": messagePatientRelated.activityType
    };
    var jsonString = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetPatientMedicalDataList/',
        data: jsonString,
        success: function (serverResponse) {

            if ((serverResponse == null) || (serverResponse.length == 0)) {
                //データなし

                //クリア
                messagePatientRelated.clear();

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

                //クリア
                messagePatientRelated.clear();

                // ul要素取得
                var ulElem = document.getElementById("selectList");

                for (var i = 0; i < serverResponse.length; i++) {

                    var keyCode = serverResponse[i].KeyCode;
                    var DispDate = serverResponse[i].DispDate;
                    var DataType = serverResponse[i].DataType;
                    var DataTypeName = serverResponse[i].DataTypeName;
                    var Title = serverResponse[i].Title;

                    //<li>
                    //    <div><span>2015/04/01(水) [検体検査]</span></div>
                    //    <div><span>穀物（ゴマ、小麦）</span></div>

                    //</li>

                    var list = document.createElement('li');
                    list.setAttribute("id", keyCode);
                    list.setAttribute("data-datatype", DataType);
                    list.setAttribute("data-datatypename", DataTypeName);
                    list.setAttribute("data-title", Title);
                    list.setAttribute("onclick", "messagePatientRelated.selectListItem('" + keyCode + "');");

                    var div = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = DispDate + " [" + DataTypeName + "]";
                    div.appendChild(span);
                    list.appendChild(div);

                    var div = document.createElement('div');
                    var span = document.createElement('span');
                    span.innerHTML = Title;
                    div.appendChild(span);
                    list.appendChild(div);


                    // LIST項目を追加
                    ulElem.appendChild(list);

                }
            }
        },
        error: function () {
        }
    });
}

messagePatientRelated.selectListItem = function (id) {

    //クリックされたリストの背景色を変更
    $("ul.selectList li").each(function () { $(this).removeClass("active"); });
    $("#" + id).addClass("active");

    //クリックされた項目を退避
    messagePatientRelated.selectItem = id;
}