const {
	graphql,
	getAxiosGraphQLQuery,
	getPHPApiAxios,
	getWpAjaxAxios,
	postAxios,
	postPhpAdmin
} = require("../../helper/api-helper");
const {
	User,
	UserMeta,
	UserEnum,
	LogEnum
} = require("../../config/db-config");
const {
	Single
} = require("../../config/registration-config");
const {
	SiteUrl, EmailPhpAdmin
} = require("../../config/app-config");
const {
	AuthUserKey
} = require("../../config/auth-config");
const obj2arg = require("graphql-obj2arg");
const {
	LogApi
} = require("./other-api");

const {
	Secret
} = require("../secret/secret");

const {
	AuthAPIErr
} = require("../../config/auth-config");
const registrationConfig = require("../../config/registration-config");

const MailChimp = {
	//ListId: "5be77e4419", // Test List
	ListId: "a694cb5f7a", // Seeds Job Fair Mailing List
	ListIdLocal: "3532b6961c", // Seeds Job Fair Mailing List (Local)
	ApiKey: Secret.MAIL_CHIMP_KEY
};


function getIdUtmTable(cf) {
	let table = "ref_id_utm"; // UTM20
	if (cf == "UTM20") {
		table = "ref_id_utm";
	}
	if (cf == "UTM21") {
		table = "ref_id_utm21";
	}
	if (cf == "UMT") {
		table = "ref_id_umt";
	}
	return table
}
function getIdUtmKey(cf) {
	let key = "id_utm"; // UTM20
	if (cf == "UTM20") {
		key = "id_utm";
	}
	if (cf == "UTM21") {
		key = "id_utm21";
	}
	if (cf == "UMT") {
		key = "id_umt";
	}
	return key
}

const LIMIT_STUDENT_JPATC = 2000;
// const LIMIT_STUDENT_JPATC = 4;
class AuthAPI {
	//##########################################################################################
	// Helper
	isCFValid(user, cf) {
		var role = user.role;

		if (role == UserEnum.ROLE_STUDENT) {
			// New Feature for 2019, override checking during login
			// sume student boleh join mana2
			this.insertCfAfterLogin(user, cf);
			return true;
		}
		else if (role == UserEnum.ROLE_ORGANIZER) {
			return user[User.CF].indexOf(cf) >= 0;
		}
		else if (role == UserEnum.ROLE_RECRUITER) {
			if (user.company) {
				return user.company.cf.indexOf(cf) >= 0;
			} else {
				return false;
			}
		} else {
			return (
				role == UserEnum.ROLE_VOLUNTEER ||
				role == UserEnum.ROLE_ADMIN ||
				role == UserEnum.ROLE_EDITOR ||
				role == UserEnum.ROLE_SUPPORT
			);
		}
	}

	insertCfAfterLogin(user, cf) {
		if (user.role == UserEnum.ROLE_STUDENT) {
			// check kalau dah ada dlm cf_map
			let existingCf = user[User.CF];
			if (!Array.isArray(existingCf)) {
				existingCf = [];
			}
			if (existingCf.indexOf(cf) >= 0) {
				return;
			}

			// kalau takde, masukkan cf ni

			let update = {};
			update[User.ID] = user.ID;
			update[User.CF] = cf;

			// kita tanak record lama dioverride,
			// n kita boleh track bila user tu regiser, login cf baru
			update[User.SKIP_DELETE_CF] = true;

			var query = `mutation{edit_user(${obj2arg(update, {
				noOuterBraces: true
			})}) {ID}}`;
			getAxiosGraphQLQuery(query).then(
				res => { },
				err => { }
			);
		}
	}

	checkPasswordWithoutSlash(password, user_id, success, failed) {
		var user_query = `query{user(ID:${user_id}){user_pass}}`;
		return getAxiosGraphQLQuery(user_query).then(
			res => {
				var pass = res.data.data.user.user_pass;
				pass = pass.replaceAll("/", "");

				if (pass == password) {
					success();
				} else {
					failed("Not Authorized");
				}
			},
			err => {
				failed(err);
			}
		);
	}

