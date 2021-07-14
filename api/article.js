import {request} from "@/plugins/request";

//获取公共文章列表
export const getArticles=params=>{
  return request({
    method:"GET",
    url:"/api/articles",
    params
  })
}

//获取关注的用户文章列表
export const getFeedArticles=params=>{
  return request({
    method:"GET",
    url:"/api/articles/feed",
    params
  })
}

//点赞
export const addFavorite=slug=>{
  return request({
    method:"POST",
    url:"/api/articles/"+slug+"/favorite",
  })
}

//点赞
export const deleteFavorite=slug=>{
  return request({
    method:"DELETE",
    url:"/api/articles/"+slug+"/favorite",
  })
}

//获取文章详情
export const getArticle=slug=>{
  return request({
    method:"GET",
    url:"/api/articles/"+slug,
  })
}

//获取文章评论
export const getComments=slug=>{
  return request({
    method:"GET",
    url:"/api/articles/"+slug+"/comments",
  })
}

//删除文章评论
export const deleteComment=(slug,id)=>{
  return request({
    method:"DELETE",
    url:`api/articles/${slug}/comments/${id}`
  })
}

//添加文章评论
export const addComment=(slug,data)=>{
  return request({
    method:"POST",
    url:`api/articles/${slug}/comments`,
    data,
  })
}

//发表文章
export const publish=(data)=>{
  return request({
    method:"POST",
    url:"api/articles",
    data
  })
}

//删除文章
export const deleteArticle=slug=>{
  return request({
    method:"DELETE",
    url:"api/articles/"+slug,
  })
}



