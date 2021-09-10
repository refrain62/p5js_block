// https://www.aura-office.co.jp/blog/p5/

//変数
//ボールの変数
var ball;
var ballImage;

//バーの変数
var bar;
var barImage;

//ブロックの変数
var block;
var blockImages = [];
var blockGroup;
var blockCount = 80;

//上と左右の変数
var wallTop;
var wallLeft;
var wallRight;

//ゲームモードの変数
var gameMode;

//メディアをロード
function preload(){
  ballImage = loadImage('image/ball.png');
  barImage = loadImage('image/bar.png');
  blockImages[0] = loadImage('image/block1.png');
  blockImages[1] = loadImage('image/block2.png');
  blockImages[2] = loadImage('image/block3.png');
  blockImages[3] = loadImage('image/block4.png');
  blockImages[4] = loadImage('image/block5.png');
  blockImages[5] = loadImage('image/block6.png');
}

//最初に1回だけ実行
function setup(){
  createCanvas(600,425);

  gameSetup();
}

//1フレームごとに実行
function draw(){
  //背景の色
  background(0);
  
  //テキスト表示
  //テキスト共通設定
  fill(255,255,255);
  textAlign(CENTER);
  
  //ゲームモードによって表示されるテキストを変更
  switch(gameMode){
    //ゲーム開始前
    case 'gameStart':
      textStyle(BOLD);
      textSize(40);
      text('GAME START',width/2,height/2);

      textStyle(NORMAL);
      textSize(20);
      text('クリックでスタート!',width/2,height/2+60);
      
      textStyle(NORMAL);
      textSize(15);
      text('⇄キーでバーを操作できます',width/2,height/2+90);
      break;
    //ゲームオーバー
    case 'gameOver':
      textStyle(BOLD);
      textSize(40);
      text('GAME OVER...',width/2,height/2);
      break;
    //ゲームクリア
    case 'gameClear':
      fill(255,255,0);
      textStyle(BOLD);
      textSize(40);
      text('CLEAR!',width/2,height/2);      
      break;
  }
  
  //ゲーム中の処理
  gameControl();
  
  //キー操作
  keyControl();

  //ゲームモード変更：プレイ中
  gamePlaying();
  
  //ゲームモード変更：ゲームオーバー
  gameOver();
  
  //ゲームモード変更：クリア
  gameClear();
  
  //全てのスプライトを表示
  drawSprites();
}

//ゲームの初期化
function gameSetup(){
  
  //ブロックのスプライト作成
  blockGroup = new Group;
  for(var j=0;j<8;j++){
    for(var i=0;i<10;i++){
      block = createSprite(30+i*60,10+j*20);
      block.addImage('block',blockImages[floor(random(5))]);
      block.immovable = true;
      blockGroup.add(block);
    }    
  }
  
  //バーのスプライト作成
  bar = createSprite(width/2, 380);
  bar.addImage(barImage);
  bar.immovable = true;
  
  //ボールのスプライト作成
  ball = createSprite();
  ball.addImage(ballImage);
  ball.setSpeed(10,random(80,100));
  
  //ボールが画面外に出ないよう壁のスプライト作成
  wallTop = createSprite(width/2,-5,width,10);
  wallTop.immovable = true;
  wallLeft = createSprite(-5,height/2,10,height);
  wallLeft.immovable = true;
  wallRight = createSprite(width+5,height/2,10,height);
  wallRight.immovable = true;
  
  //ゲームモード変更：プレイ開始前
  gameMode = 'gameStart';
}

//ゲームプレイ中の処理
function gameControl(){
  if(gameMode=='gamePlaying'){
    //ボールとバーが接触したら跳ね返る
    ball.bounce(bar);

    //ボールと上左右の壁が接触したら跳ね返る
    ball.bounce(wallTop);
    ball.bounce(wallLeft);
    ball.bounce(wallRight);

    //ボールとブロックが接触したら跳ね返る
    ball.bounce(blockGroup,function(ball,block){
      //ぶつかったらブロック削除
      block.remove();
      //ブロックの残数カウント（0でクリア）
      blockCount--;
    });
  //ゲーム開始前はボールとバーは同じ場所
  } else if(gameMode=='gameStart'){
    ball.position.x = bar.position.x;
    ball.position.y = bar.position.y-20;
  }
}

//ゲームモード変更：プレイ中
function gamePlaying(){
  if(mouseIsPressed){
    gameMode = 'gamePlaying';
  }
}

//ゲームモード変更：ゲームオーバー
function gameOver(){
  if(ball.position.y > height+40){
    gameMode = 'gameOver';
  }
}

//ゲームモード変更：クリア
function gameClear(){
  if(blockCount==0){
    gameMode = 'gameClear';
  }
}

//キー操作
function keyControl(){
  //左キーを押したときの処理
  if(keyDown('LEFT')){
    bar.position.x -= 3;
    if(bar.position.x < 0){
      bar.position.x = 0;
    }
    //プレイ開始前はバーとボールが一緒に動く
    if(gameMode=='gameStart'){
      bar.position.x -= 3;
      ball.position.x -= 3;
    }
  //右キーを押したときの処理
  } else if(keyDown('RIGHT')){
    bar.position.x += 3;
    if(bar.position.x > width){
      bar.position.x = width;
    }
    //プレイ開始前はバーとボールが一緒に動く
    if(gameMode=='gameStart'){
      bar.position.x += 3;
      ball.position.x += 3;
    }
  }  
}
