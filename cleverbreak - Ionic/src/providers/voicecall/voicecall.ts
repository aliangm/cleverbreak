import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { timeStringPipe } from '../../pipes/stringcut/stringcut';

import { AppinfoProvider } from '../../providers/appinfo/appinfo';

/*
  Generated class for the VoicecallProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var $;
declare var AgoraRTC;

// Voice call library
import * as jquery from '../../assets/js/jquery';
import * as AgoraRTCSDK from '../../assets/js/AgoraRTCSDK-2.4.1';
import * as AgoraSig from '../../assets/js/AgoraSig-1.3.0';
declare var SignalingClient;

@Injectable()
export class VoicecallProvider {

  _appId:string;
  _appCert:string;
  _userInfo:any;
  signal:any;
  msgToUserId:any;
  isCaller:boolean = false;
  receiverIsOnline:boolean = false;
  audioCallStatus:string = "";
  dbLogStatus:string;
  myUserId:any;
  client:any;
  localStream:any;
  channelKey:string;
  audioDevices:any = [];
  audio_call_period:number = 0;
  isCallConneted:boolean = false;
  dbLogId:any = '';
  timerInterval:number;

  constructor(public http: HttpClient, public appInfo: AppinfoProvider, public evt: Events) {
    this.getDevices();
  }

  getDevices() {
    AgoraRTC.getDevices((devices) => {
      for (var i = 0; i !== devices.length; ++i) {
        var device = devices[i];
        if (device.kind === 'audioinput') {
          var option = {
            value: device.deviceId,
            text: device.label || 'microphone ' + (i + 1)
          }
          this.audioDevices.push(option);
        } else if (device.kind === 'videoinput') {
          //option.text = device.label || 'camera ' + (videoSelect.length + 1);
          //videoSelect.appendChild(option);
        }
      }
      console.log("++  Audio Devices  ++", this.audioDevices);
    });
  };

  // Agora configurationi
  setAgoraAppInfo(appInfo, userInfo){
    this._appId = appInfo.appId;
    this._appCert = appInfo.appCert;
    this._userInfo = appInfo.userInfo;
    this.myUserId = this.appInfo.common.userProfile.id;

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
                this.syncReceiverLeave(this.msgToUserId);
              }
            };
        });
    });


    this.signal.sessionEmitter.on('onMessageInstantReceive', (userid, uid, msg) => {

      // Caller`s Message
      if(msg == "starting_voicecall"){
        if(!this.appInfo.isVoiceModalOpened){
          this.incomingVoiceCall(userid);
        }else{
          this.receiverBusyVoiceCall(userid);
        }
      }else if(msg == "canceled_bycaller_voicecall"){
        this.syncCallerCanceledVoiceCall(userid);
      }else if(msg == "received_audio_call_request"){
        this.receiverIsOnline = true;
      }
      
      // Receiver`s Message
      else if(msg == "accept_voicecall"){
        this.syncReceiverAcceptVoiceCall(userid);
      }else if(msg == "canceled_byreceiver_voicecall"){
        this.syncReceiverCanceledVoiceCall(userid);
      }else if(msg.indexOf("thumb_") == 0){
        //var msgInfo = msg.split("_", 2);
        //$("#user-thumb-tocall").attr('src', msgInfo[1]);
      }
    });

    this.voiceCallEventProcessor();
  }

  voiceCallEventProcessor(){
    this.evt.subscribe('message:caller-status', (data) =>{
      if(data['status'] == 'cancelled_by_caller'){
        this.callerCanceledVoiceCall();
      }else if(data['status'] == 'cancelled_by_receiver'){
        this.receiverCanceledVoiceCall();
      }else if(data['status'] == 'close-window'){
        if(this.isCaller){
          this.callerCanceledVoiceCall();
        }else{
          //this.receiverCanceledVoiceCall();
        }
        this.leaveChannel();
      }
    });
    this.evt.subscribe('message:receiver-status', (data) =>{
      if(data['status'] == 'accept-call'){
        this.receiverAcceptVoiceCall();
      }
    });
  }

  /*************************************** 
   * 
   * Caller Side functions
   * 
  ***************************************/
  
  callVoiceToUser(msgToUserId){
    this.msgToUserId = msgToUserId;
    this.isCaller = true;
    this.audioCallStatus = 'awaiting';
    
    // Check if user is online
    this.receiverIsOnline = false;
    var myThumb = "/images/users/thumbnail/" + this.appInfo.common.userProfile.picture;
    this.signal.sendMessage(msgToUserId, "thumb_" + myThumb);
    this.signal.sendMessage(msgToUserId, "starting_voicecall");


    // leave db log
    this.dbLogId = '';
    const req = this.http.post(this.appInfo.common.urlproxy + 'messages/voice-call-log', this.appInfo.addCsrfToken({
      type: 'new',
      //conID: $("#audio-call-conID").val(),
      receiver: msgToUserId
    }) )
      .subscribe(
        res => {
          if(res['status']) this.dbLogId = res['logid'];
        },
        err => {
        }
      );
    
    setTimeout(() => {
      if(!this.receiverIsOnline){
        console.log("Receiver is not Online");
        this.evt.publish('message:receiver-status', {status: 'is-not-online'});
      }
    }, 5000);
  }

  callerCanceledVoiceCall(){
    this.signal.sendMessage(this.msgToUserId, "canceled_bycaller_voicecall");
    // leave db log
    this.dbLogStatus = 'Caller cancelled';
    this.leaveChannel(false);
  }

  syncReceiverCanceledVoiceCall(userid){
    this.evt.publish('message:receiver-status', {status: 'cancelled_by_receiver', userId: userid});
    this.dbLogStatus = 'Receiver cancelled';
    this.leaveChannel(false);
  }

  syncReceiverAcceptVoiceCall(userid){
    //this.myUserId = this.appInfo.common.userProfile.id;
    this.evt.publish('message:receiver-status', {status: 'accepted_by_receiver', userId: userid});
    this.joinChannel(this.myUserId + '' + userid);
  }

  syncReceiverLeave(userid){
    this.audioCallStatus = '';
    //this.leaveChannel();
  }

  /*************************************** 
   * 
   * Receiver Side functions
   * 
  ***************************************/
  syncCallerCanceledVoiceCall(userid){
    //$(".voicecall-wrapper").fadeOut(300);
    this.leaveChannel(false);
  }

  incomingVoiceCall =  function(userid){
    
    if(!this.appInfo.isVoiceModalOpened){
      this.evt.publish('message:voicecall-incoming', {targetUserId: userid});
    }

    this.msgToUserId = userid;
    
    this.isCaller = false;
    this.signal.sendMessage(userid, "received_audio_call_request");
    
    this.audioCallStatus = 'awaiting';
    //voiceCallerId = userid;
    this.msgToUserId = userid;
    var audio = new Audio('assets/js/notification_tone.mp3');
    audio.play();

  }
  receiverAcceptVoiceCall(){
    this.signal.sendMessage(this.msgToUserId, "accept_voicecall");
    this.joinChannel(this.msgToUserId + '' + this.myUserId);
  }

  receiverCanceledVoiceCall(){
    this.signal.sendMessage(this.msgToUserId, "canceled_byreceiver_voicecall");
    this.leaveChannel(false);
  }

  receiverBusyVoiceCall(userid){
    this.signal.sendMessage(userid, "canceled_byreceiver_voicecall");
    this.leaveChannel(false);
  }

  // Voice chat related functions
  joinChannel(chanelId){

    if(this.audioCallStatus == 'connecting') return;

    this.audio_call_period = 0;
    this.audioCallStatus = 'connecting';
    //showAudioCallControls();
    
    var myStreamId = this.myUserId;
    
    
    const req = this.http.post(this.appInfo.common.urlproxy + 'messages/agora_key', this.appInfo.addCsrfToken({
      chanelId: chanelId,
      userId: myStreamId
    }) )
      .subscribe(
        res => {
            console.log(res);
        },
        err => {
          if(err.status == 200){

            this.channelKey = err.error.text;
            
            this.client = AgoraRTC.createClient({mode: 'interop'});
            this.client.init(this._appId, () => {
              var countS = 0;
              var countSS = 0;
              
              //chanelId = parseInt(chanelId);
              this.client.join(this.channelKey, chanelId, parseInt(myStreamId), function(uid) {
                console.log("Join channel ", uid);
                joinAgoraChannel(uid);
              }, function(err) {
                console.log("Join channel failed", err);
                console.log("Rd-Join channel ", myStreamId);
                joinAgoraChannel(myStreamId);
              });
              
              
              var joinAgoraChannel = (uid) => {
                if(this.audioDevices.length == 0){
                  this.signal.sendMessage(this.msgToUserId, "canceled_bycaller_voicecall");
                  //this.callerCanceledVoiceCall();
                }

                var microphone = this.audioDevices[0].value;
                this.localStream = AgoraRTC.createStream({streamID: uid, video: false, screen: false, audio: true, microphoneId: microphone});
            
                // The user has granted access to the camera and mic.
                this.localStream.on("accessAllowed", () => {
                    console.log("accessAllowed");
                });
        
                // The user has denied access to the camera and mic.
                this.localStream.on("accessDenied", () => {
                  console.log("accessDenied");
                  if(this.isCaller){
                    this.signal.sendMessage(this.msgToUserId, "canceled_bycaller_voicecall");
                    this.callerCanceledVoiceCall();
                  }
                  else{
                    this.signal.sendMessage(this.msgToUserId, "canceled_byreceiver_voicecall");
                    this.receiverCanceledVoiceCall();
                  }
                });
        
                this.localStream.init( () => {
                  if(this.audioCallStatus == 'connecting'){

                    this.isCallConneted = true;

                    console.log("getUserMedia successfully");
                    this.localStream.play('agora_local');
                    this.client.publish(this.localStream, function (err) {
                      console.log("Publish local stream error: " + err);
                      if(this.isCaller)
                        this.callerCanceledVoiceCall();
                      else
                        this.receiverCanceledVoiceCall();
                    });
          
                    this.client.on('stream-published', function (evt) {
                      console.log("Publish local stream successfully");
                    });
                  }else{
                    //this.client.leave();
                  }
                }, function (err) {
                  console.log("getUserMedia failed", err);
                  //leaveChannel();
                });
              }
              
            	this.channelKey = "";
            	this.client.on('error', (err) => {
            		console.log("Got error msg:", err.reason);
            		if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
                  this.leaveChannel();
            		}
            	});
            
            
            	this.client.on('stream-added', (evt) => {
            	    countS ++;
            		var stream = evt.stream;
            		console.log("Subscribe ", stream);
            		this.client.subscribe(stream, (err) => {
            			console.log("Subscribe stream failed", err);
                  if(this.isCaller)
                  {
                    //this.receiverCanceledVoiceCall();
                  }
                  else{
                    //this.callerCanceledVoiceCall();
                  }
            		});
              });
              
            
            	this.client.on('stream-subscribed', (evt) => {
                countSS ++;
                
                console.log("------------------------------");
                console.log("------------------------------");
                console.log("------------------------------");
                console.log("Stream subscribed");
                console.log(evt);
                console.log("------------------------------");
                
                var stream = evt.stream;
            		console.log("Subscribe remote stream successfully: " + stream.getId());
            		if ($('div#agora_video #agora_remote' + stream.getId()).length === 0) {
            			$('div#agora_video').append('<div id="agora_remote' + stream.getId() + '" style="float:left; width: 1px; height: 1px; overflow: hidden;"></div>');
            		}
            		
            		stream.play('agora_remote' + stream.getId());
                this.audioCallStatus = 'connected';
                
                this.timerInterval = setInterval(() => {
                  this.audio_call_period += 1000;
                }, 1000);

                this.sendUiEvnet({status: 'started', userId: this.msgToUserId});
              });
              
            	this.client.on('stream-removed', (evt) => {
            	  //this.firstCall = false;
            		var stream = evt.stream;
            		stream.stop();
            		$('#agora_remote' + stream.getId()).remove();
            		console.log("Remote stream is removed " + stream.getId());
            	});
            
            	this.client.on('peer-leave', (evt) => {
            		var stream = evt.stream;
            		if (stream) {
            			stream.stop();
            			$('#agora_remote' + stream.getId()).remove();
            			console.log(evt.uid + " leaved from this channel");
            		}
                // leave db log
                if(this.isCaller)
                    this.dbLogStatus = 'Receiver cancelled';
                else 
                    this.dbLogStatus = 'Caller cancelled';
                this.leaveChannel();
              });
            });

          }else{
            console.log("server error", err);
          }
        }
      );
  }

  sendUiEvnet(data){
    this.evt.publish('message:call-connected', data);
  }

  leaveChannel(endWithError:boolean = true){
    
    clearInterval(this.timerInterval);

    var beforeStatus = this.audioCallStatus;
    this.audioCallStatus = 'leaving';
    
    if(this.audioCallStatus == '' || this.audioCallStatus == 'leaving')
        //$("#make-call-touser").fadeIn(200);
        // close event
    
    // leave db log
    console.log(beforeStatus);
    var status = 0;
    var message:string = '';
    if(beforeStatus != "connected"){
        status = 4;
        message = this.dbLogStatus;
    }else if(beforeStatus == "connected"){
        status = 3;
        console.log("546498713123qw1e56rqwerqwerqwe")
        console.log(this.audio_call_period);
        message = new timeStringPipe().transform(this.audio_call_period);;
    }
    if(this.isCaller){
      
      const req = this.http.post(this.appInfo.common.urlproxy + 'messages/voice-call-log', this.appInfo.addCsrfToken({
        type: 'call-status',
        //conID: $("#audio-call-conID").val(),
        receiver: this.msgToUserId,
        msg: message,
        status: status,
        logid: this.dbLogId
      }) )
        .subscribe(
          res => {
            if(res['status']) this.dbLogId = res['logid'];
          },
          err => {
          }
        );
    }
    
    if(typeof this.client != 'undefined' || this.client != null){
        this.client.unpublish(this.localStream, function (err) {
          console.log()
            console.log("Unpublish local stream failed" + err);
        });

        if(typeof (this.localStream) != 'undefined' || this.localStream != null){
          this.localStream.close();
          this.localStream = null;
        } 
        
        this.client.leave( () => {
            this.audioCallStatus = '';
            console.log("Leavel channel successfully");
            if(endWithError){
                //$("#call-status-msg").html("Audio call error");
                //$(".voicecall-wrapper").fadeOut(500);
                this.audioCallStatus = '';
                //showAudioCallControls();
            }
        },  (err) => {
            this.audioCallStatus = 'leaveFailed';
            console.log("Leave channel failed");
        });
    }
  
  }

}
