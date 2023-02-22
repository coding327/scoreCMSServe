var express = require('express')
var router = express.Router()
var { BannerModel } = require('../db/model')
var { createToken, decodeToken } = require('../utils/token')
var axios = require('axios')
var multer = require('multer')
var routes = require('../utils/routes')
var getRouterListByRole = require('../utils')
var { insertDataFromTable, findAllDataFromTable, findOneDataFromTable, removeDataFromTable, updateDataFromTable } = require('../db/index')


router.get('/test', (req, res) => {
  res.json({
    code: 200,
    msg: '测试 APP项目的 接口',
    result: null
  })
})

router.get('/banners', (req, res) => {
  findAllDataFromTable({
    model: BannerModel,
    query: {},
    res,
  })
})


module.exports = router