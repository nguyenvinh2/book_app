'use strict';

$(document).ready(function () {
  $('.create-view-container').hide();
});

$('button').click(function () {
  const myClass = $(this).attr('class').split(' ')[1];
  $(`.${myClass}`).show();
  $(`.button-id.${myClass}`).hide();
});


//function enterForm() {

//}