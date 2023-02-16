
var express = require('express')
var { createToken, decodeToken } = require('../utils/token')
var axios = require('axios')
var multer = require('multer')

//创建express子路由
var router = express.Router()
// 导入表模型结构
var { GoodModel, UserModel, RoleModel, SubjectModel, ClassModel, AnnoModel, AdviseModel, GradeModel } = require('../db/model')
// 插入数据
var { insertDataFromTable, findAllDataFromTable, findOneDataFromTable, removeDataFromTable, updateDataFromTable } = require('../db/index')

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
  console.log(body)
  UserModel.findOne({
    $or: [
      {
        username: body.account // 这里不是username
      },
      {
        phone: body.phone
      }
    ]
  }, {})
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

// 学科添加
router.post('/subjectadd', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    let result = await findOneDataFromTable({
      model: SubjectModel,
      res,
      query: {
        $or: [
          {
            label: body.label,
          },
          {
            subjectCode: body.subjectCode
          }
        ]
      },
      next: 1
    })
    if (!result) {
      insertDataFromTable({
        model: SubjectModel,
        res,
        data: body
      })
    } else {
      res.json({
        code: 401,
        msg: '学科已经存在,请重新修改再操作',
      })
    }
  })
})

// 查询所有学科
router.post('/getallsubject', (req, res) => {
  var body = req.body
  var query = {}
  var keyword = body.keyword
  if (keyword) {
    query = {
      $or: [
        { label: new RegExp(keyword) },
        { subjectCode: new RegExp(keyword) },
      ]
    }
  }
  decodeToken(req, res, ({ username }) => {
    findAllDataFromTable({
      model: SubjectModel,
      res,
      query
    })
  })
})

// 删除学科
router.post('/delsubject', (req, res) => {
  var body = req.body
  decodeToken(req, res, ({ username }) => {
    removeDataFromTable({
      model: SubjectModel,
      res,
      query: body
    })
  })
})

// 修改学科
router.post('/changesubject', (req, res) => {
  var body = req.body
  decodeToken(req, res, ({ username }) => {
    updateDataFromTable({
      model: SubjectModel,
      res,
      query: {
        _id: body._id,
      },
      data: body
    })
  })
})

// 添加班级
router.post('/addclass', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    let result = await findOneDataFromTable({
      res,
      model: ClassModel,
      query: body,
      next: 1
    })
    if (result) {
      res.json({
        code: 401,
        msg: '班级已经存在,请重新再试',
        result
      })
    } else {
      let xueke = await findOneDataFromTable({
        res,
        model: SubjectModel,
        query: {
          label: body.subject
        },
        next: 1,
      })

      // 插入班级
      body.label = xueke.label + '_' + body.year + '_' + body.index
      body.value = body.label.toLowerCase()

      insertDataFromTable({
        res,
        model: ClassModel,
        data: body,
        msg: '添加班级成功'
      })
    }
  })

})

// 获取班级
router.post('/getclasses', (req, res) => {
  var body = req.body
  var query = {}
  var keyword = body.keyword
  if (keyword) {
    query = {
      $or: [
        { value: new RegExp(keyword) },
        { label: new RegExp(keyword) },
      ]
    }
  }
  decodeToken(req, res, ({ username }) => {
    findAllDataFromTable({
      model: ClassModel,
      res,
      query,
    })
  })
})


// 删除班级
router.post('/delclasses', (req, res) => {
  var body = req.body
  decodeToken(req, res, ({ username }) => {
    removeDataFromTable({
      model: ClassModel,
      res,
      query: body
    })
  })
})


// 修改班级
router.post('/updateclass', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    let result = await findOneDataFromTable({
      res,
      model: ClassModel,
      query: {
        subject: body.subject,
        year: body.year,
        index: body.index,
      },
      next: 1
    })
    if (result) {
      res.json({
        code: 401,
        msg: '班级已经存在,请重新再试',
        result
      })
    } else {
      let xueke = await findOneDataFromTable({
        res,
        model: SubjectModel,
        query: {
          label: body.subject
        },
        next: 1,
      })

      // 插入班级
      body.label = xueke.label + '_' + body.year + '_' + body.index
      body.value = body.label.toLowerCase()

      updateDataFromTable({
        res,
        model: ClassModel,
        query: {
          _id: body._id
        },
        data: body,
        msg: '修改班级成功'
      })
    }
  })

})

// 公告新增
router.post('/addtoanno', (req, res) => {
  var body = req.body
  body.time = new Date()
  decodeToken(req, res, async ({ username }) => {
    insertDataFromTable({
      model: AnnoModel,
      res,
      data: body
    })
  })
})

// 获取公告
router.post('/getannos', (req, res) => {
  var body = req.body
  var query = {}
  var keyword = body.keyword
  var type = body.type
  if (keyword) {
    query.title = new RegExp(keyword)
  }
  if (type) {
    query.type = type
  }
  decodeToken(req, res, async ({ username }) => {
    findAllDataFromTable({
      model: AnnoModel,
      res,
      query: query
    })
  })
})

