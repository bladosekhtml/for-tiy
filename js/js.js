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
   ListIndex = 1
   games = []

   /*====================================Отключаем дефолтное поведение====================*/
   $('#chat-message').on('keydown', function (event) {
      if (event.keyCode === 13) {
         event.preventDefault();
         $('#btnd').trigger('click');
      }
   });
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
         status: 1,
         create: new Date(),
         edit: new Date(),
         games: 0,
         win: 0,
         lose: 0,
         lock: 0,
      }
   }

   // Добавление игры в историю 
   function NewGame(win, time, px, po, dat) {
      return {
         playerx: px,
         playero: po,
         data: dat,
         time: time,
         win: win
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
   //Вывод всех активных игроков //Лист в чате
   function AllFree() {
      var freeplayers = document.querySelectorAll('select');
      var selCode = '';
      let ulCodePlayer = '';

      for (let player of players) {
         if (player.status === 1) {
            selCode += '<option value = "' + player.name + '">' + player.name + '</option>';
            ulCodePlayer += '<li>' + player.name + '</li>'
         }
      }

      freeplayers.forEach(element => {
         element.innerHTML = selCode;
      });
      document.getElementById('listPChat').innerHTML = ulCodePlayer;
   }

   //Таймер
   function timerf(t) {
      let min = 0
      let sec = 0
      let msec = 0
      t = document.getElementById(t)
      StopGame = false
      timer = setInterval(function () {
         if (StopGame) {
            clearInterval(timer)
         }
         msec += 1

         if (msec == 100) {
            msec = 0;
            sec += 1;
         }
         if (sec == 60) {
            sec = 0;
            min += 1
         }
         if (min == 100) {
            StopGame = true;
         }
         time = '<h2>' + min + ':' + sec + '</h2>';
         t.innerHTML = time;
      }, 10)
   }

   //Проверка победы1
   function xoWL(a) {
      if (a == 'disabled1') { var color = 'GreenWin' } else { var color = "RedWin" }
      btn = document.getElementsByClassName('gplace');
      let mas = []
      for (let i = 0; i < 9; i += 3) {
         mas[mas.length] = [btn[i], btn[i + 1], btn[i + 2]]
      }
      for (let i = 0; i < 3; i++) {
         for (let j = 0; j < 3; j++) {
            if (j + i == 3) { break }
            if (i == 0 && j == 0) {
               let d1 = 0;
               for (let k = 0; k < 3; k++) {
                  if (mas[i + k][j + k].getAttribute('class').includes(a)) {
                     d1 += 1;
                  }
               }
               if (d1 == 3) {
                  for (let k = 0; k < 3; k++) {
                     mas[i + k][j + k].classList.add(color)
                  };
                  return true
               }
            }
            if (i == 0) {
               let d = 0;
               for (let k = 0; k < 3; k++) {
                  if (mas[i + k][j].getAttribute('class').includes(a)) { d += 1; }
               }
               if (d == 3) {
                  for (let k = 0; k < 3; k++) {
                     mas[i + k][j].classList.add(color)
                  } return true
               }
            }
            if (j == 0) {
               let d = 0;
               for (let k = 0; k < 3; k++) {
                  if (mas[i][j + k].getAttribute('class').includes(a)) { d += 1; }
               }
               if (d == 3) {
                  for (let k = 0; k < 3; k++) {
                     mas[i][j + k].classList.add(color)
                  }
                  return true
               }
            }
            if (i == 2 && j == 0) {
               let d2 = 0;
               for (let k = 0; k < 3; k++) {
                  if (mas[i - k][j + k].getAttribute('class').includes(a)) { d2 += 1; }
               }
               if (d2 == 3) {
                  for (let k = 0; k < 3; k++) {
                     mas[i - k][j + k].classList.add(color)
                  }
                  return true
               }
            }
         }
      }
      return false
   }
   //Проверка победы2
   function taskXO(count) {
      if (xoWL('disabled1')) {
         document.getElementById('thisWinner').innerHTML = 'Победил игрок: <br>' + $('#Player1').val();
         return 1
      } else if (xoWL('disabled2')) {
         document.getElementById('thisWinner').innerHTML = 'Победил игрок: <br>' + $('#Player2').val();
         return 2
      }
      else if (count == 9) {
         document.getElementById('thisWinner').innerText = 'Победила дружба';
         return 1.5
      }
      else { return 0 }
   }

   //запусе игры и их статистика
   function stGame() {
      $('.gplace').removeClass('disabled1');
      $('.gplace').prop('disabled', false);
      $('.gplace').removeClass('disabled2');
      $('.gplace').removeClass('RedWin');
      $('.gplace').removeClass('GreenWin');
      $('.gplace').css('background-image', '')
      timerf('gtimer');
      WhoPlayer = 1
      count = 0
      PlayerWin = 0
      player1 = $('#Player1').val()
      player2 = $('#Player2').val()
      a = '<p>Ходит</p><img src = "img/x.svg" style = "width: 24px; heigth: 24px"><p>' + player1 + '</p>';
      document.getElementsByClassName('gfoot')[0].innerHTML = a;

      document.getElementById('gplayer-1').innerText = player1;
      document.getElementById('gplayer-2').innerText = player2;

      if (players[players.findIndex(obj => obj.name === player1)].games === 0) {
         document.getElementById('gproc-1').innerText = '0%';
      } else { document.getElementById('gproc-1').innerText = parseInt(players[players.findIndex(obj => obj.name === player1)].win / players[players.findIndex(obj => obj.name === player1)].games * 100) + '%' }
      if (players[players.findIndex(obj => obj.name === player2)].games === 0) {
         document.getElementById('gproc-2').innerText = '0%';
      } else { document.getElementById('gproc-2').innerText = parseInt(players[players.findIndex(obj => obj.name === player2)].win / players[players.findIndex(obj => obj.name === player2)].games * 100) + '%' }
   }
   /*==================================Интервальный обработчик==================*/
   setInterval(function () {
      //Блокировка кнопок
      if (StatusLog == 0) {
         $('button').prop('disabled', true);
      } else { $('button').prop('disabled', false); }
      // Активные игроки
      let ulCode = '';
      if ($('#ActiveFreePlayers').prop('checked')) {
         for (let player of players) {
            if (player.status == 1) {
               ulCode += '<li><p class = "ActiveP">' + player.name + '</p><div class = "PlayerF PlayerFree"></div></div><button type = "button" class = "PlayerGo">Позвать играть</button></li>';
            }
         }
      } else {
         for (let player of players) {
            if (player.status == 1) {
               ulCode += '<li><p class = "ActiveP">' + player.name + '</p><div class = "PlayerF PlayerFree"></div><button type = "button" class = "PlayerGo">Позвать играть</button></li>';
            } else {
               ulCode += '<li><p class = "ActiveP">' + player.name + '</p><div class = "PlayerF PlayerNotFree"></div><button disabled type = "button" class = "PlayerGo">Позвать играть</button></li>';
            }
         }
      }
      document.getElementById('ActivePlayers__list').innerHTML = ulCode;

      //Таблица рейтинга
      if (players.length != 0) {
         $('#listPChat').show()
         let ratCode = '<th>ФИО</th><th>Всего игр</th><th>Победы</th><th>Проигрыши</th><th>Процент побед</th>';
         playersRating = players.map(obj => ({ ...obj })); // Копирование
         playersRating = playersRating.sort((a, b) => Number(b.win) - Number(a.win)); // Сортировка по убыванию
         for (let player of playersRating) {
            if (player.games != 0) {
               ratCode += '<tr></tr><tr><td>' + player.name + '</td><td>' +
                  player.games + '</td><td style = "color: #69B849">' +
                  player.win + '</td><td style = "color: #E93E3E">' +
                  player.lose + '</td><td>' + parseInt(player.win / player.games * 100) + '%</td></tr>'
            }
            else {
               ratCode += '<tr></tr><tr><td>' + player.name + '</td><td>' +
                  player.games + '</td><td style = "color: #69B849">' +
                  player.win + '</td><td style = "color: #E93E3E">' +
                  player.lose + '</td><td>0%</td></tr>'
            }
         }
         document.getElementById('TableRating').innerHTML = ratCode;
      }
      //Проверка игроков
      if ($('#Player1').val() == $('#Player2').val()) {
         $('#StartGame').prop('disabled', true);
      } else {
         $('#StartGame').prop('disabled', false);
      }

      //Проверка на выбронного игрока в чат
      if (UserChat != '' && document.getElementById('chat-message').value != '') {
         $('#btnd').prop('disabled', false);
      } else { $('#btnd').prop('disabled', true); }


   }, 0)

   setInterval(() => {
      //История игр
      if (games.length != 0) {
         let hisCode1 = '<tr><th>Игроки</th><th></th><th></th><th>Дата</th><th>Время игры</th></tr>';
         let hisCode2 = '';
         for (let game of games) {
            if (game.win == 1) {
               var Wplayer = game.playerx + ' <img style = "width: 24px; heigth: 24px;" src = "img/кубок.png" alt = "Кубок">'

               hisCode2 = '<tr><td>' + Wplayer + '</td>' +
                  '<td><p>Против</p></td>' +
                  '<td>' + game.playero + '</td>' +
                  '<td>' + game.data + '</td>' +
                  '<td>' + game.time + '</td></tr>' + hisCode2;

            } else if (game.win == 2) {
               var Wplayer = game.playero + ' <img style = "width: 24px; heigth: 24px;" src = "/img/кубок.png" alt = "Кубок">'

               hisCode2 = '<tr><td>' + game.playerx + '</td>' +
                  '<td><p>Против</p></td>' +
                  '<td>' + Wplayer + '</td>' +
                  '<td>' + game.data + '</td>' +
                  '<td>' + game.time + '</td></tr>' + hisCode2;
            }
            else {
               hisCode2 = '<tr><td>' + game.playerx + '</td>' +
                  '<td><p>Против</p></td>' +
                  '<td>' + game.playero + '</td>' +
                  '<td>' + game.data + '</td>' +
                  '<td>' + game.time + '</td></tr>' + hisCode2;
            }
         }
         hisCode1 += hisCode2;
         console.log(games, hisCode1)
         document.getElementById('HistoryTable').innerHTML = hisCode1;
      }
   }, 10000);
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
      if ($('#NamePlayer').val() == '' || players.some(player => player.name === $('#NamePlayer').val())) {
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
         AllFree();
      }
   });

   //Блокировка пользователей
   $('#PlayerList-t').on('click', '.LockButton', function () {
      $(this).toggleClass('LockButton0')
      $(this).toggleClass('LockButton1')

      let table = document.getElementById('PlayerList-t');
      let row = table.rows[parseInt(this.getAttribute('data-index'))];
      let col = row.cells[3];
      let innerDiv = $(col).find('.LockStatus');
      innerDiv.toggleClass('LockStatus1');
      innerDiv.toggleClass('LockStatus0');

      if (innerDiv.hasClass('LockStatus1')) { players[parseInt(this.getAttribute('data-index')) - 1].status = 0; players[parseInt(this.getAttribute('data-index')) - 1].lock = 1; }
      else { players[parseInt(this.getAttribute('data-index')) - 1].status = 1; players[parseInt(this.getAttribute('data-index')) - 1].lock = 0; }

      AllFree();
   })
   //Ход
   WhoPlayer = 1;
   count = 0;
   PlayerWin = 0;
   player1 = 0;
   player2 = 0;
   $('.gplace').on('click', function () {
      if (!($(this).hasClass('disabled1') || $(this).hasClass('disabled2'))) {
         $(this).prop('disabled', true);
         if (WhoPlayer == 1) {
            $(this).css('background-image', 'url(/img/x.svg)');
            WhoPlayer = 0;
            $(this).addClass('disabled1')
            let a = '<p>Ходит</p><img src = "img/o.svg" style = "width: 24px; heigth: 24px"><p>' + player2 + '</p>';
            document.getElementsByClassName('gfoot')[0].innerHTML = a;
         } else {
            $(this).css('background-image', 'url(/img/o.svg)'); WhoPlayer = 1;
            $(this).addClass('disabled2');
            let a = '<p>Ходит</p><img src = "img/x.svg" style = "width: 24px; heigth: 24px"><p>' + player1 + '</p>';
            document.getElementsByClassName('gfoot')[0].innerHTML = a;
         }
         count += 1;
         PlayerWin = taskXO(count);
         if (PlayerWin != 0) {
            $('gplace').prop('disabled', true);
            clearInterval(timer);
            let time = document.getElementById('gtimer').innerText
            games[games.length] = NewGame(PlayerWin, time, player1, player2, formatDate(new Date));

            i1 = players.findIndex(obj => obj.name === player1)
            i2 = players.findIndex(obj => obj.name === player2)
            if (PlayerWin == 1) {
               players[i1].games = players[i1].games += 1;
               players[i1].win = players[i1].win += 1;

               players[i2].games = players[i2].games += 1;
               players[i2].lose = players[i2].lose += 1;
            }
            else if (PlayerWin == 2) {
               players[i2].games = players[i2].games += 1;
               players[i2].win = players[i2].win += 1;

               players[i1].games = players[i1].games += 1;
               players[i1].lose = players[i1].lose += 1;
            } else {
               players[i1].games = players[i1].games += 1;
               players[i1].lose = players[i1].lose += 1;

               players[i2].games = players[i2].games += 1;
               players[i2].games = players[i2].lose += 1;
            }

            $('.main__repeat').addClass('dflex');
            $('.main__repeat').removeClass('dnone');

            $('#overlay1').show()
            $('body').css('overflow-y', 'hidden');
         }
      }
   });
   //Начало игры
   $('#StartGame').on('click', function () {
      stGame();
      $('.main__who').hide();
      $('.main__game').show();
   })
   //Возвращение в меню
   $('#goMenu').on('click', function () {
      $('.main__repeat').addClass('dnone');
      $('#overlay1').hide()
      $('body').css('overflow-y', 'none');
      $('.main__game').hide()
      $('.main__who').show()
   })

   //Новая игра реванш
   $('#repeatGame').on('click', function () {
      stGame();
      $('.main__repeat').addClass('dnone');
      $('.main__repeat').removeClass('dflex');
      $('.main__repeat').removeClass('dflex');
      $('#overlay1').hide()
      $('body').css('overflow-y', 'none');
   })

   //Чат открыть
   $('#chat-open').on('click', function () {
      $('#chat-open').css('transform', 'translateX(150%)');
      $('.main__chat').css('transform', 'translateX(0)');
   });

   //Чат закрыть
   $('#chat-close').on('click', function () {
      $('#chat-open').css('transform', 'translateX(0)');
      $('.main__chat').css('transform', 'translateX(150%)');
      $('#listPChat li').removeClass('showBlock');
   });

   //Показ юзеров
   $('#chatUser').on('click', function () {
      $('#listPChat li').toggleClass('showBlock');
   })


   var UserChat = '';
   var UserColor = '';
   //Кто пишет в чате 
   $('#listPChat').on('click', 'li', function () {
      UserChat = $(this).text();
      UserColor = $(this).css('border-color');
      $('#listPChat li').toggleClass('showBlock');
   })

   //Отправление сообщения в чат
   $('#btnd').on('click', function () {
      let message = document.getElementById('chat-message').value;
      console.log('message')
      if (message != '' && UserChat != '') {
         document.getElementById('chat-message').value = '';

         let codeMessages = document.getElementById('messages').innerHTML

         let now = new Date();
         let hours = now.getHours();
         let minutes = now.getMinutes();;

         let Usertime = hours + ':' + minutes

         let code = '<li style = "margin: 0 3px 5px;"><div style = "background-color: white; box-shadow: 0px 2px 6px 0px #2C39791A; border-radius: 16px 16px 16px 0; padding: 12px; margin-right: 60px;">' +
            '<div style = "display: flex; justify-content: space-between; align-item: center;"><p style = "color: ' + UserColor + '; font-size: 14px">' + UserChat + '</p><p style = "font-size: 14px; font-weigth: 400; color: #898993;">' + Usertime + '</p></div><div>' +
            message + '</div></div></li>';
         codeMessages += code;
         document.getElementById('messages').innerHTML = codeMessages;
      }
      var chat = $('#messages');
      chat.scrollTop(chat.prop('scrollHeight'));
   })

})

