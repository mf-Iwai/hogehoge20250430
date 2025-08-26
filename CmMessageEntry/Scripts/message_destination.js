var messageDestination = {};

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//・コールバック関数：getMessageDestinationResult(piArrayList, piAddressInfo)
//      piArrayList:宛先情報
//          AddressGroupClass : 宛先グループ種別
//          AddressGroupId    : 宛先グループID
//          AddressGroupName  : 宛先グループ名称
//          DispName          : 表示名称
//      piAddressInfo: 宛先グループ種別^宛先グループID^宛先グループ名称のパイプ（"|"）区切り
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

messageDestination.deviceType = "";

messageDestination.selectListItems = {};        //宛先グループ詳細情報（宛先グループ種別^宛先グループID）
messageDestination.activeSearchFunction = "";   //現在検索中の機能

$(function () {

    //Html5のPostMessageの受付
    window.addEventListener("message", messageDestination.receiveMessage, false);

    var selectList = "";

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString("CmMessageEntry", strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            selectList = objArgument["SelectList"];
        }
    }

    // ユーザ情報取得
    messageDestination.deviceType = commonscript.getCookieItem("DeviceType");

    // クリア
    messageDestination.clear();

    // リスト初期表示
    if ((commonscript.NullChk(selectList)) && (selectList != "")) {
        var dispList = selectList.split("|");
        for (var i = 0; i < dispList.length; i++) {
            var addressInfo = dispList[i].split("^");
            var addressGroupClass = addressInfo[0];
            var addressGroupId = addressInfo[1];
            var addressGroupName = addressInfo[2];
            messageDestination.addListItem(addressGroupClass, addressGroupId, addressGroupName);
        }
    }
    

});

