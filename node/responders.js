'use strict'

const responder = require('./responder').Responder
const response = require('./response').Response

/// ------------------
/// REGISTER RESPONDERS
/// ------------------


responder.register(function(event, message){
  let out = false
  const txt = message.text
  out = out || txt.match(/hello/i)
  out = out || txt.match(/salut/i)
  out = out || txt.match(/bonjour/i)
  out = out || txt.match(/hi/i)
  return out
}, function(event, message, response){
  response.getUserInfo().then(()=>{ response.sendTextMessage(`Bonjour ${response.user.first_name}`) })
})

responder.register(function(event, message){
  let out = false
  const txt = message.text
  out = out || txt.match(/tronche/i)
  out = out || txt.match(/gueule/i)
  out = out || txt.match(/ma photo/i)
  return out
}, function(event, message, response){
  response.getUserInfo().then(()=>{ response.sendImageMessage(response.user.profile_pic) })
})

responder.register(function(event, message){
  let out = false
  const txt = message.text
  out = out || txt.match(/(c|ç)a va.*pas/i)
  out = out || txt.match(/je vais vas.*pas/i)
  return out
}, function(event, message, response){
  response.getUserInfo().then(()=>{ response.sendTextMessage(`Tu m'en vois désolé`) })
})

responder.register(function(event, message){
  let out = false
  const txt = message.text
  out = out || txt.match(/(c|ç)a va/i)
  out = out || txt.match(/je vais vas.*?/i)
  return out
}, function(event, message, response){
  response.getUserInfo().then(()=>{ response.sendTextMessage(`Tu m'en vois ravi`) })
})

responder.register(function(event, message){
  let out = false
  const txt = message.text
  out = out || txt.match(/(c|ç)a va.*?/i)
  out = out || txt.match(/tu vas.*?/i)
  return out
}, function(event, message, response){
  response.getUserInfo().then(()=>{ response.sendTextMessage(`Moi ca va bien, merci. Et toi ?`) })
})


responder.register(function(event, message){
  return true
}, function(event, message, response){
  response.sendTextMessage(message.text)
}, {weight: 10000})

