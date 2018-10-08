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
        runSpeed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // switch of acceleration direction
        this.isCreateSelf = false;

    },

    start: function () {

      // console.log(this.count);
    },

    update: function (dt) {
      if (this.game.isGameOver || !this.game.isGameStarted) {
        this.runSpeed = 0;
        return;
      }
      this.runSpeed = 7;
        this.node.x -= Helpers.runSpeed * Helpers.gameSpeed * dt;
        if (this.node.x <= -900) {
          this.node.destroy();
        }
        if (this.node.x <= -500 && !this.isCreateSelf) {
          this.game.CreateNewGround();
          this.isCreateSelf = true;
        }
    },
});
