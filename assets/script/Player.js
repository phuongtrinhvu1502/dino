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
        playerName: {
          default: null,
          type: cc.Node,
        },
        buttonJump: {
          default: null,
          type: cc.Node,
        },
        buttonDuck: {
          default: null,
          type: cc.Node,
        },
        socket: {
          default: null,
          type: cc.Node,
        }
    },

    jump: function() {
      console.log('Jump');
    },

    duck: function() {
      console.log('duck');
    },

    setButtonControl: function () {
      var self = this;
      var anim1 = self.anim;
      var runAnimState1 = self.anim.getAnimationState('dino');
      var jumpAnimState1 = self.anim.getAnimationState('dino_jump');
      var duckAnimState1 = self.anim.getAnimationState('dino_duck');
      this.buttonJump.on(cc.Node.EventType.TOUCH_START, function(event){
	     // click event
       self.accTop = true;
       if (!jumpAnimState1.isPlaying) {
         if (anim1._clips != null) {
           anim1.play("dino_jump");
         }
       }
      });
      this.buttonJump.on(cc.Node.EventType.TOUCH_END, function(event){
      	// event when leave the finger touch
        self.accTop = false;
        self.isGrowing = false;
      });

      this.buttonDuck.on(cc.Node.EventType.TOUCH_START, function(event){
        if (!duckAnimState1.isPlaying) {
          if (anim1._clips != null) {
            anim1.play("dino_duck");
            // console.log(this.duckCollider);
            if (!self.duckCollider.enabled) {
              self.duckCollider.enabled = true;
              self.standCollider.enabled = false;
            }
          }
        }
      });

      this.buttonDuck.on(cc.Node.EventType.TOUCH_END, function(event){
        if (!runAnimState1.isPlaying) {
          if (anim1._clips != null) {
            anim1.play("dino");
            if (!self.standCollider.enabled) {
              self.duckCollider.enabled = false;
              self.standCollider.enabled = true;
            }
          }
        }
      });
    },

    setInputControl: function () {
        if (!this.game.isGameOver) {
          var self = this;
          var anim1 = self.anim;
          var runAnimState1 = self.anim.getAnimationState('dino');
          var jumpAnimState1 = self.anim.getAnimationState('dino_jump');
          var duckAnimState1 = self.anim.getAnimationState('dino_duck');
          var node1 = self.node;
          // console.log(jumpAnimState1);
          // this.anim = this.getComponent(cc.Animation);
          // add keyboard event listener
          // When there is a key being pressed down, judge if it's the designated
          // directional button and set up acceleration in the corresponding direction
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {

              switch (event.keyCode) {
                  case cc.KEY.w:
                      // self.accTop = true
                      self.accTop = true;
                      if (!jumpAnimState1.isPlaying) {
                        if (anim1._clips != null) {
                          anim1.play("dino_jump");
                        }
                      }
                      break;
                  case cc.KEY.up:
                        self.accTop = true;
                        if (!jumpAnimState1.isPlaying) {
                          if (anim1._clips != null) {
                            anim1.play("dino_jump");
                          }
                        }
                      break;
                  case cc.KEY.down:
                      if (!duckAnimState1.isPlaying) {
                        if (anim1._clips != null) {
                          anim1.play("dino_duck");
                          // console.log(this.duckCollider);
                          if (!self.duckCollider.enabled) {
                            self.duckCollider.enabled = true;
                            self.standCollider.enabled = false;
                          }
                        }
                      }
                      break;
              }
          });
          // when releasing the button, stop acceleration in this direction
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
              switch (event.keyCode) {
                  case cc.KEY.w:
                  console.log("Key Up");
                      self.accTop = false;
                      self.isGrowing = false;
                      break;
                  case cc.KEY.up:
                      self.accTop = false;
                      self.isGrowing = false;
                      break;
                  case cc.KEY.down:
                      if (!runAnimState1.isPlaying) {
                        if (anim1._clips != null) {
                          anim1.play("dino");
                          if (!self.standCollider.enabled) {
                            self.duckCollider.enabled = false;
                            self.standCollider.enabled = true;
                          }
                        }
                      }
                      break;
              }
          });
        }
    },

    getNameFromCookie: function(name) {
      // var cookieName = document.cookie;
      // var name = "";
      // if (cookieName == ""){
      //   name = "";
      // }else{
      //   var params = cookieName.split(";");
      //
      //   for (var i=0; i<params.length; i++) {
      //     var param = params[i].split("=");
      //     if(param[0].trim() == "userInfo_name"){ name = param[1]; break;}
      //     else if(param[0].trim() == "userInfo_name_guest"){ name = param[1]; }
      //   }
      //   name = decodeURIComponent(name).replace(/\+/g, ' ');
      //   console.log("CookieName: [" + name + "]");
        this.playerName.getComponent(cc.Label).string = name;
        this.socket.getComponent('Socket').createSocket(name);
      // }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
      this.isDead = false;
      this.isFalling = false;
      this.isGrowing = false;
      // switch of acceleration direction
      this.accTop = false;

      // current horizontal speed of main character
      this.xSpeed = 0;
      this.ySpeed = 0;
      var self = this;
      var name = cc.sys.localStorage.getItem('playerName');
      self.getNameFromCookie(name);
      // var isLogin = cc.sys.localStorage.getItem('isLogin');
      // if (isLogin == 'true') {
      //   this.playerName.getComponent(cc.Label).string = cc.sys.localStorage.getItem('name');
      // } else {
      //   this.playerName.getComponent(cc.Label).string = cc.sys.localStorage.getItem('guest_name');
      // }

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
      this.setInputControl();
      this.setButtonControl();
    },

    onCollisionEnter: function (other, self) {
      // console.log('on collision enter: ' + other.node.group);

      if (other.tag == 0) {
        // console.log("You lose");
        this.game.GameOver();
        if (!this.deadAnimState.isPlaying) {
          this.isDead = true;
          this.anim.play('dino_dead');
        }
      }
    },

    start: function() {

    },

    update: function (dt) {
        // update speed of each frame according to the current acceleration direction
        // console.log("Player: " + this.accTop);
        if (!this.game.isGameOver && this.game.isGameStarted) {
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
        }

    },
});
