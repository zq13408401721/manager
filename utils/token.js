const tokenName = "manager-token"
const schoolid = "schoolid"
export function setToken(data){
	localStorage.setItem(tokenName,data)
}
export function getToken(){
	return localStorage.getItem(tokenName)
}
export function removeToken(){
	localStorage.removeItem(tokenName)
}
export function setSchoolId(data){
	localStorage.setItem(schoolid,data)
}
export function  getSchoolId(){
	return localStorage.getItem(schoolid)
}
