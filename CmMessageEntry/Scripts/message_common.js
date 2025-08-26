var messageCommon = {};

// 有効期限
messageCommon.expirationDateClass = {
    Indefinite: 0,
    Relative: 2,
    Designation : 1
}

// 宛先グループ種別
messageCommon.addressGroupClass = {
    Common: 1,
    Personal: 2,
    MedicalGroup: 3,
    Doctor: 4,
    Nurse: 5,
    Other: 6,
    Board: 7            // [ 病院版対応：連絡板対応] 2017-10 福元　Add
}

// 
messageCommon.addressGroupClassOtherItemClass = {
    Oneself: "Oneself",
    Everyone: "Everyone"
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [職員検索]画面起動
* 引　数： selectedUserId   選択済み職員の利用者IDをセミコロン区切りにて渡す
*          selectCount      最大職員選択数
*          callFlg          予備元判別用（渡した値を選択結果として返される）
****************************************************************/
messageCommon.openStaffSearch = function (selectedUserId, selectCount, callFlg) {
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
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [共通グループ][マイグループ]選択リスト画面起動
* 引　数： addressGroupClass 宛先グループ種別（1:共通 2:個人）
*          editLinkDispMode  選択リストから編集画面へのリンクを表示する場合1
****************************************************************/
messageCommon.openGroupSelection = function (addressGroupClass, editLinkDispMode) {
    var objdata = new Object();
    objdata["DeviceType"] = commonscript.getCookieItem("DeviceType");
    objdata["AddressGroupClass"] = addressGroupClass;
    objdata["EditLinkDispMode"] = editLinkDispMode;
    var encryptQueryString = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
    var Title = "";
    if (addressGroupClass == messageCommon.addressGroupClass.Common) {
        Title = "共通グループ";
    } else if (addressGroupClass == messageCommon.addressGroupClass.Personal) {
        Title = "マイグループ";
    }
    //グループ選択リスト
    commonscript.openPopUp("/CmMessageEntry/MyGroup/MyGroupSelection", Title, encryptQueryString, 350, 500, "commonscript.popupclose()");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 汎用検索画面起動
****************************************************************/
messageCommon.openGeneralSearch = function (searchClassName, searchClassificationCode) {

    var lstParameter = new Array();
    var lstPrivateParameter = new Array();

    //汎用検索固定パラメータリストの設定
    lstParameter.push("Top");   //1:階層コード（未指定時=TOP）
    lstParameter.push("");      //2:基準日
    lstParameter.push("");      //3:検索文字列
    //4:既選択項目   strCode.split(";");
    //var arraySelectedPara = new Array();
    //if (commonscript.NullChk(strCode)) {
    //    arraySelectedPara = strCode.split(";");
    //}
    //lstParameter.push(arraySelectedPara);
    lstParameter.push("");

    //固有パラメータリストの設定
    if (searchClassificationCode == "AssignPost") {

        strUseHistoryKey = searchClassName + "AssignPost";
        strTabLabel = "所属部署";

        lstPrivateParameter.push("1");          //部署区分（1:部署 2:診療科）
        lstPrivateParameter.push("99999999");   //有効終了日

    } else if (searchClassificationCode == "Department") {

        strUseHistoryKey = searchClassName + "Department";
        strTabLabel = "診療科";

        lstPrivateParameter.push("2");          //部署区分（1:部署 2:診療科）
        lstPrivateParameter.push("99999999");   //有効終了日

    } else if (searchClassificationCode == "OtherCreatorLicense") {

        strUseHistoryKey = searchClassName + "OtherCreatorLicense";
        strTabLabel = "職種";

    } else if (searchClassificationCode == "OrderType") {

        strUseHistoryKey = searchClassName + "OrderType";
        strTabLabel = "オーダ種別";

        lstPrivateParameter.push("0");
        lstPrivateParameter.push("");
        lstPrivateParameter.push("");
        lstPrivateParameter.push("");
        

    } else if (searchClassificationCode == "DocumentType") {

        strUseHistoryKey = searchClassName + "DocumentType";
        strTabLabel = "文書種別";

        //: 1:モード(0:文書種別 1:オーダ紐づけ文書 2:スキャナ文書 3:OV用文書種別 4:記録シート対象文書)
		//: 2:入外区分
        //: 3:オーダ種別
        //: 4:新規区分
        //: 5:ユーザーID
        //: 6:診療科

        //[ 障害対応(No.2030)：メッセージ関連文書検索不具合対応] 2020-06 小牟田 Mod S
        //lstPrivateParameter.push("0");
        //モードを3:OV用文書種別に設定
        lstPrivateParameter.push("3");
        //[ 障害対応(No.2030)：メッセージ関連文書検索不具合対応] 2020-06 小牟田 Mod E

        lstPrivateParameter.push("");
        lstPrivateParameter.push("");

        //[ 障害対応(No.2030)：メッセージ関連文書検索不具合対応] 2020-06 小牟田 Mod S
        //lstPrivateParameter.push("0");
        //新規区分を1に設定
        lstPrivateParameter.push("1");
        //[ 障害対応(No.2030)：メッセージ関連文書検索不具合対応] 2020-06 小牟田 Mod E

        lstPrivateParameter.push("");
        lstPrivateParameter.push("");

    }

    CmGeneralSearchSetting.Init(searchClassName, searchClassificationCode, lstParameter, lstPrivateParameter, strUseHistoryKey, "1", strTitle, 0, "9");
    CmGeneralSearchSetting.settingDispColumn("SEQ", "", "False", "");
    CmGeneralSearchSetting.settingDispColumn("LevelItemCode", "", "False", "");
    CmGeneralSearchSetting.settingDispColumn("ItemCode", "", "False", "");
    CmGeneralSearchSetting.settingDispColumn("ItemName", "", "True", "");

    var strURL = "/CmGeneralSearch/GeneralSearch/GeneralSearch";
    var strTitle = strTabLabel;
    var stroptioninfo = "";
    var intWidth = 450;
    var intHeight = 700;
    var strCloseFunc = "";
    commonscript.openPopUp(strURL, strTitle, stroptioninfo, intWidth, intHeight, strCloseFunc);
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 宛先ｸﾞﾙｰﾌﾟ詳細情報取得
****************************************************************/
messageCommon.getAddressGroupDetailList = function (addressGroupId) {
    var data = {
        "addressGroupId": addressGroupId
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/GetAddressGroupDetailList/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if ((serverResponse == null) || (serverResponse.length == 0)) {
        //データなし
        serverResponse = "ERR";
    } else if (serverResponse[0].LoginCheckResult.ErrorHandle > 0) {
        //エラー
        //ボタン押下時の処理を記述
        func1 = 'commonscript.dialogclose();';
        func2 = '';
        func3 = '';
        //ポップアップダイアログの表示
        commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
        commonscript.opendialog();
        serverResponse = "ERR";
    }

    return serverResponse;
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 宛先ｸﾞﾙｰﾌﾟﾏｽﾀ保存
* 引　数： addressGroupId   　宛先グループID(新規登録時はブランク)     
*          addressGroupName   宛先グループ名称   
*          dispNo             表示順（新規登録時はブランク）
*          detailInfoList     詳細情報リスト配列（宛先グループ種別^項目分類^項目コード）  
****************************************************************/
messageCommon.setAddressGroup = function (addressGroupId, addressGroupName, dispNo, detailInfoList) {

    // ★ 詳細情報は、各項目を「^」区切り、各レコードを「|」区切りで設定する
    detailInfo = detailInfoList.join("|");

    var data = {
        "addressGroupId": addressGroupId,
        "addressGroupName": addressGroupName,
        "addressGroupClass": 2,
        "dispNo": dispNo,
        "detailInfo": detailInfo
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/SetAddressGroup/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if (serverResponse != 1) {
        //エラー
        commonscript.dispMessage("CmMessageEntry", "WebFunction", 1, "宛先ｸﾞﾙｰﾌﾟﾏｽﾀ保存（setAddressGroup）", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    return true;
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 宛先ｸﾞﾙｰﾌﾟﾏｽﾀ削除
* 引　数： addressGroupId   　宛先グループID(新規登録時はブランク)     
*          addressGroupName   宛先グループ名称     
*          detailInfoList     詳細情報リスト配列（宛先グループ種別^項目分類^項目コード）  
****************************************************************/
messageCommon.deleteAddressGroup = function (addressGroupId) {

    var data = {
        "addressGroupId": addressGroupId
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/DeleteAddressGroup/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if (serverResponse != 1) {
        //エラー
        commonscript.dispMessage("CmMessageEntry", "WebFunction", 1, "宛先ｸﾞﾙｰﾌﾟﾏｽﾀ保存（deleteAddressGroup）", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    return true;

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 部署マスタ情報取得
****************************************************************/
messageCommon.getPostDataList = function (moduleName, postClass) {

    var data = {
        "moduleName": moduleName,
        "startRow": 1,
        "postClass": postClass
    };
    var jsonString = JSON.stringify(data);

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetPost/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if ((serverResponse == null) || (serverResponse.length == 0)) {
        //データなし
        serverResponse = "ERR";
    } else if (serverResponse[0].LoginCheckResult.ErrorHandle > 0) {
        //エラー
        //ボタン押下時の処理を記述
        func1 = 'commonscript.dialogclose();';
        func2 = '';
        func3 = '';
        //ポップアップダイアログの表示
        commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
        commonscript.opendialog();
        serverResponse = "ERR";
    }

    return serverResponse;
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 関連情報項目名称取得
****************************************************************/
messageCommon.getProcessListItemName = function (
    activityType, activityTypeName,
    medicalDataType, medicalDataTypeName,
    derivationClass, derivationKey, derivationKeyName) {

    //表示名称生成
    var dispName = ""
    if (derivationClass == 1) {
        dispName = activityTypeName + "（新規）：" + medicalDataTypeName;
        //[ 機能追加：在宅カルテ　職員登録依頼対応] 2018-11 池田 Add S
        if (activityType == 10) {
            console.log(medicalDataTypeName + ":" + derivationKeyName);
            dispName = dispName + "【" + derivationKeyName + "】";
        }
        //[ 機能追加：在宅カルテ　職員登録依頼対応] 2018-11 池田 Add E
    } else if (derivationClass == 2) {
        dispName = activityTypeName + "（スタンプ）：" + derivationKeyName;
    } else if (derivationClass == 3) {
        dispName = activityTypeName + "（患者）：" + derivationKeyName;
    }

    return dispName;

}