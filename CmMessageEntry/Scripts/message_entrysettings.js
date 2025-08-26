
var messageEntrySettings = {};

messageEntrySettings.myPrjId = "CmMessageEntry";
messageEntrySettings.myPrgId = "MessageEntrySettings";

//--------------------------------------------------------------------------------------
$(function () {

    // クエリストリング復号化
    var strQval = document.getElementById("Qval").value;
    var strQdata = document.getElementById("Qdata").value;
    if (strQval.length > 0) {
        var retObj = commonscript.getDcryptQueryString(messageEntrySettings.myPrjId, strQval, strQdata);
        if (retObj != "ERR") {
            // ログイン情報をcookieへ保存
            objArgument = $.extend(true, {}, retObj);
            //displayconditions.mode = objArgument["DispMode"];
        }
    }

    //画面初期化
    messageEntrySettings.initForm();

});

/**************************************************************** 
* 編　集： 2015.11.07 T.Kusumoto Mod
* 機　能： 画面レイアウト設定
          （画面幅を基準としてモバイル用とPC用の処理へ分岐）
* 引　数： なし
* 戻り値： なし
****************************************************************/
var loadFlg = false;
function editPageLayout() {

    // 画面の高さを取得して、変数wHに代入
    var wH = $(window).height();
    // フッターの高さを取得
    var fH = $('#msg_footer').outerHeight(true);
    var contentHeight = wH - (fH + 5);
    // #msg_containerに高さを加える
    $('#main_container').css('height', contentHeight + 'px');
        

    // 初回読み込み時
    if (!loadFlg) {

        // ラジオボタン処理読込
        messageEntrySettings.changeExpirationView();

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
function closingWindow(e) {

}

/**************************************************************** 
* 編　集： 2015.12.01 T.Kusumoto Add
* 機　能： 有効期限のラジオボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntrySettings.changeExpirationView = function () {

    $('input[name=expiration_date]').change(function () {
        $('.radio_inr').hide('fast');
        if ($("input:radio[name='expiration_date']:checked").val() == "0") {
            $('.radio_inr').hide('fast', function () {
                
            });
        } else if ($("input:radio[name='expiration_date']:checked").val() == "2") {
            $('#relative_period').show('fast', function () {
                
            });
        } else if ($("input:radio[name='expiration_date']:checked").val() == "1") {
            $('#designation_period').show('fast', function () {
                
            });
        }
    }).trigger('change');

}

/**************************************************************** 
* 編　集： 2015.12.01 T.Kusumoto Add
* 機　能： 有効期限のセレクトボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntrySettings.changeSelectRelative = function () {

    var selectVal = $('#relative_period select').val();
    var selectCalculatedClass = parent.messageEntry.objRelativeDateList[selectVal].CalculatedClass;

    if (parent.messageEntry.lastSelectedCalculatedClass != selectCalculatedClass) {
        $('.relative_select_inr').css('display', 'none');
        if (selectCalculatedClass == 1) {
            $('.relative_select_inr').eq(1).fadeIn(200, function () {

            });
        } else {
            $('.relative_select_inr').eq(0).fadeIn(200, function () {

            });
        }
        parent.messageEntry.lastSelectedCalculatedClass = selectCalculatedClass;
    }
    
}

/**************************************************************** 
* 編　集： 2015.11.05 T.Kusumoto Add
* 機　能： フォーム内の文字削除
* 引　数： 削除するフォームID
* 戻り値： なし
****************************************************************/
messageEntrySettings.clearForm = function (frmId) {
    document.getElementById(frmId).value = ""
}

messageEntrySettings.initForm = function () {
    
    //入力者（デフォルト：ログインユーザ）
    $("#input_user").text(parent.messageEntry.inputUserName);

    //指定日（デフォルト：システム日付）
    var sysDateTime = commonscript.getServerDateTime(messageEntrySettings.myPrjId);
    var sysDate = sysDateTime.split(',')[1];
    $("#datepickerpopup01").val(commonscript.DateFormatChg(sysDate));

    //相対日付リスト
    var select = document.getElementById("relativedate_select");
    for (var i = 0; i < parent.messageEntry.objRelativeDateListFromDB.length; i++) {
        var info = parent.messageEntry.objRelativeDateListFromDB[i];
        var relativeDateCode = info.RelativeDateCode;
        var relativeDateName = info.RelativeDateName;
        var calculatedClass = info.CalculatedClass;
        var addValue = info.AddValue;
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
    //$("#relativedate_select").val(parent.messageEntry.inputRelativeDateCode);

    if (window.parent.messageEntry.stampEditMode == 2) {
        //登録モードは日付指定のみ
        parent.messageEntry.inputExpirationDateClass = 1;
        $("#radio_relative").hide();
        $("#radiolabel_relative").hide();
    }
    // 重要度
    $("input[name='importance_level']").val([parent.messageEntry.inputImportance]);

    // 相対日付？日付指定？
    $("input[name='expiration_date']").val([parent.messageEntry.inputExpirationDateClass]);
    $("input:radio[name='expiration_date']:checked").change();

    var relativeDateCode = 0;
    var relativeDate = 0;
    if (parent.messageEntry.inputExpirationDateClass == 0) {
        //無期限
    } else if (parent.messageEntry.inputExpirationDateClass == 1) {
        //日付指定
        $("#datepickerpopup01").val(commonscript.DateFormatChg(parent.messageEntry.inputRelativeDate));
    } else {
        //相対日付
         $("#relativedate_select").val(parent.messageEntry.inputRelativeDateCode);
         $("input[name='relative_date']").val([parent.messageEntry.inputRelativeDate]);
    }

    // 既読要求
    $("input[name='read_request']").val([parent.messageEntry.inputReadRequestFlg]);

}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： OKボタン
****************************************************************/
messageEntrySettings.onClickOK = function () {
    var result = new Array;

    //親画面の変数に退避

    // 重要度
    parent.messageEntry.inputImportance = $("input[name='importance_level']:checked").val();

    // 相対日付？日付指定？
    var expirationDateClass = $("input[name='expiration_date']:checked").val();
    parent.messageEntry.inputExpirationDateClass = expirationDateClass;
    
    var relativeDateCode = 0;
    var relativeDate = 0;
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
    parent.messageEntry.inputRelativeDateCode = relativeDateCode;
    parent.messageEntry.inputRelativeDate = relativeDate;

    // 既読要求
    parent.messageEntry.inputReadRequestFlg = $("input[name='read_request']:checked").val();

    //閉じる
    messageEntrySettings.close();
};

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： 閉じる
****************************************************************/
messageEntrySettings.close = function () {
    if (window == parent) {
        //単独起動した場合
        commonscript.exitProgram();
    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
};
