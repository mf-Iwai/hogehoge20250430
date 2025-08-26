
var messageStamp = {};

/**************************************************************** 
* 編　集： 2016.02.01 T.Kusumoto Mod
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
    //var infoH = $('#relation_info_box').outerHeight(true);
    var msgH = contentHeight - (trmH + 50);
    $('#message_box textarea').css('height', msgH + 'px');

    // #left_contentに幅を加える
    var contentWidth = $('#msg_container').outerWidth(true);
    var rightW = $('#right_content').outerWidth(true);
    var leftW = contentWidth - rightW;
    $('#left_content').css('width', leftW - 3 + 'px');


        

    // 初回読み込み時
    if (!loadFlg) {
        // ラジオボタン処理読込
        messageEntry.changeExpirationView();
        // プラグイン読み込み
        messageEntry.plugin();

        loadFlg = true;

    } else {

    }

}

/**************************************************************** 
* 編　集： 2016.02.01 T.Kusumoto
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
* 編　集： 2016.02.01 T.Kusumoto Add
* 機　能： Windowクローズイベント取得(カラ)
* 引　数： e:イベント
* 戻り値： なし
****************************************************************/
function closingWindow(e) {

}

/**************************************************************** 
* 編　集： 2016.02.01 T.Kusumoto Add
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
* 編　集： 2016.02.01 T.Kusumoto Add
* 機　能： 有効期限のラジオボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
messageEntry.changeExpirationView = function () {
    $('input[name=expiration_date]').change(function () {
        $('.radio_inr').hide('fast');

        if ($("input:radio[name='expiration_date']:checked").val() == "1") {
            $('.radio_inr').hide('fast', function () {
                // メッセージ部リサイズ
                messageEntry.msgBoxResize();
            });
        } else if ($("input:radio[name='expiration_date']:checked").val() == "2") {
            $('#relative_period').show('fast', function () {
                messageEntry.msgBoxResize();
            });
        } else if ($("input:radio[name='expiration_date']:checked").val() == "3") {
            $('#designation_period').show('fast', function () {
                messageEntry.msgBoxResize();
            });
        }
    }).trigger('change');

}

/**************************************************************** 
* 編　集： 2016.02.01 T.Kusumoto Add
* 機　能： 有効期限のセレクトボタン内容切り替え
* 引　数： なし
* 戻り値： なし
****************************************************************/
// 前回のオプションの値
var beforVal = 'week';
messageEntry.changeSelectRelative = function () {
    var getSelectVal = $('#relative_period select').val();
    if (beforVal !== getSelectVal) {
        $('.relative_select_inr').css('display', 'none');
        switch (getSelectVal) {
            case '':
                $('.relative_select_inr').eq(0).fadeIn(200, function () {
                    // メッセージ部リサイズ
                    messageEntry.msgBoxResize();
                });
                break;
            case 'week':
                $('.relative_select_inr').eq(1).fadeIn(200, function () {
                    messageEntry.msgBoxResize();
                });
        }
        beforVal = getSelectVal;
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
    //var infoH = $('#relation_info_box').outerHeight(true);
    var msgH = contentHeight - (trmH + 50);
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