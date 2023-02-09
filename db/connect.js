
// Node 连接Mongodb数据库
// Mongoose

const mongoose = require('mongoose')

// const hostname = "localhost"
// const port = 27017
// const dbname = "scorecms" // 数据库名
// // 没有用户名
// const user = "?"
// // 没有密码
// const pwd = "?"

// 不使用严格查询【修改这个文件，重新运行项目】
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/scorecms', err => {
  if (err) {
    console.log('数据库连接失败')
    console.log(err)
  } else {
    console.log('数据库连接成功')
  }
})

// 然后去app.js文件中require('./db/connect')