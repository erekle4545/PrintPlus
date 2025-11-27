$(document).ready(function() {
    // search
    $('.search-terms').on('keyup', function() {
        const keyword = $(this).val()
        if(keyword === ''){
            $('.search_result').hide()
        }else{
            $('.search_result').show()

        }

        const url = document.querySelector('meta[name="home"]').getAttribute('content') + '/global_search'
        $.ajax({
            type: 'POST',
            url: url,
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
            data: {
                keyword: keyword
            },
            success: function(response) {
                $('.search_result').html(response)
            }
        })
    })


    $('#send_contact').on('click', function() {
        const url = document.querySelector('meta[name="home"]').getAttribute('content') + '/send_message'


        if ($('#username').val() === '' || $('#object').val() === '' || $('#contact-email').val() === ''|| $('#contact-text').val() === '') {
            $('.error').show()
        }else{
            $('.error').hide()
            $.ajax({
                type: 'POST',
                url: url,
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
                data: {
                    'username': $('#username').val(),
                    'object': $('#object').val(),
                    'email': $('#contact-email').val(),
                    'text': $('#contact-text').val()
                },
                success: function(response) {
                    $('.text-success').show()

                    // Swal.fire(re sponse.message)
                }
            })
        }
    })

  // subscribers
  $('#subscribeBtn').on('click', function() {

    const url = document.querySelector('meta[name="home"]').getAttribute('content') + '/subscribe'
    if ($('#email').val() === '' ) {
      $('.error-subscribe-empty').show()
    }else{
      $('.error').hide()
      $.ajax({
        type: 'POST',
        url: url,
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
        data: {
          'email': $('#email').val(),
        },
        success: function(response) {
          $('.text-success-subscribe').show()
        },error: function (err){
          console.log(err)
        }
      })
    }
  })

    /**
     * End Gallery
     */
})
