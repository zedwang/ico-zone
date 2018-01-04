$(function () {
  var cd = {
    'blue': '#4d80f4',
    'red': '#ff4222',
    'black': 'black',
    'green': '#0b920b'
  }
  var oMap = {}
  var selected = $('#selected')
  var dropdown = $('#dropdown')
  var container = $('#container')
  var btnRemove = $('#remove')
  var btnPush = $('#push')

  container.css('color', cd['blue'])

  dropdown.find('li').each(function () {
    $(this).bind('click', function () {
      var color = $(this).data('color')
      selected.attr('class', '').attr('class', 'color ' + color)
      container.css('color', cd[color])
    })
  })

  container.find('.icon').each(function () {
    $(this).bind('click',function () {
      var id = $(this).attr('id')
      $(this).toggleClass('active')
      if ($(this).hasClass('active')) {
        oMap[id] = true
      } else {
        delete oMap[id]
      }
    })
  })

  btnRemove.bind('click', function () {
    // business logic...
    var ids = keys(oMap)
    if (valid(ids)) {
      var $btn = $(this).button('loading')
      doRemove(ids)
    } 
    
  })

  btnPush.bind('click', function () {
    
    var ids = keys(oMap)
    if (valid(ids)) {
      var $btn = $(this).button('loading')
      doPush(ids)
      $('#alert').html('亲，这个操作时间比较长，请耐心等待！').show()
    }
    
  })

})
function valid(data) {
  if (!data.length) {
    $('#alert').html('亲，这个操作时间比较长，请耐心等待！').show()
    return false;
  }
  return true
}
function reload () {
  window.location.href = window.location.href
}
function keys (map) {
  var res = []
  for (var k in map) {
    res.push(k)
  }
  return res.join(',')
}
function doRemove (id) {
  $.ajax({
    url: `/api/delete/${id}`,
    type: 'DELETE',
    success: function (res) {
      if (res.code === 'OK') {
        reload()
      }
    }
  })
}

function doPush (ids) {
  $.ajax({
    url: `/api/push/${ids}`,
    type: 'POST',
    success: function (res) {
      if (res.code === 'OK') {
        reload()
      }
    }
  })
}