// Whitelist of allowable characters in the 'name' box (all alphanumerics, plus space, hyphen and aspotrophe)
var allowed_chars = [32, 39, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
// Whitelist of allowable non-character keys (backspace, tab, delete)
var allowed_keys = [8, 9, 46];

$(document).ready(function() {
  if(!navigator.geolocation) {
    $('#submit').attr('disabled', 'disabled');
    $('#geoloc_supported').toggle();
    $('#geoloc_not_supported').toggle();
  } else {
    var name = localStorage.getItem('name');
    $('#name').text(name || 'No name');
    var stored_timestamp = localStorage.getItem('last_pickup');
    if(stored_timestamp) { stored_timestamp = new Date(stored_timestamp).toLocaleString(); }
    $('#last_pickup').html(stored_timestamp || 'no pickups today');
    
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
          localStorage.setItem('name', $('#name').text());
          localStorage.setItem('last_pickup', d);
        });
    });

    $('#change_name').click(function() {
      $('#name_input').toggle("slow").focus();
    })

    $('#name_input').keypress(function(evt) {
      if(evt.charCode === 0 && allowed_keys.indexOf(evt.keyCode) >= 0) { 
        return true;
      } else if(allowed_chars.indexOf(evt.charCode) >= 0) {
        return true;
      } else {
        return false;
      }
    });

    $('#name_input').bind('paste', function() {
      return false;
    });

    $('#name_input').keyup(function() {
      $('#name').html(
        this.value.length > 0 ? this.value : "No name"
      );
    });

    $('#name_input').blur(function() {
      $(this).toggle("slow");
    })
  }
});