	//##########################################################################################
	// Login Module
	loginCheckPassword(user, password, cf, request) {
		//check password
		var pass_params = {
			action: "check_password",
			password: password,
			hashed: user.user_pass
		};
		return getPHPApiAxios("password_hash", pass_params).then(
			res => {
				//password match -- cannot use === operator

				// check if password corrent
				if (res.data == "1") {
					// check if valid cf
					if (!this.isCFValid(user, cf)) {
						return AuthAPIErr.INVALID_CF;
					} else {

						// @kpt_validation - loginCheckPassword - init
						let errKptValidation = this.loginCheckPasswordKptValidation(cf, user);
						if (errKptValidation !== false) {
							return errKptValidation;
						}

						// @id_utm_validation - loginCheckPassword - init
						let errIdUtmValidation = this.loginCheckPasswordIdUtmValidation(cf, user);
						if (errIdUtmValidation !== false) {
							return errIdUtmValidation;
						}

						user[User.PASSWORD] = user[User.PASSWORD].replaceAll("/", "");
						user[User.CF] = cf;

						try {
							var logData = request.get("User-Agent");
							LogApi.add(LogEnum.EVENT_LOGIN, logData, user.ID);
						} catch (err) {
						}

						return user;
					}
				} else {
					return AuthAPIErr.WRONG_PASS;
				}
			},
			err => {
				console.log("Error Auth Api getPHPApiAxios");
				return err.response.data;
			}
		);
	}

	loginCheckPasswordKptValidation(cf, user) {
		if (registrationConfig.isDoJpaKptValidation(cf) && user.role == UserEnum.ROLE_STUDENT) {
			if (!user.kpt) {
				// @kpt_validation - loginCheckPassword - KPT_NOT_FOUND_IN_USER_RECORD
				return AuthAPIErr.KPT_NOT_FOUND_IN_USER_RECORD;
			} else if (!user.is_kpt_jpa) {
				// @kpt_validation - loginCheckPassword - KPT_NOT_JPA
				return AuthAPIErr.KPT_NOT_JPA;
			}
		}
		return false;
	}

	loginCheckPasswordIdUtmValidation(cf, user) {
		if (registrationConfig.isDoIdUtmValidation(cf) && user.role == UserEnum.ROLE_STUDENT) {
			if (!user[getIdUtmKey(cf)]) {
				// @id_utm_validation - loginCheckPassword - ID_UTM_NOT_FOUND_IN_USER_RECORD
				return AuthAPIErr.ID_UTM_NOT_FOUND_IN_USER_RECORD;
			} else if (!user.is_id_utm) {
				// @id_utm_validation - loginCheckPassword - ID_UTM_NOT_VALID
				return AuthAPIErr.ID_UTM_NOT_VALID;
			}
		}
		return false;
	}

	// @kpt_validation - new param
	login({ email, password, cf, kpt, id_utm, request }) {

		var field = "";
		let authUserKey = JSON.parse(JSON.stringify(AuthUserKey));
		let idByCf = getIdUtmKey(cf);
		if (authUserKey.indexOf(idByCf) <= -1) {
			authUserKey.push(idByCf)
		}
		authUserKey.map((d, i) => {
			field += `${d},`;
		});
		field = field.slice(0, -1);


		var user_query = `query{
            user:user(user_email:"${email}", cf_to_check_id_utm:"${cf}"){
                ${field} company {cf name recruiters
                    {ID user_email first_name last_name}}
            }
			cf:cf(name:"${cf}"){
				name feature_student_login feature_recruiter_login
			}
		}`;

		return getAxiosGraphQLQuery(user_query).then(
			(res) => {
				var user = res.data.data.user;
				var cfRes = res.data.data.cf;

				if (user !== null) {
					
					if (user["role"] == UserEnum.ROLE_STUDENT && cfRes["feature_student_login"] == "OFF") {
						return AuthAPIErr.USER_CANNOT_LOGIN;
					}
					if (user["role"] == UserEnum.ROLE_RECRUITER && cfRes["feature_recruiter_login"] == "OFF") {
						return AuthAPIErr.USER_CANNOT_LOGIN;
					}

					// check if in kpt exist
					if (kpt && user.role == UserEnum.ROLE_STUDENT) {
						// @kpt_validation - login - init
						return this.loginKptValidation({
							kpt: kpt,
							user: user,
							user_query: user_query,
							password: password,
							cf: cf,
							request: request
						});
					} else if (id_utm && user.role == UserEnum.ROLE_STUDENT) {
						// @id_utm_validation - login - init
						return this.loginIdUtmValidation({
							id_utm: id_utm,
							user: user,
							user_query: user_query,
							password: password,
							cf: cf,
							request: request
						});
					} else {
						return this.loginCheckPassword(user, password, cf, request);
					}


				} else {
					return AuthAPIErr.INVALID_EMAIL;
				}
			},
			err => {
				console.log("Error Auth Api getAxiosGraphQLQuery", err.response.data);
				return err.response.data;
			}
		);
	}