/**************************************************************** 
* 編　集： 2016.08.23 M.Matsuo Add
* 機　能： 【Html5】PostMessage受信
* 引　数： メッセージ
* 戻り値： なし
****************************************************************/
messageDestination.receiveMessage = function (event) {

    var data = event.data;

    if ("refreshMyGroupEdit" == data.message) {
        // 自分の子画面（マイグループ選択）へ伝送
        commonscript.postMessageToAllFrame(data);
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
* 機　能： クリア
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageDestination.clear = function () {
    //リストクリア
    $("#selectList > li").remove();
    //選択値リスト退避用配列クリア
    messageDestination.selectListItems = {};
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 閉じる
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageDestination.close = function () {
    if (window == parent) {
        //単独起動した場合
        commonscript.exitProgram();
    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [職員検索]ボタンクリックイベント
****************************************************************/
messageDestination.onClickStaffSearch = function () {
    //職員検索画面起動
    if ((messageDestination.deviceType == 4) || (messageDestination.deviceType == 6)) {
        messageCommon.openStaffSearch("", 99, "MessageDestination");
    } else {
        //（当画面[宛先選択]の呼出元から起動する。）
        parent.openStaffSearchForMessageDestination("");
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
            messageDestination.addListItem(messageCommon.addressGroupClass.Personal,
                                           staffId,
                                           staffName);
        }
    }

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [マイグループ]ボタンクリックイベント
****************************************************************/
messageDestination.onClickMyGroup = function () {
    messageDestination.activeSearchFunction = "MyGroup";
    messageCommon.openGroupSelection(messageCommon.addressGroupClass.Personal, 1);
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [共通グループ]ボタンクリックイベント
****************************************************************/
messageDestination.onClickCommonGroup = function () {
    messageDestination.activeSearchFunction = "CmGroup";
    messageCommon.openGroupSelection(messageCommon.addressGroupClass.Common, 0);
}

    /**************************************************************** 
    * 機　能： グループ選択戻り処理(共通callback関数)
    * 引　数： piArrayResult:グループ選択画面で選択した値（Array）
    ****************************************************************/
    function getAddressGroupSelectionResult(piArrayResult) {

        for (var i = 0; i < piArrayResult.length; i++) {

            if (messageDestination.activeSearchFunction == "MyGroup") {

                //【マイグループ】
                var addresssGroupId = piArrayResult[i].AddresssGroupId;

                //マイグループの詳細を取得し、リストへ追加
                var list = messageCommon.getAddressGroupDetailList(addresssGroupId);
                if (list == "ERR") {
                    continue;
                }

                for (var i = 0; i < list.length; i++) {

                    var addressGroupClass = list[i].AddressGroupClass;
                    var addressGroupId = "";
                    var addressGroupName = "";

                    if ((list[i].ItemClass.length > 0) && (list[i].ItemCode.length > 0)) {
                        addressGroupId = list[i].ItemClass + "," + list[i].ItemCode;
                        addressGroupName = list[i].ItemClassName + "," + list[i].ItemCodeName;
                    } else if (list[i].ItemClass.length > 0) {
                        addressGroupId = list[i].ItemClass;
                        addressGroupName = list[i].ItemClassName;
                    } else if (list[i].ItemCode.length > 0) {
                        addressGroupId = list[i].ItemCode;
                        addressGroupName = list[i].ItemCodeName;
                    }
                    // 医師or看護師の場合、頭に職種名を付与する
                    if (addressGroupClass == messageCommon.addressGroupClass.Doctor) {
                        addressGroupName = "医師," + addressGroupName;
                    } else if (addressGroupClass == messageCommon.addressGroupClass.Nurse) {
                        addressGroupName = "看護師," + addressGroupName;
                    }

                    messageDestination.addListItem(list[i].AddressGroupClass,
                                                   addressGroupId,
                                                   addressGroupName);
                }


            } else if (messageDestination.activeSearchFunction == "CmGroup") {

                //【共通グループ】

                //共通グループの選択値をリストへ追加
                messageDestination.addListItem(messageCommon.addressGroupClass.Common,
                                               piArrayResult[i].AddresssGroupId,
                                               piArrayResult[i].AddresssGroupName);
            }
        }
    }

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [医師]ボタンクリックイベント
****************************************************************/
messageDestination.onClickDoctor = function () {
    messageCommon.openGeneralSearch("MessageCommon", "Department");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [看護師]ボタンクリックイベント
****************************************************************/
messageDestination.onClickNurse = function () {
    messageCommon.openGeneralSearch("MessageCommon", "AssignPost");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [その他]ボタンクリックイベント
****************************************************************/
messageDestination.onClickOther = function () {
    messageCommon.openGeneralSearch("MessageCommon", "OtherCreatorLicense");
}

    /**************************************************************** 
    * 機　能： 汎用検索戻り処理(共通callback関数)
    * 引　数： piArrayResult:汎用検索で選択した値（Array）
    * 戻り値： なし
    ****************************************************************/
    function getGeneralSearchResult(piClassName, piClassificationCode, piArrayResult) {

        for (var i = 0; i < piArrayResult.length; i++) {

            if ((piClassName == "MessageCommon") && (piClassificationCode == "Department")) {
                //医師（診療科）リスト追加
                messageDestination.addListItem(messageCommon.addressGroupClass.Doctor,
                                               piArrayResult[i].ItemCode,
                                               "医師," + piArrayResult[i].ItemName);

            } else if ((piClassName == "MessageCommon") && (piClassificationCode == "AssignPost")) {
                //看護師（所属部署）リスト追加
                messageDestination.addListItem(messageCommon.addressGroupClass.Nurse,
                                               piArrayResult[i].ItemCode,
                                               "看護師," + piArrayResult[i].ItemName);

            } else if ((piClassName == "MessageCommon") && (piClassificationCode == "OtherCreatorLicense")) {
                //その他（職種）リスト追加
                messageDestination.addListItem(messageCommon.addressGroupClass.Other,
                                               piArrayResult[i].ItemCode,
                                               piArrayResult[i].ItemName);
                

            }
        }
    }

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [自分]ボタンクリックイベント
****************************************************************/
messageDestination.onClickMe = function () {
    messageDestination.addListItem(messageCommon.addressGroupClass.Other,
                                   messageCommon.addressGroupClassOtherItemClass.Oneself,
                                   "自分");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [マイグループ登録]ボタンクリックイベント
****************************************************************/
messageDestination.onClickMyGroupEntry = function () {

    //選択リストが０件の場合は処理しない
    if ($('ul#selectList li').length == 0) {
        //[ 障害対応：メッセージ宛先選択画面　マイグループ登録ボタンをクリックた場合のメッセージ対応] 2017-04 岩切 Add S
        commonscript.dispMessage("CmMessageEntry", "CmMessage", 14, "", "commonscript.dialogclose();", "", "");
        //[ 障害対応：メッセージ宛先選択画面　マイグループ登録ボタンをクリックた場合のメッセージ対応] 2017-04 岩切 Add E

        return;
    }

    //[マイグループ登録画面]ポップアップ起動
    var Title = "マイグループ登録";
    commonscript.openPopUp("/CmMessageEntry/MyGroup/MyGroupRegister", Title, "", 350, 280, "commonscript.popupclose()");
}
function getMyGroupRegisterResult(myGroupName) {

    var detailInfoList = new Array;

    //表示リストをループ
    $('ul#selectList li').each(function () {

        var addressGroupClass = $(this).attr('data-addressgroupclass');
        var addressGroupId = $(this).attr('data-addressgroupid');
        var addressGroupName = $(this).attr('data-addressgroupname');

        //宛先グループマスタの詳細情報を生成（宛先ｸﾞﾙｰﾌﾟ種別^項目分類^項目ｺｰﾄﾞ）
        var itemClass = "";
        var itemCode = "";
        if (addressGroupClass == messageCommon.addressGroupClass.MedicalGroup) {
            //3:
            aryAddressGroupId = addressGroupId.split(',');
            itemClass = aryAddressGroupId[0];
            itemCode = aryAddressGroupId[1];
        } else if ((addressGroupClass == messageCommon.addressGroupClass.Personal)
            || (addressGroupClass == messageCommon.addressGroupClass.Doctor)
            || (addressGroupClass == messageCommon.addressGroupClass.Nurse)) {
            itemCode = addressGroupId;
            //2:4:5
        } else if (addressGroupClass == messageCommon.addressGroupClass.Other) {
            //6:
            if ((addressGroupId == messageCommon.addressGroupClassOtherItemClass.Oneself) 
                || (addressGroupId == messageCommon.addressGroupClassOtherItemClass.Everyone)) {
                //
                itemClass = addressGroupId;
            } else {
                //職種
                itemCode = addressGroupId;
            }
        } else {
            itemClass = addressGroupId;
        }

        detailInfoList.push(addressGroupClass + "^" + itemClass + "^" + itemCode);
    });

    //宛先グループマスタ保存
    messageCommon.setAddressGroup("", myGroupName, "", detailInfoList);
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [OK]ボタンクリックイベント
****************************************************************/
messageDestination.select = function () {
    
    var result = new Array;
    var addressInfo = "";

    //表示リストをループ
    $('ul#selectList li').each(function () {

        var addressGroupClass = $(this).attr('data-addressgroupclass');
        var addressGroupId = $(this).attr('data-addressgroupid');
        var addressGroupName = $(this).attr('data-addressgroupname');

        //戻り値配列に挿入
        result.push({
            AddressGroupClass: $(this).attr('data-addressgroupclass'),
            AddressGroupId: $(this).attr('data-addressgroupid'),
            AddressGroupName: $(this).attr('data-addressgroupname'),
            DispName: $(this).text(),
            AddressInfo: $(this).attr('data-addressinfo')
        });

        if (addressInfo == "") {
            addressInfo = addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
        } else {
            addressInfo = addressInfo + "|" + addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
        }
        
    });

    //呼出元コールバック
    parent.getMessageDestinationResult(result, addressInfo);
    //閉じる
    messageDestination.close();

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： リスト項目追加
* 引　数： addressGroupClass 宛先グループ種別[1:共通 2:個人 3:診療Gr 4:医師 5:看護師 6:その他]
*          addressGroupId    宛先グループID
*          addressGroupName  宛先グループ名称
****************************************************************/
messageDestination.addListItem = function (addressGroupClass, addressGroupId, addressGroupName) {


    // 設定例）宛先グループ種別 / 宛先グループID / 宛先グループ名 : 表示名称

    //  共通　）1 / 00000    / 全職員            : 
    //  個人　）2 / SYS19    / 医師　太郎        : 
    //  診療Gr）3 / 001,001  / 禁煙外来,第１内科 : 禁煙外来（第一内科）
    //  医師　）4 / 001      / 医師,第１内科     : 医師（第一内科）
    //  看護師）5 / 01E      / 看護師,１階東病棟 : 看護師（１階東病棟）
    //  その他）6 / Oneself  / 自分              : 
    //  その他）6 / Everyone / 全員              : 
    //  その他）6 / 34       / 薬剤師            : 

    // リストID
    var id = addressGroupClass + "_" + addressGroupId;
    if (messageDestination.selectListItems[id] != null) {
        // 既に選択中の項目はリストへ追加しない
        return;
    }

    //宛先情報 (宛先グループ種別^宛先グループID)
    //※呼び元に返却する値
    var addressInfo = addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;

    //↓↓↓ 動的に作成する要素イメージ ↓↓↓
    //<li>
    //  <input type="checkbox" class="floatLeft" id="chk001" data-id="001">
    //    <span>看護師長グループ</span>
    //    <span class="delete_icon"></span>
    //</li>

    
    // 表示名称
    var dispName = addressGroupName;
    if ((addressGroupClass == 3) || (addressGroupClass == 4) || (addressGroupClass == 5)) {
        var aryAddressGroupName = addressGroupName.split(',');
        dispName = aryAddressGroupName[0] + "（" + aryAddressGroupName[1] + "）";
    }

    // --- アイテム項目作成 START --------------------

    //LI要素作成
    var list = document.createElement('li');
    list.setAttribute("id", id);
    list.setAttribute("data-addressinfo", addressInfo);
    list.setAttribute("data-addressgroupclass", addressGroupClass);
    list.setAttribute("data-addressgroupid", addressGroupId);
    list.setAttribute("data-addressgroupname", addressGroupName);
    list.setAttribute("data-dispname", dispName);

    //SPAN①要素作成
    span = document.createElement('span');
    span.innerHTML = dispName;
    list.appendChild(span);     //LISTへ追加

    //SPAN②要素作成
    span = document.createElement('span');
    span.setAttribute("class", "delete_icon");
    span.setAttribute("onclick", "messageDestination.deleteListItem('" + id + "');");
    list.appendChild(span);     //LISTへ追加

    // --- アイテム項目作成 END ----------------------

    // UL要素へ追加
    var ulElem = document.getElementById("selectList");
    ulElem.appendChild(list);

    // 選択値リストへ退避
    messageDestination.selectListItems[id] = dispName;
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： リスト項目削除
****************************************************************/
messageDestination.deleteListItem = function (id) {

    //選択値リストより対象のキーを削除
    delete messageDestination.selectListItems[id];

    //表示リストから削除
    $("#" + id).remove();

}


