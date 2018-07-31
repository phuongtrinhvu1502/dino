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
      accel: 0,
      fallingPoint: 0,
      max: 0,
      groundPoint: 0,
      moveSpeed: 7,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.isDead = false;
      this.isFalling = false;
      this.isGrowing = false;
      // switch of acceleration direction
      this.accTop = true;
      this.isBotDead = false;
      // current horizontal speed of main character
      this.xSpeed = 0;
      this.ySpeed = 0;

      this.anim = this.getComponent(cc.Animation);
      this.runAnimState = this.anim.getAnimationState('dino');
      this.jumpAnimState = this.anim.getAnimationState('dino_jump');
      this.deadAnimState = this.anim.getAnimationState('dino_dead');
      this.duckAnimState = this.anim.getAnimationState('dino_duck');
      // initialize keyboard input listener


      this.colliders = this.node.getComponents(cc.PolygonCollider);
      this.standCollider = this.colliders[0];
      this.duckCollider = this.colliders[1];
      //
      var manager = cc.director.getCollisionManager();
      // Enabled the colider manager.
      manager.enabled = true;
      // Enabled draw collider
      manager.enabledDebugDraw = false;
    },

    onCollisionEnter: function (other, self) {
      // console.log('on collision enter: ' + other.node.group);

      if (other.tag == 0 && other.node.group == 'Enemy') {
        // console.log("You lose");
        this.moveSpeed = other.getComponent('Enemy').runSpeed;
        if (!this.deadAnimState.isPlaying) {
          this.isDead = true;
          this.anim.play('dino_dead');
          this.isBotDead = true;
        }
      }
    },

    start: function () {
    },

    update: function (dt) {

      if (this.game.isGameOver && this.isBotDead) {
        return;
      }
        if (this.isBotDead) {
          this.node.x -= this.moveSpeed;
          if (this.node.x <= -1500) {
            this.node.destroy();
          }
          return;
        }
        if (this.accTop && !this.isFalling && this.isGrowing) {
          this.ySpeed += this.accel * dt;

        }
        else {
          this.ySpeed -= (this.accel *50/100) *dt;
        }
        if (this.ySpeed >= this.max) {
          this.ySpeed = this.max;
        }
        this.node.y += this.ySpeed * dt;
        if (this.node.y <= this.groundPoint) {
          this.ySpeed = 0;
          this.node.y = this.groundPoint;
          this.isFalling = false;
          this.isGrowing = true;
          if (!this.runAnimState.isPlaying && !this.isDead && !this.duckAnimState.isPlaying) {
            this.anim.play('dino');
          }
        }
        if (this.node.y >= this.fallingPoint) {
          this.accTop = false;
          this.isFalling = true;
        }
        if (this.game.isGameOver || !this.game.isGameStarted) {
        this.node.x += this.moveSpeed;
          if (this.node.x >= 900) {
            this.node.destroy();
          }
        }
    },
});
