const express=require('express');

const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server)
const{v4:uuidv4}=require('uuid');
const{ExpressPeerServer}=require('peer');
const peerserver=ExpressPeerServer(server,{
    debug:true
});
app.use('/peerjs', peerserver);
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>
{
    res.redirect(`/${uuidv4()}`);
})
app.get('/:room',(req,res)=>
{
    res.render('room',{roomId:req.params.room})
})
io.on('connection',socket =>
{
    socket.on('join-room',(roomid,userid)=>
    {
       socket.join(roomid);
       socket.to(roomid).emit('user-connected',userid);
       socket.on('message',message=>
       {
           io.to(roomid).emit('createmessage',message)
       })
    })
})
server.listen(process.env.PORT||3030);