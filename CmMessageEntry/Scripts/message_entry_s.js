
var messageEntryS = {};

/**************************************************************** 
* 編　集： 2015.11.07 T.Kobayashi Mod
* 機　能： 画面レイアウト設定
* 引　数： なし
* 戻り値： なし
****************************************************************/
var loadFlg = false;
function editPageLayout() {
    // 画面の高さを取得して、変数wHに代入
    var wH = $(window).height();
    // ヘッダ・フッター部分の高さを取得
    var hH = parseInt($('#header_container').outerHeight(true)) + parseInt($('#footer_container').outerHeight(true)) + 38;
    var contentHeight = wH - hH;

    // #table_containerに高さを加える
    $('#textarea_container').css('height', contentHeight + 'px');
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
