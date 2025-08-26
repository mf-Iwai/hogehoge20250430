// 名前空間の宣言
var boardEntry = {};


boardEntry.myPrjId = "CmMessageEntry";
boardEntry.myPrgId = "MessageBoardEntry";

//Cookie情報
boardEntry.terminalId = "";
boardEntry.sessionId = "";
boardEntry.deviceType = "1";
boardEntry.userId = "";
boardEntry.userName = "";

//患者情報
boardEntry.patientId = "";
boardEntry.patientName = "";

//入力情報
boardEntry.inputUserId = "";
boardEntry.inputUserName = "";

//クエリストリング
boardEntry.startClass = "";
boardEntry.messageNo = "";
boardEntry.addressId = "";
boardEntry.deviceType = "";
boardEntry.patientId = "";
boardEntry.patientName = "";

//[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add S
//在宅モード取得 1:在宅モード
boardEntry.zaitakuMode = "0";
//[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add E


//--------------------------------------------------------------------------------------
/**************************************************************** 
* 編　集： 2015.00.00 氏名 Add
* 機　能： Windowクローズイベント取得(カラ)
* 引　数： e:イベント
* 戻り値： なし
****************************************************************/

function closingWindow() { }

/**************************************************************** 
* 編　集： 2017.10.19 E.Iwakiri Add
* 機　能： 画面レイアウト設定
* 引　数： なし
* 戻り値： なし
****************************************************************/
function editPageLayout() {

    // 画面の高さを取得
    var kH = $(window).height();

    //コンテナ、ヘッダー、フッターの高さを取得
    var headHeight = $('div#head-box').height();
    var footerHeight = $('div.boardentry_footer').height();

    //コンテンツに高さを加える
    $('div.boardentry_content').css('height', kH - headHeight - footerHeight - 6 + 'px');
    var contentHeight = $('div.boardentry_content').height();
    var topareaHeight = $('div.top_area').height();

    $('div.btm_area').css('height', contentHeight - topareaHeight - 6 + 'px');

}

