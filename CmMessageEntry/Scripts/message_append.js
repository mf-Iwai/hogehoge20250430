
var messageAppend = {};

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//・コールバック関数：getMessageAppendResult(piArrayList)
// piArrayList:メッセージ関連情報
//      ActivityType        ｱｸﾃｨﾋﾞﾃｨ種別（1:オーダ 3:文書 7:DPC）
//      ActivityTypeName    ｱｸﾃｨﾋﾞﾃｨ種別名
//      MedicalDataType     診療ﾃﾞｰﾀ種別
//      MedicalDataTypeName 診療ﾃﾞｰﾀ種別名
//      DerivationClass     由来区分（1:新規作成 2:スタンプ 3:患者データ）
//      DerivationKey       由来ｷｰ
//      DerivationKeyName   由来ｷｰ名
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

messageAppend.startClass = 1;               //1:メッセージ登録時の関連情報選択 2:メッセージ表示時の関連情報参照
messageAppend.patientId = "";               //患者ID
messageAppend.messageNo = "";               //（startClass=2の場合）メッセージ番号
messageAppend.processExecutability = 1;            //（startClass=2の場合）関連情報処理実行可否（0:不可 1:可能）

messageAppend.selectListItems = {};         //
messageAppend.activeProcessKey = "";

messageAppend.enumActivityType = {
    Order: 1,
    Task: 2,
    Document: 3,
    Disease: 9          //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add
}

messageAppend.enumDerivationClass = {
    New: 1,
    Stamp: 2,
    Patient: 3
}

$(function () {

    var selectList = "";

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var  retObj = commonscript.getDcryptQueryString("CmMessageEntry", strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            messageAppend.startClass = objArgument["StartClass"];
            messageAppend.patientId = objArgument["PatientId"];
            messageAppend.messageNo = commonscript.onNullDef(objArgument["MessageNo"], "");
            messageAppend.processExecutability = commonscript.onNullDef(objArgument["ProcessExecutability"], "");
            selectList = objArgument["SelectList"];
        }
    }

    // クリア
    messageAppend.clear();

    // ボタン表示制御
    if (messageAppend.startClass == "1") {
        //1:メッセージ登録時
        if (messageAppend.patientId == "") {
            $(".btnPatient").prop('disabled', true);
            $(".btnPatient").addClass('btn04_off');
        } 
    } else if (messageAppend.startClass == "2") {
        //2:メッセージ参照時
        $(".btnHeader").prop('disabled', true);
        $(".btnHeader").addClass('btn04_off');
        $("#grClear_btn").hide();
        $("#liClear").hide();
        if (messageAppend.processExecutability == 1) {
            $("#grOK_btn").val("関連処理");
            $("#liOk input").val("関連処理");
        } else {
            $("#grOK_btn").hide();
            $("#liOk input").hide();
        }
    }

    // リスト初期表示
    if ((commonscript.NullChk(selectList)) && (selectList != "")) {
        var dispList = selectList.split("|");
        for (var i = 0; i < dispList.length; i++) {
            var processInfo = dispList[i].split("^");
            var activityType = processInfo[0];
            var activityTypeName = processInfo[1];
            var medicalDataType = processInfo[2];
            var medicalDataTypeName = processInfo[3];
            var derivationClass = processInfo[4];
            var derivationKey = processInfo[5];
            var derivationKeyName = processInfo[6];
            messageAppend.addListItem(activityType,
                                      activityTypeName,
                                      medicalDataType,
                                      medicalDataTypeName,
                                      derivationClass,
                                      derivationKey,
                                      derivationKeyName,
                                      "",
                                      "");
        }
    } else if (messageAppend.messageNo != "") {
        //メッセージ番号より、メッセージ処理データ取得
        messageAppend.dispMessageProcessDataList(messageAppend.messageNo);
    }

    //[ 障害対応：スタンプボックス>プロパティより、スタンプ管理名を変更後、リフレッシュされない] 2017-08 河原 Add.S
    //Html5のPostMessageの受付
    window.addEventListener("message", messageAppend.receiveMessage, false);
    //[ 障害対応：スタンプボックス>プロパティより、スタンプ管理名を変更後、リフレッシュされない] 2017-08 河原 Add.E
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

    /* 選択リスト高さ設定 */
    var select_containerHeight = $('#main_container').outerHeight(true);
    var otherHeight = $('#selectList_label').outerHeight(true);
    var contentHeight = select_containerHeight - otherHeight;
    $('#select_container').css('height', contentHeight + 'px');

}

