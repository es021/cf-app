const {
	graphql,
	getAxiosGraphQLQuery,
	getPHPApiAxios,
	getWpAjaxAxios,
	postAxios
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
		// else if (role == UserEnum.ROLE_ORGANIZER) {
		//   return user[User.CF].indexOf(cf) >= 0;
		// }
		else if (role == UserEnum.ROLE_RECRUITER) {
			if (user.company) {
				return user.company.cf.indexOf(cf) >= 0;
			} else {
				return false;
			}
		} else {
			return (
				role == UserEnum.ROLE_VOLUNTEER ||
				role == UserEnum.ROLE_ORGANIZER ||
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
	login(user_email, password, cf, request) {
		var field = "";
		AuthUserKey.map((d, i) => {
			field += `${d},`;
		});
		field = field.slice(0, -1);
		//console.log(field);
		var user_query = `query{
            user(user_email:"${user_email}"){
                ${field} company {cf name recruiters 
                    {ID user_email first_name last_name}}
            }}`;

		return getAxiosGraphQLQuery(user_query).then(
			res => {
				var user = res.data.data.user;
				if (user !== null) {



					//check if active
					// FIX 2019 - remove filter not active
					// if (user.user_status === UserEnum.STATUS_NOT_ACT) {
					//     return AuthAPIErr.NOT_ACTIVE;
					// }

					//check password
					var pass_params = {
						action: "check_password",
						password: password,
						hashed: user.user_pass
					};
					return getPHPApiAxios("password_hash", pass_params).then(
						res => {
							//password match -- cannot use === operator
							//console.log(res);

							// check if password corrent
							if (res.data == "1") {
								// check if valid cf
								if (!this.isCFValid(user, cf)) {
									return AuthAPIErr.INVALID_CF;
								} else {

									// @kpt_validation
									if (registrationConfig.isDoJpaKptValidation(cf)) {
										if (!user.kpt) {
											// @kpt_validation - KPT_NOT_FOUND_IN_USER_RECORD
											return AuthAPIErr.KPT_NOT_FOUND_IN_USER_RECORD;
										} else {
											// **** TODO **** @kpt_validation - KPT_NOT_JPA
											return AuthAPIErr.KPT_NOT_JPA;
										}
									}

									//delete (user[User.PASSWORD]);

									user[User.PASSWORD] = user[User.PASSWORD].replaceAll("/", "");

									//delete (user["company"]);
									user[User.CF] = cf;
									//get cf object here
									//user["cf_object"] = {};

									// success login here

									try {
										var logData = request.get("User-Agent");
										LogApi.add(LogEnum.EVENT_LOGIN, logData, user.ID);
									} catch (err) {
										//console.log(err);
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

						return postAxios(EmailPhpAdmin, email_data).then(res => {
							console.log("[password_reset_request success]", res);
							return {
								status: 1,
								res: res
							};
						}).catch(error => {
							console.log("[password_reset_request error]", error);
							return {
								status: 0,
								error: error
							};
						});

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

	//raw form from sign up page
	register(user) {
		//separate userdata and usermeta

		//get cf
		var cf = user[User.CF];
		delete user[User.CF];

		// @kpt_validation
		var kpt = user[UserMeta.KPT];

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

		const addToSingleInput = (data, user, key) => {
			let userId = data[User.ID];
			var q = `mutation{
                add_single(key_input:"${key}", 
                entity:"user", 
                entity_id:${userId}
                val:"${user[key]}"
                ) { ID }}`;
			getAxiosGraphQLQuery(q);
		};

		const successInterceptor = data => {
			let userId = data[User.ID];

			// add first name and last name at single_input
			addToSingleInput(data, user, Single.first_name);
			addToSingleInput(data, user, Single.last_name);

			// update cf
			var cf_sql = `mutation{
                edit_user(ID:${userId}, cf:"${cf}") {cf}}`;
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

		// @kpt_validation
		if (kpt) {
			return graphql(`query{user(kpt:"${kpt}"){kpt}}`).then((res) => {
				try {
					console.log("@kpt_validation", res.data.data)
					if (res.data.data.user.kpt) {
						// @kpt_validation - KPT_ALREADY_EXIST
						return AuthAPIErr.KPT_ALREADY_EXIST;
					}
				} catch (err) { }
				return getWpAjaxAxios("app_register_user", data, successInterceptor);
			});
		} else {
			return getWpAjaxAxios("app_register_user", data, successInterceptor);
		}

	}
}

AuthAPI = new AuthAPI();

//test
//AuthAPI.set_password(1, "gundamseed21");

module.exports = {
	AuthAPI,
	AuthAPIErr
};