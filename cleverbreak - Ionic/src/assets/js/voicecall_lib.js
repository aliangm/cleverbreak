/*!
 * EventEmitter v5.2.4 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */
!function(e){"use strict";function t(){}function n(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function r(e){return function(){return this[e].apply(this,arguments)}}function i(e){return"function"==typeof e||e instanceof RegExp||!(!e||"object"!=typeof e)&&i(e.listener)}var s=t.prototype,o=e.EventEmitter;s.getListeners=function(e){var t,n,r=this._getEvents();if(e instanceof RegExp){t={};for(n in r)r.hasOwnProperty(n)&&e.test(n)&&(t[n]=r[n])}else t=r[e]||(r[e]=[]);return t},s.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},s.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},s.addListener=function(e,t){if(!i(t))throw new TypeError("listener must be a function");var r,s=this.getListenersAsObject(e),o="object"==typeof t;for(r in s)s.hasOwnProperty(r)&&n(s[r],t)===-1&&s[r].push(o?t:{listener:t,once:!1});return this},s.on=r("addListener"),s.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},s.once=r("addOnceListener"),s.defineEvent=function(e){return this.getListeners(e),this},s.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},s.removeListener=function(e,t){var r,i,s=this.getListenersAsObject(e);for(i in s)s.hasOwnProperty(i)&&(r=n(s[i],t),r!==-1&&s[i].splice(r,1));return this},s.off=r("removeListener"),s.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},s.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},s.manipulateListeners=function(e,t,n){var r,i,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(r=n.length;r--;)s.call(this,t,n[r]);else for(r in t)t.hasOwnProperty(r)&&(i=t[r])&&("function"==typeof i?s.call(this,r,i):o.call(this,r,i));return this},s.removeEvent=function(e){var t,n=typeof e,r=this._getEvents();if("string"===n)delete r[e];else if(e instanceof RegExp)for(t in r)r.hasOwnProperty(t)&&e.test(t)&&delete r[t];else delete this._events;return this},s.removeAllListeners=r("removeEvent"),s.emitEvent=function(e,t){var n,r,i,s,o,u=this.getListenersAsObject(e);for(s in u)if(u.hasOwnProperty(s))for(n=u[s].slice(0),i=0;i<n.length;i++)r=n[i],r.once===!0&&this.removeListener(e,r.listener),o=r.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,r.listener);return this},s.trigger=r("emitEvent"),s.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},s.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},s._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},s._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return e.EventEmitter=o,t},"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:e.EventEmitter=t}(this||{});

class SignalingClient {
    constructor(appId, appcertificate) {
        this._appId = appId
        this._appcert = appcertificate
        // init signal using signal sdk
        this.signal = Signal(appId) // eslint-disable-line 
        // init event emitter for channel/session/call
        this.channelEmitter = new EventEmitter()
        this.sessionEmitter = new EventEmitter()
        this.callEmitter = new EventEmitter()
    }

    /**
     * @description login agora signaling server and init 'session'
     * @description use sessionEmitter to resolve session's callback
     * @param {String} account   
     * @param {*} token default to be omitted
     * @returns {Promise}
     */
    login(account, token = '_no_need_token') {
        this._account = account
        return new Promise((resolve, reject) => {
            this.session = this.signal.login(account, token);
            // proxy callback on session to sessionEmitter
            [
                'onLoginSuccess', 'onError', 'onLoginFailed', 'onLogout',
                'onMessageInstantReceive', 'onInviteReceived'
            ].map(event => {
                return this.session[event] = (...args) => {
                    this.sessionEmitter.emit(event, ...args)
                }
            });
            // Promise.then
            this.sessionEmitter.on('onLoginSuccess', (uid) => {
                this._uid = uid
                resolve(uid)
            })
            // Promise.catch
            this.sessionEmitter.on('onLoginFailed', (...args) => {
                reject(...args)
            })
        })
    }

    /**
     * @description logout agora signaling server
     * @returns {Promise}
     */
    logout() {
        return new Promise((resolve, reject) => {
            this.session.logout()
            this.sessionEmitter.on('onLogout', (...args) => {
                resolve(...args)
            })
        })
    }

