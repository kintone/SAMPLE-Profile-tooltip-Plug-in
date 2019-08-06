/*
MIT License
Copyright (c) 2018 Cybozu
https://github.com/kintone/SAMPLE-Profile-tooltip-Plug-in/blob/master/LICENSE
*/
jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';
  // Get configuration settings
  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropDown() {
    // Retrieve field information, then set drop-down
    return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET',
      {'app': kintone.app.getId()}).then(function(resp) {

      for (var key in resp.properties) {
        if (!resp.properties.hasOwnProperty(key)) {
          continue;
        }
        var prop = resp.properties[key];
        var $option = $('<option>');

        switch (prop.type) {
          // Only pick User Selection field
          case 'USER_SELECT':
            $option.attr('value', prop.code);
            $option.text(escapeHtml(prop.label));
            $('#select_name_field').append($option.clone());
            break;
          default:
            break;
        }
      }
      // Set default values
      $('#select_name_field').val(CONF.name);
    }, function(resp) {
      return alert('Failed to retrieve field(s) information');
    });
  }

  $(document).ready(function() {
    // Set drop-down list
    setDropDown();

    // Set input values when 'Save' button is clicked
    $('#check-plugin-submit').click(function() {
      var config = [];
      var name = $('#select_name_field').val();

      // Check required fields
      if (name === '') {
        alert('Please set required field(s)');
        return;
      }
      config.name = name;

      kintone.plugin.app.setConfig(config);
    });
    // Process when 'Cancel' is clicked
    $('#check-plugin-cancel').click(function() {
      history.back();
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
