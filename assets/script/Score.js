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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },,
        score: 0,
    },

    updateScore: function() {
      var self = this;
      setTimeout(function () {

        if (self.isStartUpdate) {
          self.label.string = self.score;
          self.score+= 1;
        } else {
          self.score = 0;
          self.label.string = self.score;
        }
        self.updateScore();
      }, 100);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.label = this.node.getComponent(cc.Label);
      this.isStartUpdate = false;
    },

    // start () {
    //
    // },

    // update (dt) {},
});
