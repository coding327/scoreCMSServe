

var _  = require('lodash')

// 数组递归 
const getRouterListByRole = (arr,role)=>{    
    let newArr = _.filter([...arr],(item)=>{
        if(item.max){
            return role>=item.role && role<= item.max; 
        }else{
            return role>=item.role;
        }
    })
    
    
    _.forEach(newArr,(item)=>{
        if(item.children){
            return item.children = getRouterListByRole(item.children,role)  ;  // 第二次循环递归 
        }
    })

    return [...newArr]
}


module.exports = getRouterListByRole;