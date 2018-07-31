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
        this.socket.socket.disconnect();
        if (this.highScore == null) {
          cc.sys.localStorage.setItem('HighScore', this.score);
        } else if (this.score > this.highScore) {
          cc.sys.localStorage.setItem('HighScore', this.score);
        }
    },
    onLoad: function () {
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
    },

    setInputControl: function () {
          var self = this;
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {

              switch (event.keyCode) {
                  case cc.KEY.up:
                      if (!self.isGameStarted) {
                        // self.isGameStarted = true;
                        var scoreInterval = setInterval(function () {
                          if (!self.isGameOver) {
                            self.score += 1;
                            self.scoreDisplay.string = self.score;
                          } else {
                            clearInterval(scoreInterval);
                          }
                        }, 100);
                      }
                      break;
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
    },

    update: function (dt) {

    },
});
