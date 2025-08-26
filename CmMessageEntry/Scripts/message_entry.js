var messageEntry = {};

messageEntry.myPrjId = "CmMessageEntry";
messageEntry.myPrgId = "MessageEntry";

messageEntry.stampFormId = 5;

messageEntry.deviceType = "";
messageEntry.userId = "";
messageEntry.userName = "";
messageEntry.mobileMode = 0;

// 画面起動パラメータ
messageEntry.stampEditMode = 0          // スタンプ編集モード (2:オーダ・文書予約登録)
messageEntry.startClass = "1";          // メッセージ起動区分【 1:標準版 2:簡易版 】
messageEntry.replyClass = "0";          // メッセージ返信区分【 0:返信対象外 1:返信(引用なし) 2:返信(引用有り) 3:転送 】
messageEntry.patientId = "";            // 患者ID
messageEntry.patientName = "";          // 患者名
messageEntry.addressGroupClass = "";    // 宛先グループ種別(複数指定時は、||区切り)
messageEntry.addressGroupId = "";       // 宛先グループID(複数指定時は、||区切り)
messageEntry.addressGroupName = "";     // 宛先グループ名(複数指定時は、||区切り)
messageEntry.messageNo = "";            // 【返信転送の場合のみ】引用元メッセージのメッセージ番号
messageEntry.subject = "";              // 核心的内容
messageEntry.bodyText = "";             // 本文
messageEntry.activityType = "";         // アクティビティ種別【1:オーダ 2:タスク 3:文書 7:DPC】
messageEntry.medicalDataType = "";      // 診療データ種別【1:オーダの場合オーダ種別、2:文書の場合、文書種別
//[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.S
messageEntry.medicalDataTypeName = ""   // 診療データ種別名称
//[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.E
messageEntry.derivationClass = "";      // 由来区分【1:新規作成 2:スタンプ 3:患者データ】
messageEntry.derivationKey = "";        // 由来キー【1:オーダの場合オーダ番号を設定、2:文書の場合、文書番号　7:DPCの場合、DPCキー番号】
messageEntry.derivationKeyName = "";    // 由来キー名称
messageEntry.modFlg = "1";              // 修正起動フラグ 1:修正 その他:新規　※オーダ・文書予約登録で使用
messageEntry.relativeDate = "";         // 相対日(YYYY/MM/DD)
messageEntry.departmentCode = "";       // 診療科コード　　※オーダ編集からのメッセージ設定で使用
messageEntry.enforcedInfoUserId = "";   // 実施予定者ID　　※オーダ編集からのメッセージ設定で使用

messageEntry.inputUserId = "";
messageEntry.inputUserName = "";
messageEntry.inputPatientId = "";
messageEntry.inputImportance = "1";
messageEntry.inputExpirationDateClass = "";
messageEntry.inputRelativeDateCode = "";
messageEntry.inputRelativeDate = "";
messageEntry.inputReadRequestFlg = "0";

//DBより取得した相対日付ﾏｽﾀデータオブジェクト
messageEntry.objRelativeDateListFromDB = {};
//DBより取得した相対日付ﾏｽﾀデータを相対日付ｺｰﾄﾞをキーに保持するオブジェクト
messageEntry.objRelativeDateList = {};
messageEntry.lastSelectedCalculatedClass = "";

messageEntry.objSelectedAppendInfo = {};            //選択された関連情報
messageEntry.selectedAddressInfo = "";       //選択された宛先情報(宛先グループ種別^宛先グループID^宛先グループ名称)

messageEntry.copyStr = "";
messageEntry.stampStr = "";

messageEntry.registStampType = "";

//[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add S
//在宅モード取得 1:在宅モード
messageEntry.zaitakuMode = "0";
//[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add E

//[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add S
messageEntry.limitStartDateDispFlg = "0"; //表示開始日設定フラグ(1:表示開始日を表示する、0:表示しない)
//[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add E

$(function () {

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add S
    //環境変数のlimitStartDateをvbhtml側から取得する
    messageEntry.limitStartDateDispFlg = document.getElementById("hdnLimitStartDateDispFlg").value;
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add E
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString(messageEntry.myPrjId, strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            messageEntry.stampEditMode = commonscript.onNullDef(objArgument["StampEditMode"], 0);
            messageEntry.startClass = objArgument["StartClass"];
            messageEntry.replyClass = objArgument["ReplyClass"];
            messageEntry.patientId = objArgument["PatientId"];
            var patientInfo = commonscript.getPatientBasicInfo(messageEntry.myPrjId, messageEntry.patientId);
            if (commonscript.NullChk(patientInfo)) {
                messageEntry.patientName = patientInfo.PatientKanjiName;
            }
            messageEntry.addressGroupClass = commonscript.onNullDef(objArgument["AddressGroupClass"], "");
            messageEntry.addressGroupId = commonscript.onNullDef(objArgument["AddressGroupId"], "");
            messageEntry.addressGroupName = commonscript.onNullDef(objArgument["AddressGroupName"], "");
            messageEntry.messageNo = objArgument["MessageNo"];
            messageEntry.subject = commonscript.onNullDef(objArgument["Subject"], "");
            messageEntry.bodyText = commonscript.onNullDef(objArgument["BodyText"], "");
            messageEntry.activityType = objArgument["ActivityType"];
            messageEntry.medicalDataType = objArgument["MedicalDataType"];
            //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.S
            messageEntry.medicalDataTypeName = commonscript.onNullDef(objArgument["MedicalDataTypeName"], "");
            //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.E
            messageEntry.derivationClass = objArgument["DerivationClass"];
            messageEntry.derivationKey = objArgument["DerivationKey"];
            messageEntry.derivationKeyName = objArgument["DerivationKeyName"];
            messageEntry.modFlg = objArgument["ModFlg"];
            messageEntry.relativeDate = commonscript.onNullDef(objArgument["RelativeDate"], "");
            messageEntry.departmentCode = commonscript.onNullDef(objArgument["DepartmentCode"], "");
            messageEntry.enforcedInfoUserId = commonscript.onNullDef(objArgument["EnforcedInfoUserId"], "");
        }
    }
    messageEntry.mobileMode = document.getElementById("MobileMode").value;

    if (commonscript.getNativeMode() == 1) {
        // CloseFlgを0: 終了拒否に変更
        window.top.calledJS.changeCloseFlg("0");
    }

    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add S
    //在宅モード取得
    //環境設定マスタ取得
    messageEntry.zaitakuMode = commonscript.getEnviromentSetUp("CmPatientInfo", "Cm", "Zaitaku", "Settings", "Mode", "1")
    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add E
    //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.S
    //患者選択・切り替え時に患者ロック情報を書き込む
    if (commonscript.getNativeMode() == 1) {
        var lockResult = commonscript.lockPatientData([commonscript.getCookieItem("LoginSId"),
                                       messageEntry.myPrjId,
                                       commonscript.getCookieItem("TerminalId"),
                                       commonscript.getCookieItem("UserId"),
                                       "^CmMessageEntry",
                                       "Patient",
                                       messageEntry.patientId]);
        if (lockResult != "1") {
            //患者が選択された場合は処理を終える
            commonscript.dispMessage(messageEntry.myPrjId, "CmPatientIdConversion", "21", "", "window.top.calledJS.changeCloseFlg('1');window.top.calledJS.closeWindow();", "", "", "");
        }
    }
    //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.E

    // クッキーから情報取得
    messageEntry.deviceType = commonscript.getCookieItem("DeviceType");
    messageEntry.userId = commonscript.getCookieItem("UserId");
    messageEntry.userName = commonscript.getCookieItem("UserName");

    // 画面初期化
    messageEntry.clear();
    messageEntry.init(messageEntry.replyClass);

    //相対日付リスト設定
    messageEntry.setRelativeDateList();

    //スタンプボックス表示
    if (messageEntry.stampEditMode == 1) {
        $("#right_content").hide();
        $(".pInputUser").hide();
        $(".pPatientInfo").hide();
        $(".itemSaveStamp").hide();
        $(".itemSend").hide();
        $(".itemTemp").hide();  //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add
        $(".itemWkSave").hide();
        $(".itemWkDelete").hide();
        editPageLayout();
        messageEntry.developStampData(messageEntry.messageNo);
    //登録モード（オーダ・文書で使用）
    } else if (messageEntry.stampEditMode == 2) {
        $(".itemSaveStamp").hide();
        $(".itemSend").hide();
        $(".itemTemp").hide();  //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add
        $(".itemSave").hide();
        $("#radio_relative").hide();
        $("#radiolabel_relative").hide();
        $("#relation_info_box").hide();
        $("#relative_info_menu").hide();
        $('#designation_period').show();
        if (commonscript.NullChk(messageEntry.messageNo)){
            if (messageEntry.messageNo.length == 0) {
                $(".itemWkDelete").hide();
            }
        } else {
            $(".itemWkDelete").hide();
        }

        //2016.11.01 A.Fukumoto Add.S 障害対応：オーダ等から起動した場合は患者検索を無効化
        //スマートフォン？
        if ((messageEntry.deviceType == "4") || (messageEntry.deviceType == "6")) {
            $(".search_icon01").attr('disabled', true);
            $("#msgAttached_btn").hide();
        } else {
            //×ﾎﾞﾀﾝのｸﾘｯｸｲﾍﾞﾝﾄと表示を無くす
            $("#nameDel").removeAttr('onclick');
            $("#nameDel").attr('style', 'display:none');
            //患者検索のｸﾘｯｸｲﾍﾞﾝﾄを無くす
            $("#msgPatientName").removeAttr('onclick');
        }
        //2016.11.01 A.Fukumoto Add.E

        var strUrl = "/StStampBox/StStampBox/StStampBox"
        var objdata = new Object();
        objdata["StampForm"] = messageEntry.stampFormId;
        objdata["DevelopMode"] = "1";	//スタンプ展開モード（1:ドラッグ&ドロップ 　2:選択＋ボタン押下）
        objdata["DrilldownOnly"] = "0";	//ドリルダウン表示のみ
        var param = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
        $("#ifrmStampBox").attr("src", "/StStampBox/StStampBox/StStampBox?" + param);
        //登録済みデータ読みこみ
        messageEntry.loadWkData(messageEntry.messageNo);

    } else {
        $(".itemSave").hide();
        $(".itemWkSave").hide();
        $(".itemWkDelete").hide();
        var strUrl = "/StStampBox/StStampBox/StStampBox"
        var objdata = new Object();
        objdata["StampForm"] = messageEntry.stampFormId;
        objdata["DevelopMode"] = "1";	//スタンプ展開モード（1:ドラッグ&ドロップ 　2:選択＋ボタン押下）
        objdata["DrilldownOnly"] = "0";	//ドリルダウン表示のみ
        var param = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
        $("#ifrmStampBox").attr("src", "/StStampBox/StStampBox/StStampBox?" + param);
        //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add S
        if (messageEntry.modFlg == "1") {
            //登録済みデータ読みこみ
            messageEntry.loadData(messageEntry.messageNo);
        }
        //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add E
    }

    //イベント定義
    $(document).on("dragover", "div#left_content", function (e) { messageEntry.onDragover(e); });
    $(document).on("drop", "div#left_content", function (e) { messageEntry.onDrop(e); });
    //[ 障害対応：スタンプボックス>プロパティより、スタンプ管理名を変更後、リフレッシュされない] 2017-08 河原 Add.S
    //Html5のPostMessageの受付
    window.addEventListener("message", messageEntry.receiveMessage, false);
    //[ 障害対応：スタンプボックス>プロパティより、スタンプ管理名を変更後、リフレッシュされない] 2017-08 河原 Add.E

    //コンテキストメニュー(右クリック)
    var menuGroup = commonscript.getMenuContentByCategory(messageEntry.myPrjId, "CmMessageEntry");
    var objJsonContextMenuContent = messageEntry.parseJson(menuGroup);

    //コンテキストメニュー作成
    if ($(".context_menu").length > 0) {
        messageEntry.makeContextMenu(".context_menu", objJsonContextMenuContent["CmMessageEntryEdit"], "right");
    }

    // 画面入力項目編集チェック（開始）
    commonscript.modifyCheck("Start");

    //IME切り替え 20161102 E.Iwakiri Add
    commonscript.changeImeModeJapanese();



});

