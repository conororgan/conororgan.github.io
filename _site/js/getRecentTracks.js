$(document).ready(function() {
       $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=whyelse&api_key=ee5696757919d38bc8660c1d101b60e2&&limit=10&format=json&callback=?", function(data) {
           var html = '';
           var counter = 0;
           $.each(data.recenttracks.track, function(i, item) {

             html = '<section id="section-'+ counter +'" style="background: #0C0C0D;"><img crossorigin="Anonymous" id="img-'+ counter + '" class="hidden" src="'+ item.image[3]['#text'] +'"/><div class="wrapper"><pre style="color: #AAAAAA;" id="artwork-' + counter + '"></pre><p class="title" style="color: #AAA">'+ item.name +'</p><p style="color: #AAA">' + item.artist['#text'] +'</p><p style="color: #AAA">' + item.album['#text'] +'</p></div></section>';
             $('#tracks').append(html);

             var id = '#artwork-' + counter;

             createASCII(item.image[3]['#text'], id);

             getColours(counter);

             counter++;

           });


       });
   });

   function createASCII(artwork, id) {
     aalib.read.image.fromURL(artwork)
    .map(aalib.filter.contrast(0.1))
    .map(aalib.filter.inverse())
    .map(aalib.aa({ width: 100, height: 70}))
    .map(aalib.render.html({ tagName: 'p', el: document.querySelector(id), fontFamily: 'Space Mono', background: '#0C0C0D',fontSize: '5', color: '#AAA' }))
    .subscribe();
   }

   function getBase64Image(img, id) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.id = id;
    canvas.class ="hidden";


    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

   function getAverageRGB(imgEl, id) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
            console.log(e);
            return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}

function invertColour(rgb) {
    // invert color components
    var r = (255 - parseInt(rgb.r)).toString(16),
        g = (255 - parseInt(rgb.g)).toString(16),
        b = (255 - parseInt(rgb.b)).toString(16);

    // Check the contrast
    // calculate the relative luminance
const color1luminance = luminance(rgb.r, rgb.g, rgb.b);
const color2luminance = luminance(padZero(r), padZero(g), padZero(b));

const ratio = color1luminance > color2luminance
    ? ((color2luminance + 0.05) / (color1luminance + 0.05))
    : ((color1luminance + 0.05) / (color2luminance + 0.05));

    if(ratio < 1/4.5) {
      // pad each with zeros and return
      return '#' + padZero(r) + padZero(g) + padZero(b);
    } else {
      // pad each with zeros and return
      return '#AAA';
    }



}

function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

   function getColours(id) {
     var item = document.getElementById("img-" + id);
    var color = getAverageRGB(item, "img-" + id);
    var inverted = invertColour(color);
    var section = '#section-' + id;
    $(section).css("background", "rgb("+color.r+","+color.g+","+color.b+")");
    $('pre#artwork-' + id).css({ 'color': inverted });
    $(section + " p").css({ 'color': inverted });
    $('#artwork-' + id).css("background", "rgb("+color.r+","+color.g+","+color.b+")");

   }
