import axios from "axios";

//var httpUrl = "http://res.yimios.com:9080/"
var httpUrl = "http://127.0.0.1:12005/"
//var httpUrl = "http://res.yimios.com:9060/"
var uploadUrl = "http://res.yimios.com:9060/" //图片上传
//var panUpload = "http://res.yimios.com:9000"
import {getToken} from "./token.js"
export default{
	post:function(curl,data){
		const token = getToken()
		return new Promise((resolve,reject)=>{
			axios.defaults.headers.common['from'] = "manager"
			axios.defaults.headers.common['art-token'] = token
			axios.post(httpUrl+curl,data)
				.then(function (response){
					resolve(response);
				})
				.catch(function (error) {
					reject(error);
				})
		})
	},
	get:function(curl,data){
		return new Promise((resolve,reject)=>{
			axios.defaults.headers.common['from'] = "manager"
			axios.defaults.headers.common["art-token"] = getToken()
			axios.get(httpUrl+curl,data)
				.then(function (response) {
					resolve(response);
				})
				.catch(function (error) {
					reject(error)
				})
		})
	},
	// data formdata
	upload:function (curl,data){
		const token = getToken()
		return new Promise((resolve,reject)=>{
			axios.defaults.headers.common['from'] = "manager"
			axios.defaults.headers.common['art-token'] = token
			axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
			// httpUrl+curl
			axios.post(httpUrl+curl,data)
				.then(function (response){
					resolve(response);
				})
				.catch(function (error) {
					reject(error);
				})
		})
	},
	uploadMore:function (curl,data){
		const token = getToken()
		return new Promise((resolve,reject)=>{
			axios.defaults.headers.common['from'] = "manager"
			axios.defaults.headers.common['art-token'] = token
			axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
			axios.defaults.headers.common['processData'] = 'false'
			axios.post(httpUrl+curl,data)
				.then(function (response){
					resolve(response);
				})
				.catch(function (error) {
					reject(error);
				})
		})
	},
	//带进度的文件上传 data为formdata
	uploadFile:function (curl,data,index,progress){
		const token = getToken()
		return new Promise((resolve,reject) => {
			var xhr = new XMLHttpRequest()
			xhr.open("post",httpUrl+curl)
			xhr.setRequestHeader('from','manager')
			xhr.setRequestHeader('art-token',token)
			//完成回调
			xhr.onreadystatechange = function (){
				if(xhr.readyState == 4 && xhr.status == 200){
					console.log("上传准备就绪")
					resolve(index)
				}
			}
			//获取上传进度
			xhr.upload.onprogress = function (event){
				if (event.lengthComputable){
					var percent = event.loaded/event.total*100
					console.log('porgress:'+percent)
					progress(index,percent)
				}
			}
			xhr.send(data)
		})
	}

}
