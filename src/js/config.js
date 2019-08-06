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
  var $form = $('.js-submit-settings');
  var $cancelButton = $('#js-cancel-button');
  var $name = $('select[name="js-select-name-field"]');

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropDown() {
    // Retrieve field information, then set drop-down
    KintoneConfigHelper.getFields('USER_SELECT').then(function(resp) {

      resp.forEach(function(field) {
        var $option = $('<option>');
        $option.attr('value', field.code);
        $option.text(escapeHtml(field.label));
        $name.append($option.clone());
      });
      // Set default values
      $name.val(CONF.name);
    }).catch(function(resp) {
      alert('Failed to retrieve field(s) information');
    });
  }

  // Set drop-down list
  setDropDown();

  // Set input values when 'Save' button is clicked
  $form.on('submit', function(e) {
    e.preventDefault();
    var config = [];
    var name = $name.val();

    // Check required fields
    if (name === '') {
      alert('Please set required field(s)');
      return;
    }
    config.name = name;

    kintone.plugin.app.setConfig(config);
  });
  // Process when 'Cancel' is clicked
  $cancelButton.click(function() {
    window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);
