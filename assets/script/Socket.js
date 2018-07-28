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
    },

    createEnemy : function(data, index) {
      var self = this;
      setTimeout(function () {
        var enemyIndex = data[index];
        var newEnemy = cc.instantiate(self.enemies[enemyIndex]);
        self.parentEnemy.addChild(newEnemy);
        newEnemy.setPosition(cc.p(700, -33.5));
        newEnemy.getComponent('Enemy').game = self;
        newEnemy.getComponent('Enemy').player = self.player;
        index++;
        self.createEnemy(data, index);
      }, 1000);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.abc123 = 'abc123';
      this.isGameOver = false;
      this.isDisconnect = false;
      this.socket = require('socket.io-client')('http://localhost:1338');
      console.log("Socket onLoad");
      var self = this;
      // var enemies = this.enemies;
      // var parentEnemy = this.parentEnemy;
      this.socket.emit('register', "abc123");
      this.socket.on('registerComplete',function(data){
        // console.log(data);
        var enemyData = data.split(',');
        self.createEnemy(enemyData, 0);
      });
    },

    // start () {
    //
    // },

    // update: function (dt) {
    // },
});
