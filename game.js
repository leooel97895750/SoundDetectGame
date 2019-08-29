//29 fa ~ 89 fa 數字音名對照表
var notelist=["♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","♯","F1","F1♯","G1","G1♯","A1","A1♯","B1","C2","C2♯","D2","D2♯","E2","F2","F2♯","G2","G2♯","A2","A2♯","B2","C3","C3♯","D3","D3♯","E3","F3","F3♯","G3","G3♯","A3","A3♯","B3","C4","C4♯","D4","D4♯","E4","F4","F4♯","G4","G4♯","A4","A4♯","B4","C5","C5♯","D5","D5♯","E5","F5","F5♯","G5","G5♯","A5","A5♯","B5","C6","C6♯","D6","D6♯","E6","F6"];
//音階色彩對照表
var colorlist=["#ff0000","#822222","#ffaa00","#ffff00","#9def1f","#00ff00","#008000","#2222ff","#00ffff","#ff00ff","#4b0082","#555555"];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//史萊姆平時動作( Q 彈 )
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var crab_close = 0;
var crabaction;
function qqjump()
{
  var crabing = $("#crab");
  var crabnow = 0;
  crabaction = setInterval(frame2,200); 
  function frame2() {
      if (crab_close == 1) {
          clearInterval(crabaction);
      } 
      else 
      {
        if(crabnow==0)
        {
          crabing.css("-moz-transform-origin","0px 60px");
          crabing.css("-moz-transform","scaleY(0.95)");
          //crabing.css("-moz-transform","rotate(7deg)");
          crabnow = 1;
        }
        else
        {
          crabing.css("-moz-transform-origin","0px 60px");
          crabing.css("-moz-transform","scaleY(1.05)");
          //crabing.css("-moz-transform","rotate(-7deg)");
          crabnow = 0;
        }
      }
  }
}
window.onload = function()
{
    //每0.1秒更新一次目前的音名
    //nownote是寫在turner.js的全域變數
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var printnote_close = 0;
    var notetext = $("#printnote");
    var nnote = $("#note");
    var printnote = setInterval(frame1,100); 
    function frame1() {
        if (printnote_close == 1) {
            clearInterval(printnote);
        } 
        else {
            notetext.text(notelist[nownote]);
            nnote.text(nownote);
            //console.log(nownote);
        }
    }

    //footer 頻率、振幅
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    var d = document.getElementById('footer');
    for(var i=1; i<251; i++){
      d.innerHTML += '<div></div>';
    }
    var dd = document.querySelectorAll('#footer div');
    var timer;
    var context = new AudioContext();
    navigator.getUserMedia({audio: true}, function(stream) {
      var microphone = context.createMediaStreamSource(stream);
      var analyser = context.createAnalyser();
      microphone.connect(analyser);
      //這行是在播出錄到的聲音
      //analyser.connect(context.destination);

      analyser.fftSize = 2048;//必須是2的冪次方
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(analyser.fftSize);
      analyser.getByteFrequencyData(dataArray);
      
      update();

      function update(){
        //console.log(dataArray);
        analyser.getByteFrequencyData(dataArray);
        for(var j=1; j<251; j++){
          dd[j].style.height = (dataArray[j])/2.5+'px';
          dd[j].style.background = 'rgba('+j*2+','+j+','+255*((250-j)/250)+',1)';
        }
        timer = setTimeout(update,1);
      }
    }, function(){
      console.log('error');
    });

    //start game畫面
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    for(var i=0;i<11;i++)
    {
      var every_note = $('<div class="stage_note" id="n' + i + '"></div>');
      every_note.css("left",i*80-25+"px");
      if(i<=5)
      {
        every_note.css("height",i*40+50+'px');
      }
      else
      {
        every_note.css("height",250-((i-5)*40)+'px');
      }
      $("#stage").append(every_note);
      var mycolor = colorlist[i];
      every_note.css("box-shadow","0 0 7px 5px"+mycolor);
    }
    $("#crab").css("display","inline-block");
    $("#crab").css("top",'80px');//要減去自身的長度
    $("#crab").css("left","375px");

    qqjump();
    
};

//遊戲背景移動
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var bg;
var bg_close = 0;
function bgmove(picnum)
{
  var bg1 = $("#bg1");
  var bg2 = $("#bg2");
  //換圖片
  bg1.css("background-image",'url("images/'+ picnum +'.jpg")');
  bg2.css("background-image",'url("images/'+ picnum +'.jpg")');

  bg_close = 1;
  var mycounter = 0;
  bg = setInterval(frame6, 40);
  function frame6(){
    mycounter--;
    bg1.css("left",mycounter+'px');
    bg2.css("left",mycounter+800+'px');
    if(mycounter == -800)
    {
      mycounter = 0;
    }
  }
}

