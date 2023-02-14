
exports.insertDataFromTable = ({
    model,
    data,  // 插入的数据
    res,
    msg = '添加成功',
    next,  // 1 进行下一个异步promise  0 已经终止执行
})=>{
    return new Promise((resolve,reject)=>{
        model.insertMany(data)
        .then(result=>{
            if(next){
                resolve(result)
            }else{
                res.json({
                    code:200,
                    msg:msg,
                    result
                })
            }
        })
        .catch(err=>{
            console.log(err)
            res.json({
                code:500,
                err,
                msg:'服务器异常'
            })
            reject(err)
        })
    })
}


exports.findAllDataFromTable  = ({
    model,
    res,
    query,  // 条件
    fields ,  // 字段
    msg='成功',
    next,  // 1 进行下一个异步promise  0 已经终止执行
    skip,
    limit,
    sort
})=>{
    return new Promise((resolve,reject)=>{
        model.find(query,fields)
        .skip(skip)  // 跳过多少条
        .limit(limit) // 限制多少条
        .sort(sort)  // 排序
        .then(result=>{
            if(next){
                resolve(result)
            }else{
                res.json({
                    code:200,
                    msg,
                    result
                })
            }
        })
        .catch(err=>{
            console.log(err)
            res.json({
                code:500,
                err,
                msg:'服务器异常'
            })
            reject(err)
        })
    })
}

exports.findOneDataFromTable  = ({
    model,
    res,
    query,  // 条件
    fields ,  // 字段
    msg='成功',
    next,  // 1 进行下一个异步promise  0 已经终止执行
})=>{
    return new Promise((resolve,reject)=>{
        model.findOne(query,fields)
        .then(result=>{
            if(next){
                resolve(result)
            }else{
                res.json({
                    code:200,
                    msg:msg,
                    result
                })
            }
        })
        .catch(err=>{
            console.log(err)
            res.json({
                code:500,
                err,
                msg:'服务器异常'
            })
            reject(err)
        })
    })
}


exports.removeDataFromTable = ({
  model,
  res,
  query,  // 条件
  msg = '删除成功',
  next,  // 1 进行下一个异步promise  0 已经终止执行
}) => {
  return new Promise((resolve, reject) => {
    model.remove(query)
      .then(result => {
        if (next) {
          resolve(result)
        } else {
          res.json({
            code: 200,
            msg: msg,
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
        reject(err)
      })
  })
}

exports.updateDataFromTable = ({
  model,
  res,
  query,  // 条件
  data,
  msg = '修改成功',
  next,  // 1 进行下一个异步promise  0 已经终止执行
}) => {
  return new Promise((resolve, reject) => {
    model.updateMany(query, {
      $set: data
    })
      .then(result => {
        if (next) {
          resolve(result)
        } else {
          res.json({
            code: 200,
            msg: msg,
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
        reject(err)
      })
  })
}