/**************************************************************** 
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
* 機　能： クリア
****************************************************************/
messageAppend.clear = function () {
    //リストクリア
    $("#selectList > li").remove();
    //選択値リスト退避用配列クリア
    messageAppend.selectListItems = {};
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： OKボタン
****************************************************************/
messageAppend.onClickOk = function () {

    if (messageAppend.startClass == "1") {

        var result = new Array;
        var processInfo = "";       //処理情報（アクティビティ種別^診療データ種別^由来区分^由来キー）
        var processNameInfo = "";

        //表示リストをループ
        $('ul#selectList li').each(function () {

            var activityType = $(this).attr('data-activitytype');
            var activityTypeName = $(this).attr('data-activitytypename');
            var medicalDataType = $(this).attr('data-medicaldatatype');
            var medicalDataTypeName = $(this).attr('data-medicaldatatypename');
            var derivationClass = $(this).attr('data-derivationclass');
            var derivationKey = $(this).attr('data-derivationkey');
            var derivationKeyName = $(this).attr('data-derivationkeyname');
            var itemName = $(this).text();

            //戻り値配列に挿入
            result.push({
                ActivityType: activityType,
                ActivityTypeName: activityTypeName,
                MedicalDataType: medicalDataType,
                MedicalDataTypeName: medicalDataTypeName,
                DerivationClass: derivationClass,
                DerivationKey: derivationKey,
                DerivationKeyName: derivationKeyName,
                ItemName: itemName
            });

        });

        //呼出元コールバック
        parent.getMessageAppendResult(result);

    } else if (messageAppend.startClass == "2") {
        if (messageAppend.activeProcessKey.length == 0) {
            return;
        }
        var processKey = $("#" + messageAppend.activeProcessKey).attr('data-processseq');
        var activityType = $("#" + messageAppend.activeProcessKey).attr('data-activitytype');
        var medicalDataType = $("#" + messageAppend.activeProcessKey).attr('data-medicaldatatype');
        var derivationClass = $("#" + messageAppend.activeProcessKey).attr('data-derivationclass');
        var derivationKey = $("#" + messageAppend.activeProcessKey).attr('data-derivationkey');

        //[ 機能追加：在宅カルテ　職員登録依頼対応] 2018-11 池田 Add S
        if (activityType == 10) {
            // 職員情報承認処理(在宅カルテのみ)
            var zaitakuMode = commonscript.getEnviromentSetUp("CmMessageEntry", "Cm", "Zaitaku", "Settings", "Mode", 1);
            if (zaitakuMode == 1) {
                //承認処理
                var func1 = "commonscript.dialogclose();messageAppend.AcceptUser('" + derivationKey + "');";
                var func2 = "commonscript.dialogclose();";
                var func3 = "commonscript.dialogclose();";
                commonscript.dispMessage("CmMessageEntry", "SmStaffAddRequest", "3", "", func1, func2, func3, "");
            }
            return;
        }
        //[ 機能追加：在宅カルテ　職員登録依頼対応] 2018-11 池田 Add E

        // [ 京都（カスタマイズ）：メッセージ関連処理からYahgee文書起動対応] 2019-10 立山 Add S
        var systemCode = "";
        var systemDocId = "";
        if (activityType == 3) {
            // 文書の場合、外部文書情報を取得する
            var DocInfo = messageAppend.GetDocInfoExternal(derivationKey);
            if (DocInfo.MessageInfo.ErrorHandle != 0) {
                // ボタン押下時の処理を記述
                func1 = 'commonscript.dialogclose();';
                func2 = '';
                func3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv("CmMessageEntry", DocInfo.MessageInfo.ErrMsgInfo, func1, func2, func3);
                // ダイアログ起動
                commonscript.opendialog();
                return false;
            } else {
                // 外部文書のシステムコード、文書IDが設定されている場合はパラメータに設定する
                systemCode = DocInfo.SystemCode;
                systemDocId = DocInfo.SystemDocId;
            }
        }
        // [ 京都（カスタマイズ）：メッセージ関連処理からYahgee文書起動対応] 2019-10 立山 Add E

        //[ 障害対応(No.1997)：メッセージ関連文書　診療科選択がない場合の不具合] 2021-01 福元 Add S
        var admitClass = "";
        //選択患者の入外区分を取得する
        var data = {
            "piPatientId": messageAppend.patientId,
            "piCheckDate": ""
        };
        var jsonString = JSON.stringify(data);
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: 'application/json',
            url: '/CmMessageList/CmMessageList/CheckPatientAdmitClass/',
            data: jsonString,
            async: false,
            success: function (serverResponse) {
                admitClass = serverResponse.replace(/"/g, "");
            },
            error: function () {
            }
        });
        //[ 障害対応(No.1997)：メッセージ関連文書　診療科選択がない場合の不具合] 2021-01 福元 Add E

        //messageprocess || [患者ID] || [ﾒｯｾｰｼﾞ番号^ﾌﾟﾛｾｽSeq^ｱｸﾃｨﾋﾞﾃｨ種別^診療ﾃﾞｰﾀ種別^由来区分^由来ｷｰ]
        var message = "messageprocess"
                        + "||" + messageAppend.patientId
                        + "||" + messageAppend.messageNo
                            + "^" + processKey
                            + "^" + activityType
                            + "^" + medicalDataType
                            + "^" + derivationClass
                            // [ 京都（カスタマイズ）：メッセージ関連処理からYahgee文書起動対応] 2019-10 立山 Mod S
                            //+ "^" + derivationKey;
                            + "^" + derivationKey
                            + "^" + systemCode
                            + "^" + systemDocId
                            // [ 京都（カスタマイズ）：メッセージ関連処理からYahgee文書起動対応] 2019-10 立山 Mod S
                    //[ 障害対応(No.1997)：メッセージ関連文書　診療科選択がない場合の不具合] 2021-01 福元 Add S
                       + "||" + admitClass;
                    //[ 障害対応(No.1997)：メッセージ関連文書　診療科選択がない場合の不具合] 2021-01 福元 Add E
        window.top.calledJS.sendProgramMessageToMenu("CmMessageEntry", "MessageEntry", message);
        setTimeout("window.top.calledJS.activateWindow('" + "カルテ入力" + "');", 500);

    }

    //閉じる
    messageAppend.close();

};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 閉じる
****************************************************************/
messageAppend.close = function () {
    if (window == parent) {
        //単独起動した場合
        commonscript.exitProgram();
    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [オーダ]ボタンクリックイベント
****************************************************************/
messageAppend.onClickOrder = function () {
    messageCommon.openGeneralSearch("CmMessageEntry", "OrderType");
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [文書]ボタンクリックイベント
****************************************************************/
messageAppend.onClickDocument = function () {
    messageCommon.openGeneralSearch("CmMessageEntry", "DocumentType");
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [スタンプ]ボタンクリックイベント
****************************************************************/
messageAppend.onClickStamp = function () {
    var strUrl = "/StStampBox/StStampBox/StStampBox";
    var strTitle = "スタンプボックス";
    var intWidth = 400;
    var intHeight = 600;
    var objdata = new Object();
    objdata["StampForm"] = "6";
    objdata["DevelopMode"] = "2";	//スタンプ展開モード（1:ドラッグ&ドロップ 　2:選択＋ボタン押下）
    objdata["DrilldownOnly"] = "0";	//ドリルダウン表示のみにしたい場合は1
    var param = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
    commonscript.openPopUp(strUrl, strTitle, param, intWidth, intHeight);
};

//[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.S
/**************************************************************** 
* 編　集： 2017.08.07 A.Fukumoto Add
* 機　能： [病名]ボタンクリックイベント
****************************************************************/
messageAppend.onClickDisease = function () {

    messageAppend.addListItem(messageAppend.enumActivityType.Disease,
                              "病名",
                              "",
                              "病名登録",
                              messageAppend.enumDerivationClass.New,
                              "",
                              "",
                              "",
                              "");

};
//[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.E

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [患者オーダ]ボタンクリックイベント
****************************************************************/
messageAppend.onClickPatientOrder = function () {
    openMessagePatientRelated(messageAppend.enumActivityType.Order)
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [患者文書]ボタンクリックイベント
****************************************************************/
messageAppend.onClickPatientDocument = function () {
    openMessagePatientRelated(messageAppend.enumActivityType.Document)
};

/**************************************************************** 
* 機　能： 汎用検索戻り処理(共通callback関数)
* 引　数： piArrayResult:汎用検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
function getGeneralSearchResult(piClassName, piClassificationCode, piArrayResult) {

    for (var i = 0; i < piArrayResult.length; i++) {

        if ((piClassName == "CmMessageEntry") && (piClassificationCode == "OrderType")) {

            //オーダ種別をリスト追加
            messageAppend.addListItem(messageAppend.enumActivityType.Order,
                                      "オーダ",
                                      piArrayResult[i].ItemCode,
                                      piArrayResult[i].ItemName,
                                      messageAppend.enumDerivationClass.New,
                                      "",
                                      "",
                                      "",
                                      "");

        } else if ((piClassName == "CmMessageEntry") && (piClassificationCode == "DocumentType")) {

            //文書種別リスト追加
            messageAppend.addListItem(messageAppend.enumActivityType.Document,
                                      "文書",
                                      piArrayResult[i].ItemCode,
                                      piArrayResult[i].ItemName,
                                      messageAppend.enumDerivationClass.New,
                                      "",
                                      "",
                                      "",
                                      "");

        }
    }
}

/**************************************************************** 
* 機　能： スタンプボックス戻り処理(共通callback関数)
* 引　数：StampId：スタンプID
* 　　　　StampManageName：スタンプ管理名（スタンプボックス上で表示される名称）
* 　　　　StampType：スタンプ種別
* 　　　　StampInfomation：スタンプ付加情報（オーダスタンプならオーダ種別、など）
* 戻り値： なし
****************************************************************/
function getStampBoxResult(StampId, StampManageName, StampType, StampInfomation) {

    if (StampType == "5") {
        //オーダ
        messageAppend.addListItem(messageAppend.enumActivityType.Order,
                                  "オーダ", 
                                  StampInfomation,
                                  "",
                                  messageAppend.enumDerivationClass.Stamp,
                                  StampId,
                                  StampManageName,
                                  "",
                                  "");
    } else if (StampType == "7") {
        //文書
        messageAppend.addListItem(messageAppend.enumActivityType.Document,
                                  "文書",
                                  StampInfomation,
                                  "",
                                  messageAppend.enumDerivationClass.Stamp,
                                  StampId,
                                  StampManageName,
                                  "",
                                  "");
    }

}

/**************************************************************** 
* 機　能： 患者診療データ選択画面起動
* 引　数： piArrayResult:汎用検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
function openMessagePatientRelated(activityType) {

    var strUrl = "/CmMessageEntry/MessageEntry/MessagePatientRelated";
    var strTitle = "";
    if (activityType == messageAppend.enumActivityType.Order) {
        strTitle = "患者オーダ";
    } else if (activityType == messageAppend.enumActivityType.Document) {
        strTitle = "患者文書";
    }
    var intWidth = 430;
    var intHeight = 600;
    var objdata = new Object();
    objdata["PatientId"] = messageAppend.patientId;
    objdata["ActivityType"] = activityType;
    var param = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
    commonscript.openPopUp(strUrl, strTitle, param, intWidth, intHeight);
}

/**************************************************************** 
* 機　能： 患者診療データ選択戻り処理(共通callback関数)
* 引　数： piArrayResult:患者診療データ選択で選択した値（Array）
* 戻り値： なし
****************************************************************/
function getMessagePatientRelatedResult(piArrayResult) {

    var activityType = "";
    var medicalDataType = "";
    var KeyCode = "";

    for (var i = 0; i < piArrayResult.length; i++) {

        activityType = piArrayResult[i].ActivityType;
        medicalDataType = piArrayResult[i].MedicalDataType;
        medicalDataTypeName = piArrayResult[i].MedicalDataTypeName;
        keyCode = piArrayResult[i].KeyCode;     //オーダNo or 文書No
        keyName = piArrayResult[i].KeyName;

        if (activityType == messageAppend.enumActivityType.Order) {

            //オーダ
            messageAppend.addListItem(activityType,
                                      "オーダ",
                                      medicalDataType,
                                      medicalDataTypeName,
                                      messageAppend.enumDerivationClass.Patient,
                                      keyCode,
                                      keyName,
                                      "",
                                      "");

        } else if (activityType == messageAppend.enumActivityType.Document) {

            //文書
            messageAppend.addListItem(activityType,
                                      "文書",
                                      medicalDataType,
                                      medicalDataTypeName,
                                      messageAppend.enumDerivationClass.Patient,
                                      keyCode,
                                      keyName,
                                      "",
                                      "");
        }
    }

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： リスト項目追加
* 引　数：  ActivityType        ｱｸﾃｨﾋﾞﾃｨ種別（1:オーダ 3:文書）
*           ActivityTypeName    ｱｸﾃｨﾋﾞﾃｨ種別名
*           MedicalDataType     診療ﾃﾞｰﾀ種別
*           MedicalDataTypeName 診療ﾃﾞｰﾀ種別名
*           DerivationClass     由来区分（1:新規作成 2:スタンプ 3:患者データ）
*           DerivationKey       由来ｷｰ
*           DerivationKeyName   由来ｷｰ名
*           processSeq          処理ｼｰｹﾝｽ
*           processFlg          処理ﾌﾗｸﾞ
****************************************************************/
messageAppend.addListItem = function (activityType, activityTypeName,
                                      medicalDataType, medicalDataTypeName,
                                      derivationClass, derivationKey, derivationKeyName,
                                      processSeq, ProcessFlg) {

    //キー情報（ [ｱｸﾃｨﾋﾞﾃｨ種別]_[診療ﾃﾞｰﾀ種別]_[由来区分]_[由来ｷｰ] ）
    var keyInfo = activityType + "_" + medicalDataType + "_" + derivationClass + "_" + derivationKey;
    keyInfo = keyInfo.replace(/;/g, '；')

    if (messageAppend.selectListItems[keyInfo] != null) {
        // 既に選択中の項目はリストへ追加しない
        return;
    }

    //表示名称生成
    var dispName = messageCommon.getProcessListItemName(
                            activityType, activityTypeName,
                            medicalDataType, medicalDataTypeName,
                            derivationClass, derivationKey, derivationKeyName);

    if (ProcessFlg == 1) {
        dispName = dispName + "　【 処理済 】";
    }
    // --- アイテム項目作成 START --------------------

    //LI要素作成
    var list = document.createElement('li');
    list.setAttribute("id", keyInfo);
    list.setAttribute("data-activitytype", activityType);
    list.setAttribute("data-activitytypename", activityTypeName);
    list.setAttribute("data-medicaldatatype", medicalDataType);
    list.setAttribute("data-medicaldatatypename", medicalDataTypeName);
    list.setAttribute("data-derivationclass", derivationClass);
    list.setAttribute("data-derivationkey", derivationKey);
    list.setAttribute("data-derivationkeyname", derivationKeyName);
    list.setAttribute("data-processseq", processSeq);

    //SPAN①要素作成
    span = document.createElement('span');
    span.innerHTML = dispName;
    if (messageAppend.startClass == 2) {
        span.setAttribute("onclick", "messageAppend.activeListItem('" + keyInfo + "');");
    }
    list.appendChild(span);     //LISTへ追加

    if (messageAppend.startClass == 1) {
        //SPAN②要素作成
        span = document.createElement('span');
        span.setAttribute("class", "delete_icon");
        span.setAttribute("onclick", "messageAppend.deleteListItem('" + keyInfo + "');");
        list.appendChild(span);     //LISTへ追加
    }
    // --- アイテム項目作成 END ----------------------

    // UL要素へ追加
    var ulElem = document.getElementById("selectList");
    ulElem.appendChild(list);

    // 選択値リストへ退避
    messageAppend.selectListItems[keyInfo] = dispName;
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： リスト項目選択
****************************************************************/
messageAppend.activeListItem = function (id) {

    //クリックされたリストの背景色を変更
    $("ul.selectList li").each(function () { $(this).removeClass("active"); });
    $("#" + id).addClass("active");

    //クリックされた項目を退避
    messageAppend.activeProcessKey = id;

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： リスト項目削除
****************************************************************/
messageAppend.deleteListItem = function (id) {

    //選択値リストより対象のキーを削除
    delete messageAppend.selectListItems[id];

    //表示リストから削除
    $("#" + id).remove();
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： メッセージ関連処理開始
****************************************************************/
messageAppend.dispMessageProcessDataList = function (messageNo) {

    //データ取得
    var data = {
        "messageNo": messageNo
    };
    var jsonString = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetMessageProcessDataList/',
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
                    messageAppend.addListItem(serverResponse[i].ActivityType,
                                              serverResponse[i].ActivityTypeName,
                                              serverResponse[i].MedicalDataType,
                                              serverResponse[i].MedicalDataTypeName,
                                              serverResponse[i].DerivationClass,
                                              serverResponse[i].DerivationKey,
                                              serverResponse[i].DerivationKeyName,
                                              serverResponse[i].ProcessSeq,
                                              serverResponse[i].ProcessFlg);

                }
            }
        },
        error: function () {
        }
    });
}


/**************************************************************** 
* 編　集： 2017.09.01 A.Kawahara Add
* 機　能： 【Html5】PostMessage受信
* 引　数： メッセージ
* 戻り値： なし
****************************************************************/
messageAppend.receiveMessage = function (event) {
    var data = event.data;
    var senddata;
    if ("stampNameRefresh" == data.message) {
        senddata = new Object();
        senddata.message = data.message;
        senddata.stampManageName = data.stampManageName;
        if (data.stampForm == 6) {
            commonscript.postMessageToFrame("popup-container", senddata);
        }
    }
}

/**************************************************************** 
* 編　集：[ 機能追加：在宅カルテ　職員登録依頼対応] 2018-11 池田 Add
* 機　能：職員承認処理
* 引　数：メッセージ
* 戻り値： なし
****************************************************************/
messageAppend.AcceptUser = function (addUser) {
    var sessionId = commonscript.getCookieItem("LoginSId");
    var terminalId = commonscript.getCookieItem("TerminalId");
    var acceptUser = commonscript.getCookieItem("UserId");
    var requestUser = parent.cmMessageViewCommon.objSendDataDB.CreationInfo.UserId;
    //データ取得
    var data = {
        "piSessionId": sessionId,
        "piModuleName": "CmMessageEntry",
        "piTerminalId": terminalId,
        "piAcceptUserId": acceptUser,
        "piAddUserId": addUser,
        "piRequestUserId": requestUser,
    };
    var jsonString = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/SmStaffAddRequest/SmStaffAddRequest/StaffAddAccept/',
        data: jsonString,
        async: false,
        success: function (serverResponse) {
            console.log(serverResponse);
            var func1 = "commonscript.dialogclose();";
            var func2 = "commonscript.dialogclose();";
            var func3 = "commonscript.dialogclose();";
            if (serverResponse.ErrorHandle == 0) {
                commonscript.makeDialogDiv("CmMessageEntry", serverResponse.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();
                
                messageAppend.updateProcessFlg();
            } else if (serverResponse.ErrorHandle == 2) {
                commonscript.makeDialogDiv("CmMessageEntry", serverResponse.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();

                messageAppend.updateProcessFlg();
            } else {
                // 承認エラー
                commonscript.makeDialogDiv("CmMessageEntry", serverResponse.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();
            }
        },
        error: function () {
            console.log("DB接続エラー");
        }
    });
}
/**************************************************************** 
* 編　集：[ 機能追加：在宅カルテ　職員登録依頼対応] 2018-11 池田 Add
* 機　能：関連処理フラグ更新
* 引　数：
* 戻り値：なし
****************************************************************/
messageAppend.updateProcessFlg = function () {
    var ret = false;
    var data = {
        "messageNo": messageAppend.messageNo,
        "processSeq": 1,
        "processFlg": 1,
        "processKey": ""
    };
    var jsonString = JSON.stringify(data);
    response = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageView/CmMessageView/UpdateProcessFlg/',
        data: jsonString,
        async: false,
    });
    if (response.status == 200) {
        // 成功の場合
        var retVal = JSON.parse(response.responseText);
        if (retVal == 1) {
            ret = true;
        }
    } else {
        console.log('Error:messageAppend.updateProcessFlg()')
    }
    return ret;
}

// [ 京都（カスタマイズ）：メッセージ関連処理からYahgee文書起動対応] 2019-10 立山 Add S
/**************************************************************** 
* 編　集：2019.10.12 S.Tateyama Add
* 機　能：外部文書情報取得
* 引　数：piDocumentNo:文書番号
* 戻り値：result:外部文書情報
****************************************************************/
messageAppend.GetDocInfoExternal = function (piDocumentNo) {
    var serverUrlString = "/CmMessageEntry/MessageEntry/GetDocInfoExternal";
    var jsonString = ""

    var sessionId = commonscript.getCookieItem("LoginSId");
    var terminalId = commonscript.getCookieItem("TerminalId");

    var data = {
        piTerminalId: terminalId,
        piSessionId: sessionId,
        piModuleName: "CmMessageEntry",
        piDocNo: piDocumentNo
    };

    jsonString = JSON.stringify(data);

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: serverUrlString,
        data: jsonString,
        async: false
    }).responseText;
    return JSON.parse(result);
}
// [ 京都（カスタマイズ）：メッセージ関連処理からYahgee文書起動対応] 2019-10 立山 Add E
