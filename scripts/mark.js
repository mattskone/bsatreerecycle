$(document).ready(function() {
  // document.cookie='name=;expires=' + new Date();
  var name = /name=[^;]+/.exec(document.cookie);
  if(!name) { $('#name_input').toggle('slow').focus(); }
  $('#name').text(name ? unescape(name[0]).slice(5) : 'No name');
  
  $('#submit').click(function () {
    $('#submit').attr('disabled', 'disabled');
    $('body').css('cursor', 'progress');
    setTimeout(function() {
      $('#submit').removeAttr('disabled');
      $('body').css('cursor', 'default');
    }, 1000);
    navigator.geolocation.getCurrentPosition(function(posit) {
      var d = new Date();
      var pickup = {
        'lat':posit.coords.latitude,
        'lng':posit.coords.longitude,
        'timestamp':d,
        'tag':$('#name').text()
      };
      $.post('pickups', pickup);
      $('#last_pickup').html(d.toLocaleString());
      // $('#latlng').append(JSON.stringify(pickup));
      document.cookie='name=' + escape($('#name').text()) +
        ';expires=' + new Date(Date.now() + 1000*60*60*24*30);
    });
  });

  $('#change_name').click(function() {
    $('#name_input').toggle("slow").focus();
  })

  $('#name_input').keyup(function() {
    $('#name').html(
      this.value.length > 0 ? this.value : "No name"
    );
  });

  $('#name_input').blur(function() {
    $(this).toggle("slow");
  })
});