/**************************************************************** 
* 編　集： 2015.00.00 氏名 Add
* 機　能： ﾘｻｲｽﾞ時処理
* 引　数： なし
* 戻り値： なし
* 注意）共通処理の為、必ず配置する事！
****************************************************************/
function resizePageLayout() {
    editPageLayout();
}
/////////////////////////////////////////////////////////////////
$(function () {

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString("CmMessageEntry", strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            boardEntry.mode = objArgument["Mode"];
            boardEntry.deviceType = objArgument["DeviceType"];
            boardEntry.patientId = objArgument["PatientId"];
            boardEntry.patientName = commonscript.onNullDef(objArgument["PatientName"], "");
            if (commonscript.NullChk(objArgument["StartClass"])) {
                boardEntry.startClass = objArgument["StartClass"];
            }
            if (commonscript.NullChk(objArgument["MessageNo"])) {
                boardEntry.messageNo = objArgument["MessageNo"];
            }
            if (commonscript.NullChk(objArgument["AddressId"])) {
                boardEntry.addressId = objArgument["AddressId"];
            }
        }
    }

    boardEntry.mobileMode = document.getElementById("MobileMode").value;

    $(document).on("click", '#menu_save', function (e) { boardEntry.onSave(); });                                     //Menu保存
    $(document).on("click", '#menu_close', function (e) { boardEntry.closeForm(); });                  　             //Menu閉じる
    $(document).on("click", '#delete', function (e) { boardEntry.onDelete(); });                                      //削除
    $(document).on("click", '#save', function (e) { boardEntry.onSave(); })                                           //保存
    $(document).on("click", '#close', function (e) { boardEntry.closeForm(); });                                      //閉じる
    //表示モードではイベント登録しない
    if (boardEntry.mode != "D") {
        $(document).on("click", '#input_user', function (e) { boardEntry.openStaffSearch(boardEntry.inputUserId, 1); });  //作成者汎用検索
        //$(document).on("click", '#select_patient', function (e) { boardEntry.openPatientlSearch(); });                    //患者汎用検索
        //$(document).on("click", '#patient_del', function (e) { boardEntry.onclickDel(); });                               //×ボタン押下
        //[ 障害対応：連絡事項一覧　宛先チェック不具合] 2018-08 福元 Add.S
        $(document).on("dragover", "#msg_value", function (e) { boardEntry.onDragover(e); });
        $(document).on("drop", "#msg_value", function (e) { boardEntry.onDrop(e); });
        //[ 障害対応：連絡事項一覧　宛先チェック不具合] 2018-08 福元 Add.E
    }
    if (commonscript.getNativeMode() == 1) {
        // CloseFlgを0: 終了拒否に変更
        window.top.calledJS.changeCloseFlg("0");
    }

    // クッキーから情報取得
    boardEntry.terminalId = commonscript.getCookieItem("TerminalId");
    boardEntry.sessionId = commonscript.getCookieItem("LoginSId");
    boardEntry.deviceType = commonscript.getCookieItem("DeviceType");
    boardEntry.userId = commonscript.getCookieItem("UserId");
    boardEntry.userName = commonscript.getCookieItem("UserName");

    //患者
    var patientInfo = commonscript.getPatientBasicInfo(boardEntry.myPrjId, boardEntry.patientId);
    if (commonscript.NullChk(patientInfo)) {
        boardEntry.patientName = patientInfo.PatientKanjiName;
    }

    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add S
    //在宅モード取得
    //環境設定マスタ取得
    boardEntry.zaitakuMode = commonscript.getEnviromentSetUp("CmPatientInfo", "Cm", "Zaitaku", "Settings", "Mode", "1")
    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add E

    //宛先情報取得
    boardEntry.getDestination();

    //初期表示設定
    boardEntry.initDisp();

    //[ 要望対応(No.1910) ：文字スタンプ編集に右クリックメニューを追加してほしい] 2020-12 福元 Add S
    //コンテキストメニュー(右クリック)
    var menuGroup = commonscript.getMenuContentById(boardEntry.myPrjId, "CmMessageBoardEntry");
    var objJsonContextMenuContent = boardEntry.parseJson(menuGroup);

    //コンテキストメニュー作成
    if ($(".context_menu").length > 0) {
        boardEntry.makeContextMenu(".context_menu", objJsonContextMenuContent["CmMessageBoardEntry"], "right");
    }
    //[ 要望対応(No.1910) ：文字スタンプ編集に右クリックメニューを追加してほしい] 2020-12 福元 Add E

    //入力切替
    commonscript.changeImeModeJapanese();
});

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 初期表示設定
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.initDisp = function () {

    if (boardEntry.mode == "N") {
        //新規の場合
        //レイアウトデータ取得
        boardEntry.SetDispInfo();

        //既読ﾁｪｯｸ・削除ボタン非表示
        $('#readFlg').hide();
        $('#delete').hide();

        //入力者の設定
        boardEntry.inputUserId = boardEntry.userId;
        boardEntry.inputUserName = boardEntry.userName;

        //作成日
        //サーバ日付を初期表示する
        var sysDate = commonscript.getServerDateTime("CmMessageEntry").split(',');
        if (sysDate.length > 0) {
            var date = commonscript.DateFormatChg(sysDate[1]);
            $('#input_day').text(date);
        }        
        //更新日
        $('#update_day').text('');
        //入力者
        $('#input_user').text(boardEntry.inputUserName);
        //患者氏名
        $('#select_patient').text(boardEntry.patientName);

        //編集チェック開始
        commonscript.modifyCheck("Start");

    } else if (boardEntry.mode == "E") {
        //編集の場合
        boardEntry.dispData();
        //患者検索不可
        $("#select_patient").prop('disabled', true);

        //アイコン非表示
        $('#select_patient').removeClass('form_text_disabled');
        $('#patient_del').hide();

    } else if (boardEntry.mode == "D") {
        //表示の場合
        boardEntry.dispData();

        //保存ボタン非表示
        $('#save').hide();
        $('#menu_save').hide();
        //テキスト入力・宛先選択不可
        $("#address").prop('disabled', true);
        $("#msg_value").removeClass('form_textarea');
        $('#msg_value').attr('readonly', true);
        //アイコン非表示
        $('#input_user').removeClass('form_text_disabled');
        $('#select_patient').removeClass('form_text_disabled');
        $('#patient_del').hide();

        //[ 診療所版対応：連絡板「重要」項目追加] 2018-11 嶌田 Add.S
        //重要チェックボックス選択不可
        $("#importance_check").prop('disabled', true);
        //[ 診療所版対応：連絡板「重要」項目追加] 2018-11 嶌田 Add.E
    }
    
    //文字色付与
    $('#input_user').addClass('black');
    $('#select_patient').addClass('black');
}

