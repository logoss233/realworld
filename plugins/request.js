import axios from "axios"

export const request=axios.create({
  baseURL: 'https://conduit.productionready.io/'
})

export default ({store})=>{
  //请求拦截器
  //任何请求都要经过请求拦截器
  request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const {user}=store.state
    if(user && user.token){
      config.headers.Authorization=`Token ${user.token}`
    }
    
    return config
  }, function (error) {
    // 对请求错误做些什么  还没发出去时失败
    return Promise.reject(error)
  });
}


