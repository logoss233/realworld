import {request} from "@/plugins/request";

//用户登录
export const login=data=>{
  return request({
    method:"POST",
    url:"/api/users/login",
    data
  })
}

//用户注册
export const register=data=>{
  return request({
    method:"POST",
    url:"/api/users",
    data
  })
}

//更新用户设置
export const updateSetting=data=>{
  return request({
    method:"PUT",
    url:"/api/user",
    data
  })
}
//用户页面
export const profile=username=>{
  return request({
    method:"GET",
    url:"api/profiles/"+username
  })
}