//關卡移動
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var stagemove_close = 0;//關卡計時器
var stagemove;
function stage_move(speed)
{
  stagemove_close = 1;
  var allnote = document.querySelectorAll('#stage div');
  var crabmove = document.getElementById("crab");
  stagemove = setInterval(frame3,speed); 
  var notelength = allnote.length;
  function frame3() {
      if (allnote[notelength-1].offsetLeft=='580')//少一個當終點
      {
          clearInterval(stagemove);
          stagemove_close = 0;
      } 
      else {
        for(var i=0; i<notelength; i++)
        {
          //stage_note移動
          //console.log(allnote[i].offsetLeft);
          allnote[i].style.left = allnote[i].offsetLeft-5+'px';//每次減5，小心修改後造成無法達成終止條件的狀況
        }
        //crab跟著曲速一起移動
        //console.log(crabmove.offsetLeft);
        crabmove.style.left = crabmove.offsetLeft-5+'px';
      }
  }
}

//偵測
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var stopplay = 0;
var listcounter; //從1開始到總長度-1
var samenote_move;
//下一個音相同時史萊姆滑過去
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function samenote(mytime,num)
{
  var samenote_count=0;
  var mycrab = document.getElementById("crab");
  //改成緩緩往右移動
  samenote_move = setInterval(frame8, mytime/10.0);
  function frame8(){
    mycrab.style.left = mycrab.offsetLeft+8 +'px';
    samenote_count += 8;
    if(samenote_count >= 80*num)
    {
      clearInterval(samenote_move);
      stopplay=0;
    }
  }
}
//每個音之間會等待0.2秒後執行這個function進行下一次音名判斷
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function stopplay_open()
{
  stopplay=0;
}

//跳躍函式
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var jumping;
var jumping_stop = 0;
function jump(mycrab,myheight)
{
  //console.log("kkk");
  jumping_stop = 1;

  //現在高度
  var crab_old = mycrab.offsetTop;
  var crab_new = myheight;
  //console.log(crab_old);
  //console.log(crab_new);
  //高度差
  var crab_move_height;
  //最高點
  var max_height;
  var myway = 0;
  //往更高音
  if(crab_old > crab_new)
  {
    myway = 1;
    crab_move_height = crab_old - crab_new;
    max_height = crab_new-50;
  }
  else if(crab_old == crab_new)
  {
    crab_move_height = 0;
  }
  //往更低音
  else
  {
    myway = -1;
    crab_move_height = crab_new - crab_old;
    max_height = crab_old-50;
  }
  //跳躍總長度
  var jumplong = 50*2 + crab_move_height;
  var each_jump = jumplong/10.0;
  //console.log("-------");
  //console.log(each_jump);
  //console.log("-------");
  //console.log(crab_move_height);
  var totalmove = 0; 
  var each_move = crab_move_height/10.0;
  //console.log(each_move);
  //換圖
  mycrab.src="images/crab_smile.png";
  var overmax = 0;
  jumping = setInterval(frame7, 10);
  function frame7()
  {
    //以每8為單位，總共做10次
    mycrab.style.left = mycrab.offsetLeft+8+'px';
    totalmove += 8;
    if(myway==1)
    {
      //上升期
      //console.log(mycrab.offsetTop);
      //console.log(max_height);
      if(max_height<=mycrab.offsetTop && overmax==0)
      {
        mycrab.style.top = mycrab.offsetTop - each_jump +'px';
      }
      //下降期
      else
      {
        overmax = 1;
        mycrab.style.top = mycrab.offsetTop + each_jump +'px';
      }
      //mycrab.style.top = mycrab.offsetTop - each_move +'px';
    }
    else if(myway==-1)
    {
      //console.log(mycrab.offsetTop);
      //console.log(max_height);
      //上升期
      if(max_height<=mycrab.offsetTop && overmax==0)
      {
        mycrab.style.top = mycrab.offsetTop - each_jump +'px';
      }
      //下降期
      else
      {
        overmax = 1;
        mycrab.style.top = mycrab.offsetTop + each_jump +'px';
      }
      //mycrab.style.top = mycrab.offsetTop + each_move +'px';
    }
    
    if(totalmove>=80)
    {
      //換回原本的圖
      mycrab.src="images/crab.png";
      //消除高度誤差
      mycrab.style.top = myheight+'px';
      //console.log(mycrab.offsetTop);
      
      clearInterval(jumping);
      jumping_stop = 0;
    }
  }
}

