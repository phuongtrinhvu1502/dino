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
        // },
        socket: {
          default: null,
          type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    callback: function () {
        //here the customEventData parameter is equal to you set before the "foobar"
          this.socket.getComponent('Socket').socket.disconnect();
          cc.director.loadScene("game", function() {
            console.log("Loaded");
          });

    },

    menuCallBack: function() {
      this.socket.getComponent('Socket').socket.disconnect();
      
      cc.director.loadScene("MenuWeb", function() {

      });
    },

    onLoad: function() {
      var self = this;
      // window.parent.document.getElementById("sco-game").contentWindow.again = function() {
      //   console.log('Cocos Again');
      //   self.callback();
      // }
      window.again = function() {
        self.callback();
      }
      window.backToMenu = function() {
          self.menuCallBack();
      }
    },

    // start () {
    //
    // },

    // update (dt) {},
});
