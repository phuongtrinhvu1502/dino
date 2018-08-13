// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        newGround.setPosition(cc.p(900, this.groundYPos));
        newGround.getComponent('Ground').game = this;
        this.lowestGround++;
        this.listGround[0] = this.listGround[1];
        this.listGround[1] = this.listGround[2];
        this.listGround[2] = newGround;
        // console.log(this.countGround);
    },
    GameOver: function() {
        console.log("Game over");
        this.isGameOver = true;
        this.playerScript.accel = 0;
        this.gameOverDisplay.enabled = true;
        this.playAgain.active = true;
        this.socket.isGameOver = true;
        // this.socket.socket.disconnect();
        if (this.highScore == null) {
          cc.sys.localStorage.setItem('HighScore', this.score);
        } else if (this.score > this.highScore) {
          cc.sys.localStorage.setItem('HighScore', this.score);
        }
        // for (i = 0; i < 5; i++) {
        //   var scoreComp = this.socket.leaderBoardScore[i].getComponent('Score');
        //   scoreComp.isStartUpdate = false;
        // }
        if (!this.isSendLeaderBoard) {
          this.isSendLeaderBoard = true;
          this.saveScore();
        }
    },
    saveScore: function() {
      var isLogin = cc.sys.localStorage.getItem('isLogin');
      if (isLogin == 'true') {
        var obj = new Object();
        var loginMethod = cc.sys.localStorage.getItem('loginMethod');
        if (loginMethod == 'facebook') {
          obj.type = 'fb_id';
        } else if (loginMethod == 'twitter') {
          obj.type = 'tw_id';
        } else if (loginMethod == 'google') {
          obj.type = 'gg_id';
        } else if (loginMethod == 'name') {
          obj.type = 'user_name';
        }
        obj.id = cc.sys.localStorage.getItem('id');
        obj.name = cc.sys.localStorage.getItem('name');
        obj.score = this.score;
        obj.avatar = cc.sys.localStorage.getItem('avatar');
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://45.33.124.160/Dino/saveScore.php");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(obj));
        console.log(JSON.stringify(obj));

      }
    },
    onLoad: function () {
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
    },

    setInputControl: function () {
          var self = this;
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {

              switch (event.keyCode) {
                  case cc.KEY.up:
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
