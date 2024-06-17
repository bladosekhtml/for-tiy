$(document).ready(function () {
   users = []
   function NewUser(name, age, gender) {
      return {
         name: name,
         age: age,
         gender: gender,
         status: 0,
         create: new Date(),
         edit: new Date(),
         games: 0,
         win: 0,
         lose: 0
      }
   }
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

   $('#AddPlayer').on('click', function () {
      document.getElementsByName('gender')[0].checked = false;
      document.getElementsByName('gender')[1].checked = false;
      $('.RadioEdit').css('background-color', '#ffffff');
      $('.RadioEdit').css('border-color', '#dcdcdf');
      document.getElementById('AgePlayer').value = '';
      document.getElementById('NamePlayer').value = '';

      $('.NewPlayer').fadeIn();
      $('#overlay').fadeIn();
      $('body').css('overflow-y', 'hidden');
   })

   $('#CloseNewPlayer').on('click', function () {
      $('.NewPlayer').css('display', 'none');
      $('#overlay').fadeOut();
      $('body').css('overflow-y', 'scroll');
   })
   const numberInput = document.getElementById('AgePlayer');
   numberInput.addEventListener('input', function (event) {
      const inputValue = event.target.value;
      const filteredValue = inputValue.replace(/\D/g, '');
      event.target.value = filteredValue;
   });
   const nameInput = document.getElementById('NamePlayer');
   nameInput.addEventListener('input', function (e) {
      const inputValue = e.target.value;
      const filteredValue = inputValue.replace(/[^A-Za-zА-Яа-я ]/g, '');
      e.target.value = filteredValue;
   })
   $('.GenderRadio').on('click', function () {
      $('.RadioEdit').css('background-color', '#ffffff');
      $('.RadioEdit').css('border-color', '#dcdcdf');
      if ($(this).val() == 0) {
         $('.RadioEdit0').css('background-color', '#60C2AA');
         $('.RadioEdit0').css('border-color', '#60C2AA');
      } else {
         $('.RadioEdit1').css('background-color', '#60C2AA');
         $('.RadioEdit1').css('border-color', '#60C2AA');
      }
   })

   $('#CreateNewPlayer').on('click', async function () {
      let count = 0;
      if ($('#NamePlayer').val() == '') {
         $('#NamePlayer').css('border', 'red 1px solid');
         count += 1;
      } else { $('#NamePlayer').css('border', '#DCDCDF 1px solid'); }
      if ($('#AgePlayer').val() == '') {
         $('#AgePlayer').css('border', 'red 1px solid');
         count += 1;
      } else { $('#AgePlayer').css('border', '#DCDCDF 1px solid'); }
      R0 = document.getElementsByName('gender')[0].checked;
      R1 = document.getElementsByName('gender')[1].checked;
      if (!(R0 || R1)) {
         $('.RadioEdit').css('border', 'red 1px solid');
         count += 1;
      } else { $('.RadioEdit').css('border', '#DCDCDF 1px solid'); }
      if (count == 0) {
         $('.NewPlayer').css('display', 'none');
         $('#overlay').fadeOut();
         $('body').css('overflow-y', 'scroll');

         let NamePlayer = document.getElementById('NamePlayer').value;
         let AgePlayer = document.getElementById('AgePlayer').value;
         let GenderPlayer = R0 ? 0 : 1;

         users[users.length] = NewUser(NamePlayer, AgePlayer, GenderPlayer);
      }
   });
})