/**************************************************************** 
* 編　集： 2015.11.07 T.Kobayashi Mod
* 機　能： 画面レイアウト設定
          （画面幅を基準としてモバイル用とPC用の処理へ分岐）
* 引　数： なし
* 戻り値： なし
****************************************************************/
var loadFlg = false;
function editPageLayout() {

    // 画面の高さを取得して、変数wHに代入
    var wH = $(window).height();

    // ヘッダーの高さを取得
    var hH = $('#header').outerHeight(true);
    // フッターの高さを取得
    var fH = $('#msg_footer').outerHeight(true);
    var contentHeight = wH - (hH + fH);
    // #msg_containerに高さを加える
    $('#msg_container').css('height', contentHeight + 'px');

    // #message_boxのテキストエリアに高さを加える
    var contentHeight = $('#msg_container').outerHeight(true);
    var trmH = $('#tarms_box').outerHeight(true);
    var infoH = $('#relation_info_box').outerHeight(true);
    var msgH = contentHeight - (trmH + infoH + 98);
    $('#message_box textarea').css('height', msgH + 'px');

    // #left_contentに幅を加える
    var contentWidth = $('#msg_container').outerWidth(true);
    var rightW = $('#right_content').outerWidth(true);
    if (messageEntry.stampEditMode == 1) {
        rightW = 5;
    }
    var leftW = contentWidth - rightW;
    $('#left_content').css('width', leftW - 3 + 'px');

    // #relation_info_box: 幅調整
    var contentWidth = parseInt($('#relation_info_box').outerWidth(true));
    //var tW = parseInt($('.info_label').outerWidth(true)) + parseInt($('.relatedInfo').outerWidth(true)) + parseInt($('.relation_select_input').outerWidth(true));
    var tW = parseInt($('.info_label').outerWidth(true));
    var contentWidth = contentWidth - tW;
    $('#form_info').css('width', (contentWidth - 39) + 'px');
     
    // 初回読み込み時
    if (!loadFlg) {
        // ラジオボタン処理読込
        messageEntry.changeExpirationView();
        // プラグイン読み込み
        messageEntry.plugin();

        loadFlg = true;
    }

}

/**************************************************************** 
* 編　集： 2015.03.31 J.Kodama Add
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
* 編　集： 2015.10.15 S.Tateyama Add
* 機　能： Windowクローズイベント取得(カラ)
* 引　数： e:イベント
* 戻り値： なし
****************************************************************/
function closingWindow(e) {}

