

const socket= io('/');

let myvideostream
const myvideo=document.createElement('video');
const videogrid=document.getElementById('video-grid')
myvideo.muted=true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
  })
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>
    {
        myvideostream=stream;
        addvideostream(myvideo,stream);
        peer.on('call',call=>
        {
            call.answer(stream)
            const video=document.createElement('video')
            call.on('stream',uservideostream=>
            {
                addvideostream(video,uservideostream)
            })
        })
        socket.on('user-connected',userid=>
{
    connecttonewuser(userid,stream);
})
})
peer.on('open',id=>
{
    socket.emit('join-room',ROOM_ID,id);
})


const connecttonewuser=(userid,stream)=>
{
    const call=peer.call(userid,stream)
    const video=document.createElement('video')
    call.on('stream',uservideostream=>
    {
        addvideostream(video,uservideostream)
    })
}

const addvideostream=(video,stream)=>
{
    video.srcObject=stream;
    video.addEventListener('loadmetadata',()=>
    {
        video.play();
    })
    videogrid.append(video);
}
let text = $("input");

$('html').keydown((e)=>
{
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit('message', text.val());
        text.val('')
      }
})
socket.on('createmessage',message=>
{
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
    
})
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  const muteUnmute = () => {
    const enabled = myvideostream.getAudioTracks()[0].enabled;
    if (enabled) {
      myvideostream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myvideostream.getAudioTracks()[0].enabled = true;
    }
  }
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  const playStop = () => {
    console.log('object')
    let enabled = myvideostream.getVideoTracks()[0].enabled;
    if (enabled) {
      myvideostream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myvideostream.getVideoTracks()[0].enabled = true;
    }
  }
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  