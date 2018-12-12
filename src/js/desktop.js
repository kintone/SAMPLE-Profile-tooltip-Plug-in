/*
MIT License
Copyright (c) 2018 Cybozu
https://github.com/kintone/SAMPLE-Profile-tooltip-Plug-in/blob/master/LICENSE
*/
(function(PLUGIN_ID) {
    'use strict';
    /* global tippy */

    // Get plugin configuration settings
    var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (!CONFIG) {
        return false;
    }
    // Get each settings
    var CONFIG_NAME = CONFIG.name;

    // 表示するユーザー情報の表示用タイトルとキー
    var INFOLIST = [
        {key: 'email', title: 'Email'},
        {key: 'phone', title: 'Phone'},
        {key: 'mobilePhone', title: 'Mobile Phone'},
        {key: 'timezone', title: 'Time Zone'}
    ];

    kintone.events.on('app.record.detail.show', function(event) {
        var record = event.record;
        var userFieldVal = record[CONFIG_NAME].value;
        if (userFieldVal.length === 0) {return event;}

        // 対象のユーザー選択フィールド要素を取得
        var targetField = kintone.app.record.getFieldElement(CONFIG_NAME);
        var targetLink = targetField.querySelectorAll('a');

        // ユーザー情報からcodeだけを抜く
        var fieldValCodeList = userFieldVal.map(function(value) {
            return value.code;
        });

        var body = {'codes': fieldValCodeList};
        kintone.api(kintone.api.url('/v1/users', true), 'GET', body, function(resp) {
            var respUserData = resp.users;

            function createTableTag(userData) {
                var table = '<table class="Tooltip-table">';
                INFOLIST.forEach(function(userInfoType) {
                    table += '<tr>'
                    + '  <td>' + userInfoType.title + '</td>'
                    + '  <td>: ' + userData[userInfoType.key] + '</td>'
                    + '</tr>';
                });
                table += '</table>';
                return table;
            }

            // 取得したユーザーデータを、ユーザーフィールドの値の順番にソートする
            respUserData.sort(function(x, y) {
                return fieldValCodeList.indexOf(x.code) - fieldValCodeList.indexOf(y.code);
            });

            // ツールチップに表示するhtmlのリスト生成
            var htmlContainer = respUserData.map(function(value, index) {
                // フィールドの各値に識別用の属性を追加
                targetLink[index].setAttribute('data-template', index);
                return createTableTag(value);
            });

            tippy(targetLink, {
                arrow: true,
                arrowType: 'round',
                animation: 'scale',
                interactive: true,
                placement: 'right',
                content(reference) {
                    return htmlContainer[reference.getAttribute('data-template')];
                }
            });
        }, function(error) {
            // error
            console.log(error);
        });
        return event;
    });
})(kintone.$PLUGIN_ID);
