// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// var DebugMenuItem = cc.Class({
//     name: 'DebugMenuItem',
//     properties: {
//     NAME: '',
//     ViewFunc: cc.Component,
//     Flag: false,
// });
// ctor: function () {
//     cc.log('DebugMenuItem Constructor');
//     this.name = '';
//     this.ViewFunc = null;
//     this.Flag = false;
// };
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: js.array, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        enemies: {
                    default: [],
                    type: cc.Prefab,
                    tooltip: "List enemy",
        },
        parentEnemy: {
          default: null,
          type: cc.Node
        },
        player: {
          default: null,
          type: cc.Node
        },
        bot: {
          default: null,
          type: cc.Prefab,
          tooltip: "Bot",
        },
        networkPlayer: {
          default: null,
          type: cc.Prefab,
          tooltip: "Network Player",
        },
        serverSocket: 'http://45.33.124.160:1339',
        gameSpeed: 7,
        maxGameSpeed: 12,
        leaderBoardName: {
          default: [],
          type: cc.Node,
        },
        leaderBoardScore: {
          default: [],
          type: cc.Node,
        },
        buttonJump: {
          default: null,
          type: cc.Node,
        },
        buttonDuck: {
          default: null,
          type: cc.Node,
        },
        spawn: {
          default: null,
          type: cc.Node,
        },
    },

    createEnemy : function(data, index, duration) {
      if (!this.isGameOver) {
        // console.log('Create Enemy');
        var self = this;
        setTimeout(function () {
          var enemy = data[index].split(',');
          var enemyIndex = enemy[0];
          var enemyDuration = parseInt(enemy[1]);
          enemyDuration = enemyDuration - (30 * (self.gameSpeed - 7));
          var newEnemy = cc.instantiate(self.enemies[enemyIndex]);
          self.parentEnemy.addChild(newEnemy);
          newEnemy.setPosition(cc.p(700, -33.5));
          newEnemy.getComponent('Enemy').game = self;
          newEnemy.getComponent('Enemy').runSpeed = self.gameSpeed;
          index++;
          if (index == data.length){
            index = 0;
          }
          self.createEnemy(data, index, enemyDuration);
        }, duration);
      }
    },

    sendDataJump: function() {
      this.socket.emit("jump", '');
    },

    sendDataDuck: function() {
      this.socket.emit("duck", '');
    },

    sendDataCancleJump: function() {
      this.socket.emit("cancleJump", '');
    },

    sendDataCancleDuck: function() {
      this.socket.emit("cancleDuck", '');
    },

    sendDataStartMove: function() {
      this.socket.emit('startMove', '');
    },
    sendDataGetLeaderBoard: function() {
      console.log('Get leaderBoard');
      this.socket.emit('getLeaderBoard', '');
    },
    sendDataDead: function() {
      this.socket.emit('dead', '');
    },

    setInputControl: function () {
      var self = this;
        if (!self.gameController.isGameOver) {
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
              switch (event.keyCode) {
                  case cc.KEY.up:
                        if (!self.isHoldingButton && self.socket != null) {
                          self.sendDataJump();
                          self.isHoldingButton = true;
                        }
                      break;
                  case cc.KEY.down:
                        if (!self.isHoldingButton && self.socket != null) {
                          self.sendDataDuck();
                          self.isHoldingButton = true;
                        }
                      break;
              }
          });
          // when releasing the button, stop acceleration in this direction
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
              switch (event.keyCode) {
                  case cc.KEY.up:
                      if (self.socket != null) {
                        self.isHoldingButton = false;
                        self.sendDataCancleJump();
                      }

                      break;
                  case cc.KEY.down:
                      if (self.socket != null) {
                        self.isHoldingButton = false;
                        self.sendDataCancleDuck();
                      }
                      break;
              }
          });
        }
    },

    setButtonControl: function() {
      var self = this;
      this.buttonJump.on(cc.Node.EventType.TOUCH_START, function(event){
       self.sendDataJump();
       self.isHoldingButton = true;
      });
      this.buttonJump.on(cc.Node.EventType.TOUCH_END, function(event){
        if (self.socket != null) {
          self.isHoldingButton = false;
          self.sendDataCancleJump();
        }
      });

      this.buttonDuck.on(cc.Node.EventType.TOUCH_START, function(event){
        if (!self.isHoldingButton && self.socket != null) {
          self.sendDataDuck();
          self.isHoldingButton = true;
        }
      });

      this.buttonDuck.on(cc.Node.EventType.TOUCH_END, function(event){
        if (self.socket != null) {
          self.isHoldingButton = false;
          self.sendDataCancleDuck();
        }
      });
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.spawn.getComponent('Spawn').game = this.getComponent('GameController');
      this.increateSpeed = 300;
      this.isHoldingButton = false;
      this.gameController = this.getComponent('GameController');
      this.name = cc.sys.localStorage.getItem('guest_name');
      this.isGameOver = this.gameController.isGameOver;
      var newSocket = require('socket.io-client')(this.serverSocket);
      var self = this;
      this.isCreatedEnemy = false;
      this.enemyData = '';
      // var enemies = this.enemies;
      // var parentEnemy = this.parentEnemy;
      var pro5 = new Object();
      pro5.name = this.name;
      pro5.room = 'global';
      pro5.type = 'player';
      var result = JSON.stringify(pro5);
      newSocket.emit('register', result);
      newSocket.on('registerComplete',function(data){
        // console.log(data);
        self.enemyData = data.split(';');
        // self.createEnemy(enemyData, 0);
      });
      newSocket.on('startMove', function(data){
        var newPlayer = JSON.parse(data);
        if (newPlayer.type == 'bot') {
            var newBot = cc.instantiate(self.bot);
            self.node.addChild(newBot);
            newBot.setPosition(cc.p(self.spawn.x, -56));
            newBot.getComponent('Bot').game = self.gameController;
            console.log("Bot : " + data);
            newBot.getComponent('Bot').botNameComp.string = newPlayer.name;
            newBot.name = newPlayer.id;
        } else {
            // var newBot = cc.instantiate(self.bot);
            // self.node.addChild(newBot);
            // newBot.setPosition(cc.p(-237, -56));
            // newBot.getComponent('Bot').game = self.gameController;
            var newNetworkPlayer = cc.instantiate(self.networkPlayer);
            self.node.addChild(newNetworkPlayer);
            newNetworkPlayer.setPosition(cc.p(-237, -56));
            newNetworkPlayer.getComponent('NetworkPlayer').game = self.gameController;
            newNetworkPlayer.getComponent('NetworkPlayer').netWorkPlayerNameComp.string = newPlayer.name;
            newNetworkPlayer.name = newPlayer.id;
        }
      });
       newSocket.on('jump', function(data){
         var child = self.node.getChildByName(data);
         if (child != null) {
           child.getComponent('NetworkPlayer').jump();
         }

       });
       newSocket.on('cancleJump', function(data){
         var child = self.node.getChildByName(data);
         if (child != null) {
           child.getComponent('NetworkPlayer').cancleJump();
         }

       });
       newSocket.on('duck', function(data) {
         var child = self.node.getChildByName(data);
         if (child != null) {
           child.getComponent('NetworkPlayer').duck();
         }

       });
       newSocket.on('cancleDuck', function(data){
         var child = self.node.getChildByName(data);
         if (child != null) {
           child.getComponent('NetworkPlayer').stand();
         }

       });
       newSocket.on('getLeaderBoard', function(data){
         var leaderBoard = JSON.parse(data);
         for (i = 0; i < 5; i++) {
           if (i < leaderBoard.length) {
             var obj = leaderBoard[i];
             if (obj.id == newSocket.id) {
               self.leaderBoardName[i].color = cc.hexToColor('#E43131');
               self.leaderBoardScore[i].color = cc.hexToColor('#E43131');
             } else {
               self.leaderBoardName[i].color = cc.hexToColor('#000000');
               self.leaderBoardScore[i].color = cc.hexToColor('#000000');
             }
             self.leaderBoardName[i].getComponent(cc.Label).string = (i+1) + '. ' + obj.name;
             var scoreComp = self.leaderBoardScore[i].getComponent('Score');
             if (!scoreComp.isStartUpdate) {
               scoreComp.score = obj.score;
               scoreComp.updateScore();
               scoreComp.isStartUpdate = true;
             } else {
               scoreComp.score = obj.score + 1;
             }
           } else {
             self.leaderBoardName[i].getComponent(cc.Label).string = (i+1);
             self.leaderBoardScore[i].getComponent(cc.Label).string = 0;
             self.leaderBoardName[i].color = cc.hexToColor('#000000');
             self.leaderBoardScore[i].color = cc.hexToColor('#000000');
           }
         }
       });
       newSocket.on('dead', function(data){
         var deadInfo = JSON.parse(data);
         var child = self.node.getChildByName(deadInfo.id);
         if (child != null) {
           child.destroy();
         }
       });
      this.socket = newSocket;
    },

    start: function () {
      this.setInputControl();
      this.setButtonControl();
    },

    update: function (dt) {
      // console.log(this.gameController.score);
      if (this.gameController.score >= this.increateSpeed && this.gameSpeed <= this.maxGameSpeed) {
        console.log('Increate Speed');
        this.gameSpeed++;
        this.increateSpeed += 300;
      }
      if (!this.gameController.isGameStarted) {
        return;
      } else {
        if (this.isCreatedEnemy) {

          return;
        }
        else {
          this.createEnemy(this.enemyData, 0, 1500);
          this.isCreatedEnemy = true;
        }
      }
    },
});