	loginKptValidation({ kpt, user, user_query, password, cf, request }) {
		// @kpt_validation - login - check LIMIT_STUDENT_JPATC
		return graphql(` query{cf(name:"JPATC") { total_student } } `).then((res) => {
			try {
				let total_student = res.data.data.cf.total_student;
				if (total_student && total_student >= LIMIT_STUDENT_JPATC) {
					return AuthAPIErr.JPA_OVER_LIMIT;
				}
			} catch (err) { }

			// @kpt_validation - login - check if duplicate
			return graphql(`query{user(kpt:"${kpt}"){kpt}}`).then((res) => {
				try {
					if (res.data.data.user.kpt) {
						// @kpt_validation - login - KPT_ALREADY_EXIST
						return AuthAPIErr.KPT_ALREADY_EXIST;
					}
				} catch (err) { }

				// @kpt_validation - login - bind the kpt with the user that try to login
				let updateKpt = `mutation {add_single(key_input:"kpt", entity:"user", entity_id:${user.ID}, val:"${kpt}"){ val } }`
				return graphql(updateKpt).then((res) => {
					// query user again
					return graphql(user_query).then((res) => {
						user = res.data.data.user;
						return this.loginCheckPassword(user, password, cf, request);
					});
				}).catch(err => {
					return err;
				});
			});
		});
	}

	loginIdUtmValidation({ id_utm, user, user_query, password, cf, request }) {
		// @id_utm_validation - login - check if duplicate
		return graphql(`query{user(id_utm:"${id_utm}", cf:"${cf}"){${getIdUtmKey(cf)}}}`).then((res) => {
			try {
				if (res.data.data.user[getIdUtmKey(cf)]) {
					// @id_utm_validation - login - ID_UTM_ALREADY_EXIST
					return AuthAPIErr.ID_UTM_ALREADY_EXIST;
				}
			} catch (err) { }

			// @id_utm_validation - login - bind the kpt with the user that try to login
			let update = `mutation {add_single(key_input:"${getIdUtmKey(cf)}", entity:"user", entity_id:${user.ID}, val:"${id_utm}"){ val } }`
			return graphql(update).then((res) => {
				// query user again
				return graphql(user_query).then((res) => {
					user = res.data.data.user;
					return this.loginCheckPassword(user, password, cf, request);
				});
			}).catch(err => {
				return err;
			});
		});
	}
	//##########################################################################################
	// Activate Account Module

	createActivationLink(act_key, user_id, cf) {
		let cfParam = cf ? `?cf=${cf}` : "";
		return `${SiteUrl}/auth/activate-account/${act_key}/${user_id}/${cfParam}`;
	}

	activateAccount(act_key, user_id) {
		var user_query = `query{
            user(ID:${user_id}){
                user_email
                activation_key
                user_status
            }}`;

		return getAxiosGraphQLQuery(user_query).then(res => {
			var user = res.data.data.user;
			if (user === null) {
				return AuthAPIErr.INVALID_ACTIVATION;
			} else {
				if (user.user_status === UserEnum.STATUS_ACT) {
					return `User ${user.user_email} already active.`;
				}
				if (act_key === user.activation_key) {
					var update = {};
					update[User.ID] = Number.parseInt(user_id);
					update[UserMeta.USER_STATUS] = UserEnum.STATUS_ACT;

					var edit_query = `mutation{
                        edit_user(${obj2arg(update, { noOuterBraces: true })}) {
                          ID
                          user_email
                          user_status
                        }
                      }`;

					return getAxiosGraphQLQuery(edit_query).then(res => {
						var user = res.data.data.edit_user;
						return {
							user_email: user.user_email
						};
					});
				} else {
					return AuthAPIErr.INVALID_ACTIVATION;
				}
			}
		});
	}

