
var express = require('express')
var { createToken , decodeToken } = require('../utils/token')
var axios = require('axios')
var multer = require('multer')

//创建express子路由
var router = express.Router()
// 导入表模型结构
var { GoodModel , UserModel, RoleModel } = require('../db/model')

// api测试接口
// /api/goodlist
router.get('/test', (req, res) => {
  //req 请求对象 , GET req.query      POST 90%是 req.body 10%是 req.query
  //res 响应对象 , 通过 res.json 发送数据到客户端(浏览器)
  res.json({
    code: 200,
    msg: '测试API接口用的',
    result: null
  })
})

// /api/goodlist
router.get('/goodlist', (req, res) => {
  GoodModel.find({}, {
    id: 0, // 这些为0的字段都不需要，到时候result没有这些字段
    '10id': 0,
    'zhu10id': 0
  }).then(result => {
    res.json({
      code: 200,
      msg: '查询商品成功',
      result
    })
  }).catch(err => {
    console.log(err)
    res.json({
      code: 500,
      msg: '服务器异常',
      err
    })
  })
})

// 注册接口
router.post('/register', (req, res) => {
  var body = req.body // POST 获取的参数
  UserModel.findOne({ // find查找不到返回的是[]，对应true【注意[]和{}都是true】, findOne查找不到返回的是null即false
    $or: [
      {
        username: body.username
      },
      {
        phone: body.phone
      }
    ]
  }, {})
  .then(result => {
    if (result) {
      // 已经注册过了
      res.json({
        code: 401,
        msg: '当前账户已经被注册了',
        result
      })
    } else {
      // 未注册，插入数据
      body.time = new Date() // 注册时间
      body.role = 1 // 学院注册
      UserModel.insertMany(body)
      .then(result => {
        res.json({
          code: 200,
          msg: '注册成功',
          result
        })
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.json({
      code: 500,
      err,
      msg: '服务器异常'
    })
  })
})

// 登录接口
// 账号登录，用户输入的有可能是手机号也有可能是账号【用户名】
// 先验证用户名或手机号是否注册过，再验证密码
router.post('/login', (req, res) => {
  var body = req.body
  console.log(body);
  UserModel.findOne({
    $or: [
      {
        username: body.account // 这里不是username
      },
      {
        phone: body.phone
      }
    ]
  },{})
  .then(result => {
    if (result) {
      if (result.password == body.password) {
        // token
        const token = createToken({
          username: result.username,
          password: result.password,
          phone: result.phone
        })
        res.json({
          code: 200,
          msg: '登录成功',
          result,
          token
        })
      } else {
        res.json({
          code: 401,
          msg: '密码输入错误'
        })
      }
    } else {
      res.json({
        code: 401,
        msg: '登录失败，用户名或手机号不存在',
        result
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.json({
      code: 500,
      err,
      msg: '服务器异常'
    })
  })
})

// 发送验证码
router.post('/sendcaptcha', (req, res) => {
  var body = req.body
  UserModel.findOne({
    phone: body.phone
  })
  .then(result => {
    if (result) {
      axios.get("http://121.196.235.163:3000/captcha/sent", {
        params: body
      }).then(rel => {
        console.log(rel)
        res.json({
          code: 200,
          msg: '成功',
          ...rel.data,
          rel: rel.data
        })
      })
    } else {
      res.json({
        code: 401,
        msg: '手机号未注册',
        result
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.json({
      code: 500,
      err,
      msg: '服务器异常'
    })
  })
})

// 验证验证码
router.post('/checkcaptcha', (req, res) => {
  var body = req.body
  UserModel.findOne({
    phone: body.phone
  })
    .then(result => {
      if (result) {
        axios.get("http://121.196.235.163:3000/captcha/verify", {
          params: body
        }).then(rel => {
          console.log(rel)
          if (rel.data.code === 200) {
            const token = createToken({
              username: rel.username,
              password: rel.password,
              phone: rel.phone
            })
            rel.json({
              code: 200,
              msg: '验证成功',
              ...rel.data,
              rel: rel.data,
              token
            })
          } else {
            res.json({
              code: 200,
              msg: '验证失败',
              ...rel.data,
              rel: rel.data
            })
          }
        })
      } else {
        res.json({
          code: 401,
          msg: '手机号未注册',
          result
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.json({
        code: 500,
        err,
        msg: '服务器异常'
      })
    })
})

// 找回密码
router.post('/findpwd', (req, res) => {
  var body = req.body
  UserModel.findOne({
    phone: body.phone
  }, {})
  .then(result => {
    if (result) {
      // 发送验证码进行验证
      axios.get("http://121.196.235.163:3000/captcha/verify", {
        params: body
      }).then(rel => {
        console.log(rel)
        if (rel.data.code === 200) {
          const token = createToken({
            username: rel.username,
            password: rel.password,
            phone: rel.phone
          })
          UserModel.updateMany({
            phone: body.phone
          }, {
            $set: {
              password: body.password
            }
          })
          .then(rel => {
            console.log(rel)
              res.json({
                code: 200,
                msg: '密码更改成功'
              })
          })
        } else {
          res.json({
            code: 200,
            msg: '验证失败',
            ...rel.data,
            rel: rel.data
          })
        }
      })
    } else {
      res.json({
        code: 401,
        msg: '手机号未注册',
        result
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.json({
      code: 500,
      err,
      msg: '服务器异常'
    })
  })
})

// 首页获取用户信息【首页发get请求，token解密】
// router.get('/getUserInfo', (req, res) => {
//   // 根据token获取，username phone password
//   decodeToken(req, res, ({username}) => {
//     UserModel.findOne({
//       username
//     })
//     .then(result => {
//       res.json({
//         code: 200,
//         msg: '查询成功'
//       })
//     })
//     .catch(err => {
//       console.log(err)
//       res.json({
//         code: 500,
//         err,
//         msg: '服务器异常'
//       })
//     })
//   })
// })

// 获取用户信息
// router.get('/getuserinfo',(req,res)=>{
//     // 根据 token username phone 
//     decodeToken(req,res, ({ username })=>{
//         UserModel.findOne({
//             username
//         })
//         .then(result=>{
//             res.json({
//                 code:200,
//                 msg:'查询成功',
//                 result 
//             })
//         })  
//         .catch(err=>{
//             console.log(err)
//             res.json({
//                 code:500,
//                 err,
//                 msg:'服务器异常'
//             })
//         })
//     })
// })

router.get('/getuserinfo', (req, res) => {
  // 根据 token username phone
  decodeToken(req, res, async ({ username }) => {
    let userInfo = await UserModel.findOne({
      username
    }, { _id: 0 })

    let role = await RoleModel.findOne({
      value: userInfo.role
    }, { _id: 0 })

    res.json({
      code: 200,
      msg: '查询成功',
      result: {
        userInfo,
        role
      }
    })
  })
})

// 上传文件
const storage = multer.diskStorage({
  //保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
    //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
  },
  //保存在 destination 中的文件名
  filename: function (req, file, cb) {
    cb(null, "cake" + '-' + Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage }).any()   // 任何文件格式

router.post('/uploadfile', upload, (req, res) => {
  var path = req.files[0].path
  res.json({
    code: 200,
    msg: '上传成功',
    path,
    result: path,
  })
})


// 修改用户信息
router.post("/changeuserinfo", (req, res) => {
  var body = req.body
  decodeToken(req, res, ({ username }) => {
    UserModel.updateMany({
      username
    }, {
      $set: body
    })
      .then(result => {
        res.json({
          code: 200,
          msg: '修改成功',
          result
        })
      })
      .catch(err => {

        res.json({
          code: 500,
          err,
          msg: '服务器异常'
        })
      })
  })
})

module.exports = router
