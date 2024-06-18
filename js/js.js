$(document).ready(function () {
   /* ========================Импорт переменных===================================*/

   let params = new URLSearchParams(window.location.search);
   users = JSON.parse(decodeURIComponent(params.get('var1'))); //Массив логинов и паролей
   if (users == null || users == '') { users = [] }
   usersLog = params.get('var2'); //Логины
   if (usersLog == null || usersLog == '') { usersLog = [] } else { usersLog = usersLog.split(','); }
   StatusLog = params.get('var3'); //Статус входа
   if (StatusLog == null || StatusLog == '') { StatusLog = 0 } else if (StatusLog == 1) { $('.head__door').addClass('green') }

   /*============================================= Переменные ============================*/
   players = []
   ListIndex = 0



   /*============================================ Запрет ввода =================================*/
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
   /* ===================================================Функции===================================*/
   // Доабвление нового элемента в список
   function NewPlayer(name, age, gender) {
      return {
         name: name,
         age: age,
         gender: gender,
         status: 0,
         create: new Date(),
         edit: new Date(),
         games: 0,
         win: 0,
         lose: 0,
         lock: 0,
      }
   }
   //Сделай дату красивой
   function formatDate(date) {
      const months = [
         "января", "февраля", "марта",
         "апреля", "мая", "июня",
         "июля", "августа", "сентября",
         "октября", "ноября", "декабря"
      ];

      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();

      return `${day} ${months[monthIndex]} ${year}`;
   }
   /*==============================================Обработчики на клик=================================*/
   // Вход - выход
   $('.head__door').on('click', function () {
      if (StatusLog == 0) {
         window.location.href = '../log.html?var1=' + encodeURIComponent(JSON.stringify(users)) + '&var2=' + encodeURIComponent(usersLog.join(',')) + '&var3=' + encodeURIComponent(StatusLog);
      } else {
         $('.head__door').removeClass('green')
         StatusLog = 0;
         window.location.href = '../xoxo.html?var1=' + encodeURIComponent(JSON.stringify(users)) + '&var2=' + encodeURIComponent(usersLog.join(',')) + '&var3=' + encodeURIComponent(StatusLog);
      }
   })
   //Красивые кнопочки
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
   //Добавление игрока
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
   // закрытие окна
   $('#CloseNewPlayer').on('click', function () {
      $('.NewPlayer').css('display', 'none');
      $('#overlay').fadeOut();
      $('body').css('overflow-y', 'scroll');
   })
   // красивые радио
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

   // Создание нового игрока
   $('#CreateNewPlayer').on('click', function () {
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

         let player = NewPlayer(NamePlayer, AgePlayer, GenderPlayer);
         players[players.length] = player;
         let newRow = '<tr>' +
            '<td>' + player.name + '</td>' +
            '<td>' + player.age + '</td>' +
            '<td><img style="width: 24px; height: 24px;" src="/img/Gender' + (player.gender == 0 ? 0 : 1) + '.png"></td>' +
            '<td><div class="LockStatus LockStatus0"></div></td>' +
            '<td>' + formatDate(player.create) + '</td>' +
            '<td>' + formatDate(player.edit) + '</td>' +
            '<td><button type="button" class="LockButton LockButton0" data-index = ' + ListIndex + '></button></td>' +
            '</tr>';
         ListIndex += 1;
         $('#PlayerList-t tbody').append(newRow);
      }
   });

   //Блокировка пользователей
   $('.LockButton').on('click', function(){
      $(this).toggleClass('LockButton0')
      $(this).toggleClass('LockButton1')

      let table = document.getElementById('PlayerList-t');
      let row = table.rows[parseInt(this.getAttribute('data-index'))];
      let col = row.ceils[3];
      let innerDiv = col.querySelector('.LockStatus');
      innerDiv.toggleClass('LockStatus1');
      innerDiv.toggleClass('LockStatus0');
   })
})