/**************************************************************** 
* 編　集： 2016.02.29 M.Matsuo Add
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
    messageEntry.closeForm();
}

/**************************************************************** 
* 編　集： 2016.02.29 M.Matsuo Add
* 機　能： 画面終了時処理
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.closeForm = function () {
    //入力項目の編集をチェックする　
    if (commonscript.modifyCheck("Check") == "1") {
        //変更有り
        commonscript.dispMessage("CmMessageEntry", "CmMessage", 4, "", "commonscript.dialogclose();messageEntry.closeFormOk('Cancel')", "commonscript.dialogclose();", "", "");
    } else {
        //変更無し
        messageEntry.closeFormOk('Cancel');
    }
}

/**************************************************************** 
* 編　集： 2016.02.29 M.Matsuo Add
* 機　能： 画面終了時処理（確認メッセージ：はい）
****************************************************************/
messageEntry.closeFormOk = function (result) {    

    //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.S
    if (commonscript.getNativeMode() == 1) {
        commonscript.unLockPatientData([commonscript.getCookieItem("LoginSId"),
                                       messageEntry.myPrjId,
                                       commonscript.getCookieItem("TerminalId"),
                                       commonscript.getCookieItem("UserId"),
                                       "^CmMessageEntry",
                                       "Patient",
                                       messageEntry.inputPatientId]);

    }
    //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.E
    //レイアウト保存
    //var otherinfo = "";
    //messageEntry.saveOtherLayout(otherinfo);

    if (window == parent) {
        // 単独起動した場合

        // [ 札幌ハートセンター：モバイルオーダ対応] 2020-06 立山 Mod S
        if (messageEntry.deviceType == 4) {
            var prgUrl = commonscript.getMapInfoMobile("CmMessageList_Url");
            commonscript.startProgram(messageEntry.myPrjId, messageEntry.myPrgId, "", "", prgUrl, "", "", "", "", "", "");
        } else {
            //親画面へメッセージ送信
            var message = "WindowClose_CmMessageEntry||" + result;
            calledJS.sendProgramMessage(message);

            //画面を閉じる
            calledJS.changeCloseFlg("1");
            commonscript.exitProgram();
        }
        // [ 札幌ハートセンター：モバイルオーダ対応] 2020-06 立山 Mod E

    } else {
        // ダイアログ表示した場合

        //呼出元コールバック
        if (typeof parent.getCmMessageEntryResult == "function") {
            parent.getCmMessageEntryResult(result);
        }

        //自身を閉じる
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
    
}

/**************************************************************** 
* 編　集： 2016.03.01 M.Matsuo Add
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

        //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.S
        //患者選択・切り替え時に患者ロック情報を書き込む
        if (commonscript.getNativeMode() == 1) {
            var lockResult = commonscript.lockPatientData([commonscript.getCookieItem("LoginSId"),
                                           messageEntry.myPrjId,
                                           commonscript.getCookieItem("TerminalId"),
                                           commonscript.getCookieItem("UserId"),
                                           "^CmMessageEntry",
                                           "Patient",
                                           aryMsg[1]]);
            if (lockResult != "1") {
                //患者が選択された場合は処理を終える
                commonscript.dispMessage(messageEntry.myPrjId, "CmPatientIdConversion", "21", "", "window.top.calledJS.changeCloseFlg('1');window.top.calledJS.closeWindow();", "", "", "");
            }
        }
        //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.E

        //2016.11.02 A.Fukumoto Add.S
        if ((messageEntry.objSelectedAppendInfo.length != 0) && (messageEntry.inputPatientId != aryMsg[1])) {
            //元の患者とIdが違う場合は元の患者に不随している関連情報を削除
            var arrayList = new Array;
            for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
                var list = messageEntry.objSelectedAppendInfo[i];
                //患者に付随する情報は除く（3:患者）
                if (list.DerivationClass == "3") { continue; }
                //戻り値配列に挿入
                arrayList.push({
                    ActivityType: list.ActivityType,
                    ActivityTypeName: list.ActivityTypeName,
                    MedicalDataType: list.MedicalDataType,
                    MedicalDataTypeName: list.MedicalDataTypeName,
                    DerivationClass: list.DerivationClass,
                    DerivationKey: list.DerivationKey,
                    DerivationKeyName: list.DerivationKeyName,
                    ItemName: list.ItemName
                });
            }
            // 関連情報選択のコールバック関数を使用して、関連情報を保持させる
            getMessageAppendResult(arrayList);
        }
        //2016.11.02 A.Fukumoto Add.E


        messageEntry.inputPatientId = aryMsg[1];
        $("#msgPatientName").text(aryMsg[5]);

    } else if (aryMsg[0] == "WindowClosing_MyGroupEdit") {
        //【マイグループ編集】画面クローズ
        var sendData = { message: "refreshMyGroupEdit" };
        commonscript.postMessageToAllFrame(sendData);
    }

}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 送信
****************************************************************/
messageEntry.sendMessage = function (draftFlg) {

    //メッセージ送信
    var ret = messageEntry.setMessageSendData(draftFlg);
    if (!ret) {
        return;
    }

    //画面を閉じる
    messageEntry.closeFormOk('OK');
}

/**************************************************************** 
* 編　集： 2015.12.01 T.Kobayashi Add
* 機　能： 有効期限のラジオボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.plugin = function () {
    // タブ
    $('#tab_menu').tab('tabScroll', {
        tabType: 2,
        speed: 60
    });
}

/**************************************************************** 
* 編　集： 2015.12.01 T.Kobayashi Add
* 機　能： 有効期限のラジオボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.changeExpirationView = function () {
    $('input[name=expiration_date]').change(function () {
        messageEntry.changeExpiration();
    }).trigger('change');
}
messageEntry.changeExpiration = function () {

    messageEntry.inputExpirationDateClass = $("input:radio[name='expiration_date']:checked").val();
    $('.radio_inr').hide();

    if ($("input:radio[name='expiration_date']:checked").val() == "0") {
        $('.radio_inr').hide('fast', function () {
            // メッセージ部リサイズ
            messageEntry.msgBoxResize();
        });
    } else if ($("input:radio[name='expiration_date']:checked").val() == "2") {
        //相対日付
        $('#relative_period').show('fast', function () {
            messageEntry.msgBoxResize();
        });
    } else if ($("input:radio[name='expiration_date']:checked").val() == "1") {
        //日付指定
        $('#designation_period').show('fast', function () {
            messageEntry.msgBoxResize();
        });
    }

}

/**************************************************************** 
* 編　集： 2015.12.01 T.Kobayashi Add
* 機　能： 有効期限のセレクトボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.changeSelectRelative = function () {
    var selectVal = $('#relative_period select').val();
    var selectCalculatedClass = messageEntry.objRelativeDateList[selectVal].CalculatedClass;
    if (messageEntry.lastSelectedCalculatedClass != selectCalculatedClass) {
        $('.relative_select_inr').css('display', 'none');
        if (selectCalculatedClass == 1) {
            $('.relative_select_inr').eq(1).fadeIn(200, function () {
                messageEntry.msgBoxResize();
            });
        } else {
            $('.relative_select_inr').eq(0).fadeIn(200, function () {
                // メッセージ部リサイズ
                messageEntry.msgBoxResize();
            });
        }
        messageEntry.lastSelectedCalculatedClass = selectCalculatedClass;
    }
    
}

/**************************************************************** 
* 編　集： 2015.12.01 T.Kobayashi Add
* 機　能： 関連情報のセレクトボタンボタン切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.changeSelectRelation = function () {
    var getSelectVal = $('#relation_info_box select').val();
    $('.relation_select_input').css('display', 'none');
    switch (getSelectVal) {
        case 'order':
            $('.relation_select_input').eq(0).css('display', 'inline-block');
            break;
        case 'document':
            $('.relation_select_input').eq(1).css('display', 'inline-block');
    }
}

/**************************************************************** 
* 編　集： 2015.12.2 T.Kobayashi Add
* 機　能： メッセージボックスのテキストエリアに高さを加える
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.msgBoxResize = function () {
    var contentHeight = $('#msg_container').outerHeight(true);
    var trmH = $('#tarms_box').outerHeight(true);
    var infoH = $('#relation_info_box').outerHeight(true);
    var msgH = contentHeight - (trmH + infoH + 98);
    $('#message_box textarea').animate({ 'height': msgH + 'px' }, 200, 'easeOutQuad');

}

/**************************************************************** 
* 編　集： 2015.11.05 T.Kobayashi Add
* 機　能： フォーム内の文字削除
* 引　数： 削除するフォームID
* 戻り値： なし
****************************************************************/
messageEntry.clearForm = function (frmId) {
    document.getElementById(frmId).value = ""
}


/**************************************************************** 
* 編　集： 2015.11.09 T.Kobayashi Add
* 機　能： 右メニュー収納処理
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.clickRHidden = function () {
    $('#right_content').css('width', '37px')
    $('#right_hidden').css('display', 'none')
    editPageLayout();
    messageEntry.msgBoxResize();
}

/**************************************************************** 
* 編　集： 2015.11.09 T.Kobayashi Add
* 機　能： メニュー表示処理
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.clickMenu = function () {
    $('#right_content').css('width', '303px')
    $('#right_hidden').css('display', 'block')
    editPageLayout();
    messageEntry.msgBoxResize();
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 画面初期化
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.init = function (replyClass) {

    //入力者（デフォルト：ログインユーザ）
    messageEntry.inputUserId = messageEntry.userId;
    messageEntry.inputUserName = messageEntry.userName;
    $("#input_user").text(messageEntry.userName);

    //患者（デフォルト：パラメータの患者）
    messageEntry.inputPatientId = messageEntry.patientId;
    $("#msgPatientName").text(messageEntry.patientName);

    //有効期限（デフォルト：指定日[システム日付]）
    $("input[name='expiration_date']").val([messageCommon.expirationDateClass.Designation]);
    messageEntry.changeExpiration();
    var sysDate = "";
    if (messageEntry.relativeDate.length > 0) {
        sysDate = messageEntry.relativeDate;
    } else {
        var sysDateTime = commonscript.getServerDateTime(messageEntry.myPrjId);
        var sysDate = sysDateTime.split(',')[1];
        sysDate = commonscript.DateFormatChg(sysDate);
        sysDate = commonscript.AddMonth(sysDate, 3);
    }
    $("#datepickerpopup01").val(sysDate);
    messageEntry.inputRelativeDate = sysDate.replace(/\//g, "");
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Mod S
    //表示開始日
    //表示開始日のフラグの確認（1:表示する、0:表示しない)
    if (messageEntry.limitStartDateDispFlg == "1") {
        //サーバー時間を取得
        var sysDateTime = commonscript.getServerDateTime(messageEntry.myPrjId);
        //yyyymmddだけ抜き出す
        var sysDate = sysDateTime.split(',')[1];
        //yyyymmdd　→　yyyy/mm/dd　に変換
        sysDate = commonscript.DateFormatChg(sysDate);
        //Veiwの表示開始日のオブジェクトに初期値のシステム日付(yyyy/mm/dd)を格納
        $("#datepickerpopup02").val(sysDate);
    } else {
        $("#datepickerpopup02").val("0");
    }
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Mod E
    //既読要求（デフォルト 0:無し）
    $("input[name='read_request']").val(["0"]);
    messageEntry.inputReadRequestFlg = "0";

    //重要度（デフォルト 1）
    $("input[name='importance_level']").val(["1"]);
    messageEntry.inputImportance = "1";

    // [障害対応(No.4060)：モバイルメッセージ機能の条件設定障害対応] 2022-06 立山 Add S
    if (messageEntry.deviceType == 4) {
        // モバイルの場合、画面に要素が無いためデフォルト1とする（上記changeExpiration()でundefinedとなる）
        messageEntry.inputExpirationDateClass = "1";
    }
    // [障害対応(No.4060)：モバイルメッセージ機能の条件設定障害対応] 2022-06 立山 Add E

    if (replyClass == "0") {
        //=====================
        // 返信対象外
        //=====================

        // --- 関連情報表示 ----------
        if ((messageEntry.inputPatientId.length > 0) && (messageEntry.activityType.length > 0)) {

            var activityTypeName = "";
            if (messageEntry.activityType == 1) {
                activityTypeName = "オーダ";
            } else if (messageEntry.activityType == 2) {
                activityTypeName = "タスク";
            } else if (messageEntry.activityType == 3) {
                activityTypeName = "文書";
            } else if (messageEntry.activityType == 7) {
                activityTypeName = "DPC";
                //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.S
            } else if (messageEntry.activityType == 9) {
                activityTypeName = "病名";
            }
            //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Add.E

            var appendList = new Array();
            appendList.push({
                ActivityType: messageEntry.activityType,
                ActivityTypeName: activityTypeName,
                MedicalDataType: messageEntry.medicalDataType,
                //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Mod.S
                //MedicalDataTypeName: "",
                MedicalDataTypeName: messageEntry.medicalDataTypeName,
                //[ 病院版対応：メッセージ関連情報病名選択対応] 2017-08 福元 Mod.E
                DerivationClass: messageEntry.derivationClass,
                DerivationKey: messageEntry.derivationKey,
                DerivationKeyName: messageEntry.derivationKeyName
            });

            // 関連情報選択のコールバック関数を使用して、関連情報を保持させる。
            getMessageAppendResult(appendList);
        }

        // --- 宛先 ----------
        if (messageEntry.addressGroupClass.length > 0) {

            var aryAddressGroupClass = messageEntry.addressGroupClass.split("||");
            var aryAddressGroupId = messageEntry.addressGroupId.split("||");
            var aryAddressGroupName = messageEntry.addressGroupName.split("||");

            var destinationArrayList = new Array();
            var addressInfo = "";

            for (var i = 0; i < aryAddressGroupClass.length; i++) {

                var addressGroupClass = aryAddressGroupClass[i];
                var addressGroupId = aryAddressGroupId[i];
                var addressGroupName = aryAddressGroupName[i];

                if (addressGroupClass.length ==0) {
                    continue;
                }

                // 表示名称
                var dispName = addressGroupName;
                if ((addressGroupClass == 3) || (addressGroupClass == 4) || (addressGroupClass == 5)) {
                    var aryDispName = addressGroupName.split(',');
                    dispName = aryDispName[0] + "（" + aryDispName[1] + "）";
                }

                destinationArrayList.push({
                    AddressGroupClass: addressGroupClass,
                    AddressGroupId: addressGroupId,
                    AddressGroupName: addressGroupName,
                    DispName: dispName,
                });

                if (addressInfo.length > 0) {
                    addressInfo = addressInfo + "|";
                }
                addressInfo += addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
            }

            

            // 宛先選択のコールバック関数を使用して、宛先情報を保持させる。
            getMessageDestinationResult(destinationArrayList, addressInfo);
        }

        //核心的内容
        $("#msgSubject").val(messageEntry.subject);
        // 本文
        $("#msgArea").text(messageEntry.bodyText);

    } else {
        //=====================
        // 返信 or 転送
        //=====================

        // 呼出元から指定されたメッセージ番号よりメッセージデータ取得
        var originalData = messageEntry.getTargetMessageSendData(messageEntry.messageNo);

        if (replyClass == "1") {
            //------------------------------------------------------------
            // 1:返信(引用なし)
            //      To　　　　：返信元メッセージの入力者ID,入力者名を設定					
            //      件名　　　："Re." + 返信元メッセージの件名を設定
            //------------------------------------------------------------
            var addressGroupClass = messageCommon.addressGroupClass.Personal;
            var addressGroupId = originalData.RevisionInfo.UserId;
            var addressGroupName = originalData.RevisionInfo.UserName;
            var destinationInfo = {
                AddressGroupClass: addressGroupClass,
                AddressGroupId: addressGroupId,
                AddressGroupName: addressGroupName,
                DispName: addressGroupName,
                AddressInfo: addressGroupClass + "^" + addressGroupId + "^" + addressGroupName
            };
            messageEntry.selectedAddressInfo = addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
            $("#msgTo").text(originalData.RevisionInfo.UserName);
            $("#msgSubject").val("Re." + originalData.Subject);

        } else if (replyClass == "2") {
            //------------------------------------------------------------
            // 2:返信(引用有り)
            //      To　　　　：返信元メッセージの入力者ID,入力者名を設定
            //      件名　　　："Re."+ 返信元メッセージの件名を設定
            //      メッセージ：返信元メッセージの本文の行頭に「> 」を追加した物を設定
            //------------------------------------------------------------

            var addressGroupClass = messageCommon.addressGroupClass.Personal;
            var addressGroupId = originalData.RevisionInfo.UserId;
            var addressGroupName = originalData.RevisionInfo.UserName;
            var destinationInfo = {
                AddressGroupClass: addressGroupClass,
                AddressGroupId: addressGroupId,
                AddressGroupName: addressGroupName,
                DispName: addressGroupName,
                AddressInfo: addressGroupClass + "^" + addressGroupId + "^" + addressGroupName
            };
            messageEntry.selectedAddressInfo = addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
            $("#msgTo").text(originalData.RevisionInfo.UserName);
            $("#msgSubject").val("Re." + originalData.Subject);
     
            var bodyText = originalData.BodyText.split('\n');
            for (var i = 0; i < bodyText.length; i++) {
                bodyText[i] = "> " + bodyText[i];
            }
            $("#msgArea").text(bodyText.join('\n'));

        } else if (replyClass == "3") {
            //------------------------------------------------------------
            // 3:転送
            //      件名　　　："Fw." + 転送元メッセージの件名を設定					
            //      メッセージ：転送元メッセージの本文を設定		
            //------------------------------------------------------------

            $("#msgSubject").val("Fw." + originalData.Subject);
            $("#msgArea").text(originalData.BodyText);

        }
    }

}

messageEntry.clear = function () {

    $("#msgTo").text("");
    $("#msgSubject").val("");
    $("#msgArea").text("");
    messageEntry.selectedAddressInfo = "";
    messageEntry.objSelectedAppendInfo = new Array;

}

messageEntry.setRelativeDateList = function () {

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetRelativeDateList/',
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

            if (serverResponse == null) {

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

                messageEntry.objRelativeDateListFromDB = $.extend(true, [], serverResponse);

                // select要素作成
                var select = document.getElementById("relativedate_select");

                for (var i = 0; i < serverResponse.length; i++) {

                    var relativeDateCode = serverResponse[i].RelativeDateCode;
                    var relativeDateName = serverResponse[i].RelativeDateName;
                    var calculatedClass = serverResponse[i].CalculatedClass;
                    var addValue = serverResponse[i].AddValue;

                    // 取得したマスタデータを退避
                    messageEntry.objRelativeDateList[relativeDateCode] = $.extend(true, [], serverResponse[i]);
                    if (i == 0) {
                        // 選択値を退避
                        messageEntry.lastSelectedCalculatedClass = calculatedClass
                    }

                    if (messageEntry.mobileMode != 1) {
                        // option要素作成 --------------------------------------
                        var option = document.createElement("option");
                        // option要素のvalue属性に選択項目データ
                        option.value = relativeDateCode;
                        // テキストノードをoption要素に追加
                        var text = document.createTextNode(relativeDateName);
                        option.appendChild(text);
                        // option要素をselect要素に追加
                        select.appendChild(option);
                        //-------------------------------------------------------
                    }

                }

            }

    //$.ajax({
    //    type: "POST",
    //    dataType: "json",
    //    contentType: 'application/json',
    //    url: '/CmMessageEntry/MessageEntry/GetRelativeDateList/',
    //    success: function (serverResponse) {

    //        if (serverResponse == null) {

    //        } else if (serverResponse[0].LoginCheckResult.ErrorHandle > 0) {

    //            //エラー
    //            //ボタン押下時の処理を記述
    //            func1 = 'commonscript.dialogclose();';
    //            func2 = '';
    //            func3 = '';
    //            //ポップアップダイアログの表示
    //            commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
    //            commonscript.opendialog();

    //        } else {

    //            messageEntry.objRelativeDateListFromDB = $.extend(true, [], serverResponse);

    //            // select要素作成
    //            var select = document.getElementById("relativedate_select");

    //            for (var i = 0; i < serverResponse.length; i++) {

    //                var relativeDateCode = serverResponse[i].RelativeDateCode;
    //                var relativeDateName = serverResponse[i].RelativeDateName;
    //                var calculatedClass = serverResponse[i].CalculatedClass;
    //                var addValue = serverResponse[i].AddValue;

    //                // 取得したマスタデータを退避
    //                messageEntry.objRelativeDateList[relativeDateCode] = $.extend(true, [], serverResponse[i]);
    //                if (i == 0) {
    //                    // 選択値を退避
    //                    messageEntry.lastSelectedCalculatedClass = calculatedClass
    //                }

    //                if (messageEntry.mobileMode != 1) {
    //                    // option要素作成 --------------------------------------
    //                    var option = document.createElement("option");
    //                    // option要素のvalue属性に選択項目データ
    //                    option.value = relativeDateCode;
    //                    // テキストノードをoption要素に追加
    //                    var text = document.createTextNode(relativeDateName);
    //                    option.appendChild(text);
    //                    // option要素をselect要素に追加
    //                    select.appendChild(option);
    //                    //-------------------------------------------------------
    //                }
                    
    //            }

    //        }
    //    },
    //    error: function () {
    //    }
    //});
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 宛先選択の利用者検索
* 注　意： 宛先選択画面をポップアップ表示する画面で必要
****************************************************************/
function openStaffSearchForMessageDestination(selectedUserId) {
    // 利用者検索
    var selectCount = "99";
    var callFlg = "MessageDestination";
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
                messageEntry.inputUserId = piArrayResult[0]["StaffId"];
                messageEntry.inputUserName = piArrayResult[0]["StaffName"];
                $('#input_user').text(piArrayResult[0]["StaffName"]);
            }
        }
    }
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 患者検索
* 引　数： 
* 戻り値： なし
****************************************************************/
messageEntry.openPatientlSearch = function () {
    //患者一覧起動パラメータ
    var objdata = new Object();
    objdata["AdmitClass"] = "2";    //TODO
    objdata["DeviceType"] = messageEntry.deviceType;
    objdata["AfterSelectingMode"] = 1;  //患者選択後に閉じる
    //2016.11.07 A.Fukumoto Add.S 障害対応:モバイル時に患者選択がエンドレスになる
    objdata["startClass"] = 1; //メッセージからの起動
    //2016.11.07 A.Fukumoto Add.E

    var queryString = commonscript.getEncryptQueryString(messageEntry.myPrjId, objdata);

    var prgUrl = "/PsPatientList/PsPatientList/PsPatientList";

    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add S
    //在宅モード取得
    if (messageEntry.zaitakuMode == "1") {
        if (messageEntry.mobileMode == 1) {
            prgUrl = "/CmGroupPatientList/GroupChatPatientList/GroupChatPatientListMobile";
        } else {
            prgUrl = "/CmGroupPatientList/GroupChatPatientList/GroupChatPatientList";
        }
    }
    //[ 機能追加：在宅カルテ対応] 2018-11 菊地 Add E

    if (messageEntry.mobileMode == 1) {
        // [ 札幌ハートセンター：モバイルオーダ対応] 2020-06 立山 Mod S
        //commonscript.openPopUpSpecifyId(prgUrl, "患者検索", queryString, 500, 500, "", true, "-PatientSearch")
        commonscript.openPopUpSpecifyId(prgUrl, "患者検索", queryString, 0, 0, "", true, "-PatientSearch")
        // [ 札幌ハートセンター：モバイルオーダ対応] 2020-06 立山 Mod E
    } else {
        //画面をロックしてモーダル起動とする
        commonscript.lockScreen();     
        commonscript.startProgram(messageEntry.myPrjId, messageEntry.myPrgId, "PsPatientList", "PsPatientList", prgUrl + "?" + queryString, "患者一覧", "0", 0, 0, "", "");
    }
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 患者検索戻り処理(共通callback関数)
* 引　数： piArrayResult:患者検索で選択した値（Array）
* 戻り値： なし
****************************************************************/
function getPatientlSearchResult(piArrayResult) {
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： スタンプ登録
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.registStamp = function () {

    //// 関連情報チェック（患者由来データがある場合は確認メッセージ表示）
    //for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
    //    var data = messageEntry.objSelectedAppendInfo[i];
    //    if (data.DerivationClass == "3") {
    //        var func1 = 'commonscript.dialogclose(); messageEntry.startRegistStamp();';
    //        var func2 = 'commonscript.dialogclose();';
    //        var func3 = '';
    //        commonscript.dispMessageSync(messageEntry.myPrjId, "CmMessage", 12, "", func1, func2, func3, 0);
    //        return;
    //    }
    //}
    messageEntry.startRegistStamp(17);
}

messageEntry.startRegistStamp = function (stampType) {

    messageEntry.registStampType = stampType;

    var strUrl = "/StStampEntry/StampEntry/StampEntry"
    var objdata = new Object();
    objdata["WorkingMode"] = "1";   //(1：登録モード)固定
    objdata["StampType"] = stampType;    //スタンプ種別
    objdata["StampManageName"] = "";
    objdata["DetailName"] = "";
    var strEncryptQueryString = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
    commonscript.openPopUpSpecifyId(strUrl, "スタンプ登録", strEncryptQueryString, 500, 500, "", true, "StampEntry");
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： スタンプ登録戻り処理(共通callback関数)
* 引　数： StampCategory：スタンプ分類
*          ParentId：親ID
*          StampManageName：スタンプ管理名 
*          DetailName：詳細名 
* 戻り値： なし
****************************************************************/
function getStampEntryResult(StampCategory, ParentId, StampManageName, DetailName) {

    if (messageEntry.registStampType == "7") {
        // ﾃｷｽﾄｽﾀﾝﾌﾟ保存
        var data = {
            "stampCategory": StampCategory,
            "stampParentId": ParentId,
            "stampManageaName": StampManageName,
            "stampDetailName": DetailName,
            "stampText": messageEntry.stampStr
        };
        var jsonString = JSON.stringify(data);

        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: 'application/json',
            url: '/NtProgressNote/ProgressNoteEdit/SetStampSave',
            data: jsonString,
            success: function (serverResponse) {
                var jsonParseData = JSON.parse(serverResponse);

                if (jsonParseData.RetCd != "-1") {
                    //正常終了処理なし
                    //スタンプボックスリロード
                    messageEntry.reloadStampBox(jsonParseData.RetCd);
                }
            },
            error: function () {
                //exceptionMessage("スタンプ登録時に例外エラーが発生しました。");
            }
        });
    } else {
        // ﾒｯｾｰｼﾞｽﾀﾝﾌﾟﾃﾞｰﾀ保存
        var stampId = messageEntry.setMessageStampData(StampCategory, ParentId, StampManageName, DetailName);
        //スタンプボックスリロード
        messageEntry.reloadStampBox(stampId);
    }
    

    

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： ﾒｯｾｰｼﾞｽﾀﾝﾌﾟﾃﾞｰﾀ保存
****************************************************************/
messageEntry.setMessageStampData = function (StampCategory, ParentId, StampManageName, DetailName) {

    var importance = "";
    var subject = "";
    var bodyText = "";
    var relativeDateCode = 0;
    var relativeDate = 0;
    var readRequestFlg = 0;

    // 件名／本文
    var subject = $('#msgSubject').val();
    var bodyText = $('#msgArea').val();
    if (messageEntry.mobileMode == "1") {
        // 重要度
        importance = messageEntry.inputImportance;
        // 相対日付？日付指定？
        expirationDateClass = messageEntry.inputExpirationDateClass;
        if (expirationDateClass == 0) {
            //無期限
            relativeDate = 99999999
        } else if (expirationDateClass == 1) {
            //日付指定
            relativeDate = messageEntry.inputRelativeDate;
        } else {
            //相対日付
            relativeDateCode = messageEntry.inputRelativeDateCode;
            relativeDate = messageEntry.inputRelativeDate;
        }
        // 既読要求
        readRequestFlg = messageEntry.inputReadRequestFlg;
    } else {
        // 重要度
        importance = $("input[name='importance_level']:checked").val();
        // 相対日付？日付指定？
        expirationDateClass = $("input[name='expiration_date']:checked").val();
        if (expirationDateClass == 0) {         //無期限
            relativeDate = 99999999
        } else if (expirationDateClass == 1) {  //日付指定
            var setDate = $("#datepickerpopup01").val();
            if (setDate.length == 0) {
                relativeDate = 0;
            } else {
                var sysDateTime = commonscript.getServerDateTime(messageEntry.myPrjId);
                var sysDate = sysDateTime.split(',')[1];
                relativeDate = commonscript.getDiff(commonscript.DateFormatChg(sysDate), setDate);
            }
        } else {                                //相対日付
            relativeDateCode = $("#relativedate_select").val();
            relativeDate = $("input[name='relative_date']:checked").val();
        }
        // 既読要求
        readRequestFlg = $("input[name='read_request']:checked").val();
    }

    //処理情報（アクティビティ種別^診療データ種別^由来区分^由来キー）
    var processInfo = "";
    var aryProcessInfo = new Array;
    for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
        var data = messageEntry.objSelectedAppendInfo[i];
        if (data.DerivationClass != "3") {  //患者データは含まない
            aryProcessInfo.push(data.ActivityType + "^" + data.MedicalDataType + "^" + data.DerivationClass + "^" + data.DerivationKey);
        }
    }
    if (aryProcessInfo.length > 0) {
        var processInfo = aryProcessInfo.join("|");
    }

    var stampId = "";
    if (messageEntry.stampEditMode == 1) {
        stampId = messageEntry.messageNo;
    }

    var data = {
        "stampId": stampId,
        "importance": importance,
        "subject": subject,
        "bodyText": bodyText,
        "relativeDateCode": relativeDateCode,
        "relativeDate": relativeDate,
        "readRequestFlg": readRequestFlg,
        "processInfo": processInfo,
        "stampCategory": StampCategory,
        "parentId": ParentId,
        "stampManageName": StampManageName,
        "detailName": DetailName,
    };
    var jsonString = JSON.stringify(data);

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/SetMessageStampData/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    var ret = "";
    if (commonscript.NullChk(serverResponse)) {
        ret = serverResponse;
    }
    return ret;
}

messageEntry.reloadStampBox = function (stampId) {

    var senddata = {};
    if (commonscript.NullChk(stampId)) {
        senddata = { message: "addstamp", targetid: stampId};
    } else {
        senddata = { message: "refresh" };
    }
    // iframeのwindowオブジェクトを取得
    var ifrm = document.getElementById("ifrmStampBox").contentWindow;
    // iframeのsrc属性の内容を取得
    var url = document.getElementById("ifrmStampBox").src;

    // 指定iframeにメッセージを投げる
    ifrm.postMessage(senddata, url);
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 宛先選択
****************************************************************/
messageEntry.selectDestination = function () {
    //宛先選択画面起動
    var objdata = new Object();
    objdata["SelectList"] = messageEntry.selectedAddressInfo;
    var queryString = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
    var prgUrl = "/CmMessageEntry/MessageEntry/MessageDestination";
    // [ 札幌ハートセンター：モバイルオーダ対応] 2020-06 立山 Mod S
    //commonscript.openPopUpSpecifyId(prgUrl, "宛先選択", queryString, 420, 600, "", true, "-MessageDestination");
    var width = 420;
    var height = 600;
    if (messageEntry.deviceType == 4) {
        width = 0;
        height = 0;
    }
    commonscript.openPopUpSpecifyId(prgUrl, "宛先選択", queryString, width, height, "", true, "-MessageDestination");
    // [ 札幌ハートセンター：モバイルオーダ対応] 2020-06 立山 Mod E
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 宛先選択(共通callback関数)
*      piArrayList:宛先情報
*          AddressGroupClass : 宛先グループ種別
*          AddressGroupId    : 宛先グループID
*          AddressGroupName  : 宛先グループ名称
*          DispName          : 表示名称
*      piAddressInfo: [宛先グループ種別^宛先グループID^宛先グループ名称]のパイプ（"|"）区切り
****************************************************************/
function getMessageDestinationResult(piArrayList, piAddressInfo) {

    //選択された宛先情報を退避
    messageEntry.selectedAddressInfo = piAddressInfo;

    //宛先名称の表示
    var selectedDispName = "";
    var beforeDispName = "";
    for (var i = 0; i < piArrayList.length; i++) {
        if ((selectedDispName.indexOf(piArrayList[i].DispName)) > -1) {
            continue;
        }
        if (selectedDispName.length == 0) {
            selectedDispName = piArrayList[i].DispName;
        } else {
            selectedDispName = selectedDispName + "，" + piArrayList[i].DispName;
        }
        beforeDispName = piArrayList[i].DispName;
    }

    $("#msgTo").text(selectedDispName);
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 関連情報選択
****************************************************************/
messageEntry.attachedFile = function () {
    //ファイル添付
    var objdata = new Object();
    objdata["StartClass"] = "1";    //1:メッセージ登録時の関連情報選択
    objdata["PatientId"] = messageEntry.inputPatientId;
    var selectList = "";
    for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
        var list = messageEntry.objSelectedAppendInfo[i];
        if (selectList != "") {
            selectList = selectList + "|";
        }
        selectList = selectList + list.ActivityType + "^" + list.ActivityTypeName + "^" +
                                    list.MedicalDataType + "^" + list.MedicalDataTypeName + "^" +
                                    list.DerivationClass + "^" + list.DerivationKey + "^" +
                                    list.DerivationKeyName;
    }
    objdata["SelectList"] = selectList;
    var queryString = commonscript.getEncryptQueryString("CmMessageEntry", objdata);
    var prgUrl = "/CmMessageEntry/MessageEntry/MessageAppend";
    commonscript.openPopUpSpecifyId(prgUrl, "", queryString, 500, 600, "", true, "MessageAppend");

}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 関連情報選択(callback関数)
*   piArrayList:メッセージ関連情報
*       ActivityType        ｱｸﾃｨﾋﾞﾃｨ種別（1:オーダ 3:文書）
*       ActivityTypeName    ｱｸﾃｨﾋﾞﾃｨ種別名
*       MedicalDataType     診療ﾃﾞｰﾀ種別
*       MedicalDataTypeName 診療ﾃﾞｰﾀ種別名
*       DerivationClass     由来区分（1:新規作成 2:スタンプ 3:患者データ）
*       DerivationKey       由来ｷｰ
*       DerivationKeyName   由来ｷｰ名
[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod 引数追加 piProcessKbn(1:スタンプ展開）
****************************************************************/
function getMessageAppendResult(piArrayList, piProcessKbn) {

    //選択された関連情報を退避
    //[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod S
    //messageEntry.objSelectedAppendInfo = piArrayList;

    var updateFlg = 1;
    piProcessKbn = commonscript.onNullDef(piProcessKbn, 0);
    if (piProcessKbn == 1 && piArrayList.length == 0) {
        //スタンプ展開時かつ、関連情報が未セットの場合
        updateFlg = 0;
    } else {
        messageEntry.objSelectedAppendInfo = piArrayList;
    }
    //[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod E

    //2016.10.19 A.Fukumoto Add.S 
    if (messageEntry.mobileMode == 1) {
        //parentId = parent.document.getElementById("footer_container")

        if (piArrayList.length == 0) {
            //添付なし

            //元々添付がない場合は抜ける
            if ($("#msgAttached_btn").hasClass("attached_icon_none") == true) { return; }

            $("#msgAttached_btn").removeClass("attached_icon")
            $("#msgAttached_btn").addClass("attached_icon_none")

            return;

        } else {
            //添付あり

            //元々添付がない場合は抜ける
            if ($("#msgAttached_btn").hasClass("attached_icon") == true) { return; }

            $("#msgAttached_btn").removeClass("attached_icon_none")
            $("#msgAttached_btn").addClass("attached_icon")

            return;
        }
    }
    //2016.10.19 A.Fukumoto Add.E

    //宛先名称の表示
    var selectedDispName = "";
    for (var i = 0; i < piArrayList.length; i++) {

        var itemName = messageCommon.getProcessListItemName(
                            piArrayList[i].ActivityType, piArrayList[i].ActivityTypeName,
                            piArrayList[i].MedicalDataType, piArrayList[i].MedicalDataTypeName,
                            piArrayList[i].DerivationClass, piArrayList[i].DerivationKey, piArrayList[i].DerivationKeyName);

        if (selectedDispName.length == 0) {
            selectedDispName = itemName;
        } else {
            selectedDispName = selectedDispName + "，" + itemName;
        }
    }

    //[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod S
    //$("#form_info").text(selectedDispName);
    if (updateFlg == 1) {
        $("#form_info").text(selectedDispName);
    }
    //[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod E

}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 患者情報取得
* 引　数： (1:オーダ 2:文書)
****************************************************************/
messageEntry.getPatientData = function (mode) {
}

/**************************************************************** 
* 編　集： 2016.02.02 M.Matsuo Add
* 機　能： 設定画面起動（モバイル用詳細設定）
****************************************************************/
messageEntry.openSettings = function () {

    //メッセージ登録画面起動
    var objData = new Object()
    objData['DeviceType'] = messageEntry.deviceType;

    // 暗号化したクエリストリングを取得
    var param = commonscript.getEncryptQueryString(messageEntry.myPrjId, objData);
    // 最終的に読み込むURL全体を作成
    var strUrl = '/' + messageEntry.myPrjId + '/MessageEntry/MessageEntrySettings';
    // ポップアップ起動
    commonscript.openPopUpSpecifyId(strUrl, '詳細設定', param, 450, 560, "", true, "-MessageEntrySettings");
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 指定ﾒｯｾｰｼﾞ送信ﾃﾞｰﾀ取得
****************************************************************/
messageEntry.getTargetMessageSendData = function (messageNo) {

    var data = {
        "messageNo": messageNo
    };
    var jsonString = JSON.stringify(data);

    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetTargetMessageSendData/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if ((serverResponse == null) || (serverResponse.length == 0)) {
        //データなし
        serverResponse = "ERR";
    } else if (serverResponse.LoginCheckResult.ErrorHandle > 0) {
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
* 機　能： ﾒｯｾｰｼﾞ送信ﾃﾞｰﾀ保存
****************************************************************/
messageEntry.setMessageSendData = function (draftFlg) {

    var importance = "";
    var subject = "";
    var bodyText = "";
    var relativeDateCode = 0;
    var relativeDate = 0;
    var readRequestFlg = 0;
    var messageNo = "";
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add S
    var limitStartDate = 0;
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add E

    
    // 件名／本文
    var subject = $('#msgSubject').val();
    var bodyText = $('#msgArea').val();

    if (messageEntry.mobileMode == "1") {
        // 重要度
        importance = messageEntry.inputImportance;
        // 相対日付？日付指定？
        expirationDateClass = messageEntry.inputExpirationDateClass;
        if (expirationDateClass == 0) {
            //無期限
            relativeDate = 99999999
        } else if (expirationDateClass == 1) {
            //日付指定
            relativeDate = messageEntry.inputRelativeDate;
        } else {
            //相対日付
            relativeDateCode = messageEntry.inputRelativeDateCode;
            relativeDate = messageEntry.inputRelativeDate;
        }
        // 既読要求
        readRequestFlg = messageEntry.inputReadRequestFlg;
    } else {
        // 重要度
        importance = $("input[name='importance_level']:checked").val();
        // 相対日付？日付指定？
        expirationDateClass = $("input[name='expiration_date']:checked").val();
        if (expirationDateClass == 0) {
            //無期限
            relativeDate = 99999999
        } else if (expirationDateClass == 1) {
            //日付指定
            relativeDate = $("#datepickerpopup01").val().replace(/\//g, "");
        } else {
            //相対日付
            relativeDateCode = $("#relativedate_select").val();
            relativeDate = $("input[name='relative_date']:checked").val();
        }
        // 既読要求
        readRequestFlg = $("input[name='read_request']:checked").val();
    }

    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add S
    //表示開始日の設定があるか確認
    if (messageEntry.limitStartDateDispFlg == "1") {
        //Veiw側のオブジェクトから変数に格納
        limitStartDate = $("#datepickerpopup02").val().replace(/\//g, "");
        //表示開始日が空欄の場合0が登録される
        if (limitStartDate != "") {
            //日付形式の場合は日付チェック
            if (expirationDateClass == 1) {
                //日付形式チェック
                if (commonscript.DateFormatChk(limitStartDate) == "") {
                    //異常な値の場合
                    $("#datepickerpopup02").val("");
                    //確認メッセージ表示
                    commonscript.dispMessage("CmMessageEntry", "CmMessage", 99, "日付の入力に誤りがあります。", "commonscript.dialogclose();", "", "", 0);
                    return false;
                }
            } else {
                //相対日付の場合、開始表示日は現在日を登録
                //サーバー時間を取得
                var sysDateTime = commonscript.getServerDateTime(messageEntry.myPrjId);
                //yyyymmddだけ抜き出す
                var sysDate = sysDateTime.split(',')[1];
                //yyyymmdd　→　yyyy/mm/dd　に変換
                sysDate = commonscript.DateFormatChg(sysDate);
                limitStartDate = sysDate
            }
        }
    }
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add E
    //【件名未入力エラー】
    if (subject == "") {
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 7, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    // 8:宛先情報（宛先グループ種別^宛先グループID^宛先グループ名^宛先ID）
    var addressInfo = "";
    addressInfo = messageEntry.selectedAddressInfo;

    //【宛先情報未入力エラー】
    if (addressInfo == "") {
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 6, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    // 9:処理情報（アクティビティ種別^診療データ種別^由来区分^由来キー）
    var processInfo = "";
    var aryProcessInfo = new Array;
    for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
        var data = messageEntry.objSelectedAppendInfo[i];
        aryProcessInfo.push(data.ActivityType + "^" + data.MedicalDataType + "^" + data.DerivationClass + "^" + data.DerivationKey);
    }
    if (aryProcessInfo.length > 0) {
        var processInfo = aryProcessInfo.join("|");
    }

    //【処理情報選択時の患者未選択エラー】
    if ((processInfo != "") && (messageEntry.inputPatientId == "")) {
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 8, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add S
    //【日付範囲入力エラー】
    //日付指定の場合のみ確認
    if (expirationDateClass == 1) {
        if (limitStartDate > relativeDate) {
            commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 99, "日付の範囲設定に誤りがあります。", "commonscript.dialogclose();", "", "", 0);
            return false;
        }
    }
    //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add E
    if (messageEntry.stampEditMode == 2) {
        //--------------------------------------
        // ﾒｯｾｰｼﾞ登録ﾃﾞｰﾀ保存
        //--------------------------------------
        var data = {
            "messageNo": messageEntry.messageNo,
            "patientId": messageEntry.inputPatientId,
            "importance": importance,
            "subject": subject.replace(/\t/g, '　'),
            "bodyText": bodyText.replace(/\t/g, '　'),
            "relativeDateCode": relativeDateCode,
            "relativeDate": relativeDate,
            "readRequestFlg": readRequestFlg,
            "addressInfo": addressInfo,
            "processInfo": processInfo,
            "departmentCode": messageEntry.departmentCode,
            "enforcedInfoUserId": messageEntry.enforcedInfoUserId
        };
        var jsonString = JSON.stringify(data);
        //同期通信
        var result = $.ajax({
            type: "POST",
            dataType: "json",
            contentType: 'application/json',
            url: '/CmMessageEntry/MessageEntry/SetWkMessageSendData/',
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

        var sendMessageNo = serverResponse;
        messageEntry.closeFormOk(sendMessageNo + "||" + addressInfo);
    } else {
        //--------------------------------------
        // ﾒｯｾｰｼﾞ送信ﾃﾞｰﾀ保存
        //--------------------------------------
        //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add S
        if (messageEntry.modFlg == "1") {
            messageNo = messageEntry.messageNo;
        }
        //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add E

        var data = {
            //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Mod S
            //"messageNo": "",
            "messageNo": messageNo,
            //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Mod E
            "patientId": messageEntry.inputPatientId,
            "importance": importance,
            "subject": subject.replace(/\t/g, '　'),
            "bodyText": bodyText.replace(/\t/g, '　'),
            "relativeDateCode": relativeDateCode,
            "relativeDate": relativeDate,
            "readRequestFlg": readRequestFlg,
            "addressInfo": addressInfo,
            "processInfo": processInfo,
            "inputUserId": messageEntry.inputUserId,    //[ 病院版対応：連絡板対応] 2017-10 福元 Add　引数に作成者:inputUserIdを追加
            "draftFlg": draftFlg,                       //[ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add
            "limitStartDate": limitStartDate            //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add　引数にlimitStartDateを追加
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

        var sendMessageNo = serverResponse;

        //--------------------------------------
        // 返信・転送フラグ更新
        //--------------------------------------
        if (messageEntry.replyClass == 0) {
            //0:返信対象外  
            return true;
        }

        if ((messageEntry.replyClass == 1) || (messageEntry.replyClass == 2)) {
            //------------------------------
            // 1:返信(引用なし) 2:返信(引用有り)
            //------------------------------
            var data = {
                "messageNo": messageEntry.messageNo,
                "replyFlg": 1
            };
            var jsonString = JSON.stringify(data);
            //同期通信
            var result = $.ajax({
                type: "POST",
                dataType: "json",
                contentType: 'application/json',
                url: '/CmMessageEntry/MessageEntry/UpdateReplyFlg/',
                data: jsonString,
                async: false,
                traditional: true
            }).responseText;
            var serverResponse = JSON.parse(result);

        } else if (messageEntry.replyClass == 3) {
            //------------------------------
            // 3:転送
            //------------------------------
            var data = {
                "messageNo": messageEntry.messageNo,
                "forwardFlg": 1,
                "forwardSrcNo": sendMessageNo
            };
            var jsonString = JSON.stringify(data);
            //同期通信
            var result = $.ajax({
                type: "POST",
                dataType: "json",
                contentType: 'application/json',
                url: '/CmMessageEntry/MessageEntry/UpdateForwardFlg/',
                data: jsonString,
                async: false,
                traditional: true
            }).responseText;
            var serverResponse = JSON.parse(result);

        }
    }
    return true;
}

// ドロップ受け付け判定
messageEntry.onDragover = function (event) {
    // ドロップを受け付ける 
    // （イベントのデフォルト動作であるドロップの拒否を行なわない） 
    event.preventDefault();
    // これが無いとドロップ不可能になる。 

    // ドロップ時の効果を設定
    event.originalEvent.dataTransfer.dropEffect = "copy";
}

// ドロップ処理
messageEntry.onDrop = function (event) {

    // ページの遷移を防止 
    //（これがないとドラッグ内容の文字列へブラウザが遷移する） 
    event.preventDefault(); 

    // イベントに格納された文字列データを取り出し 
    //（スタンプボックスからのドロップ時はスタンプIDが取得できます。）
    // console.log(s)  : StampInfo=ST00000014||総蛋白，アルブミ||5
    var stampInfo = event.originalEvent.dataTransfer.getData("text/plain");

    // ★★★　ここにドロップした際の処理を書く　★★★
    if (stampInfo.split('=')[0] == "StampInfo") {
        var stampId = stampInfo.split('=')[1].split('||')[0];
        var stampType = stampInfo.split('=')[1].split('||')[2];
        if (stampType == 17) {
            //スタンプデータ展開
            messageEntry.developStampData(stampId);
        }
    } else {
        if ($(event.target).hasClass('dropTextStamp')) {
            //テキストスタンプをドロップできる要素の場合
            $(event.target).focus();
            document.execCommand("insertHTML", false, stampInfo);
        }
    }
}

/**************************************************************** 
* 編　集： [ 要望対応：メッセージ一時保存対応] 2018-05 松尾 Add 
* 機　能： 登録データ展開
****************************************************************/
messageEntry.loadData = function (messageNo) {

    //メッセージデータ取得
    var data = {
        "messageNo": messageNo
    };
    var jsonString = JSON.stringify(data);

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetTargetMessageData/',
        data: jsonString,
        async: true,
        success: function (serverResponse) {

            if ((serverResponse == null) || (serverResponse.length == 0)) {
                //データなし

            } else if (serverResponse.LoginCheckResult.ErrorHandle > 0) {
                //エラー
                //ボタン押下時の処理を記述
                func1 = 'commonscript.dialogclose();';
                func2 = '';
                func3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv(messageEntry.myPrjId, serverResponse.LoginCheckResult.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();

            } else {
                // 取得したデータをセット
                //入力者
                messageEntry.inputUserId = serverResponse.CreationInfo.UserId;
                messageEntry.inputUserName = serverResponse.CreationInfo.UserName;
                $('#input_user').text(serverResponse.CreationInfo.UserName);
                //患者
                messageEntry.inputPatientId = serverResponse.PatientId;
                $('#msgPatientName').text(serverResponse.PatientName);
                // 有効期限
                var limitDate = commonscript.DateFormatChg(serverResponse.LimitDate);
                if (limitDate.length > 0) {
                    $("#datepickerpopup01").val(limitDate);
                }
                //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add S
                //表示開始日を取得し、（yyyymmdd→yyyy/mm/dd）に変換して変数に格納
                var limitStartDate = commonscript.DateFormatChg(serverResponse.limitStartDate);
                //保存したメッセージに表示開始日ある（0ではない）場合は、表示する
                if (limitStartDate != 0 ) {
                    $("#datepickerpopup02").val(limitStartDate);
                } else {
                    //保存したメッセージに表示開始日がない場合は、システム日付を表示
                    //サーバー時間を取得
                    var sysDateTime = commonscript.getServerDateTime(messageEntry.myPrjId);
                    //yyyymmddだけ抜き出す
                    var sysDate = sysDateTime.split(',')[1];
                    //yyyymmdd　→　yyyy/mm/dd　に変換
                    sysDate = commonscript.DateFormatChg(sysDate);
                    //Veiwの表示開始日のオブジェクトに初期値のシステム日付(yyyy/mm/dd)を格納
                    $("#datepickerpopup02").val(sysDate);
                }
                //[豊田地域医療センター：職員コミュニケート機能　メッセージ登録画面改修] 2025-06 mf)岩井 Add E
                // 既読要求
                $('input[name=read_request]').val([serverResponse.ReadRequestFlg]);
                if (messageEntry.mobileMode == "1") {
                    //モバイルは別ポップアップなので一旦変数に保持
                    messageEntry.inputImportance = serverResponse.Importance;
                    messageEntry.inputExpirationDateClass = 1;
                    messageEntry.inputRelativeDateCode = "";
                    messageEntry.inputRelativeDate = serverResponse.LimitDate;
                    messageEntry.inputReadRequestFlg = serverResponse.ReadRequestFlg;
                }
                // 重要度
                $('input[name=importance_level]').val([serverResponse.Importance]);
                //核心的内容
                $("#msgSubject").val(serverResponse.Subject);
                //本文
                $("#msgArea").val(serverResponse.BodyText);

                // --- 宛先情報 ----------
                if (serverResponse.ReceiveList.length > 0) {

                    var destinationArrayList = new Array();
                    var addressInfo = "";

                    //[障害対応(No.4565)： メッセージ入力でHTTP414エラーがでる及び一時保存が遅い改善対応] 2022-12 伊藤 Add S
                    var setGroupIdList = new Array();
                    //[障害対応(No.4565)： メッセージ入力でHTTP414エラーがでる及び一時保存が遅い改善対応] 2022-12 伊藤 Add E

                    for (var i = 0; i < serverResponse.ReceiveList.length; i++) {

                        var addressGroupClass = serverResponse.ReceiveList[i].AddressGroupClass;
                        var addressGroupId = serverResponse.ReceiveList[i].AddressGroupId;
                        var addressGroupName = serverResponse.ReceiveList[i].AddressGroupName;

                        //[障害対応(No.4565)： メッセージ入力でHTTP414エラーがでる及び一時保存が遅い改善対応] 2022-12 伊藤 Mod S
                        //destinationArrayList.push({
                        //    AddressGroupClass: addressGroupClass,
                        //    AddressGroupId: addressGroupId,
                        //    AddressGroupName: addressGroupName,
                        //    DispName: addressGroupName,
                        //});

                        //if (addressInfo.length > 0) {
                        //    addressInfo = addressInfo + "|";
                        //}
                        //addressInfo += addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
                        if ((setGroupIdList.indexOf(addressGroupId)) == -1) {
                            destinationArrayList.push({
                                AddressGroupClass: addressGroupClass,
                                AddressGroupId: addressGroupId,
                                AddressGroupName: addressGroupName,
                                DispName: addressGroupName,
                            });

                            if (addressInfo.length > 0) {
                                addressInfo = addressInfo + "|";
                            }
                            addressInfo += addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;

                            setGroupIdList.push(addressGroupId);
                        }
                        //[障害対応(No.4565)： メッセージ入力でHTTP414エラーがでる及び一時保存が遅い改善対応] 2022-12 伊藤 Mod E
                    }
                     
                    // 宛先選択のコールバック関数を使用して、宛先情報を保持させる。
                    getMessageDestinationResult(destinationArrayList, addressInfo);

                }

                // --- 関連情報 ----------
                var appendList = new Array();
                if (serverResponse.ProcessList.length > 0) {
                    for (var i = 0; i < serverResponse.ProcessList.length; i++) {
                        appendList.push({
                            ActivityType: serverResponse.ProcessList[i].ActivityType,
                            ActivityTypeName: serverResponse.ProcessList[i].ActivityTypeName,
                            MedicalDataType: serverResponse.ProcessList[i].MedicalDataType,
                            MedicalDataTypeName: serverResponse.ProcessList[i].MedicalDataTypeName,
                            DerivationClass: serverResponse.ProcessList[i].DerivationClass,
                            DerivationKey: serverResponse.ProcessList[i].DerivationKey,
                            DerivationKeyName: serverResponse.ProcessList[i].DerivationKeyName,
                        });
                    }
                }
                // 関連情報選択のコールバック関数を使用して、関連情報を保持させる。
                getMessageAppendResult(appendList);
            }
        },
        error: function () {
        }
    });

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： スタンプデータ展開
****************************************************************/
messageEntry.developStampData = function (stampId) {
    
    //スタンプデータ取得
    var data = {
        "stampId": stampId
    };
    var jsonString = JSON.stringify(data);

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetTargetMessageStampData/',
        data: jsonString,
        async: true,
        success: function (serverResponse) {

            if ((serverResponse == null) || (serverResponse.length == 0)) {
                //データなし

            } else if (serverResponse.LoginCheckResult.ErrorHandle > 0) {
                //エラー
                //ボタン押下時の処理を記述
                func1 = 'commonscript.dialogclose();';
                func2 = '';
                func3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();
                
            } else {

                // クリア
                //messageEntry.clear();

                // 取得したデータをセット
                $("#msgSubject").val(serverResponse.Subject);
                $("#msgArea").val(serverResponse.BodyText);
                // 重要度
                $('input[name=importance_level]').val([serverResponse.Importance]);
                // 有効期限
                var relativeDateCode = serverResponse.RelativeDateCode;
                if ((relativeDateCode.length == 0) || (relativeDateCode == 0)) {
                    // ( 日付指定 )
                    $("#radio_designation").click();
                    //サーバ日付に相対日数を加算し表示する
                    var serverDateTime = commonscript.getServerDateTime(messageEntry.myPrjId);
                    if (serverDateTime.length > 0) {
                        var sysDate = serverDateTime.split(',')[1];
                        var setDate = commonscript.AddDay(sysDate, serverResponse.RelativeDate);
                        $("#datepickerpopup01").val(commonscript.DateFormatChg(setDate));
                    }
                } else {
                    // ( 相対日指定 )
                    $("#radio_relative").click();
                    $("#relativedate_select").val(relativeDateCode);
                    $("input[name='relative_date']").val([serverResponse.RelativeDate]);
                    messageEntry.changeSelectRelative();
                }
                messageEntry.changeExpiration();

                // 既読要求
                $('input[name=read_request]').val([serverResponse.ReadRequestFlg]);

                // スタンプ関連情報データ展開
                //予約登録以外の処理データは固定とする為、スタンプ情報を展開しない
                if (messageEntry.stampEditMode != 2) {
                    messageEntry.developStampProcessData(stampId);
                }

                // スタンプ利用履歴登録
                if (messageEntry.stampEditMode == 0) {
                	// [ 診療所版対応：頻用履歴機能] 2018-11 鵜狩 Mod S
                	//commonscript.writeUsageHistory("CmMessageEntry", "6", messageEntry.stampFormId, stampId);
                	commonscript.writeUsageHistory("CmMessageEntry", "6", messageEntry.stampFormId, stampId, "", "", "");
                	// [ 診療所版対応：頻用履歴機能] 2018-11 鵜狩 Mod E
                }
            }
        },
        error: function () {
        }
    });

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： スタンプ関連情報データ展開
****************************************************************/
messageEntry.developStampProcessData = function (stampId) {

    //スタンプデータ取得
    var data = {
        "stampId": stampId
    };
    var jsonString = JSON.stringify(data);

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetMessageProcessStampDataList/',
        data: jsonString,
        async: true,
        success: function (serverResponse) {

            var appendList = new Array();

            if ((serverResponse == null) || (serverResponse.length == 0)) {
                // データなし

            } else if (serverResponse[0].LoginCheckResult.ErrorHandle > 0) {
                // エラー
                // ボタン押下時の処理を記述
                func1 = 'commonscript.dialogclose();';
                func2 = '';
                func3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();

            } else {
                for (var i = 0; i < serverResponse.length; i++) {
                    appendList.push({
                        ActivityType: serverResponse[i].ActivityType,
                        ActivityTypeName: serverResponse[i].ActivityTypeName,
                        MedicalDataType: serverResponse[i].MedicalDataType,
                        MedicalDataTypeName: serverResponse[i].MedicalDataTypeName,
                        DerivationClass: serverResponse[i].DerivationClass,
                        DerivationKey: serverResponse[i].DerivationKey,
                        DerivationKeyName: serverResponse[i].DerivationKeyName,
                    });
                }
            }

            // 関連情報選択のコールバック関数を使用して、関連情報を保持させる。
            //[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod S
            //getMessageAppendResult(appendList);
            getMessageAppendResult(appendList, 1);
            //[障害対応(No.5969)：メッセージでスタンプ展開時に関連情報が消えてしまう障害] 2025-02 横山 Mod E
        },
        error: function () {

        }

    });
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： スタンプデータ保存（スタンプ編集モードの場合）
****************************************************************/
messageEntry.saveStampData = function () {

    //ﾒｯｾｰｼﾞｽﾀﾝﾌﾟﾃﾞｰﾀ保存
    messageEntry.setMessageStampData("", "", "", "");

    //画面を閉じる
    messageEntry.closeFormOk('OK');
}
/**************************************************************** 
* 編　集： 2016.09.08 T.Yamamoto Add
* 機　能： 予約登録データ展開
****************************************************************/
messageEntry.loadWkData = function (messageNo) {

    //スタンプデータ取得
    if ((messageNo.length == 0) || (messageEntry.modFlg == "0")){
        return false;
    }
    var data = {
        "messageNo": messageNo
    };
    var jsonString = JSON.stringify(data);

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/GetTargetWkMessageData/',
        data: jsonString,
        async: true,
        success: function (serverResponse) {

            if ((serverResponse == null) || (serverResponse.length == 0)) {
                //データなし

            } else if (serverResponse.LoginCheckResult.ErrorHandle > 0) {
                //エラー
                //ボタン押下時の処理を記述
                func1 = 'commonscript.dialogclose();';
                func2 = '';
                func3 = '';
                //ポップアップダイアログの表示
                commonscript.makeDialogDiv('CmMessageEntry', serverResponse[0].LoginCheckResult.ErrMsgInfo, func1, func2, func3);
                commonscript.opendialog();

            } else {

                // クリア
                //messageEntry.clear();

                // 取得したデータをセット
                $("#msgSubject").val(serverResponse.Subject);
                $("#msgArea").val(serverResponse.BodyText);
                // 重要度
                $('input[name=importance_level]').val([serverResponse.Importance]);
                // 有効期限
                if (String(serverResponse.LimitDate).length > 0) {
                    $("#datepickerpopup01").val(commonscript.DateFormatChg(serverResponse.LimitDate));
                }
                //messageEntry.changeExpiration();

                // 既読要求
                $('input[name=read_request]').val([serverResponse.ReadRequestFlg]);

                if (messageEntry.mobileMode == "1") {
                    //モバイルは別ポップアップなので一旦変数に保持
                    if (String(serverResponse.Importance).length > 0) {
                        messageEntry.inputImportance = serverResponse.Importance;
                    }
                    
                    if (String(serverResponse.LimitDate).length > 0) {
                        messageEntry.inputRelativeDate = serverResponse.LimitDate;
                    }

                    if (String(serverResponse.ReadRequestFlg).length > 0) {
                        messageEntry.inputReadRequestFlg = serverResponse.ReadRequestFlg;
                    }
                }
                // --- 宛先 ----------

                var aryAddressGroupClass = String(serverResponse["AddressGroupClass"]).split("||");
                var aryAddressGroupId = String(serverResponse["AddressGroupId"]).split("||");
                var aryAddressGroupName = String(serverResponse["AddressGroupName"]).split("||");

                if (aryAddressGroupClass.length > 0) {
                    var destinationArrayList = new Array();
                    var addressInfo = "";

                    for (var i = 0; i < aryAddressGroupClass.length; i++) {

                        var addressGroupClass = aryAddressGroupClass[i];
                        var addressGroupId = aryAddressGroupId[i];
                        var addressGroupName = aryAddressGroupName[i];

                        destinationArrayList.push({
                            AddressGroupClass: addressGroupClass,
                            AddressGroupId: addressGroupId,
                            AddressGroupName: addressGroupName,
                            DispName: addressGroupName,
                        });

                        if (addressInfo.length > 0) {
                            addressInfo = addressInfo + "|";
                        }
                        addressInfo += addressGroupClass + "^" + addressGroupId + "^" + addressGroupName;
                    }

                    // 宛先選択のコールバック関数を使用して、宛先情報を保持させる。
                    getMessageDestinationResult(destinationArrayList, addressInfo);
                }         
            }
        },
        error: function () {
        }
    });

}
/**************************************************************** 
* 編　集： 2016.09.08 T.Yamamoto Add
* 機　能： 予約登録データ保存
****************************************************************/
messageEntry.saveWkMessage = function () {

    var importance = "";
    var subject = "";
    var bodyText = "";
    var relativeDateCode = 0;
    var relativeDate = 0;
    var readRequestFlg = 0;

    // 件名／本文
    var subject = $('#msgSubject').val();
    var bodyText = $('#msgArea').val();
    if (messageEntry.mobileMode == "1") {
        // 重要度
        importance = messageEntry.inputImportance;
        // 相対日付？日付指定？
        expirationDateClass = messageEntry.inputExpirationDateClass;
        if (expirationDateClass == 0) {
            //無期限
            relativeDate = 99999999
        } else if (expirationDateClass == 1) {
            //日付指定
            relativeDate = messageEntry.inputRelativeDate;
        } else {
            //相対日付
            relativeDateCode = messageEntry.inputRelativeDateCode;
            relativeDate = messageEntry.inputRelativeDate;
        }
        // 既読要求
        readRequestFlg = messageEntry.inputReadRequestFlg;
    } else {
        // 重要度
        importance = $("input[name='importance_level']:checked").val();
        // 相対日付？日付指定？
        expirationDateClass = $("input[name='expiration_date']:checked").val();
        if (expirationDateClass == 0) {
            //無期限
            relativeDate = 99999999
        } else if (expirationDateClass == 1) {
            //日付指定
            relativeDate = $("#datepickerpopup01").val().replace(/\//g, "");
        } else {
            //相対日付
            relativeDateCode = $("#relativedate_select").val();
            relativeDate = $("input[name='relative_date']:checked").val();
        }
        // 既読要求
        readRequestFlg = $("input[name='read_request']:checked").val();
    }

    //【件名未入力エラー】
    if (subject == "") {
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 7, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    // 8:宛先情報（宛先グループ種別^宛先グループID^宛先グループ名^宛先ID）
    var addressInfo = "";
    addressInfo = messageEntry.selectedAddressInfo;

    //【宛先情報未入力エラー】
    if (addressInfo == "") {
        commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 6, "", "commonscript.dialogclose();", "", "", 0);
        return false;
    }

    // 9:処理情報（アクティビティ種別^診療データ種別^由来区分^由来キー）
    var processInfo = "";
    var aryProcessInfo = new Array;
    for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
        var data = messageEntry.objSelectedAppendInfo[i];
        aryProcessInfo.push(data.ActivityType + "^" + data.MedicalDataType + "^" + data.DerivationClass + "^" + data.DerivationKey);
    }
    if (aryProcessInfo.length > 0) {
        processInfo = aryProcessInfo.join("|");
    } else {
        aryProcessInfo.push(messageEntry.activityType + "^" + messageEntry.medicalDataType + "^" + messageEntry.derivationClass + "^" + messageEntry.derivationKey);
        processInfo = aryProcessInfo.join("|");
    }

    //【処理情報選択時の患者未選択エラー】
    //if ((processInfo != "") && (messageEntry.inputPatientId == "")) {
    //    commonscript.dispMessageSync("CmMessageEntry", "CmMessage", 8, "", "commonscript.dialogclose();", "", "", 0);
    //    return false;
    //}

    //--------------------------------------
    // ﾒｯｾｰｼﾞ送信ﾃﾞｰﾀ保存
    //--------------------------------------
    var data = {
        "messageNo": messageEntry.messageNo,
        "patientId": messageEntry.inputPatientId,
        "importance": importance,
        "subject": subject.replace(/\t/g, '　'),
        "bodyText": bodyText.replace(/\t/g, '　'),
        "relativeDateCode": relativeDateCode,
        "relativeDate": relativeDate,
        "readRequestFlg": readRequestFlg,
        "addressInfo": addressInfo,
        "processInfo": processInfo,
        "departmentCode": messageEntry.departmentCode,
        "enforcedInfoUserId": messageEntry.enforcedInfoUserId
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/SetWkMessageSendData/',
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

    var sendMessageNo = serverResponse;

    //画面を閉じる(登録したメッセージ番号を送信)
    messageEntry.closeFormOk(sendMessageNo + "||" + addressInfo);
}
/**************************************************************** 
* 編　集： 2016.09.12 T.Yamamoto Add
* 機　能： 予約登録データ削除確認
****************************************************************/
messageEntry.deleteWkMessage = function () {
    commonscript.dispMessage("CmMessageEntry", "CmMessage", 2, "", "messageEntry.deleteWkMessageExecute();", "commonscript.dialogclose();", "", 0);
}
/**************************************************************** 
* 編　集： 2016.09.12 T.Yamamoto Add
* 機　能： 予約登録データ削除確認
****************************************************************/
messageEntry.deleteWkMessageExecute = function () {
    //--------------------------------------
    // ﾒｯｾｰｼﾞ送信ﾃﾞｰﾀ保存
    //--------------------------------------
    var data = {
        "messageNo": messageEntry.messageNo
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MessageEntry/DeleteWkMessageSendData/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);
    if ((serverResponse == null) || (serverResponse.length == 0) || (serverResponse == 0)) {
        //削除処理ｴﾗｰ
        return false;
    }

    var sendMessageNo = serverResponse;

    //画面を閉じる("MessageDelete"を送信)
    messageEntry.closeFormOk("Delete");
}
/****************************************************************
* 編　集： 2016.07.09 M.Matsuo Add
* 機　能： ×ボタン押下時の処理
* 引　数： elem：押下されたボタンの要素
* 戻り値： なし
****************************************************************/
messageEntry.clearInputText = function () {

    //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.S
    if (commonscript.getNativeMode() == 1) {
        commonscript.unLockPatientData([commonscript.getCookieItem("LoginSId"),
                                       messageEntry.myPrjId,
                                       commonscript.getCookieItem("TerminalId"),
                                       commonscript.getCookieItem("UserId"),
                                       "^CmMessageEntry",
                                       "Patient",
                                       messageEntry.inputPatientId]);

    }
    //[ 病院版対応：患者ID一括変換] 2017-11 山本 Add.E

    $('#msgPatientName').text('');
    messageEntry.inputPatientId = "";
}

/**************************************************************** 
* 編　集： 2016.09.02 M.Matsuo Add
* 機　能： コンテキストメニュー作成
* 引　数： strSelector:Jquery　セレクタ
*       ： strMenuContent:メニュー項目Json文字列
*       ： strTrigger:割り当てイベント right;右クリック left:左クリック
* 戻り値： なし
****************************************************************/
messageEntry.makeContextMenu = function (strSelector, strMenuContent, strTrigger) {

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

    var strSetContent = messageEntry.parseJson(strMenuContent);

    //var menuYKZ = {
    //   "add": { "name": "追加","disabled": false },
    //    "delete": { "name": "削除","disabled": false }
    //};

    $.contextMenu({
        selector: strSelector,
        trigger: strTrigger,
        build: function ($trigger, e) {

            //メニューの内容を設定
            var menuContent = $.extend(true, {}, strSetContent);

            //★条件によりメニューに表示する項目を制御する必要がある場合はここで変更する★
            /*
            if ($(e.currentTarget).hasClass('context_YKZ')) {
                //使用可否　disabled
                menuContent.add_ykz.disabled = true;
                //表示可否　visible
                menuContent.add_ykz.visible = false;
                //表示可否　name
                menuContent.add_ykz.name = "名称変更テスト";
            }
            */

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
                            messageEntry.copyStr = messageEntry.getSelectionText($this);  //document.getSelection().toString();
                            calledJS.setClipbord(messageEntry.copyStr); // [ 機能改善：右クリックメニュー追加] 2020-08 福元 Add
                            ret = document.execCommand("copy", false);
                        } else if (key == "menu_paste") {
                            // 貼付け
                            $this.focus();

                            // [ 機能改善：右クリックメニュー追加] 2020-08 福元 Mod.S
                            //var insText = messageEntry.copyStr;
                            var insText = calledJS.getClipbord();
                            // [ 機能改善：右クリックメニュー追加] 2020-08 福元 Mod.E
                            document.execCommand("insertHTML", false, insText);

                            $this.focus();

                        } else if (key == "menu_cut") {
                            // 切取り
                            $this.focus();

                            messageEntry.copyStr = messageEntry.getSelectionText($this);  //document.getSelection().toString();
                            calledJS.setClipbord(messageEntry.copyStr); // [ 機能改善：右クリックメニュー追加] 2020-08 福元 Add
                            ret = document.execCommand("cut", false);

                        } else if (key == "menu_stamp") {
                            // 選択文字列スタンプ登録
                            messageEntry.stampStr = messageEntry.getSelectionText($this);  //document.getSelection().toString();

                            // スタンプ登録画面表示
                            messageEntry.startRegistStamp(7);

                            // テキスト選択解除（無理やり）
                            $this[0].selectionStart = $this[0].selectionEnd;

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

messageEntry.getSelectionText = function (triggerElement) {
    var ta = triggerElement[0];
    var val = ta.value;
    var start = parseInt(ta.selectionStart, 10);
    var end = parseInt(ta.selectionEnd, 10);
    var txt = val.substring(start, end);
    return txt;
}

/**************************************************************** 
* 編　集： 2016.09.02 M.Matsuo Add
* 機　能： json復元
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.parseJson = function (pData) {
    try {
        pData = pData.replace(/\r\n|\r|\n/g, "");
        pData = pData.replace(/<(.*?)>/g, "");
        var pArray = $.parseJSON(pData);
        return pArray
    } catch (ex) {
        var errMessage = "データの読み込みでエラーが発生しました。<br>Json変換エラー";
        exceptionMessage(errMessage);
        //commonscript.dispMessage("OdOrder", "OrderCommon", 7, "オーダ情報の読み込みでエラーが発生した為終了します。<br>Json変換エラー", "commonscript.exitProgram()", "", "");
    }
}

//2016.11.07 A.Fukumoto Add.S 障害対応:モバイル時に患者選択がエンドレスになる
/**************************************************************** 
* 編　集： 2016.11.07 A.Fukumoto Add
* 機　能： 患者一覧からの戻り値処理(mobile用)
* 引　数： piPatientId:患者Id
* 引　数： piPatientName:患者名
* 戻り値： なし
****************************************************************/
function getPatientName(piPatientId, piPatientName){

    if ((messageEntry.objSelectedAppendInfo.length != 0) && (messageEntry.inputPatientId != piPatientId)) {
        //元の患者とIdが違う場合は元の患者に付随している関連情報を削除
        var arrayList = new Array;
        for (var i = 0; i < messageEntry.objSelectedAppendInfo.length; i++) {
            var list = messageEntry.objSelectedAppendInfo[i];
            //患者に付随する情報は除く（3:患者）
            if (list.DerivationClass == "3") { continue; }
            //戻り値配列に挿入
            arrayList.push({
                ActivityType: list.ActivityType,
                ActivityTypeName: list.ActivityTypeName,
                MedicalDataType: list.MedicalDataType,
                MedicalDataTypeName: list.MedicalDataTypeName,
                DerivationClass: list.DerivationClass,
                DerivationKey: list.DerivationKey,
                DerivationKeyName: list.DerivationKeyName,
                ItemName: list.ItemName
            });
        }
        // 関連情報選択のコールバック関数を使用して、関連情報を保持させる
        getMessageAppendResult(arrayList);
    }

    messageEntry.inputPatientId = piPatientId;
    $("#msgPatientName").text(piPatientName);

    return;
}
//2016.11.07 A.Fukumoto Add.E


/**************************************************************** 
* 編　集： 2017.08.31 A.kawahara Add
* 機　能： 【Html5】PostMessage受信
* 引　数： メッセージ
* 戻り値： なし
****************************************************************/
messageEntry.receiveMessage = function (event) {
    var data = event.data;
    var senddata;
    if ("stampNameRefresh" == data.message) {
        senddata = new Object();
        senddata.message = data.message;
        senddata.stampManageName = data.stampManageName;
        if (data.stampForm == 5) {
            commonscript.postMessageToFrame("ifrmStampBox", senddata);
        }
        //[林眼科病院様向けMan･Go!リプレース：No.28 スタンプショートカット機能追加] 2022-09 狩野 Add S
    } else if (data.message == "jumpStamp") {
        var stampId = data.targetid;
        if (!commonscript.NullChk(stampId)) { return; };

        // 更新対象スタンプ情報を取得
        var stampCategory = data.category;
        if (!commonscript.NullChk(stampCategory)) {
            var stampInfo = "";
            if (data.stamptype == "31") {
                //リンク元のスタンプIDに置換
                stampInfo = document.getElementById('ifrmStampBox').contentWindow.stampcommon.getTargetStampData(stampId, 0, "Y");
                if (!commonscript.NullChk(stampInfo)) {
                    //元が削除されている(見つからない)
                    commonscript.dispMessageSync("StStampBox", "Common", 99, "既に削除されています。", "commonscript.dialogclose();", "", "", 1);
                    return;
                }
            } else {
                stampInfo = stampcommon.getTargetStampData(stampId, 0, "N");
            }

            if (!commonscript.NullChk(stampInfo)) { return; }

            stampCategory = stampInfo.StampCategory;

            if (data.stamptype == "31") {
                //リンク元のスタンプIDに置換
                stampId = stampInfo.StampId;
            }
        };

        // 指定ノードまでジャンプ
        document.getElementById('ifrmStampBox').contentWindow.stampbox.jump(stampId, stampCategory, 1);
        //[林眼科病院様向けMan･Go!リプレース：No.28 スタンプショートカット機能追加] 2022-09 狩野 Add E
    }

}