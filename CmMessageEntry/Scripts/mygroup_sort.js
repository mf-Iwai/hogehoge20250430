
var myGroupSort = {};

$(function () {

    // リスト表示
    myGroupSort.dispList();

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
* 編　集： 2015.02.26 M.Matsuo Add
* 機　能： 閉じる
****************************************************************/
myGroupSort.close = function () {
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
* 編　集： 2015.02.26 M.Matsuo Add
* 機　能： [OK]ボタンクリックイベント
****************************************************************/
myGroupSort.ok = function () {

    //並び順更新
    myGroupSort.updateAddressGroupDispNo();

    //画面を閉じる
    myGroupSort.close();
}

/**************************************************************** 
* 編　集： 2015.02.26 M.Matsuo Add
* 機　能： マイグループ
* 引　数： なし
* 戻り値： なし
****************************************************************/
myGroupSort.dispList = function () {

    //リストクリア
    $("#groupList > li").remove();

    //データ取得
    var data = {
        "addressGroupClass": 2,
        "includeDel": 1
    };
    var jsonString = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/GetAddressGroupList/',
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

                //リストクリア
                $("#groupList > li").remove();

                // ul要素取得
                var ulElem = document.getElementById("groupList");

                for (var i = 0; i < serverResponse.length; i++) {

                    var addressGroupId = serverResponse[i].AddressGroupId;
                    var addressGroupName = serverResponse[i].AddressGroupName;
                    var delFlg = serverResponse[i].DelFlg;

                     //<li>
                     //    <span>テストグループ</span>
                     //    <div class="sortMenu_container clearfix">
                     //        <input type="button" id="" class="BtnBtn btn04 sortUp_btn" value="" onclick="">
                     //        <input type="button" id="" class="BtnBtn btn04 c" value="" onclick="">
                     //    </div>
                     //</li>

                    var list = document.createElement('li');
                    list.setAttribute("id", addressGroupId);
                    list.setAttribute("data-name", addressGroupName);
                    list.setAttribute("data-delflg", delFlg);

                    var span = document.createElement('span');
                    span.innerHTML = addressGroupName;

                    var div = document.createElement('div');
                    div.setAttribute("class", "sortMenu_container clearfix");

                    var inputU = document.createElement('input');
                    inputU.setAttribute("type", "button");
                    inputU.setAttribute("class", "BtnBtn btn04 sortUp_btn");
                    inputU.setAttribute("onclick", "myGroupSort.sortListItem(this, 'U');");

                    var inputD = document.createElement('input');
                    inputD.setAttribute("type", "button");
                    inputD.setAttribute("class", "BtnBtn btn04 sortDown_btn");
                    inputD.setAttribute("onclick", "myGroupSort.sortListItem(this, 'D');");


                    div.appendChild(inputU);
                    div.appendChild(inputD);
                    list.appendChild(span);
                    list.appendChild(div);


                    // LIST項目を追加
                    ulElem.appendChild(list);

                }
            }
        },
        error: function () {
        }
    });
}

/**************************************************************** 
* 編　集： 2015.10.29 J.Kodama Add
* 機　能： 繰返し項目の順番変更
* 引　数： myElement : 追加ボタンが押された要素
* 　　　： upDownFlg : 上に上げるか下に下げるかのフラグ(U:上，D:下）
* 戻り値： なし
****************************************************************/
myGroupSort.sortListItem = function (myElement, upDownFlg) {

    // 自分自身の要素を取得する
    var myElem = document.getElementById(myElement.parentElement.parentElement.id);
    var myElemRepId = myElem.id.split('_')[0] + '_';

    // 自分の親ノードの要素を取得する
    var parentElem = myElem.parentElement;

    if (upDownFlg == 'U') {
        // 上げる場合は、自分自身が繰返し項目の１番目にある場合は何もしない
        // 上要素の内容取得 
        var prev_element = $(myElem).prev();
        if (prev_element.length > 0) {
            // 直前の同じ繰り返し項目を自分の直後に移動する
            $(myElem).after(prev_element);
        }

    } else if (upDownFlg == 'D') {
        // 下げる場合は、自分自身が繰返し項目の最後にある場合は何もしない
        // 下要素の内容取得 
        var next_element = $(myElem).next();
        if (next_element.length > 0) {
            // 直後の同じ繰り返し項目を自分の直前に移動する
            $(myElem).before(next_element);
        }
    }

}


myGroupSort.updateAddressGroupDispNo = function () {

    var addressGroupIdList = "";

    //表示リストをループ
    var list = new Array;
    $('ul#groupList li').each(function () {
        //戻り値配列に挿入
        list.push($(this).attr('id'));
    });
    if (list.length > 0) {
        addressGroupIdList = list.join(',');
    }
    
    var data = {
        "addressGroupIdList": addressGroupIdList
    };
    var jsonString = JSON.stringify(data);
    //同期通信
    var result = $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: '/CmMessageEntry/MyGroup/UpdateAddressGroupDispNo/',
        data: jsonString,
        async: false,
        traditional: true
    }).responseText;
    var serverResponse = JSON.parse(result);

    if (serverResponse != 1) {
        //更新失敗
        commonscript.dispMessage("CmMessageEntry", "CmMessage", 5, "", "commonscript.dialogclose();","","",0);
        return false;
    } else {
        return true;
    }
}