// データ表示
boardEntry.dispData = function () {

    // 指定メッセージ送信データ取得
    boardEntry.getTargetMessageSendData(boardEntry.messageNo);

    // 指定メッセージ受信データ取得
    boardEntry.getTargetMessageReceiveData(boardEntry.messageNo, boardEntry.addressId);
}

// 指定メッセージ送信データ取得
boardEntry.getTargetMessageSendData = function (messageNo) {

    var data = {
        "messageNo": messageNo
    };
    var jsonString = JSON.stringify(data);

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageBoardEntry/GetTargetMessageSendData/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if (serverResponse.LoginCheckResult.ErrorHandle != 0) {

        //ボタン押下時の処理を記述
        strFunction1 = 'commonscript.dialogclose();';
        strFunction2 = '';
        strFunctiom3 = '';
        //ポップアップダイアログの表示
        commonscript.makeDialogDiv("CmMessageEntry", serverResponse.LoginCheckResult.ErrMsgInfo, strFunction1, strFunction2, strFunctiom3);
        commonscript.opendialog();

    } else {

        //連絡事項データセット
        var data = serverResponse;
        boardEntry.objSendDataDB = $.extend(true, [], data);

        //作成日 YYYY-MM-DD HH:MM:SS の形で渡ってくるはず
        var createDate = data.CreationInfo.DateTime;
        if (createDate.length > 0) {
            var date = boardEntry.makeDateChage(createDate);
            $('#input_day').text(date);
        }
        //更新日
        var revisionDate = data.RevisionInfo.DateTime;
        if (revisionDate.length > 0) {
            var date = boardEntry.makeDateChage(revisionDate);
            $('#update_day').text(date);
        }

        boardEntry.inputUserId = data.CreationInfo.UserId;
        boardEntry.inputUserName = data.CreationInfo.UserName;

        $('#input_user').text(data.CreationInfo.UserName);
        $('#select_patient').text(data.PatientName);
        $('#msg_value').val(data.BodyText);

        //[ 診療所版対応：連絡板「重要」項目追加] 2018-11 嶌田 Add.S
        //重要度
        if (data.Importance == '2') {
            //「重要」の場合、チェックON
            $('#importance_check').prop('checked', true);
        } else {
            $('#importance_check').prop('checked', false);
        }
        //[ 診療所版対応：連絡板「重要」項目追加] 2018-11 嶌田 Add.E
    }
}

//日付成型
boardEntry.makeDateChage = function (piDate) {

    if (piDate.length < 19) { return piDate }

    var strYear = piDate.substr(0, 4);
    var strMonth = piDate.substr(5, 2);
    var strDay = piDate.substr(8, 2);
    return strYear.toString() + "/" + strMonth.toString() + "/" + strDay.toString()

}

// 指定メッセージ受信データ取得
boardEntry.getTargetMessageReceiveData = function (messageNo, addressId) {

    var data = {
        "messageNo": messageNo,
        "addressId": addressId
    };
    var jsonString = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageBoardEntry/GetTargetMessageReceiveData/',
        data: jsonString,
        success: function (serverResponse) {

            if (serverResponse.LoginCheckResult.ErrorHandle != 0) {
                //ボタン押下時の処理を記述
                strFunction1 = 'commonscript.dialogclose();';
                strFunction2 = '';
                strFunctiom3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv("CmMessageEntry", serverResponse.LoginCheckResult.ErrMsgInfo, strFunction1, strFunction2, strFunctiom3);
                commonscript.opendialog();

            } else {
                //メッセージ情報セット
                var data = serverResponse;
                boardEntry.objReceiveDataDB = $.extend(true, [], data);

                //既読
                if (data.ReadFlg == '1') {
                    $('#read_check').prop('checked', true);
                } else {
                    $('#read_check').prop('checked', false);
                }

                //セレクトボックスの指定
                $("#address").val(data.AddressId);

                //編集チェック開始
                if (boardEntry.mode == "E") {
                    commonscript.modifyCheck("Start");
                }
            }

        },
        error: function () {
        }
    });
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： ×ボタンクリック
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.onclickDel = function () {

    $('#select_patient').text('');
    $('#select_patient').removeClass('black');
}

