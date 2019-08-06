/*
MIT License
Copyright (c) 2018 Cybozu
https://github.com/kintone/SAMPLE-Profile-tooltip-Plug-in/blob/master/LICENSE
*/
(function(PLUGIN_ID) {
  'use strict';
  /* global tippy */

  // Get plug-in configuration settings
  var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!CONFIG) {
    return false;
  }
  // Get each setting
  var CONFIG_NAME = CONFIG.name;

  // Keys and titles of user data to display
  var INFOLIST = [
    {key: 'email', title: 'Email'},
    {key: 'phone', title: 'Phone'},
    {key: 'mobilePhone', title: 'Mobile Phone'},
    {key: 'timezone', title: 'Time Zone'}
  ];

  kintone.events.on('app.record.detail.show', function(event) {
    var record = event.record;
    var userFieldVal = record[CONFIG_NAME].value;
    if (userFieldVal.length === 0) {
      return event;
    }

    // Get the element of the specified User Selection field
    var targetField = kintone.app.record.getFieldElement(CONFIG_NAME);
    var targetLink = targetField.querySelectorAll('a');

    // Get the code (login name) from the user data
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

      // Sort the retrieved user data in order of how they are listed in the User Selection field
      respUserData.sort(function(x, y) {
        return fieldValCodeList.indexOf(x.code) - fieldValCodeList.indexOf(y.code);
      });

      // Create the HTML to display in the tooltip
      var htmlContainer = respUserData.map(function(value, index) {
        // Add an identifier to each node
        targetLink[index].setAttribute('data-template', index);
        return createTableTag(value);
      });

      tippy(targetLink, {
        arrow: true,
        arrowType: 'round',
        animation: 'scale',
        interactive: true,
        placement: 'right',
        content: function(reference) {
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