	//##########################################################################################
	// Reset Password Module

	// helper function
	createPasswordResetLink(token, user_id, cf) {
		let cfParam = cf ? `?cf=${cf}` : "";
		return `${SiteUrl}/auth/password-reset/${token}/${user_id}/${cfParam}`;
	}

	// helper function
	set_password(user_id, password, password_reset_ID = null) {
		//hash password
		var pass_params = {
			action: "hash_password",
			password: password
		};
		return getPHPApiAxios("password_hash", pass_params).then(res => {
			var hashed = res.data;
			//update hash password in db
			var user_query = `mutation{edit_user(ID:${user_id},user_pass:"${hashed}"){ID user_pass}}`;
			return getAxiosGraphQLQuery(user_query).then(res => {
				var user = res.data.data.user;

				// update is_expired to true in password_reset
				if (password_reset_ID !== null) {
					var user_query = `mutation{edit_password_reset(ID:${password_reset_ID},is_expired:1){ID}}`;
					return getAxiosGraphQLQuery(user_query).then(res => {
						return {
							status: 1
						};
					});
				} else {
					return {
						status: 1
					};
				}
			});
		});
	}

	// reset with token and user id
	password_reset_token(new_password, token, user_id) {
		var user_query = `query{password_reset(user_id:${user_id},token:"${token}"){ID is_expired}}`;
		//console.log(user_query);
		return getAxiosGraphQLQuery(user_query).then(res => {
			var password_reset = res.data.data.password_reset;
			console.log(res.data);
			if (password_reset == null) {
				return AuthAPIErr.TOKEN_INVALID;
			} else if (password_reset.is_expired) {
				return AuthAPIErr.TOKEN_EXPIRED;
			} else {
				return this.set_password(user_id, new_password, password_reset.ID);
			}
		});
	}

	// reset password with old password entered
	password_reset_old(new_password, old_password, user_id) {
		// get user old hashed password
		var user_query = `query{user(ID:${user_id}){user_pass}}`;
		return getAxiosGraphQLQuery(user_query).then(res => {
			var user = res.data.data.user;

			// check if old password is correct
			var pass_params = {
				action: "check_password",
				password: old_password,
				hashed: user.user_pass
			};
			return getPHPApiAxios("password_hash", pass_params).then(res => {
				if (res.data == "1") {
					return this.set_password(user_id, new_password);
				}
				// old password given is wrong
				else {
					return AuthAPIErr.WRONG_PASS;
				}
			});
		});
	}

	replaceAll(search, replacement, string) {
		return string.replace(new RegExp(search, `g`), replacement);
	}

	getLatestCf(userObj) {
		let cfArr = [];
		try {
			if (userObj.role == UserEnum.ROLE_RECRUITER) {
				cfArr = userObj.company.cf;
			} else {
				cfArr = userObj.cf;
			}
		} catch (err) { }

		let latestCf = null;
		if (Array.isArray(cfArr) && cfArr.length > 0) {
			latestCf = cfArr[0];
		}

		return latestCf;
	}

	password_reset_request(user_email) {
		// get user id from email
		var id_query = `query{ user(user_email:"${user_email}"){ID first_name role cf company{cf} } }`;
		return getAxiosGraphQLQuery(id_query).then(res => {
			var user = res.data.data.user;
			let latestCf = this.getLatestCf(user);
			if (user == null) {
				return AuthAPIErr.INVALID_EMAIL;
			} else {
				//create new token
				var pass_params = {
					action: "hash_password",
					password: `${user_email}_${Date.now()}`
				};
				return getPHPApiAxios("password_hash", pass_params).then(res => {
					var token = res.data;
					token = this.replaceAll("/", "", token);

					//and add to db
					var token_query = `mutation{add_password_reset(user_id:${user.ID},token:"${token}") {token} }`;
					return getAxiosGraphQLQuery(token_query).then(res => {
						//send email
						var email_data = {
							to: user_email,
							params: {
								first_name: user.first_name,
								link: this.createPasswordResetLink(token, user.ID, latestCf)
							},
							type: "RESET_PASSWORD"
						};

						console.log("email_data", email_data)
						postPhpAdmin(EmailPhpAdmin, email_data, data => {
							console.log("postPhpAdmin finish")
							console.log(data);
						});
						return {
							status: 1,
						};

						// console.log("send_email", email_data);
						// getWpAjaxAxios("app_send_email", email_data);
						// return {
						// 	status: 1
						// };
					});
				});
			}
		});
	}

