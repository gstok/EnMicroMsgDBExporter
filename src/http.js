
import axios from "axios";
import { Message } from "element-ui";

axios.defaults.timeout = 50000;
axios.defaults.baseURL = '';

//弹出错误信息
function showError (msg) {
    Message({
        type: "error",
        message: msg,
    });
}

function http (config) {
    return new Promise((resolve, reject) => {
        let message = "网络请求发生错误！";
        axios(config).then(response => {
            if (response.status === 401) {
                // 需要跳转
            }
            else if (response.status === 403) {
                // iView.Message.error('权限不足，禁止访问！');
            }
            else if (response.status === 500) {

            }
            else if (response.status !== 200) {
                // iView.Message.error(response.data.msg);
            }

            if (response.status == 200 &&
                response.data &&
                response.data.code == 200) {
                resolve(response.data);
            }
            else {
                try {
                    message = response.data.msg;
                }
                catch (e) { }
                showError(message);
            }
        }).catch(err => {
            showError(message);
            // reject(err);
        });
    });
}

/**
 * 封装get方法
 * @param url 要请求的url地址
 * @param params 请求的参数
 * @returns {Promise}
 */
export function fetch(url, params = { }) {
    return http({
        method: 'GET',
        url: url,
        params: params,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

/**
 * 封装post请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
export function post(url, data = { }) {
    return http({
        method: 'POST',
        url: url,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

/**
 * 封装patch请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
export function patch(url, data = { }) {
    return http({
        method: 'PATCH',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

/**
 * 封装put请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
export function put(url, data = { }) {
    return http({
        method: 'PUT',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}