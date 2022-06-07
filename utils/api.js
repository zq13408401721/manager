import server from "./request"

/**
 * 登录页面
 * @param data
 * @returns {Promise<unknown>}
 */
export function login(data){
    console.log("login")
    return server.post("api/user/adminLogin",data)
}

/**
 * 获取章节数据
 * @param data
 * @returns {Promise<unknown>}
 */
export function getVideoCategoryList(data){
    console.log("categorylist")
    return server.post("api/video/videoCategoryList",data)
}

/**
 * 添加章节数据
 * @param data {name,sort,pid}
 * @returns {Promise<unknown>}
 */
export function addVideoCategory(data){
    console.log("videocategory")
    return server.post("api/video/addVideoCategory",data)
}

/**
 * 创建账号
 * @param data
 */
export function createUser(data){
    return server.post("api/user/register",data)
}

/**
 * 获取用户列表
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export function getUserList(data){
    return server.post("api/user/getUserList",data)
}


/**
 * 更新章节数据
 * @param data {name,sort}
 * @returns {Promise<unknown>}
 */
export function updateVideoCategory(data){
    console.log("addvideocategory")
    return server.post("api/video/updateVideoCategory",data)
}

/**
 * 更新视频信息
 * @param data
 */
export function updateVideoInfo(data){
    return server.post("api/video/updateVideoInfo",data)
}

/**
 * 删除章节数据
 * @param data {ids}
 * @returns {Promise<unknown>}
 */
export function deleteVideoCategory(data){
    console.log("deleteVideoCategory")
    return server.post("api/video/deleteVideoCategory",data)
}

/**
 * 视频封面上传
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export function upLoadVideoCover(data){
    console.log("deleteVideoCategory")
    return server.upload("api/upload/uploadImageFile",data)
}

/**
 * 获取当前节点相关信息
 * @param data
 */
export function getCategoryInfo(data){
    return server.post("api/video/categoryInfo",data)
}

/**
 * 添加视频
 * @param data
 * @returns {Promise<unknown>}
 */
export function addVideo(data){
    return server.post("api/video/addVideo",data)
}

/**
 * 获取视频列表
 * @param option
 */
export function getVideoList(data){
    return server.post("api/video/videolist",data)
}



/**
 * 获取章节数据
 * @param data
 * @returns {Promise<unknown>}
 */
export function getGalleryCategoryList(data){
    console.log("categorylist")
    return server.post("api/gallery/galleryCategoryList",data)
}

/**
 * 添加章节数据
 * @param data {name,sort,pid}
 * @returns {Promise<unknown>}
 */
export function addGalleryCategory(data){
    console.log("gallerycategory")
    return server.post("api/gallery/addGalleryCategory",data)
}

/**
 * 更新章节数据
 * @param data {name,sort}
 * @returns {Promise<unknown>}
 */
export function updateGalleryCategory(data){
    console.log("addvideocategory")
    return server.post("api/gallery/updateGalleryCategory",data)
}

/**
 * 删除章节数据
 * @param data {ids}
 * @returns {Promise<unknown>}
 */
export function deleteGalleryCategory(data){
    console.log("deleteGalleryCategory")
    return server.post("api/gallery/deleteGalleryCategory",data)
}

/**
 * 视频封面上传
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export function upLoadGalleryCover(data){
    console.log("deleteVideoCategory")
    return server.upload("api/upload/uploadImageFile",data)
}

/**
 * 上传图片
 * @param data
 * @returns {Promise<unknown>}
 */
export function upLoadGallery(data){
    console.log("upLoadGallery")
    return server.upload("api/upload/uploadImageFile",data)
}

/**
 * 多张图上传
 * @param data
 * @returns {Promise<unknown>}
 */
export function upLoadGalleryMore(data){
    console.log("deleteVideoCategory")
    return server.uploadMore("api/upload/uploadImageMoreFile",data)
}

/**
 * 获取当前节点相关信息
 * @param data
 */
export function getGalleryCategoryInfo(data){
    return server.post("api/gallery/categoryInfo",data)
}

/**
 * 添加到图库
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export function addGallery(data){
    return server.post("api/gallery/addGallery",data)
}

/**
 * 获取视频列表
 * @param option
 */
export function getGalleryList(data){
    return server.post("api/gallery/gallerylist",data)
}

/**
 * 删除图片列表数据
 * @param data
 */
export function deleteGallery(data){
    return server.post("api/gallery/deleteGallery",data)
}

/**
 * 上传文件
 * @param data
 */
export  function uploadFile(data,index,progress){
    return server.uploadFile("api/upload/uploadGalleryFile",data,index,progress)
    //return server.uploadFile("api/pan_upload",data,index,progress)
}

/**
 * 创建学校
 * @param data
 */
export function createSchool(data){
    return server.post("api/school/createSchool",data)
}

/**
 * 获取学校列表
 * @param data
 */
export function schoolList(data){
    return server.post("api/school/schoolList",data)
}

/**
 * 学校管理员列表
 * @param data
 */
export function schoolAdmin(data){
    return server.post("api/school/schoolAdmin",data)
}

/**
 * 删除管理员数据
 * @param data
 */
export function deleteAdmin(data){
    return server.post("api/school/deleteAdmin",data)
}

/**
 * 删除学校数据
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export function deleteSchool(data){
    return server.post("api/school/deleteSchool",data)
}

/**
 * 更新图库排序
 * @param data
 * @returns {Promise<unknown>}
 */
export function updateGallerySort(data) {
    return server.post("api/gallery/galleryUpdateSort",data)
}

/**
 * 获取学校所有班级
 */
export function getClassesBySchoolId(data){
    return server.post("api/classes/queryClass",data)
}

/**
 * 创建班级
 * @param data {name,max}
 */
export function createClass(data){
    return server.post("api/classes/createClass",data)
}

/**
 * 更新编辑名称
 * @param data
 * @returns {Promise<unknown>}
 */
export function updateClassInfo(data){
    return server.post("api/classes/updateClassInfo",data)
}

/**
 * 删除班级
 * @param data{classid}
 * @returns {Promise<unknown>}
 */
export function deleteClassById(data){
    return server.post("api/classes/deleteClass",data)
}

/**
 * 添加班级成员 json结构参数
 * {"classid":1,"role":1,"users":[{"uid":"fba825c0-07cf-43ba-bca6-b66a482630b2"},{"uid":"763fb451-8e95-402f-a219-be93f4f81535"}]}
 * @param data {}
 * @returns {Promise | Promise<unknown>}
 */
export function addClassMember(data){
    return server.post("api/classes/addClassMember",data)
}

/**
 * 获取班级成员
 */
export function getClassMember(data){
    return server.post("api/classes/queryClassMember",data)
}

/**
 * 获取学校所有老师或学生列表
 * data{role=1老师 role=2学生}
 */
export function getSchoolMembers(data){
    return server.post("api/classes/querySchoolUser",data)
}

/**
 * 删除班级成员
 * @param data {classid,uids:["xxx"]}
 * @returns {Promise | Promise<unknown>}
 */
export function deleteClassMember(data){
    return server.post("api/classes/deleteClassMember",data)
}

/**
 * 删除编辑
 * @param data {classid}
 * @returns {Promise | Promise<unknown>}
 */
export function deleteClass(data){
    return server.post("api/classes/deleteClass",data)
}




