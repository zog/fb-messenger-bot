const
  request = require('request'),
  config = require('config')

const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');


class User{

}

User.cache = {}

User.get = (id) => {
  return new Promise((resolve, reject)=>{
    const cached = User.cache[id]
    if(cached !== undefined){
      resolve(cached)
      return
    }
    request({
      uri: `https://graph.facebook.com/v2.6/${id}`,
      qs: { access_token: PAGE_ACCESS_TOKEN, fields: 'first_name,last_name,profile_pic,locale,timezone,gender' },
      method: 'GET'

    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        User.cache[id] = body
        resolve(body)
      } else {
        reject("Failed calling Profile API", response.statusCode, response.statusMessage, body.error);
      }
    })
  })
}

class Response{
  constructor(recipientId){
    this.recipientId = recipientId
  }

  getUserInfo(){
    return User.get(this.recipientId).then((data)=>{
      let user = JSON.parse(data)
      this.user = user
    })
  }

  /*
   * Send a text message using the Send API.
   *
   */

  sendTextMessage(messageText) {
    var messageData = {
      recipient: {
        id: this.recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };

    this.callSendAPI(messageData);
  }

  /*
 * Send an image using the Send API.
 *
 */
  sendImageMessage(url) {
    var messageData = {
      recipient: {
        id: this.recipientId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: url
          }
        }
      }
    };

    this.callSendAPI(messageData);
  }

  /*
   * Call the Send API. The message data goes in the body. If successful, we'll
   * get the message id in a response
   *
   */
  callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s",
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });
  }

}

exports.Response = Response
