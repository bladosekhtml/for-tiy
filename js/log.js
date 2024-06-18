$(document).ready(function () {
   let params = new URLSearchParams(window.location.search);
   users = JSON.parse(decodeURIComponent(params.get('var1')));
   if (users == null || users == '') { users = [] }
   usersLog = params.get('var2');
   if (usersLog == null || usersLog == '') { usersLog = [] } else {usersLog = usersLog.split(',');}
   StatusLog = params.get('var3');
   if (StatusLog == null || StatusLog == '') { StatusLog = 0 }
   function NewUser(log, pas) {
      return {
         log: log,
         pas: pas,
      }
   }
   $('#newreg').on('click', function () {
      $('.window__log').hide();
      $('.window__reg').show();
   })
   $('#newlog').on('click', function () {
      $('.window__reg').hide();
      $('.window__log').show();
   })

   setInterval(function () {
      if (!((/^[a-zA-Z0-9]{5,}$/).test($('#reg-login').val())) || ($('#reg-pas1').val() != $('#reg-pas2').val()) || !((/^[a-zA-Z0-9]{5,}$/).test($('#reg-pas1').val()))) {
         document.getElementById('reg').disabled = true;
      } else { document.getElementById('reg').disabled = false; }

      if (StatusLog == 0) {
      }
   }, 0)
   
   $('#reg').on('click', function () {
      if (usersLog.includes($('#reg-login').val())) {
         $(".login-c").show()
         $("#reg-login").css('border-color', 'red');
      } else {
         $(".login-c").hide()
         $("#reg-login").css('border-color', '#dcdcdf');

         users[users.length] = NewUser($("#reg-login").val(), $("#reg-pas1").val());
         usersLog[usersLog.length] = $("#reg-login").val()

         window.location.href = '../xoxo.html?var1=' + encodeURIComponent(JSON.stringify(users)) + '&var2=' + encodeURIComponent(usersLog.join(',')) + '&var3=' + encodeURIComponent(1);
      }
   })
   $('#log').on('click', function () {
      let OneLogin = $('#log-login').val()
      let OnePas = $('#log-pas').val()
      console.log(usersLog.includes('pojpoj'), OneLogin)
      if (!(usersLog.includes(OneLogin)) || OnePas != users[usersLog.indexOf(OneLogin)].pas) {
         $(".login-l").show()
         $('#log-login').css('border-color', 'red')
      } else {
         $(".login-l").hide()
         $('#log-login').css('border-color', '#dcdcdf')
         window.location.href = '../xoxo.html?var1=' + encodeURIComponent(JSON.stringify(users)) + '&var2=' + encodeURIComponent(usersLog.join(',')) + '&var3=' + encodeURIComponent(1);
      }
   })
});