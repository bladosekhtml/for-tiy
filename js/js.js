$(document).ready(function () {
   $('.menu-link').on('click', function () {
      let list = document.getElementsByClassName('menu-link');
      let index = 1;
      $('.menu-link').removeClass('ActiveLink');
      $(this).addClass('ActiveLink');
      for (let i = 0; i < list.length; i++) {
         if ($(list[i]).hasClass('ActiveLink')) {
            index = i;
            break;
         }
      }
      $('main').css('transform', 'translateX(' + -(index * 100) + 'vw)');
   });
});