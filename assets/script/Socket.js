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
          console.log(enemyDuration);
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
      console.log("StartMove");
      this.socket.emit('startMove', '');
    },

    setInputControl: function () {
      var self = this;
        if (!self.gameController.isGameOver) {
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
              switch (event.keyCode) {
                  case cc.KEY.up:
                        if (!self.isHoldingButton && self.socket != null) {
                          if (!self.gameController.isGameStarted) {
                            self.sendDataStartMove();
                            self.gameController.isGameStarted = true;
                          }
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

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.increateSpeed = 300;
      this.isHoldingButton = false;
      this.gameController = this.getComponent('GameController');
      this.abc123 = 'abc123';
      this.isGameOver = this.gameController.isGameOver;
      var newSocket = require('socket.io-client')(this.serverSocket);
      var self = this;
      this.isCreatedEnemy = false;
      this.enemyData = '';
      // var enemies = this.enemies;
      // var parentEnemy = this.parentEnemy;
      var pro5 = new Object();
      pro5.name = "abc123";
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
          if (!self.gameController.isGameStarted) {
            var newBot = cc.instantiate(self.bot);
            self.node.addChild(newBot);
            newBot.setPosition(cc.p(-237, -56));
            newBot.getComponent('Bot').game = self.gameController;
          }
        } else {
          if (!self.gameController.isGameStarted) {
            // var newBot = cc.instantiate(self.bot);
            // self.node.addChild(newBot);
            // newBot.setPosition(cc.p(-237, -56));
            // newBot.getComponent('Bot').game = self.gameController;
            var newNetworkPlayer = cc.instantiate(self.networkPlayer);
            self.node.addChild(newNetworkPlayer);
            newNetworkPlayer.setPosition(cc.p(-237, -56));
            newNetworkPlayer.getComponent('NetworkPlayer').game = self.gameController;
            newNetworkPlayer.name = newPlayer.id;
          }
        }
      });
       newSocket.on('jump', function(data){
         var child = self.node.getChildByName(data);
         child.getComponent('NetworkPlayer').jump();
       });
       newSocket.on('cancleJump', function(data){
         var child = self.node.getChildByName(data);
         child.getComponent('NetworkPlayer').cancleJump();
       });
       newSocket.on('duck', function(data) {
         var child = self.node.getChildByName(data);
         child.getComponent('NetworkPlayer').duck();
       });
       newSocket.on('cancleDuck', function(data){
         var child = self.node.getChildByName(data);
         child.getComponent('NetworkPlayer').stand();
       });
      this.socket = newSocket;
    },

    start: function () {
      this.setInputControl();
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