//音名輸入判斷
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var playing;
var playing_close = 0;
function crabplay(stagelist,speed,stagenum)
{
  playing_close = 1;
  listcounter = 1;
  var same_note_speed = (speed/5)*80; //5是stage_move裡面定義，每次left減5。80是每個音階加margin的距離
  var mycrab = document.getElementById("crab");
  var mypercent = $("#percent");
  var myheight;
  var listlength = stagelist.length;
  playing = setInterval(frame4, 100);
  function frame4(){
    if(nownote==stagelist[listcounter] && stopplay==0)
    {
      stopplay=1;
      //console.log(nownote);
      //console.log(stagelist[listcounter]);
      //console.log(notelist[nownote]);
      clearInterval(samenote_move);
      //向右移動
      //調整高度，隨關卡音階範圍不同，高度調整公式也不同
      //高度公式最好都跟10的倍數有關，因為jump那邊寫的亂亂的可能會出錯
      switch(stagenum)
      {
        case 1:
        {
          myheight = 400-((stagelist[listcounter]*10)-600)-70;
          break;
        }
        case 2:
        {
          myheight = 400-((stagelist[listcounter]*10)-600)-70;
          break;
        }
        case 3:
        {
          myheight = 400-((stagelist[listcounter]*10)-600)-70;
          break;
        }
        default:console.log("switch error");
      }
      jump(mycrab,myheight); 
      //若下一個音相同，以曲速前進
      if(listcounter!=listlength && stagelist[listcounter]==stagelist[listcounter+1])
      {
        var samecount = 0;
        var tmplist = listcounter;
        while(tmplist!=listlength && stagelist[tmplist]==stagelist[tmplist+1])
        {
          tmplist++;
          samecount++;
        }
        //console.log(samecount);
        samenote(same_note_speed,samecount);
        listcounter = tmplist+1;
      }
      else
      {
        stopplay_open();
        listcounter++;
      } 
      //完成度
      mypercent.text('完成度:'+ Math.round(((listcounter-1)/listlength)*100) +'%');
      //終點偵測
      //console.log(listlength);
      //console.log(listcounter);
      if(listlength == listcounter)
      {
        if( bg_close == 1)
        {
          mypercent.text('完成度:100%');
          clearInterval(bg);
          bg_close = 0;
        }
      }
    }
  }
}

//死亡偵測
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var isdead;
var isdead_close = 0;
var flowdown;
var crab_close = 0;
function qq()
{
  var mycrab = $("#crab");
  var mycrab_same = document.getElementById("crab");
  //console.log("qqq");
  //史萊姆掉下去
  crab_close = 1;
  flowdown = setInterval(frame9, 10);
  var rotatation = 0;
  function frame9()
  {
    rotatation++;
    mycrab.css("top",mycrab_same.offsetTop+rotatation +'px');
    if(rotatation==100)
    {
      console.log("5s");
      crab_close = 0;
      clearInterval(flowdown);
    }
  }
  
}
function dead()
{
  var mycrab = $("#crab");
  var mycrab_same = document.getElementById("crab");
  isdead = setInterval(frame5, 100);
  function frame5(){
    isdead_close = 1;
    //console.log(mycrab_same.offsetLeft);
    if(mycrab_same.offsetLeft <= 0 || mycrab_same.offsetLeft >= 700)
    {
      if( stagemove_close == 1)
      {
        $("#starttext").css("display","block");
        qq();
        clearInterval(stagemove);
        stagemove_close = 0;
      }
      
      if( bg_close == 1)
      {
        clearInterval(bg);
        bg_close = 0;
      }
    }
  }
}

//Canon
var stage1_list=[0,79,79,76,77,79,79,76,77,79,67,69,71,72,74,76,77,76,76,72,74,76,76];
//River flows in you
//var stage2_list=[0,81,81,80,80,81,81,80,80,81,81,76,76,81,81,74,74,74,74,74,74,69,73,81,81,80,81,81,69,80,81,81,69,76,81,81,69,74,69,73,73,74,74,76,76,73,73,71,71,71,71,71,71,69,68,69,69,69,69,69,64,69,71,73,73,73,73,73,73,73,74,76,76,76,76,76,76,74,73,71,71,71,71,71,71,71,71,81,83,81,80,81,69,76,69,81,83,81,80,81,69,76,69,81,83,81,80,81,83,85,86,88,85,83,81,80,80,71,71,81,83,81,80,81,69,76,69,81,83,81,80,81,69,76,69,81,83,81,80,81,83,85,86,88,85,83,81,80,80,71,71,68,68,64,64,64,64,64,64,64,64,64,64,64,64,81,81,80,80,81,81,80,80,81,81,76,76,81,81,74,74,73,73,74,74,76,76,85,85,83,83,83,83,83,83,69,68,69,69,69,69,69,69,69,71,73,73,73,73,73,74,76,76,76,76,74,73,71,72,72,72,68,68,68,68,69,69,57,57,61,61,66,66,66,66,66,66,69,69,69,69,69,69,69,69,69,69,69,69,69];
//天空之城
var stage2_list=[0,69,71,72,72,72,71,72,72,76,76,71,71,71,71,71,71,64,64,69,69,69,69,67,69,69,72,72,67,67,67,67,67,67,65,64,65,65,65,64,65,65,72,72,64,64,64,64,64,72,72,72,71,71,71,66,66,66,71,71,71,71,71,71,71,71,69,71,72,72,72,71,72,72,76,76,71,71,71,71,71,71,64,64,69,69,69,69,67,69,69,72,72,67,67,67,67,67,67,64,64,65,65,72,71,71,71,72,72,74,74,76,72,72,72,72,72,72,71,69,69,71,71,68,68,69,69,69,69,69,69];
//Spirited Away: Always With Me
var stage3_list=[0,77,79,81,77,84,84,84,81,79,79,84,84,79,79,77,74,81,81,81,77,76,76,76,76,77,76,74,74,76,76,77,79,72,72,77,77,79,81,82,82,82,81,79,77,79,79,79,79,77,79,81,77,84,84,84,81,79,79,84,84,79,79,77,74,74,74,76,77,72,72,72,72,72,72,74,74,76,76,77,79,72,72,77,77,79,81,82,82,82,81,79,77,77];

