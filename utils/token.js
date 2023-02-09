
// token
// 后端生成
// 后端校验
// 后端判断

// 前端接受存储起来 sessionStorage

//  Token  令牌   (通行证)
//  生成 token  (加密的 字符串  有时效性   登录发送给前端 )

// Token是服务端生成的一串字符串，以作客户端进行请求的一个令牌，
// 当第一次登录后，服务器生成一个Token便将此Token返回给客户端，
// 以后客户端只需带上这个Token前来请求数据即可，无需再次带上用户名和密码

// https://www.cnblogs.com/lufeiludaima/p/pz20190203.html

// 使用Token的目的：Token的目的是为了减轻服务器的压力，减少频繁的查询数据库，使服务器更加健壮
// 提高服务器的安全等级   保护数据安全性

// 使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。流程是这样的：
// 客户端使用用户名跟密码请求登录
// 服务端收到请求，去验证用户名与密码
// 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
// 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
// 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
// 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据
// APP登录的时候发送加密的用户名和密码到服务器，服务器验证用户名和密码，如果成功，以某种方式比如随机生成32位的字符串作为token，
// 存储到服务器中，并返回token到APP，以后APP请求时，
// 凡是需要验证的地方都要带上该token，然后服务器端验证token，成功返回所需要的结果，
// 失败返回错误信息，让他重新登录。其中服务器上token设置一个有效期，每次APP请求的时候都验证token和有效期。

// 加密和解密  jwt

const jwt = require('jsonwebtoken')
const secretKey = "FX2301-daydayup"

// 生成token
exports.createToken = function (data) {  // data 要加密的数据
  return jwt.sign(data, secretKey, { expiresIn: '2h' })
}

// 解密token 解密后三种情况
// 1. token 过期、无效
// 2. token 不存在
// 3. token 校验成功

exports.decodeToken = (req, res, callback) => {
  var token = req.headers.token
  // 判断有无token
  if(token) {
    // 有token就解密
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.json({
          code: 3001,
          msg: 'token无效，请登录',
          result: null
        })
      } else {
        callback(data) // data是解密后的token , 可以解构出之前加密时你放的数据，username password phone
      }
    })
  } else {
    res.json({
      code: 3001,
      msg: 'token不存在请登录',
      result: null
    })
  }
}