// 删除公告
router.post('/delannoone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    removeDataFromTable({
      model: AnnoModel,
      res,
      query: { _id: body._id }
    })
  })
})

// 获取选中公告
router.post('/getannoone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    findOneDataFromTable({
      model: AnnoModel,
      res,
      query: { _id: body._id }
    })
  })
})

// 修改公告
router.post('/changeannoone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    updateDataFromTable({
      model: AnnoModel,
      res,
      query: { _id: body._id },
      data: body
    })
  })
})

// 角色查询
router.post('/getroles', (req, res) => {
  var body = req.body
  var query = {}
  var keyword = body.keyword
  if (keyword) {
    query.label = new RegExp(keyword)
  }
  decodeToken(req, res, async ({ username }) => {
    findAllDataFromTable({
      model: RoleModel,
      res,
      query: query
    })
  })
})

// 用户添加
router.post('/adduser', (req, res) => {
  var body = req.body  // POST 获取的参数 
  UserModel.findOne({  // find=[]  findOne = {}
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
      console.log(result)
      if (result) {
        // 已经注册过了
        res.json({
          code: 401,
          msg: '当前的账户已经存在了',
          result,
        })
      } else {
        // 直接插入数据
        body.time = new Date()  // 注册时间
        UserModel.insertMany(body)
          .then(data => {
            res.json({
              code: 200,
              msg: '注册成功',
              result: data,
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


router.post('/getusers', (req, res) => {
  var body = req.body
  var query = {}
  var keyword = body.keyword
  var role = body.role
  var date = body.date
  if (keyword) {
    query = {
      $or: [
        {
          username: new RegExp(keyword)
        },
        {
          phone: new RegExp(keyword)
        }
      ]
    }
  }
  if (role) {
    query.role = role
  }
  if (date) {
    query.time = {
      $gte: date[0],
      $lte: date[1]
    }
  }
  decodeToken(req, res, async ({ username }) => {
    findAllDataFromTable({
      model: UserModel,
      res,
      query: query
    })
  })
})


router.post('/deluserone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    removeDataFromTable({
      model: UserModel,
      res,
      query: { _id: body._id }
    })
  })
})

router.post('/setuserone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    updateDataFromTable({
      model: UserModel,
      res,
      query: { _id: body._id },
      data: body
    })
  })
})

// 删除
router.post('/delroleone', (req, res) => {
  var body = req.body
  decodeToken(req, res, ({ username }) => {
    removeDataFromTable({
      model: RoleModel,
      res,
      query: body
    })
  })
})

// 修改 
router.post('/setroleone', (req, res) => {
  var body = req.body
  decodeToken(req, res, ({ username }) => {
    updateDataFromTable({
      model: RoleModel,
      res,
      query: {
        _id: body._id,
      },
      data: body
    })
  })
})

// 新增角色
router.post('/addroleone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    insertDataFromTable({
      model: RoleModel,
      res,
      data: body
    })
  })
})


// 新增意见
router.post('/addadviseone', (req, res) => {
  var body = req.body
  body.time = new Date()
  decodeToken(req, res, async ({ username }) => {
    insertDataFromTable({
      model: AdviseModel,
      res,
      data: body
    })
  })
})

router.post('/getadviselist', (req, res) => {
  var body = req.body
  var query = {}
  var keyword = body.keyword
  var type = body.type
  var date = body.date
  if (keyword) {
    query.title = new RegExp(keyword)
  }
  if (type) {
    query.type = type
  }
  if (date) {
    query.time = {
      $gte: date[0],
      $lte: date[1]
    }
  }
  decodeToken(req, res, async ({ username }) => {
    findAllDataFromTable({
      model: AdviseModel,
      res,
      query: query
    })
  })
})

router.post('/deladviseone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    removeDataFromTable({
      model: AdviseModel,
      res,
      query: { _id: body._id }
    })
  })
})


router.post('/getadviseone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    findOneDataFromTable({
      model: AdviseModel,
      res,
      query: { _id: body._id }
    })
  })
})


router.post('/setadviseone', (req, res) => {
  var body = req.body
  decodeToken(req, res, async ({ username }) => {
    updateDataFromTable({
      model: AdviseModel,
      res,
      query: { _id: body._id },
      data: body
    })
  })
})

// 新增项目成绩
router.post('/addgradeone', (req, res) => {
  var body = req.body
  body.time = new Date()
  decodeToken(req, res, async ({ username }) => {
    let result = await findOneDataFromTable({
      query: { username },
      res,
      model: UserModel,
      next: 1,
    })
    body.subject = result.subject
    body.class = result.class
    body.author = result

    insertDataFromTable({
      model: GradeModel,
      res,
      data: body
    })
  })
})


router.post('/getmygrades', (req, res) => {
  decodeToken(req, res, async ({ username }) => {
    findAllDataFromTable({
      model: GradeModel,
      res,
      query: {
        'author.username': username
      }
    })
  })
})

router.post('/getallgrades', (req, res) => {
  decodeToken(req, res, async ({ username }) => {
    findAllDataFromTable({
      model: GradeModel,
      res,
      query: {

      }
    })
  })
})

module.exports = router