    /**
     * @description join channel
     * @description use channelEmitter to resolve channel's callback
     * @param {String} channel   
     * @returns {Promise}
     */
    join(channel) {
        this._channel = channel
        return new Promise((resolve, reject) => {
            if (!this.session) {
                throw {
                    Message: '"session" must be initialized before joining channel'
                }
            }
            this.channel = this.session.channelJoin(channel);
            // proxy callback on channel to channelEmitter
            [
                'onChannelJoined',
                'onChannelJoinFailed',
                'onChannelLeaved',
                'onChannelUserJoined',
                'onChannelUserLeaved',
                'onChannelUserList',
                'onChannelAttrUpdated',
                'onMessageChannelReceive'
            ].map(event => {
                return this.channel[event] = (...args) => {
                    this.channelEmitter.emit(event, ...args)
                }
            });
            // Promise.then
            this.channelEmitter.on('onChannelJoined', (...args) => {
                resolve(...args)
            })
            // Promise.catch
            this.channelEmitter.on('onChannelJoinFailed', (...args) => {
                reject(...args)
            })
        })
    }

    /**
     * @description leave channel
     * @returns {Promise}
     */
    leave() {
        return new Promise((resolve, reject) => {
            if (this.channel) {
                this.channel.channelLeave()
                this.channelEmitter.on('onChannelLeaved', (...args) => {
                    resolve(...args)
                })
            } else {
                resolve()
            }
        })
    }

    /**
     * @description send p2p message
     * @description if you want to send an object, use JSON.stringify
     * @param {String} peerAccount 
     * @param {String} text 
     */
    sendMessage(peerAccount, text) {
        this.session && this.session.messageInstantSend(peerAccount, text);
    }
    
    invoke(func, args, cb) {
        this.session && this.session.invoke(func, args, cb);
    }

    /**
     * @description broadcast message in the channel
     * @description if you want to send an object, use JSON.stringify
     * @param {String} text 
     */
    broadcastMessage(text) {
        this.channel && this.channel.messageChannelSend(text);
    }
}

class VoiceCallController {

    constructor() {
        console.log("voice call lib construct");
        this.audioCallConnected = false;
        this.audioCallIsConnecting = false;
        this.audioCallStatus = '';
        this.receiverIsOnline = false;
    }

    setAgoraAppInfo(appInfo, userInfo){
        this._appId = appInfo.appId;
        this._appCert = appInfo.appCert;
        this._userInfo = appInfo.userInfo;

        this.signal = new SignalingClient(this._appId, this._appCert);
        this.signal.login(userInfo.id + "").then(() => {
            //once logged in, enable the call btn
            this.signal.join("voicecall_signal").then(() => {
                this.signal.channel.onChannelUserList = function(users){
                    console.log('channel.onChannelUserList ' + users);
                };
                this.signal.channel.onChannelUserJoined = function(account, uid){
                    console.log('channel.onChannelUserJoined ' +  account + ' ' + uid);
                };
                this.signal.channel.onChannelUserLeaved = function(account, uid){
                    if(this.audioCallStatus == "awaiting" && this.msgToUserId == account){
                        //syncReceiverLeave(msgToUserId);
                    }
                };
            });
        });

        console.log("Agora set ID adn Cert");
    }


    callVoiceToUser(msgToUserId){

        this.msgToUserId = msgToUserId;
        this.isCaller = true;
        this.audioCallStatus = 'awaiting';
        
        // Check if user is online
        this.receiverIsOnline = false;
        console.log(this._userInfo);
        var myThumb = "/images/users/thumbnail/";// + this._userInfo.picture;
        console.log("myThumb", myThumb);
        this.signal.sendMessage(msgToUserId, "thumb_" + myThumb);
        this.signal.sendMessage(msgToUserId, "starting_voicecall");
        
        setTimeout(function(){
            if(!this.receiverIsOnline){
                console.log("Receiver is not Online");
            }
        }, 5000);
    }

    test(){
        return 'asdfasdqwerqwerqwer';
    }
};

var voiceCall = new VoiceCallController();
    