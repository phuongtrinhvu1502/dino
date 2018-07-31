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
        runSpeed: 0,
        action: 'jump',
    },

    onCollisionEnter: function (other, self) {
      // console.log('on collision enter: ' + other.node.group);
      // if (other.node.group == 'Player') {
      //   this.runSpeed = 0;
      // }
    },

    playerAction: function(playerComp) {
      if (this.action == 'jump') {
        playerComp.accTop = true;

      } else if (this.action == 'duck') {
        if (!playerComp.duckAnimState.isPlaying) {
          if (playerComp.anim._clips != null) {
            playerComp.anim.play("dino_duck");
            if (!playerComp.duckCollider.enabled) {
              playerComp.duckCollider.enabled = true;
              playerComp.standCollider.enabled = false;
            }
          }
        }
        setTimeout(function () {
          if (!playerComp.runAnimState.isPlaying) {
            if (playerComp.anim._clips != null) {
              playerComp.anim.play("dino");
              if (!playerComp.standCollider.enabled) {
                playerComp.duckCollider.enabled = false;
                playerComp.standCollider.enabled = true;
              }
            }
          }
        }, 500);
      }
    },
    onCollisionEnter: function (other, self) {
      // console.log('on collision enter: ' + other.node.group);
      // if (other.tag == 0) {
      if (other.node.group == 'Bot') {
        // console.log("Bot action");
        var comp = other.node.getComponent('Bot');
        this.playerAction(comp);
      }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
    },

    start: function () {
      // console.log(this.player);
      var box = this.node.addComponent(cc.BoxCollider);
      box.offset.x = -75;
      box.offset.y = 0;
      box.size.width = 45;
      box.size.height = 45;
      box.tag = 1;
      // console.log(this.node.name);
      // if (this.node.name == 'Enemy7') {
      //   console.log(box);
      // }
      // console.log(box);
    },

    update: function (dt) {
        // update speed of each frame according to the current acceleration direction
        // this.player.getComponent('Player').accTop = true;
        if (!this.game.isGameOver) {
          this.node.x -= this.runSpeed;
          if (this.node.x <= -1500) {
            this.node.destroy();
          }
        }
    },
});