/**************************************************************** 
* 編　集： 2017.10.25 A.Fukumoto Add
* 機　能： 削除ボタンクリック
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.onDelete = function () {

    //対象のメッセージを削除しますか？
    var func1 = 'boardEntry.delete();';
    var func2 = 'commonscript.dialogclose();';
    var func3 = "";
    commonscript.dispMessage("CmMessageEntry", "CmMessage", 17, "", func1, func2, func3, 0);

}

boardEntry.delete = function () {

    commonscript.dialogclose();

    //削除処理
    boardEntry.DeleteSendMessage(boardEntry.messageNo, boardEntry.addressId);

    //自身を閉じる
    boardEntry.closeFormOk('OK');
}

/**************************************************************** 
* 編　集： 2017.10.25 A.Fukumoto Add
* 機　能： メッセージ送信データ削除
* 引　数： messageNo : メッセージ番号
* 戻り値： 0:失敗 / 1:成功
****************************************************************/
boardEntry.DeleteSendMessage = function (messageNo, addressId) {
    var data = {
        "messageNo": messageNo,
        "addressId": addressId,
    };
    var jsonString = JSON.stringify(data);
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageList/CmMessageList/DeleteSendMessage/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    return JSON.parse(result);
}

/**************************************************************** 
* 編　集： 2017.10.25 A.Fukumoto Add
* 機　能： 既読チェック変更イベント
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.checkgReadFlg = function (checked) {

    var readFlg = 0;
    if (checked) {
        readFlg = 1;
    }

    // メッセージ受信データ既読フラグ更新
    boardEntry.UpdateReadFlgByAddressId(boardEntry.messageNo, boardEntry.addressId, readFlg);
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： ﾒｯｾｰｼﾞ受信ﾃﾞｰﾀ既読ﾌﾗｸﾞ更新
* 引　数： messageNo  : メッセージ番号
*          archiveFlg : アーカイブフラグ
* 戻り値： 0:失敗 / 1:成功
****************************************************************/
boardEntry.UpdateReadFlgByAddressId = function (messageNo, addressId, readFlg) {
    var data = {
        "messageNo": messageNo,
        "addressId": addressId,
        "readFlg": readFlg
    };
    var jsonString = JSON.stringify(data);
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageBoardEntry/UpdateReadFlgByAddressId/',
        data: jsonString,
        async: false,
    }).responseText;
    return JSON.parse(result);
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 保存ボタンクリック
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.onSave = function () {

    commonscript.headerMenuClose();

    //連絡版登録
    var ret = boardEntry.setSaveData();
    if (!ret) {
        return;
    }

    //画面を閉じる
    boardEntry.closeFormOk('OK');

}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 保存処理
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.setSaveData = function () {

    var importance = "";
    var subject = "";
    var bodyText = "";
    var relativeDateCode = 0;
    var relativeDate = 0;
    var readRequestFlg = 0;

    // 件名／本文
    var subject = "連絡事項";
    var bodyText = $('#msg_value').val();
    bodyText = bodyText.replace(/\t/g, " ");

    // 重要度
    //[ 診療所版対応：連絡板「重要」項目追加] 2018-11 嶌田 Mod.S
    //importance = 1;
    if ($('#importance_check').prop('checked') == true) {
        //「重要」の場合
        importance = 2;
    } else {
        importance = 1;
    }
    //[ 診療所版対応：連絡板「重要」項目追加] 2018-11 嶌田 Mod.E

    //日付指定
    expirationDateClass = 0;
    //相対日
    relativeDate = 99999999;
    //既読要求
    readRequestFlg = 0;
    //処理情報
    var processInfo = "";

    //宛先選択
    var addressId = $("#address").val();
    var addressName = $("#address option:selected").text();
    //【宛先情報未入力エラー】
    //[ 障害対応：連絡事項一覧　宛先チェック不具合] 2018-08 福元 Mod.S
    //if (addressId == "") {
    if (commonscript.NullChk(addressId) == false) {
        //[ 障害対応：連絡事項一覧　宛先チェック不具合] 2018-08 福元 Mod.E
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 6, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }
    var addressGroupClass = messageCommon.addressGroupClass.Board;
    var addressGroupId = addressId;
    var addressGroupName = addressName;
    //選択された宛先情報(宛先グループ種別 ^ 宛先グループID ^ 宛先グループ名称 ^ 宛先Id)
    var addressInfo = addressGroupClass + "^" + addressGroupId + "^" + addressGroupName + "^" + addressId;

    //【本文未入力エラー】
    if (bodyText == "") {
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 15, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    //--------------------------------------
    // ﾃﾞｰﾀ保存
    //--------------------------------------
    var data = {
        "messageNo": boardEntry.messageNo,
        "patientId": boardEntry.patientId,
        "importance": importance,
        "subject": subject.replace(/\t/g, '　'),
        "bodyText": bodyText.replace(/\t/g, '　'),
        "relativeDateCode": relativeDateCode,
        "relativeDate": relativeDate,
        "readRequestFlg": readRequestFlg,
        "addressInfo": addressInfo,
        "processInfo": processInfo,
        "inputUserId": boardEntry.inputUserId,
        "draftFlg": 0       //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/SetMessageSendData/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);
    if ((serverResponse == null) || (serverResponse.length == 0) || (serverResponse == 0)) {
        //更新処理ｴﾗｰ
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 10, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    return true;
}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： クロージングイベント
* 引　数： なし
* 戻り値： なし
****************************************************************/
function procBeforeClosing() {
    //画面終了時処理
    boardEntry.closeForm();
}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： 画面終了時処理①
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.closeForm = function () {

    commonscript.headerMenuClose();

    //入力項目の編集をチェックする　
    if (boardEntry.mode != "D") {
        if (commonscript.modifyCheck("Check") == "1") {
            //変更有り
            commonscript.dispMessage("CmMessageEntry", "CmMessage", 4, "", "commonscript.dialogclose();boardEntry.closeFormOk('Cancel');", "commonscript.dialogclose();", "", "");
        } else {
            //変更無し
            boardEntry.closeFormOk('OK');
        }
    } else {
        //変更無し
        boardEntry.closeFormOk('OK');
    }
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 画面終了時処理②
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.closeFormOk = function (result) {

    //レイアウト保存
    boardEntry.saveLayout();

    if (window == parent) {
        // 単独起動した場合

        //親画面へメッセージ送信
        var message = "WindowClose_MessageBoardEntry||" + result;
        calledJS.sendProgramMessage(message);

        //画面を閉じる
        calledJS.changeCloseFlg("1");
        commonscript.exitProgram();

    } else {
        // ダイアログ表示した場合

        //呼出元コールバック
        if (typeof parent.getCmMessageBoardEntryResult == "function") {
            parent.getCmMessageBoardEntryResult(result);
        }

        //自身を閉じる
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 患者検索
* 引　数： 
* 戻り値： なし
****************************************************************/
boardEntry.openPatientlSearch = function () {
     
    //患者一覧起動パラメータ
    var objdata = new Object();
    objdata["AdmitClass"] = "2";    //TODO
    objdata["DeviceType"] = boardEntry.deviceType;
    objdata["AfterSelectingMode"] = 1;  //患者選択後に閉じる
    objdata["startClass"] = 1; //メッセージからの起動
    var queryString = commonscript.getEncryptQueryString(boardEntry.myPrjId, objdata);
    var prgUrl = "/PsPatientList/PsPatientList/PsPatientList";

    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add S
    //在宅モード取得
    if (boardEntry.zaitakuMode == "1") {
        if ((boardEntry.deviceType == 4) || (boardEntry.deviceType == 6)) {
            prgUrl = "/CmGroupPatientList/GroupChatPatientList/GroupChatPatientListMobile";
        } else {
            prgUrl = "/CmGroupPatientList/GroupChatPatientList/GroupChatPatientList";
        }
    }
    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add E

    if ((boardEntry.deviceType == 4)||(boardEntry.deviceType == 6)) {
        commonscript.openPopUpSpecifyId(prgUrl, "患者検索", queryString, 500, 500, "", true, "PatientSearch")
    } else {
        //画面をロックしてモーダル起動とする
        commonscript.lockScreen();
        commonscript.startProgram(boardEntry.myPrjId, boardEntry.myPrgId, "PsPatientList", "PsPatientList", prgUrl + "?" + queryString, "患者一覧", "0", 0, 0, "", "");
    }
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 患者検索戻り処理(共通callback関数)
* 引　数： piArrayResult:患者検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
function getPatientlSearchResult(piArrayResult) {
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： [職員検索]画面起動
* 引　数： selectedUserId   選択済み職員の利用者IDをセミコロン区切りにて渡す
*          selectCount      最大職員選択数
*          callFlg          予備元判別用（渡した値を選択結果として返される）
****************************************************************/
boardEntry.openStaffSearch = function (selectedUserId, selectCount, callFlg) {
    // 利用者検索
    var basedate = "";          //基準日
    var licence = "";           //職種
    var position = "";          //役職
    var postCode = "";          //所属部署
    var staffDelFlg = 0;        //削除職員表示可否: 1=削除職員表示
    var licenseLockFlg = 0;     //職種変更不可フラグ     0=変更可 1=変更不可
    var positionLockFlg = 0;    //役職変更不可フラグ     0=変更可 1=変更不可
    var postLockFlg = 0;        //所属部署変更不可フラグ 0=変更可 1=変更不可
    CmStaffSearchSetting.Init(selectedUserId, basedate, selectCount, licence, position, postCode, staffDelFlg, callFlg, licenseLockFlg, positionLockFlg, postLockFlg);
    CmStaffSearchSetting.openPopUp();
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 利用者検索戻り処理(共通callback関数)
* 引　数： piArrayResult:利用者検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
function getCmStaffSearchResult(piArrayResult) {
    if (CmStaffSearchSetting.CallFlg == "MessageDestination") {
        //宛先選択側での戻り処理を実行
        document.getElementById('popup-MessageDestination').contentWindow.getCmStaffSearchResult(piArrayResult);
    } else {
        if (commonscript.NullChk(piArrayResult)) {
            if (piArrayResult.length > 0) {
                boardEntry.inputUserId = piArrayResult[0]["StaffId"];
                boardEntry.inputUserName = piArrayResult[0]["StaffName"];
                $('#input_user').text(piArrayResult[0]["StaffName"]);
            }
        }
    }
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： レイアウト情報保存
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.saveLayout = function () {

    //宛先条件取得
    var otherInfo = $("#address").val();
    boardEntry.saveScreenLayout(0, "DispInfo", "表示条件", "Destination", otherInfo);
}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 画面レイアウト　保存
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.saveScreenLayout = function (admitClass, layoutCode, layoutName, ctrl, otherInfo) {

    var data = {
        "terminalId": boardEntry.terminalId,
        "sessionId": boardEntry.sessionId,
        "programId": boardEntry.myPrgId,
        "admitClass": admitClass,
        "layoutCode": layoutCode,
        "layoutName": layoutName,
        "ctrl": ctrl,
        "topLocation": 0,
        "leftLocation": 0,
        "height": 0,
        "width": 0,
        "windowStatus": 0,
        "otherInfo": otherInfo
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageList/Common/SaveScreenLayout/',
        data: jsonString,
        async: false,
    }).responseText;
    return JSON.parse(result);
}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： 表示条件設定
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.SetDispInfo = function () {

    var selectval = 0;

    var layoutInfo = boardEntry.getScreenLayout(0, "DispInfo", "Destination");
    if (commonscript.NullChk(layoutInfo.OtherInfo) == true) {
        selectval = layoutInfo.OtherInfo;
    }

    //セレクトボックスの指定
    $("#address").val(selectval);

}

/**************************************************************** 
* 編　集： 2017.10.24 A.Fukumoto Add
* 機　能： 画面レイアウト取得
* 引　数： なし
* 戻り値： 
****************************************************************/
boardEntry.getScreenLayout = function (admitClass, layoutCode, ctrl) {

    //レイアウトデータの取得
    var data = {
        "terminalId": boardEntry.terminalId,
        "sessionId": boardEntry.sessionId,
        "programId": boardEntry.myPrgId,
        "admitClass": admitClass,
        "layoutCode": layoutCode,
        "ctrl": ctrl
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageList/Common/GetScreenLayout/',
        data: jsonString,
        async: false,
    }).responseText;
    return JSON.parse(result);
}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： 宛先取得
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.getDestination = function () {

    //宛先テーブル初期化
    $('#address').empty();

    //データ取得
    serverResponse = boardEntry.GetDestinationName()

    var func1 = 'commonscript.dialogclose();';
    var func2 = '';
    var func3 = '';

    if (serverResponse == "0") {
        //データベース接続失敗
        commonscript.dispMessage("CmMessageEntry", "Common", "99", "データベースの接続に失敗しました。", func1, func2, func3, 0);
    } else if (serverResponse == "99") {
        //システムエラー
        commonscript.dispMessage("CmMessageEntry", "Common", "99", "システムエラーが発生しました。", func1, func2, func3, 0);

    } else {
        //データ取得成功        
        var objAddress = serverResponse.split('\t')

        var html = "";
        //先頭に空白のリストを表示
        html = '<option value=""></option>'

        for (var i = 0; i < objAddress.length; i++) {

            var address = objAddress[i].split('||')
            html += '<option value="' + address[0] + '">' + address[1] + '</option>'
        }
    }

    $('#address').append(html);
}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： 連絡先情報取得
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.GetDestinationName = function () {
    var data = {
        "piModuleName": "MessageBoardEntry"
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageBoardEntry/GetDestinationName/',
        data: jsonString,
        async: false,
    }).responseText;
    return JSON.parse(result);
}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： ウィンドウメッセージ処理 (共通callback関数)
* 引　数： message:ウィンドウメッセージ
* 戻り値： なし
****************************************************************/
function executeMessage(message) {

    var aryMsg = message.split('||');

    if (aryMsg[0] == "WindowClosing_PsPatientList") {
        //【患者一覧】画面クローズ

        //ロックした画面を解除
        commonscript.unlockScreen();

    } else if (aryMsg[0] == "selectpatient") {
        //【患者一覧】患者選択時

        //ロックした画面を解除
        commonscript.unlockScreen();

        boardEntry.patientId = aryMsg[1];
        $("#select_patient").text(aryMsg[5]); 
        $("#select_patient").addClass("black");

    //[ 障害対応：連絡板　患者を切り替えた際に連絡事項作成画面が切り替わらない] 2017-12 貴嶋 Add.S
    } else if (aryMsg[0] == "messageboard_close") {
        //連絡事項作成画面終了
        boardEntry.closeFormOk('OK')
    //[ 障害対応：連絡板　患者を切り替えた際に連絡事項作成画面が切り替わらない] 2017-12 貴嶋 Add.E
    }

}

/**************************************************************** 
* 編　集： 2017.10.20 A.Fukumoto Add
* 機　能： 患者一覧からの戻り値処理(mobile用)
* 引　数： piPatientId:患者Id
* 引　数： piPatientName:患者名
* 戻り値： なし
****************************************************************/
function getPatientName(piPatientId, piPatientName) {

    boardEntry.patientId = piPatientId;
    $("#select_patient").text(piPatientName);
    $("#select_patient").addClass("black");

    return;
}

//[ 障害対応：連絡事項一覧　宛先チェック不具合] 2018-08 福元 Add.S
// ドロップ受け付け判定
boardEntry.onDragover = function (event) {
    // ドロップを受け付ける 
    // （イベントのデフォルト動作であるドロップの拒否を行なわない） 
    event.preventDefault();
    // これが無いとドロップ不可能になる。 

    // ドロップ時の効果を設定
    event.originalEvent.dataTransfer.dropEffect = "copy";
}

// ドロップ処理
boardEntry.onDrop = function (event) {

    // ページの遷移を防止 
    //（これがないとドラッグ内容の文字列へブラウザが遷移する） 
    event.preventDefault();

    // イベントに格納された文字列データを取り出し 
    //（スタンプボックスからのドロップ時はスタンプIDが取得できます。）
    // console.log(s)  : StampInfo=ST00000014||総蛋白，アルブミ||5
    var stampInfo = event.originalEvent.dataTransfer.getData("text/plain");

    // ★★★　ここにドロップした際の処理を書く　★★★
    if (stampInfo.split('=')[0] == "StampInfo") {
        //var stampId = stampInfo.split('=')[1].split('||')[0];
        //var stampType = stampInfo.split('=')[1].split('||')[2];
        
        return false;

    } else {

        if ($(event.target).hasClass('dropTextStamp')) {
            //テキストスタンプをドロップできる要素の場合
            $(event.target).focus();
            document.execCommand("insertHTML", false, stampInfo);
        }
    }

}
//[ 障害対応：連絡事項一覧　宛先チェック不具合] 2018-08 福元 Add.E

//[ 要望対応(No.1910) ：文字スタンプ編集に右クリックメニューを追加してほしい] 2020-12 福元 Add S
/**************************************************************** 
* 編　集： 2020.12.21 A.Fukumoto Add
* 機　能： json復元
* 引　数： なし
* 戻り値： なし
****************************************************************/
boardEntry.parseJson = function (pData) {
    try {
        pData = pData.replace(/\r\n|\r|\n/g, "");
        pData = pData.replace(/<(.*?)>/g, "");
        var pArray = $.parseJSON(pData);
        return pArray
    } catch (ex) {
        var errMessage = "データの読み込みでエラーが発生しました。<br>Json変換エラー";
        exceptionMessage(errMessage);
    }
}

/**************************************************************** 
* 編　集： 2020.12.21 A.Fukumoto Add
* 機　能： コンテキストメニュー作成
* 引　数： strSelector:Jquery　セレクタ
*       ： strMenuContent:メニュー項目Json文字列
*       ： strTrigger:割り当てイベント right;右クリック left:左クリック
* 戻り値： なし
****************************************************************/
boardEntry.makeContextMenu = function (strSelector, strMenuContent, strTrigger) {

    try {
        //Nullチェック
        if (commonscript.NullChk(strSelector) == false) {
            return "";
        }
        if (commonscript.NullChk(strMenuContent) == false) {
            return "";
        }
        if ((commonscript.NullChk(strTrigger) == false) || (strTrigger == "")) {
            trigger = "right";
        }
    } catch (e) {
        return "";
    } finally {
    }

    var strSetContent = boardEntry.parseJson(strMenuContent);

    $.contextMenu({
        selector: strSelector,
        trigger: strTrigger,
        build: function ($trigger, e) {

            //メニューの内容を設定
            var menuContent = $.extend(true, {}, strSetContent);

            //★条件によりメニューに表示する項目を制御する必要がある場合はここで変更する★

            if (boardEntry.mode == "D") {
                menuContent.menu_paste.visible = false;
                menuContent.menu_cut.visible = false;
            };

            return {
                //★各機能ごとにイベントキーの処理を記載する★
                callback: function (key, options) {
                    //var target = $(e.currentTarget).parent.parent.data();

                    // this is the trigger element
                    var $this = this;

                    var ret = "";
                    try {
                        if (key == "menu_copy") {
                            // コピー
                            var copyStr = boardEntry.getSelectionText($this);  //document.getSelection().toString();
                            calledJS.setClipbord(copyStr);
                            ret = document.execCommand("copy", false);

                        } else if (key == "menu_paste") {
                            // 貼付け
                            $this.focus();

                            var insText = calledJS.getClipbord();
                            document.execCommand("insertHTML", false, insText);

                            $this.focus();

                        } else if (key == "menu_cut") {
                            // 切取り
                            $this.focus();

                            var copyStr = boardEntry.getSelectionText($this);  //document.getSelection().toString();
                            calledJS.setClipbord(copyStr);
                            ret = document.execCommand("cut", false);

                        } else {
                            var m = "clicked: " + key;
                        }
                    } catch (err) {
                    }
                },
                items: menuContent,
                events: {
                    show: function (opt) {
                        // this is the trigger element
                        var $this = this;
                        // import states from data store 
                        $.contextMenu.setInputValues(opt, $this.data());
                        // this basically fills the input commands from an object
                        // like {name: "foo", yesno: true, radio: "3", …}
                    },
                    hide: function (opt) {
                        // this is the trigger element
                        var $this = this;
                        // export states to data store
                        $.contextMenu.getInputValues(opt, $this.data());
                        // this basically dumps the input commands' values to an object
                        // like {name: "foo", yesno: true, radio: "3", …}
                    }
                }
            };
        }
    });
}

boardEntry.getSelectionText = function (triggerElement) {
    var ta = triggerElement[0];
    var val = ta.value;
    var start = parseInt(ta.selectionStart, 10);
    var end = parseInt(ta.selectionEnd, 10);
    var txt = val.substring(start, end);
    return txt;
}
//[ 要望対応(No.1910) ：文字スタンプ編集に右クリックメニューを追加してほしい] 2020-12 福元 Add E