//關卡進行
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function stage(stage_list, stagenum, picnum, speed)//Canon
{
  $("#starttext").css("display","none");
  //清除上次所有div 清除所有開啟的計時器
  $("#stage").empty();
  if( crab_close == 1)//frame2
  {
    //console.log("close");
    clearInterval(flowdown);
    crab_close = 0;
  }
  if( stagemove_close == 1)
  {
    clearInterval(stagemove);
    stagemove_close = 0;
  }
  if( jumping_stop == 1)
  {
    clearInterval(jumping);
    jumping_stop = 0;
  }
  if( playing_close == 1)
  {
    clearInterval(playing);
    playing_close = 0;
  }
  if( isdead_close == 1)
  {
    clearInterval(isdead);
    isdead_close = 0;
  }
  if( bg_close == 1)//frame6
  {
    clearInterval(bg);
    bg_close = 0;
  }
  //產生div音階
  
  var listlength = stage_list.length;
  for(var i=0; i<listlength; i++)
  {
    if(i==0)
    {
      var every_note = $('<div class="stage_note" id="n' + i + '"></div>');
      every_note.css("left",i*80+240+"px");
      //加入高度，不同關卡需調整
      switch(stagenum)
      {
        case 1:
        {
          every_note.css("height",stage_list[1]*10-600+'px');
          break;
        }
        case 2:
        {
          every_note.css("height",stage_list[1]*10-600+'px');
          break;
        }
        case 3:
        {
          every_note.css("height",stage_list[1]*10-600+'px');
          break;
        }
        default:console.log("heigth_create switch error");
      }
    }
    else
    {
      
      var every_note = $('<div class="stage_note" id="n' + i + '">'+notelist[stage_list[i]]+'</div>');
      
      if(i!=listlength && stage_list[i]==stage_list[i+1])
      {
        var howmany = 0;
        var tmpi = i;
        while(tmpi!=listlength && stage_list[tmpi]==stage_list[tmpi+1])
        {
          tmpi++;
          howmany++;
        }
        every_note.css("width",60+80*howmany+'px');
        every_note.css("left",i*80+240+"px");//多兩格當起點
        i=tmpi;
      }
      else
      {
        every_note.css("width","60px");
        every_note.css("left",i*80+240+"px");//多兩格當起點
      }
      
      var mycolor = colorlist[stage_list[i]%12];
      var each_height;
      every_note.css("box-shadow","0 0 7px 5px"+mycolor);
      //加入高度，不同關卡需調整
      switch(stagenum)
      {
        case 1:
        {
          each_height = stage_list[i]*10-600;
          every_note.css("height",stage_list[i]*10-600+'px');
          break;
        }
        case 2:
        {
          each_height = stage_list[i]*10-600;
          every_note.css("height",stage_list[i]*10-600+'px');
          break;
        }
        case 3:
        {
          each_height = stage_list[i]*10-500;
          every_note.css("height",stage_list[i]*10-600+'px');
          break;
        }
        default:console.log("heigth_create switch error");
      }  
    }
    $("#stage").append(every_note);
  }
  //螃蟹
  $("#crab").css("display","inline-block");
  var startnote = document.getElementsByClassName("stage_note");
  //console.log(startnote[0].offsetTop);
  $("#crab").css("top",startnote[0].offsetTop-60 +'px');//要減去自身的長度
  $("#crab").css("left","240px");
  
  //position移動
  stage_move(speed);

  //死亡偵測
  dead();

  //腳色動作
  crabplay(stage_list, speed, stagenum);

  //腳色動作
  bgmove(picnum);
}



