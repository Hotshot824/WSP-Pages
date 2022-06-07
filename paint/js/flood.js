var the_canvas ;
var the_canvas_context ;
var black = {r:255, g:0, b:0, a:255};

document.querySelector("#the_canvas").addEventListener("click", event => flood_fill(event.x, event.y, black))

function flood_fill(x, y, color) {
    pixel_stack = [{x:x, y:y}] ;
    pixels = the_canvas_context.getImageData(0, 0, the_canvas.width, the_canvas.height );
    var linear_cords = ( y * the_canvas.width + x ) * 4 ;
    original_color = {r:pixels.data[linear_cords],
                      g:pixels.data[linear_cords+1],
                      b:pixels.data[linear_cords+2],
                      a:pixels.data[linear_cords+3]} ;

    while( pixel_stack.length>0 ) {
        new_pixel = pixel_stack.shift() ;
        x = new_pixel.x ;
        y = new_pixel.y ;

        //console.log( x + ", " + y ) ;
  
        linear_cords = ( y * the_canvas.width + x ) * 4 ;
        while( y-- >= 0 &&
               (pixels.data[linear_cords]==original_color.r &&
                pixels.data[linear_cords+1]==original_color.g &&
                pixels.data[linear_cords+2]==original_color.b &&
                pixels.data[linear_cords+3]==original_color.a) ) {
            linear_cords -= the_canvas.width * 4 ;
        }
        linear_cords += the_canvas.width * 4 ;
        y++ ;

        var reached_left = false ;
        var reached_right = false ;
        while( y++ < the_canvas.height &&
               (pixels.data[linear_cords]==original_color.r &&
                pixels.data[linear_cords+1]==original_color.g &&
                pixels.data[linear_cords+2]==original_color.b &&
                pixels.data[linear_cords+3]==original_color.a) ) {
            pixels.data[linear_cords]   = color.r ;
            pixels.data[linear_cords+1] = color.g ;
            pixels.data[linear_cords+2] = color.b ;
            pixels.data[linear_cords+3] = color.a ;

            if( x > 0 ) {
                if( pixels.data[linear_cords-4]==original_color.r &&
                    pixels.data[linear_cords-4+1]==original_color.g &&
                    pixels.data[linear_cords-4+2]==original_color.b &&
                    pixels.data[linear_cords-4+3]==original_color.a ) {
                    if( !reached_left ) {
                        pixel_stack.push( {x:x-1, y:y} ) ;
                        reached_left = true ;
                    }
                } else if( reached_left ) {
                    reached_left = false ;
                }
            }
        
            if( x < the_canvas.width - 1 ) {
                if( pixels.data[linear_cords+4]==original_color.r &&
                    pixels.data[linear_cords+4+1]==original_color.g &&
                    pixels.data[linear_cords+4+2]==original_color.b &&
                    pixels.data[linear_cords+4+3]==original_color.a ) {
                    if( !reached_right ) {
                        pixel_stack.push( {x:x+1, y:y} ) ;
                        reached_right = true ;
                    }
                } else if( reached_right ) {
                    reached_right = false ;
                }
            }
            
            linear_cords += the_canvas.width * 4 ;
        }
    }
    the_canvas_context.putImageData( pixels, 0, 0 ) ;
}

function body_loaded() {
    the_canvas = document.getElementById( "the_canvas" ) ;
    the_canvas_context = the_canvas.getContext( "2d" ) ;
    the_canvas_context.beginPath();
    the_canvas_context.arc(75,75,50,0,Math.PI*2,true); // Outer circle
    the_canvas_context.moveTo(110,75);
    the_canvas_context.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
    the_canvas_context.moveTo(65,65);
    the_canvas_context.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    the_canvas_context.moveTo(95,65);
    the_canvas_context.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    the_canvas_context.stroke();
}