var express = require('express')
var router = express.Router()
var { BannerModel, AppUserModel } = require('../db/model')
var { createToken, decodeToken } = require('../utils/token')
var axios = require('axios')
var multer = require('multer')
var routes = require('../utils/routes')
var getRouterListByRole = require('../utils')
var { insertDataFromTable, findAllDataFromTable, findOneDataFromTable, removeDataFromTable, updateDataFromTable } = require('../db/index')

// 测试接口
router.get('/test', (req, res) => {
  res.json({
    code: 200,
    msg: '测试 APP项目的 接口',
    result: null
  })
})

// 广告
router.get('/banners', (req, res) => {
  findAllDataFromTable({
    model: BannerModel,
    query: {},
    res,
  })
})

// 查找用户
router.post("/finduser", (req, res) => {
  var body = req.body
  findOneDataFromTable({
    res,
    model: AppUserModel,
    query: body
  })
})

// 注册接口
router.post("/register", (req, res) => {
  var body = req.body
  console.log(body)
  body.time = new Date
  insertDataFromTable({
    model: AppUserModel,
    res,
    data: body
  })
})

// 登录接口
router.post('/login', async (req, res) => {
  var body = req.body
  let result = await findOneDataFromTable({
    model: AppUserModel,
    res,
    query: body,
    next: 1
  })
  if (result) {
    const token = createToken({
      username: result.username,
      phone: result.phone,
      password: result.password,
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
      msg: "用户名或者密码不匹配",
      result: null
    })
  }
})

// 生成token
router.post("/gettoken", (req, res) => {
  var body = req.body
  const token = createToken(body)
  res.json({
    code: 200,
    msg: '成功',
    token
  })
})

// 发送验证码
router.post('/sendcaptcha', (req, res) => {
  var body = req.body
  AppUserModel.findOne({
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

// 验证验证码[合并到找回密码中了]
router.post('/checkcaptcha', (req, res) => {
  var body = req.body
  AppUserModel.findOne({
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

// 找回密码【包含了验证验证码】
router.post('/findpwd', (req, res) => {
  var body = req.body
  AppUserModel.findOne({
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
            AppUserModel.updateMany({
              phone: body.phone
            }, {
              $set: {
                password: body.password,
                dbpass: body.dbpass
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

// 获取用户信息
router.get('/getuserinfo', (req, res) => {
  // 根据 token username phone
  decodeToken(req, res, async ({ phone }) => {
    findOneDataFromTable({
      model: AppUserModel,
      query: { phone },
      res,
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
    cb(null, "FX2301" + '-' + Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage }).any()   // 任何文件格式

// 上传文件
router.post('/uplodafile', upload, (req, res) => {
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
  decodeToken(req, res, ({ phone }) => {
    updateDataFromTable({
      model: AppUserModel,
      res,
      query: { phone },
      data: body
    })
  })
})

module.exports = router