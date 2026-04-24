    var canvas;
    var canvasContext;
    
    var ballX=50;
    var ballY=50;
    var ballSpeedX=10;//usually goes hori to the right
    var ballSpeedY=4;//usually goes vert downwards
    
    var player1Score=0;
    var player2Score=0;
    const WINNING_SCORE=5;

    var showingWinScreen=false;

    var paddle1Y=250;
    var paddle2Y=250;
    const PADDLE_HEIGHT=100;
    const PADDLE_WIDTH=10;

    var paddle_sound= new Audio('sounds/paddle_hit.mp3');
    var win_sound= new Audio('sounds/win_sound.mp3');
    var lose_sound= new Audio('sounds/lose_sound.mp3');

    function calculateMousePos(evt){
      var rect=canvas.getBoundingClientRect();
      var root=document.documentElement;
      //getting X n Y coordinates of the mouse within the playable space of the canvas, regardless of where the canvas is on the page,scrolling,etc.
      var mouseX=evt.clientX-rect.left-root.scrollLeft;
      var mouseY=evt.clientY-rect.top-root.scrollTop;
      //returns an object with x and y properties, which are the coordinates of the mouse within the canvas
      return{
        x:mouseX,
        y:mouseY
      };
    }

    function handleMouseClick(evt){
      if(showingWinScreen){
        player1Score=0;
        player2Score=0;
        showingWinScreen=false;
      }
    }

    window.onload = function(){
      
      canvas=document.getElementById('gameCanvas');
      canvasContext=canvas.getContext('2d');
      
      var framesPerSecond=30;
      setInterval(function(){
        moveEverything();
        drawEverything();
      },1000/framesPerSecond);// calls the drawEverything function every 500 milliseconds (0.5 second)
      
      canvas.addEventListener('mousedown',handleMouseClick);//event listener for mouse clicks on the canvas, which calls the handleMouseClick function when the canvas is clicked
      

      canvas.addEventListener('mousemove',function(evt){ //event listener for mouse movement on the canvas
        var mousePos=calculateMousePos(evt);
        paddle1Y=mousePos.y-(PADDLE_HEIGHT/2);//sets the paddle's Y position to the mouse's Y position minus half the paddle's height, so that the paddle is centered on the mouse cursor
      });
    }

    function ballReset(){
      if(player1Score>=WINNING_SCORE ){
        showingWinScreen=true;
        win_sound.play();
      }
      if(player2Score>=WINNING_SCORE){
        showingWinScreen=true;
        lose_sound.play();
      }
      ballSpeedX=-ballSpeedX;
      ballX=canvas.width/2;
      ballY=canvas.height/2;
    }

    function computerMovement(){
      var paddle2YCenter=paddle2Y+(PADDLE_HEIGHT/2);
      if(paddle2YCenter<ballY-35){
        paddle2Y+=6;
      }
      else if(paddle2YCenter>ballY+35){
        paddle2Y-=6;
      }

    }


    function moveEverything(){
      if(showingWinScreen){
        return;
      }

      computerMovement();

      ballX += ballSpeedX;
      ballY += ballSpeedY;

      if(ballX > canvas.width - PADDLE_WIDTH - 11){
        if(
         ballX >= canvas.width - PADDLE_WIDTH - 11 &&
         ballY > paddle2Y &&
         ballY < paddle2Y + PADDLE_HEIGHT
         ){ //below top of the paddle and above the bottom of the paddle(ball Y inc as it goes down)
          ballSpeedX=-ballSpeedX;
          paddle_sound.play();
          var deltaY=ballY-(paddle2Y+PADDLE_HEIGHT/2);//the distance between the ball and the center of the paddle, which is used to calculate how much the ball's vertical speed should change when it hits the paddle
          ballSpeedY=deltaY*0.35;//the farther the ball is from the center of the paddle, the more it will change its vertical speed, which adds some unpredictability to the game and makes it more fun to play
        }
        else{
          player1Score++; //should be before ballReset()
          //ball goes off the right side of the screen
          ballReset();
          
        }
      }
      if(ballX < PADDLE_WIDTH + 11){
        if(
        ballX <= PADDLE_WIDTH + 11 &&
        ballY > paddle1Y &&
        ballY < paddle1Y + PADDLE_HEIGHT
        ){ //below top of the paddle and above the bottom of the paddle(ball Y inc as it goes down)
          ballSpeedX=-ballSpeedX;
          paddle_sound.play();

          var deltaY=ballY-(paddle1Y+PADDLE_HEIGHT/2);//the distance between the ball and the center of the paddle, which is used to calculate how much the ball's vertical speed should change when it hits the paddle
          ballSpeedY=deltaY*0.35;//the farther the ball is from the center of the paddle, the more it will change its vertical speed, which adds some unpredictability to the game and makes it more fun to play
        }
        else{
          //ball goes off the left side of the screen
          player2Score++; //should be before ballReset()
          ballReset();
          
        }
      }
      if(ballY>canvas.height){
        ballSpeedY=-ballSpeedY;
      }
      else if(ballY<0){
        ballSpeedY=-ballSpeedY;
      }
      
    }
    function drawNet(){
      for(var i = 0; i < canvas.height; i += 41.5){
       colorRect(canvas.width/2 - 1, i, 4, 20, '#f4f9f7');
      }
   }
    

    function drawEverything(){
      // next line blanks out the screen with black
      var gradient = canvasContext.createLinearGradient(0,0,0,canvas.height);
      gradient.addColorStop(0, "#052b5c");
      gradient.addColorStop(1, "#0a4694");

      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(0,0,canvas.width,canvas.height);

      if(showingWinScreen){
        if(player1Score>=WINNING_SCORE){
          canvasContext.fillStyle='white';
          canvasContext.fillText("You Won!",320,200);

        }
        else if(player2Score>=WINNING_SCORE){
          canvasContext.fillStyle='white';
          canvasContext.fillText("Computer Won :(",260,200);
        }
        canvasContext.fillStyle='white';
        canvasContext.fillText("Click to Play Again",200,500);
        return;
      }
      drawNet();

      canvasContext.shadowBlur = 20;
      canvasContext.shadowColor = "#1dbd5a";

      // this is our left player paddle
      colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'#1dbd5a');

      // this is our right player paddle
      colorRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'#1dbd5a');

      // next line draws our ball
      colorCircle(ballX,ballY,11,'white');

      canvasContext.shadowBlur = 0;
      
     canvasContext.font = "20px 'Press Start 2P', cursive";
     canvasContext.fillStyle = "white";

     canvasContext.fillText(player1Score, 150, 80);
     canvasContext.fillText(player2Score, 620, 80);
    }

    function colorCircle(centerX,centerY,radius,drawColor){
      canvasContext.fillStyle=drawColor;
      canvasContext.beginPath();
      canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);//(x,y,radius,startAngle-radian,endAngle-radian,anticlockwise-section of circle)
      canvasContext.fill();
    }


    function colorRect(leftX,topY,width,height,drawColor){
      canvasContext.fillStyle=drawColor;
      canvasContext.fillRect(leftX,topY,width,height);
    }