	//##########################################################################################
	// Registration Module
	createRecruiter(rec) {
		var rec_company = rec[UserMeta.REC_COMPANY];
		var first_name = rec[UserMeta.FIRST_NAME];

		var userdata = rec;
		var usermeta = rec;
		var data = {};
		data["userdata"] = userdata;
		data["usermeta"] = usermeta;

		const successInterceptor = data => {
			/** data
			 * { ID: 909, activation_key: '92a4feb2e629fb0c79d397db6232d6b36364b5c6' }
			 */
			var user_id = data[User.ID];
			// update cf and role
			var cf_sql = `mutation{
				edit_user(ID:${user_id}, 
				rec_company:"${rec_company}", 
				wp_cf_capabilities: "recruiter") {rec_company}}`;
			getAxiosGraphQLQuery(cf_sql)
			getAxiosGraphQLQuery(`mutation{
				add_single(key_input:"first_name", entity:"user", entity_id:${user_id}, val:"${first_name}"){val}
			}`);
		};

		return getWpAjaxAxios("app_register_user", data, successInterceptor);

	}

	//raw form from sign up page
	register(user) {
		//separate userdata and usermeta

		//get cf
		var cf = user[User.CF];
		delete user[User.CF];

		var userdata = user;
		var usermeta = user;

		var data = {};
		data["userdata"] = userdata;
		data["usermeta"] = usermeta;

		const addToMailChimp = (email, first_name, last_name) => {


			graphql(`query{
        cf(name:"${cf}"){
          name
          mail_chimp_list
        }
      }`).then((res) => {

				let mail_chimp_list = res.data.data.cf["mail_chimp_list"];
				console.log("mail_chimp_list", mail_chimp_list);

				let listId = mail_chimp_list == "local" ? MailChimp.ListIdLocal : MailChimp.ListId;
				let url = `https://us16.api.mailchimp.com/3.0/lists/${listId}/members`;
				console.log("url", url);

				let params = {
					email_address: email,
					status: "subscribed",
					merge_fields: {
						FNAME: first_name,
						LNAME: last_name
					}
				};
				let headers = {
					"Content-Type": "application/json",
					Authorization: `apikey ${MailChimp.ApiKey}`
				};

				postAxios(url, params, headers)
					.then(res => {
						console.log("[addToMailChimp success]", res);
					})
					.catch(error => {
						console.log("[addToMailChimp error]", error);
					});
			});


		};

		const addToSingleInput = (data, user, key, overrideKey) => {
			// console.log("--------------------------------")
			// console.log("addToSingleInput", data, user, key, overrideKey)

			let userId = data[User.ID];
			var q = `mutation{
                add_single(key_input:"${key}", 
                entity:"user", 
                entity_id:${userId}
                val:"${overrideKey ? user[overrideKey] : user[key]}"
				) { ID }}`;
			// console.log("--------------------------------")
			// console.log(q);
			// console.log("--------------------------------")
			getAxiosGraphQLQuery(q);
		};

		const successInterceptor = data => {
			let userId = data[User.ID];

			// add first name and last name at single_input
			addToSingleInput(data, user, "level_study_utm21");
			addToSingleInput(data, user, "faculty_utm21");
			addToSingleInput(data, user, Single.first_name);
			addToSingleInput(data, user, Single.last_name);
			addToSingleInput(data, user, Single.kpt); //@kpt_validation
			addToSingleInput(data, user, getIdUtmKey(cf), "id_utm"); //@id_utm_validation

			// update cf
			var cf_sql = `mutation{edit_user(ID:${userId}, cf:"${cf}") {cf}}`;
			getAxiosGraphQLQuery(cf_sql);
			console.log(cf_sql);

			//send Email here
			var act_link = this.createActivationLink(
				data[UserMeta.ACTIVATION_KEY],
				data[User.ID],
				cf
			);

			var email_data = {
				to: user[User.EMAIL],
				params: {
					first_name: user[UserMeta.FIRST_NAME],
					last_name: user[UserMeta.LAST_NAME],
					activation_link: act_link
				},
				type: "STUDENT_REGISTRATION"
			};

			console.log("send STUDENT_REGISTRATION email", email_data);
			addToMailChimp(
				user[User.EMAIL],
				user[UserMeta.FIRST_NAME],
				user[UserMeta.LAST_NAME]
			);

			// skip send welcome email
			// getWpAjaxAxios("app_send_email", email_data);
		};
		const errorInterceptor = err => {
			console.log(err);
			if (err == AuthAPIErr.USERNAME_EXIST) {
				let existedEmail = user[User.EMAIL];
				return graphql(`query{user(user_email:"${user[User.EMAIL]}") {ID}}`).then(resQuery => {
					let existedId = resQuery.data.data.user.ID;
					let overrideEmail = "DELETED_" + existedEmail;
					return graphql(`mutation{edit_user(ID:${existedId}, user_email:"${overrideEmail}", user_login:"${overrideEmail}") 
						{ID}}`).then(resUpdate => {
						return getWpAjaxAxios("app_register_user", data, successInterceptor);
					});

				})
			} else {
				return err;
			}
		}


		if (user[UserMeta.KPT]) {
			// @kpt_validation - register - init
			return this.registerKptValidation({
				kpt: user[UserMeta.KPT],
				data: data,
				successInterceptor: successInterceptor
			});
		} else if (user.id_utm) {
			// @id_utm_validation - register - init
			return this.registerIdUtmValidation({
				id_utm: user.id_utm,
				cf: cf,
				data: data,
				successInterceptor: successInterceptor
			});
		} else {
			return getWpAjaxAxios("app_register_user", data, successInterceptor, null, errorInterceptor);
		}

	}

