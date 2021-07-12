const socket = io('/'); //imported socket.io
//getting element from room.ejs
const videoGrid = document.getElementById('video-grid');
const myVideo= document.createElement('video');
myVideo.muted = true;  //to mute the sound of our video

//creating peer
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
})


let myVideoStream //to make the object public
navigator.mediaDevices.getUserMedia({
    video: true, //for streaming video and audio
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', function(call) {
    call.answer(stream); // Answer the call with an A/V stream.
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)// Show stream in some video/canvas element.
    })
})

    socket.on('user-connected',(userId) => {
        connectToNewUser(userId, stream);
    })
    // input value
let text = $("input");
// when press enter send message
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
      console.log(text.val());
    socket.emit('message', text.val());
    text.val('')
  }
});

socket.on('createMessage',message => {
    //console.log('this is coming from server', message);
    $('ul').append(`<li class = "message"><b>User</b><br/>${message}</li>`)
    scrollToBottom()
})
} )

peer.on('open', id => { 
    socket.emit('join-room', Room_Id, id); //emit the room and pass id -> will show other users id
    // console.log(id); //this shows my id
})


const connectToNewUser = (userId, stream) => {
   // console.log("new user");
    console.log(userId);
    const call = peer.call(userId, stream)    //call user
    const video = document.createElement('video') ///new video element
    call.on('stream', userVideoStream => { //recieve stream
        addVideoStream(video, userVideoStream) //add the stream of user
    })
}

//for playing the video when the data is loaded
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

//mute video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  

  //to stop or play camera
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  
  //when we mute the audio
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.team_mute_button').innerHTML = html;
  }
  
  //when we unmute the audio
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.team_mute_button').innerHTML = html;
  }
  
  //when camera is off
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.team_video_button').innerHTML = html;
  }
  
  //when camera is on
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.team_video_button').innerHTML = html;
  }

