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
        actionDistance: 100,
    },

    onCollisionEnter: function (other, self) {
      // console.log('on collision enter: ' + other.node.group);
      // if (other.node.group == 'Player') {
      //   this.runSpeed = 0;
      // }
    },

    getPlayerDistance: function () {
        // judge the distance according to the position of the player node
        var playerPos = this.player.getPosition();
        // calculate the distance between two nodes according to their positions
        var dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    },

    playerAction: function(playerComp) {
      if (this.action == 'jump') {
        playerComp.accTop = true;

      } else if (this.action == 'duck') {
        console.log("Duck");
        if (!playerComp.duckAnimState.isPlaying) {
          if (playerComp.anim._clips != null) {
            playerComp.anim.play("dino_duck");
            if (!playerComp.standCollider.enabled) {
              playerComp.duckCollider.enabled = true;
              playerComp.standCollider.enabled = false;
            }
          }
        }
      }
    },
    onCollisionEnter: function (other, self) {
      // console.log('on collision enter: ' + other.node.group);
      console.log("Player enter");
      // if (other.tag == 0) {
      if (other.node.group == 'Player') {
        // console.log("You lose");
        var comp = other.node.getComponent('Player');
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
      this.playerComp = this.player.getComponent('Player');
      var box = this.node.addComponent(cc.BoxCollider);
      box.offset.x = -75;
      box.offset.y = -0;
      box.size.width = 45;
      box.size.height = 45;
      box.tag = 1;

      // console.log(box);
      console.log(this.getComponent(cc.BoxCollider));
    },

    update: function (dt) {
        // update speed of each frame according to the current acceleration direction
        // this.player.getComponent('Player').accTop = true;
        if (!this.game.isGameOver) {
          this.node.x -= this.runSpeed;
          if (this.node.x <= -1500) {
            this.node.destroy();
          }
          if (this.getPlayerDistance() < this.actionDistance) {
            // console.log("Player action: " + this.action);
            // this.playerAction();
          }
        }
    },
});