	registerKptValidation({ kpt, data, successInterceptor }) {
		// @kpt_validation - register - check if LIMIT_STUDENT_JPATC
		return graphql(` query{cf(name:"JPATC") { total_student } } `).then((res) => {
			try {
				let total_student = res.data.data.cf.total_student;
				if (total_student && total_student >= LIMIT_STUDENT_JPATC) {
					return AuthAPIErr.JPA_OVER_LIMIT;
				}
			} catch (err) { }

			// @kpt_validation - register - check if JPA
			return graphql(` query{is_kpt_jpa(kpt:"${kpt}")} `).then((res) => {
				let isKptJpa = res.data.data.is_kpt_jpa;
				if (isKptJpa !== 1) {
					return AuthAPIErr.KPT_NOT_JPA;
				}
				// @kpt_validation - register - check if duplicate
				return graphql(`query{user(kpt:"${kpt}"){kpt}}`).then((res) => {
					try {
						if (res.data.data.user.kpt) {
							// @kpt_validation - register - KPT_ALREADY_EXIST
							return AuthAPIErr.KPT_ALREADY_EXIST;
						}
					} catch (err) { }
					return getWpAjaxAxios("app_register_user", data, successInterceptor);
				});
			});
		});
	}

	registerIdUtmValidation({ id_utm, cf, data, successInterceptor }) {

		// @id_utm_validation - register - check if JPA
		return graphql(` query{is_id_utm(id_utm:"${id_utm}", cf:"${cf}")} `).then((res) => {
			let isValid = res.data.data.is_id_utm;
			if (isValid !== 1) {
				// @id_utm_validation - register - ID_UTM_NOT_VALID
				return AuthAPIErr.ID_UTM_NOT_VALID;
			}
			// @id_utm_validation - register - check if duplicate
			return graphql(`query{user(id_utm:"${id_utm}", cf: "${cf}" ){${getIdUtmKey(cf)}}}`).then((res) => {
				try {
					if (res.data.data.user[getIdUtmKey(cf)]) {
						// @id_utm_validation - register - ID_UTM_ALREADY_EXIST
						return AuthAPIErr.ID_UTM_ALREADY_EXIST;
					}
				} catch (err) { }
				return getWpAjaxAxios("app_register_user", data, successInterceptor);
			});
		});
	}
}

AuthAPI = new AuthAPI();

//test
//AuthAPI.set_password(1, "gundamseed21");

module.exports = {
	AuthAPI,
	AuthAPIErr,
	getIdUtmTable,
	getIdUtmKey
};