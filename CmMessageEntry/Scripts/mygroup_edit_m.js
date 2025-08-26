
var myGroupEditM = {};

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
    var otherHeight = $('#menu_container').outerHeight(true) + $('#selectList_label').outerHeight(true);
    var contentHeight = select_containerHeight - otherHeight;
    $('#select_container').css('height', contentHeight + 'px');

    /* マイグループ:ドロップダウン調整 */
    var contentWidth = $('.row03').outerWidth(true);
    var otherWidth =  $('#grSort_btn').outerWidth(true) + 20;
    contentWidth = contentWidth - otherWidth;
    $('.myGroupName_drpdwn').css('width', contentWidth + 'px');

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