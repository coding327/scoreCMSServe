
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// model 表模型对象  操作数据库 操作文档
// 参数1: 表名【写复数】
// 参数2: Schema名称
// 一定要写复数
// goods = goods
// good = goodes
// good1 = good1
// city = cities

// Schema 定义表结构
const Good_Schema = new Schema({
  "name": String,
  "price": Number,
  "discount": Number,
  "img": String,
  "type": Object
})

const User_Schema = new Schema({
  username: String,
  phone: String,
  password: String,
  dbpass: String,
  email: String,
  avatar: String,
  role: Number, // 角色权限 1 学院 2 讲师 3 管理员
  time: Date // 记录注册插入数据的时间
})

const Role_Schema = new Schema({
  id: Number,
  label: String,
  value: Number,
  menus: Array,
  color: String
})

const Subject_Schema = new Schema({
  label: String,
  subjectCode: String
})


exports.GoodModel = mongoose.model('goods', Good_Schema)
exports.UserModel = mongoose.model('users', User_Schema)
exports.RoleModel = mongoose.model('roles', Role_Schema)
exports.SubjectModel = mongoose.model('subjects', Subject_Schema)