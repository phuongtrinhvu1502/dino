// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Helpers = require('Helpers')
cc.Class({
    extends: cc.Component,

    properties: {
      groundYPos: 0,
      ground: {
          default: null,
          type: cc.Prefab
      },
      grounds: {
        default: null,
        type: cc.Node
      },
      player: {
        default: null,
        type: cc.Node
      },
      gameOverDisplay: {
            default: null,
            type: cc.Label
      },
      playAgain: {
        default: null,
        type: cc.Node
      },
      scoreDisplay: {
        default: null,
        type: cc.Label
      },
      highScoreDisplay: {
        default: null,
        type: cc.Label
      },
      buttonJump: {
        default: null,
        type: cc.Node,
      },
      buttonDuck: {
        default: null,
        type: cc.Node,
      },
    },

    CreateNewGround: function() {
        // generate a new node in the scene with a preset template
        var newGround = cc.instantiate(this.ground);
        this.grounds.addChild(newGround);
        newGround.setPosition(cc.p(1300, this.groundYPos));
        newGround.getComponent('Ground').game = this;
        this.lowestGround++;
        this.listGround[0] = this.listGround[1];
        this.listGround[1] = this.listGround[2];
        this.listGround[2] = newGround;
        // console.log(this.countGround);
    },
    GameOver: function() {
      console.log("Game Over");
        this.isGameOver = true;
        this.playerScript.accel = 0;
        // this.gameOverDisplay.enabled = true;
        // this.playAgain.active = true;
        this.socket.isGameOver = true;
        // this.socket.socket.disconnect();
        this.socket.sendDataDead();
        // for (i = 0; i < 5; i++) {
        //   var scoreComp = this.socket.leaderBoardScore[i].getComponent('Score');
        //   scoreComp.isStartUpdate = false;
        // }
        if (!this.isSendLeaderBoard) {
          this.isSendLeaderBoard = true;
          // this.saveScore();
          this.checkLogin();
        }
        window.loadIframeAds(this.score);
        // var dieTime = cc.sys.localStorage.getItem('noDead');
        var dieTime = Helpers.noDead;
        if (dieTime == null || dieTime == 'undefined') {
          dieTime = 1;
        } else {

          if (dieTime == 5) {
            dieTime = 1;
            window.reloadDie5times();
          } else {
            dieTime++;
          }
        }
        // cc.sys.localStorage.setItem('noDead', dieTime);
        Helpers.noDead = dieTime;
    },
    checkLogin: function() {
      var cookieName = document.cookie;
      if (cookieName == ""){
        this.isLogin = false;
      }else{
        var params = cookieName.split(";");

        for (var i=0; i<params.length; i++) {
          var param = params[i].split("=");
          if(param[0].trim() == "userInfo_name")
          {
            this.isLogin = true;
            this.saveScore();
            break;
          }
          else if(param[0].trim() == "userInfo_name_guest"){
            this.isLogin = false;
          }
        }
      }
    },
    saveScore: function() {
      var name = this.player.getComponent('Player').playerName.getComponent(cc.Label).string;
      // var param = 'userName=' + name + '&score=' + this.score;
      var playerObject = new Object();
      playerObject.userName = name;
      playerObject.score = this.score;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://dinosaurgame.io/funcUser/saveScore.php", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(playerObject));
    },
    onLoad: function () {
      console.log(Helpers.version);
      Helpers.runSpeed = 7;
      this.isLogin = false;
      this.isSendLeaderBoard = false;
      this.isGameStarted = false;
      this.isGameOver = false;
      this.highScore = cc.sys.localStorage.getItem('HighScore');
      this.socket = this.getComponent('Socket');
      this.playerScript = this.player.getComponent('Player');
      this.playerScript.game = this;
      this.gameOverDisplay.enabled = false;
      this.playAgain.active = false;
      this.listGround = [];
      this.lowestGround = 1;
      for (var i =0; i<3;i++) {
        var newGround = cc.instantiate(this.ground);
        this.grounds.addChild(newGround);
        newGround.setPosition(cc.p(-300 + (600*i) - 5, this.groundYPos));
        newGround.getComponent('Ground').game = this;
        this.listGround.push(newGround);
      }
      this.score = 0;
      this.setInputControl();
      this.setButtonControl();
      // console.log(cc.sys.os);
      if (cc.sys.os == 'Windows') {
        this.buttonDuck.active = false;
        this.buttonJump.active = false;
      }
      // window.speed = function(speed) {
      //     Helpers.gameSpeed = speed;
      // }
      // window.distance = function(distance) {
      //     Helpers.enemyDistance = distance;
      // }
    },

    setInputControl: function () {
          var self = this;
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {

              switch (event.keyCode) {
                  case cc.KEY.up:
                      if (!self.isGameStarted) {

                        if (self.socket.enemyData != '') {
                          var scoreInterval = setInterval(function () {
                            if (!self.isGameOver) {
                              self.score += 1;
                              self.scoreDisplay.string = self.score;
                            } else {
                              clearInterval(scoreInterval);
                            }
                          }, 100);
                          self.socket.sendDataStartMove();
                          self.socket.sendDataGetLeaderBoard();
                          self.isGameStarted = true;
                        }
                      }
                      break;
              }
          });
    },

    setButtonControl: function() {
      var self = this;
      this.buttonJump.on(cc.Node.EventType.TOUCH_START, function(event){
        if (!self.isGameStarted) {

          if (self.socket.enemyData != '') {
            console.log("Create interval");
            var scoreInterval = setInterval(function () {
              if (!self.isGameOver) {
                self.score += 1;
                self.scoreDisplay.string = self.score;
              } else {
                clearInterval(scoreInterval);
              }
            }, 100);
            self.socket.sendDataStartMove();
            self.socket.sendDataGetLeaderBoard();
            self.isGameStarted = true;
          }
        }
      });
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad: () {},

    start: function () {
      if (this.highScore == null) {
        this.highScoreDisplay.string = 'HI  0';
      } else {
        this.highScoreDisplay.string = 'HI  ' + this.highScore;
      }
      // cc.view.resizeWithBrowserSize(true);
      // cc.view.setDesignResolutionSize(2048, 1080, cc.ResolutionPolicy.EXACT_FIT);
       // cc.view.enableAutoFullScreen(true);
       cc.view.setDesignResolutionSize(1200, 560, cc.ResolutionPolicy.EXACT_FIT);
    },

    update: function (dt) {

    },
});
