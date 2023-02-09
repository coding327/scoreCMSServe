
var express = require('express')
var { createToken} = require('../utils/token')

//创建express子路由
var router = express.Router()
// 导入表模型结构
var { GoodModel , UserModel } = require('../db/model')

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

// 找回密码
router.post('/findpwd', (req, res) => {
  var body = req.body
  UserModel.findOne({
    phone: body.phone
  }, {})
  .then(result => {
    if (result) {
      UserModel.updateOne({
        phone: body.phone
      }, {
        password: body.password
      })
      .then(rel => {
        console.log(rel)
        if (rel.acknowledged) {
          res.json({
            code: 200,
            msg: '密码更改成功'
          })
        } else {
          res.json({
            code: 500,
            err,
            msg: '密码更改失败'
          })
        }
      })
    } else {
      res.json({
        code: 401,
        msg: '手机号不存在',
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


module.exports = router
