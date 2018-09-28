'use strict';

$(document).ready(function () {
  $('.create-view-container').hide();
  $('.book-view-update').hide();
});

$('button').click(function () {
  const myClass = $(this).attr('class').split(' ')[1];
  $(`.${myClass}`).show();
  $(`.button-id.${myClass}`).hide();
});

$('button').click(function () {
  if ($(this).attr('class').split(' ')[0] === 'create-view-container') {
    const hideForm = $(this).attr('class').split(' ')[0];
    const showButtons = $(this).attr('class').split(' ')[1];
    $(`.${hideForm}`).hide();
    $(`.button-id.${showButtons}`).show();
  }
});

$('button').click(function () {
  if ($(this).attr('class') === 'edit') {
    $('.book-view-update').toggle();
    $('.detail-view.container').toggle();
  }
});
