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
        logged: {
          default: null,
          type: cc.Node,
        },
        notLogged: {
          default: null,
          type: cc.Node,
        },
        email: {
          default: null,
          type: cc.EditBox,
        },
        password: {
          default: null,
          type: cc.EditBox,
        },
        loginForm: {
          default: null,
          type: cc.Node,
        },
        registerForm: {
          default: null,
          type: cc.Node,
        },
        error: {
          default: null,
          type: cc.Label,
        },
        gameMenu: {
          default: null,
          type: cc.Node,
        },
        loginPage: {
          default: null,
          type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
      this.fbInit = '';
      this.firebase = '';
      this.isLogin = cc.sys.localStorage.getItem('isLogin');
      this.loginMethod = cc.sys.localStorage.getItem('loginMethod');
      if (!cc.sys.isNative) {
        this.facebook();
        this.twitter();
      }
      // this.twitter();
    },

    TestCode: function() {
      console.log('Test');
    },

    twitter: function () {
      this.firebase = require("firebase");
      var config = {
        apiKey: "AIzaSyARrKc0Y-una2Ui82l8H07ZJBCSNuQGzTQ",
        authDomain: "dino-5e78a.firebaseapp.com",
        databaseURL: "https://dino-5e78a.firebaseio.com",
        projectId: "dino-5e78a",
        storageBucket: "",
        messagingSenderId: "1072649185974"
      };
      this.firebase.initializeApp(config);

      this.firebase.auth().useDeviceLanguage();

    },

    facebook: function() {
      var self = this;
      window.fbAsyncInit = function() {
      FB.init({
        appId      : '662647887110255',
        // appId      : '2313250858704953',
        xfbml      : true,
        version    : 'v2.8'
      });
      // FB.AppEvents.logPageView();
      self.fbInit = FB;
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v3.1&appId=662647887110255&autoLogAppEvents=1';
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
   },

   loginFacebook: function() {
     var self = this;
     this.fbInit.login(function(response) {

       if (response.authResponse) {
         self.fbInit.api('/me',{fields: 'id,name,email,picture.type(large)'}, function(response) {
           var avatarUrl = response.picture.data.url;
           response.url = avatarUrl;
           var xhr = new XMLHttpRequest();
           xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var result = JSON.parse(xhr.responseText);
                cc.textureCache.addImageAsync(result.url, function(data){

                  loggedComp.avatar.spriteFrame.setTexture(data);
                }, this);
                loggedComp.playerName.string = response.name;
                console.log(result.highScore);
                cc.sys.localStorage.setItem('isLogin', true);
                cc.sys.localStorage.setItem('loginMethod', 'facebook');
                cc.sys.localStorage.setItem('name', response.name);
                cc.sys.localStorage.setItem('HighScore', result.highScore);
                cc.sys.localStorage.setItem('avatar', result.url);
            }
          };
          xhr.open("POST", "http://45.33.124.160/Dino/saveUserFb.php");
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr.send(JSON.stringify(response));
           self.logged.active = true;
           self.notLogged.active = false;
           var loggedComp = self.logged.getComponent('Logged');

         });
       } else {
        console.log('User cancelled login or did not fully authorize.');
       }
     });
   },

   loginTwitter: function() {
     var self = this;
     var provider = new this.firebase.auth.TwitterAuthProvider();

     provider.setCustomParameters({
       'lang': 'en'
     });
     this.firebase.auth().signInWithPopup(provider).then(function(result) {
       // var user = result.user;
       // console.log(result.additionalUserInfo.profile.id_str);
       // console.log(result.additionalUserInfo.profile.name);
       // console.log(result.additionalUserInfo.profile.email);
       // console.log(result.additionalUserInfo.profile.profile_image_url);
       var user = new Object();
       user.email = result.additionalUserInfo.profile.email;
       user.id = result.additionalUserInfo.profile.id_str;
       user.name = result.additionalUserInfo.profile.name;
       user.url = result.additionalUserInfo.profile.profile_image_url;
       var xhr = new XMLHttpRequest();
       xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var result1 = JSON.parse(xhr.responseText);
            console.log(result1);
            cc.textureCache.addImageAsync(result1.url, function(data){

              loggedComp.avatar.spriteFrame.setTexture(data);
            }, this);
            loggedComp.playerName.string = result.additionalUserInfo.profile.name;
            cc.sys.localStorage.setItem('isLogin', true);
            cc.sys.localStorage.setItem('loginMethod', 'twitter');
            cc.sys.localStorage.setItem('name', result.additionalUserInfo.profile.name);
            cc.sys.localStorage.setItem('HighScore', result1.highScore);
            cc.sys.localStorage.setItem('avatar', result1.url);
        }
      };
      xhr.open("POST", "http://45.33.124.160/Dino/saveUserTw.php");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var loggedComp = self.logged.getComponent('Logged');
      xhr.send(JSON.stringify(user));
      self.logged.active = true;
      self.notLogged.active = false;

     }).catch(function(error) {
       console.log(error);
     });
   },

   loginGoogle: function () {
     var self = this;
     var provider = new this.firebase.auth.GoogleAuthProvider();
     provider.addScope('https://www.googleapis.com/auth/userinfo.email');
     provider.setCustomParameters({
       'lang': 'en'
     });
     this.firebase.auth().signInWithPopup(provider).then(function(result) {
       var user = new Object();
       user.email = result.additionalUserInfo.profile.email;
       user.id = result.additionalUserInfo.profile.id;
       user.name = result.additionalUserInfo.profile.name;
       user.url = result.additionalUserInfo.profile.picture;
       var xhr = new XMLHttpRequest();
       xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var result1 = JSON.parse(xhr.responseText);
            console.log(result1);
            cc.textureCache.addImageAsync(result1.url, function(data){

              loggedComp.avatar.spriteFrame.setTexture(data);
            }, this);
            loggedComp.playerName.string = result.additionalUserInfo.profile.name;
            cc.sys.localStorage.setItem('isLogin', true);
            cc.sys.localStorage.setItem('loginMethod', 'google');
            cc.sys.localStorage.setItem('name', result.additionalUserInfo.profile.name);
            cc.sys.localStorage.setItem('HighScore', result1.highScore);
            cc.sys.localStorage.setItem('avatar', result1.url);
        }
      };
      xhr.open("POST", "http://45.33.124.160/Dino/saveUserGg.php");

      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      var loggedComp = self.logged.getComponent('Logged');
      xhr.send(JSON.stringify(user));
      self.logged.active = true;
      self.notLogged.active = false;

     }).catch(function(error) {
       console.log(error);
     });
   },

   loginEmail: function() {
     console.log('Email: ' + this.email.string);
     console.log('Password: ' + this.password.string);
   },

   logout: function() {
    var self = this;
    cc.sys.localStorage.setItem('isLogin', false);
    self.logged.active = false;
    self.notLogged.active = true;

  },

  login: function() {
    if (this.email.string == '') {
      this.error.node.active = true;
      this.error.string = 'Please enter user name!';
    } else if (this.password.string == '') {
      this.error.node.active = true;
      this.error.string = 'Please enter password!';
    } else {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
       if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
           var result1 = JSON.parse(xhr.responseText);
           console.log(result1);
           if (result1.success) {
             cc.sys.localStorage.setItem('isLogin', true);
             cc.sys.localStorage.setItem('loginMethod', 'name');
             cc.sys.localStorage.setItem('name', result1.name);
             // cc.sys.localStorage.setItem('HighScore', result1.highScore);
             cc.sys.localStorage.setItem('avatar', result1.url);
           } else {
             console.log('Fail: ' + result1.msg);
           }
       }
     };
     xhr.open("POST", "http://45.33.124.160/Dino/login.php");
     var user = new Object();
     user.user_name = this.email.string;
     user.pw = this.password.string;
     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
     xhr.send(JSON.stringify(user));
   }
  },

  register: function() {
    if (this.email.string == '') {
      this.error.node.active = true;
      this.error.string = 'Please enter user name!';
    } else if (this.password.string == '') {
      this.error.node.active = true;
      this.error.string = 'Please enter password!';
    } else {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
       if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
           var result1 = JSON.parse(xhr.responseText);
           console.log(result1);
           if (result1.success) {
             cc.sys.localStorage.setItem('isLogin', true);
             cc.sys.localStorage.setItem('loginMethod', 'name');
             cc.sys.localStorage.setItem('name', result1.name);
             cc.sys.localStorage.setItem('HighScore', result1.highScore);
             cc.sys.localStorage.setItem('avatar', result1.url);
           } else {
             console.log('Fail: ' + result1.msg);
           }
       }
     };
     xhr.open("POST", "http://45.33.124.160/Dino/saveUserName.php");
     var user = new Object();
     user.user_name = this.email.string;
     user.pw = this.password.string;
     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
     xhr.send(JSON.stringify(user));
    }
  },
  showRegForm: function() {
    this.registerForm.active = true;
    this.loginForm.active = false;
  },
  showLoginForm: function() {
    this.registerForm.active = false;
    this.loginForm.active = true;
  },
  showLoginPage: function() {
    this.loginPage.active = true;
    this.gameMenu.active = false;
  },
  showGameMenu: function() {
    this.loginPage.active = false;
    this.gameMenu.active = true;
  }

    // start () {
    //
    // },

    // update (dt) {},
});
