
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

// 用户
const User_Schema = new Schema({
  username: String,
  phone: String,
  password: String,
  dbpass: String,
  email: String,
  avatar: String,
  role: Number, // 角色权限 1 学院 2 讲师 3 管理员
  time: Date, // 记录注册插入数据的时间
  nickname: String, // 昵称
  class: String, // 班级
  subject: String // 学科
})

// 角色
const Role_Schema = new Schema({
  id: Number,
  label: String,
  value: Number,
  menus: Array,
  color: String
})

// 学科
const Subject_Schema = new Schema({
  label: String,
  subjectCode: String
})

// 班级
const Class_Schema = new Schema({
  year: String,
  index: String,
  subject: String,
  label: String,
  value: String
})

// 公告
const Anno_Schema = new Schema({
  title: String,
  content: String,
  type: Number,
  desc: String,
  author: Object,
  time: Date
})

// 意见
const Advise_Schema = new Schema({
  title: String,
  content: String,
  type: Array,
  desc: String,
  author: Object,
  time: Date
})

// 成绩
const Grade_Schema = new Schema({
  name: String,
  address: String,
  jishu: String,
  lightdot: String,
  bug: String,
  detail: String,
  type: String,
  author: Object,
  time: Date,
  score: Number, // 老师打分的
  subject: String,
  class: String,
})


// react移动端
const banner_Schema = new Schema({
  imgurl: String
})

const AppUser_Schema = new Schema({
  username: String,
  phone: String,
  password: String,
  dbpass: String,
  email: String,
  avatar: String,  // 头像信息
  role: Number, // 权限  1 学员 2. 讲师 3.管理员
  time: Date,
  nickname: String,
  class: String,
  subject: String
})

const AppTravel_Schema = new Schema({
  title: String,
  address: String,
  date: Date,
  tags: Array,
  imgs: Array,
  content: String,
  time: Date, // 提交时间
  author: Object,
  hot: Number, // 热度值
  likes: Number,
  collections: Number
})

exports.GoodModel = mongoose.model('goods', Good_Schema)
exports.UserModel = mongoose.model('users', User_Schema)
exports.RoleModel = mongoose.model('roles', Role_Schema)
exports.SubjectModel = mongoose.model('subjects', Subject_Schema)
exports.ClassModel = mongoose.model('classes', Class_Schema)
exports.AnnoModel = mongoose.model('annos', Anno_Schema)
exports.AdviseModel = mongoose.model('advises', Advise_Schema)
exports.GradeModel = mongoose.model('grades', Grade_Schema)
exports.BannerModel = mongoose.model('banners', banner_Schema)
exports.AppUserModel = mongoose.model('appusers', AppUser_Schema)
exports.AppTravelModel = mongoose.model('apptravels', AppTravel_Schema)
