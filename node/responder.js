'use strict'

const response = require('./response')

class Responder {
  constructor(test, callback, opts){
    this.test = test
    this.callback = callback
    this.opts = opts
  }

  match(event, message){
    return this.test(event, message)
  }

  answer(event, message, senderID){
    return this.callback(event, message, senderID)
  }
}

Responder.candidates = {}

Responder.register = (test, callback, opts=null) => {
  if(opts === null){
    opts = {}
  }
  console.log(`registering ${test}`)
  weight = opts.weight || 0
  candidate = new Responder(test, callback, opts)
  if(Responder.candidates[weight] === undefined){
    Responder.candidates[weight] = []
  }
  Responder.candidates[weight].push(candidate)
}

Responder.respond = (event) => {
  const senderID = event.sender.id
  const message = event.message
  for(index in Responder.candidates){
    let candidatesList = Responder.candidates[index]
    for(candidate of candidatesList){
      if(candidate.match(event, message)){
        const _response = new response.Response(senderID)
        return candidate.answer(event, message, _response)
      }
    }
  }
}

exports.Responder = Responder
