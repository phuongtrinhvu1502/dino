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
        labelName: {
          default: null,
          type: cc.Node,
        },
        startString: 'Enter your name...',
        editBox: {
          default: null,
          type: cc.EditBox,
        }
    },

    setText: function(data) {
      // console.log(data);


      if (data == '') {
        this.label.string = this.startString;
        this.labelName.color = cc.hexToColor('#7F7F7F');
      } else {
        if (this.editBox.inputFlag == 0) {
          var input = '';
          for (i = 0; i < data.length; i++) {
            input += "*";
          }
          this.label.string = input;
        } else {
          this.label.string = data;
        }
        if (this.labelName.color.b != 255) {
          this.labelName.color = cc.hexToColor('#000000');
        }
      }
    },

    startGetName: function() {
      if (this.label.string == this.startString) {
        this.label.string = '';
      }
    },

    endGetName: function(data) {
      if (this.label.string == '') {
        this.label.string = this.startString;
        this.labelName.color = cc.hexToColor('#7F7F7F');
      }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.label = this.labelName.getComponent(cc.Label);
    },

    start: function () {
    },

    // update (dt) {},
});
