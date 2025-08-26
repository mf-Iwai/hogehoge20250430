
var groupEdit = {};

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
    var msgH = contentHeight - (trmH + infoH + 90);
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
