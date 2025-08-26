
var myGroupRegister = {};

$(function () {
    // リアルタイムバリデーションチェックのための処理
    $("#inputarea").validationEngine({
        promptPosition: "bottomLeft"
    });
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
    // フッターの高さを取得
    var fH = $('#footer_container').outerHeight(true);
    var contentHeight = wH - (fH + 10);
    // #main_containerに高さを加える
    $('#main_container').css('height', contentHeight + 'px');

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

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [保存]ボタンクリックイベント
****************************************************************/
myGroupRegister.save = function () {

    var result = $('#grTitle_input').val();
    if (result.trim().length == 0) {
        $('#grTitle_input').focus();
        return;
    }

    //呼出元コールバック
    parent.getMyGroupRegisterResult(result);
    //閉じる
    myGroupRegister.close();
}

/**************************************************************** 
* 編　集： 2016.02.26 M.Matsuo Add
* 機　能： [閉じる]ボタンクリックイベント
****************************************************************/
myGroupRegister.close = function () {
    if (window == parent) {
        //単独起動した場合
        commonscript.exitProgram();
    } else {
        // ﾀﾞｲｱﾛｸﾞ表示した場合
        var id = window.frameElement.id;
        window.parent.$("#" + id).dialog("destroy").remove();
    }
}
