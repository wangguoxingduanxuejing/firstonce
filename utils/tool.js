const tool ={
    isEmpty:function(data){
        return data===undefined || data ===null ||
        typeof data ==='object'&&Object.keys(data).length===0 ||
        typeof data ==='string'&&data.trim().length===0
    }
}

module.exports={
    tool
}