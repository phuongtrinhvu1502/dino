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
    },

    // LIFE-CYCLE CALLBACKS:
    GetRoom: function(){
        var roomid_value = "global";
		    var level_value = "";
        var queryString = window.location.search.substring(1);
        var params = queryString.split("&");

        for (var i=0; i<params.length; i++) {
            var param = params[i].split("=");
            if(param[0] == "roomid"){ roomid_value = param[1]; }
        }
        console.log("Room: " + roomid_value);
        // var buffer = _malloc(lengthBytesUTF8(roomid_value) + 1);
        cc.sys.localStorage.setItem('roomId', roomid_value);
        return roomid_value;
    },

    onLoad: function () {
      this.roomid = this.GetRoom();
      if (this.roomid == "global") {
        window.parent.loadGamePopup();
      } else {
        cc.director.loadScene("game", function() {

        });
      }
      window.parent.playFunction = function(name) {
        console.log('Get name: ' + name);
        cc.sys.localStorage.setItem('playerName', name);
        cc.director.loadScene("game", function() {

        });
      }
    },

    // start () {
    //
    // },

    // update (dt) {},
});
