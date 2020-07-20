const axios = require('axios');
const {
	AppConfig,
	StaticUrl
} = require('../config/app-config');
const qs = require('qs');
const graphQLUrl = AppConfig.Api + "/graphql?";

const getGraphQlErrorMes = (rawMes) => {
	let mes = "";
	let customMes = null

	if (rawMes.indexOf("ER_DUP_ENTRY") >= 0) {
		customMes = "Record Already Exist";
	}

	if (customMes != null) {
		mes += `${customMes}\n\n${rawMes}`;
	} else {
		mes = rawMes;
	}

	return "[Request Failed]\n" + mes;
}

// add errMes in responseObj.response.data
const rejectPromiseError = function (responseObj, errMes) {
	if (errMes !== null) {
		if (typeof responseObj["response"] === "undefined") {
			responseObj["response"] = {};
		}
		responseObj.response["data"] = errMes;

		//maybe log this error in db?
		if (typeof alert !== "undefined") {
			//in browser
			alert(errMes);
		} else {
			// in node server
			console.error(errMes);
		}

		return Promise.reject(responseObj);
	}

	return false;
};

// Add a response interceptor
axios.interceptors.response.use(response => {
	//graphql can return error in response as well
	var retErr = null;
	if (response.config.url == graphQLUrl && response.data.errors) {
		//console.log("error from axios graphQLUrl");
		console.log("Intercept GraphQL Error 1", response)
		retErr = getGraphQlErrorMes(response.data.errors[0].message);
	}

	if (retErr !== null) {
		return rejectPromiseError(response, retErr);
	}

	return response;

}, error => {
	var retErr = null;
	try {
		// error in query -- getAxiosGraphQLQuery

		if (error.response.config.url == graphQLUrl) {
			//error.response["data"] = `[GraphQL Error] ${error.response.data.errors[0].message}`;
			let q = null;
			try { q = error.response.config.params.query } catch (err) { }
			console.log("[Intercept GraphQL Error 2]", q);
			retErr = getGraphQlErrorMes(error.response.data.errors[0].message);
		}

	} catch (e) {
		// no connection -- getPHPApiAxios
		//console.log("error from axios catch");
		if (error.code === undefined) {
			retErr = error.message; //network error
		} else {
			// ECONNREFUSED
			retErr = `${error.code} ${error.address}:${error.port}`;
		}

		retErr = `[Server Error] ${retErr}`;
	}

	if (retErr !== null) {
		return rejectPromiseError(error, retErr);
	}

	//console.log("error from axios finish");
	return Promise.reject(error);
});


function getAxiosGraphQLQuery(queryString) {

	var config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		proxy: false,
		params: {
			query: queryString,
			variables: null
		}
	};

	return axios.post(graphQLUrl, {}, config);
}

function graphql(q) {
	return getAxiosGraphQLQuery(q);
}

function graphqlAttr(...dbConfigArr) {
	let r = "";
	for(var conf of dbConfigArr){
		for(var k in conf){
			if(k == "TABLE"){
				continue;
			}

			r += ` ${conf[k]} `
		}
	}

	return r;
}

function getStaticAxios(filename, version = null) {
	var config = {
		proxy: false
	};

	var url = `${StaticUrl}/${filename}`;
	if (version !== null) {
		url += `?v=${version}`;
	}

	return axios.get(url, config)
		.then((res) => {
			return res.data;
		}, (err) => {
			rejectPromiseError(err, `Failed To Load Static Asset - ${url}`)
		});
}

function getAxios(requestUrl, params, headers) {
	// return axios.get(requestUrl, JSON.stringify(params), config);
	return axios({
		method: 'get',
		params: params,
		headers: headers,
		proxy: false,
		url: requestUrl
	})
}

function postAxios(requestUrl, params, headers) {
	var config = {
		proxy: false
	};

	if (typeof headers !== "undefined") {
		config.headers = headers;
	}

	return axios.post(requestUrl, JSON.stringify(params), config);
}

function deleteAxios(requestUrl, headers) {
	var config = {
		proxy: false
	};

	if (typeof headers !== "undefined") {
		config.headers = headers;
	}

	return axios.delete(requestUrl, config);
}

function getPHPApiAxios(script, params) {
	var requestUrl = AppConfig.PHPApi + `${script}.php`;
	console.log(requestUrl);
	var config = {
		proxy: false
	};
	return axios.post(requestUrl, qs.stringify(params), config);
}

function getPHPNotificationApiAxios(script, params) {
	var requestUrl = AppConfig.PHPNotificationApi + `${script}.php`;
	console.log(requestUrl);
	var config = {
		proxy: false
	};
	return axios.post(requestUrl, qs.stringify(params), config);
}


// only in ajax_external -- response is fixed here
function postPhpAdmin(url, params, successInterceptor = null) {
	var config = {
		proxy: false
	};
	return axios.post(url, qs.stringify(params), config).then((res) => {
		console.log("postPhpAdmin success");
		console.log(res.data);
		console.log("postPhpAdmin success");
		if (res.data.err) {
			return res.data.err;
		} else {

			var retData = res.data.data;

			if (typeof retData == "undefined") {
				retData = res.data;
			}

			if (successInterceptor !== null) {
				successInterceptor(retData);
			}

			return retData;
		}
	}, (err) => {
		console.log("postPhpAdmin err");
		console.log(err.response);
		console.log("postPhpAdmin err");
		return err.response.data;
	});
}

// only in ajax_external -- response is fixed here
function getWpAjaxAxios(action, data, successInterceptor = null, isDataInPost = false) {

	var params = {};
	if (isDataInPost) {
		params = data;
	} else {
		params["data"] = data;
	}
	params["action"] = action;

	var config = {
		proxy: false
	};
	return axios.post(AppConfig.WPAjaxApi, qs.stringify(params), config).then((res) => {
		if (res.data.err) {
			return res.data.err;
		} else {

			var retData = res.data.data;

			if (typeof retData == "undefined") {
				retData = res.data;
			}

			if (successInterceptor !== null) {
				successInterceptor(retData);
			}

			return retData;
		}
	}, (err) => {
		return err.response.data;
	});
}

//Export functions 
module.exports = {
	postPhpAdmin,
	graphqlAttr,
	graphql,
	deleteAxios,
	postAxios,
	getAxios,
	getStaticAxios,
	getAxiosGraphQLQuery,
	getPHPApiAxios,
	getPHPNotificationApiAxios,
	getWpAjaxAxios
};