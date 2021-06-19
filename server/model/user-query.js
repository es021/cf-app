const DB = require("./DB.js");
const { getIdUtmTable, getIdUtmKey } = require("../api/auth-api");
const {
	User,
	UserMeta,
	UserEnum,
	QueueEnum,
	PrescreenEnum,
	Availability,
	Prescreen,
	GroupSessionJoin,
	SessionEnum,
	SessionRequest,
	SessionRequestEnum,
	VideoEnum
} = require("../../config/db-config.js");
const {
	RequiredFieldStudent,
	Multi,
	Single
} = require("../../config/registration-config");

const {
	DocLinkExec
} = require("./doclink-query.js");
const {
	SkillExec
} = require("./skill-query.js");

// @login_by_student_id
class UserQuery {
	isRoleStudent(uid) {
		return ` (select mm2.meta_value 
			FROM wp_cf_usermeta mm2 
			WHERE 1=1
			AND mm2.user_id = ${uid} 
			AND mm2.meta_key = "wp_cf_capabilities") = 'a:1:{s:7:"student";b:1;}'`;
	}
	selectMultiMain(table_name, user_id, {
		isConcatVal,
		isCountVal,
		inWhere
	}) {
		let sel = "";
		if (isConcatVal) {
			sel = `GROUP_CONCAT(m.val SEPARATOR ':: ')`;
		} else if (isCountVal) {
			sel = `COUNT(m.val)`
		} else {
			sel = `m.val`;
		}
		inWhere = typeof inWhere === "undefined" ? "1=1" : `val IN ${inWhere}`;
		return `select ${sel} from multi_${table_name} m 
      where 1=1
      and ${inWhere}
      and m.entity_id = ${user_id} 
      and m.entity = 'user'`;
	}
	selectSingleMain(user_id, key_input) {
		return `select s.val from single_input s where s.entity_id = ${user_id} 
		and s.entity = 'user' 
		and s.key_input = '${key_input}'`;
	}
	getSearchMulti(table_name, field, search_params) {
		if (typeof search_params !== "undefined") {
			return `(${this.selectMultiMain(table_name, field, {
				isConcatVal: true
			})}) LIKE '%${search_params}%' `;
		} else {
			return "1=1";
		}
	}
	getSearchInterested(user_id, entity, entity_id, search_params) {
		if (search_params === "1") {
			let qIn = `select i.is_interested from interested i 
				where i.entity = '${entity}' 
				and i.entity_id = ${entity_id} 
				and i.user_id = ${user_id}
				`;
			return ` 1 IN (${qIn})`;
		} else {
			return "1=1";
		}
	}
	// getSearchInterested(user_id, entity, entity_id, search_params, recruiter_id = null) {
	// 	if (search_params === "1") {
	// 		let qIn = `select i.is_interested from interested i 
	// 			where i.entity = '${entity}' 
	// 			and i.entity_id = ${entity_id} 
	// 			and i.user_id = ${user_id}
	// 			${recruiter_id ? `and i.recruiter_id = ${recruiter_id}` : ''}
	// 			`;
	// 		return ` 1 IN (${qIn})`;
	// 	} else {
	// 		return "1=1";
	// 	}
	// }
	getSearchGradeCategory(key_input, user_id, search_params) {
		if (!search_params) {
			return "1=1";
		}

		// let val  = `CONVERT(REPLACE(REPLACE(s.val,'CGPA',''),':',''), DOUBLE)`;
		let val = `s.val`;
		let q = `(SELECT s.val FROM 
        single_input s, ref_grade_category r
        where r.val = '${search_params}'
        and s.key_input = '${key_input}'
        and s.entity = 'user' 
        and s.entity_id = ${user_id}
        and 
        (
            (${val} >= r.start_val and ${val} < r.end_val) 
          or
            s.val like CONCAT('%', r.keyword, '%')
        )) IS NOT NULL`;

		return q;
	}
	getSearchSingle(key_input, field, search_params) {
		if (typeof search_params !== "undefined") {
			return `(${this.selectSingleMain(
				field,
				key_input
			)}) LIKE '%${search_params}%' `;
		} else {
			return "1=1";
		}
	}
	getSearchMeta(field, search_params, meta_key) {
		if (typeof search_params !== "undefined") {
			return `(${this.selectMetaMain(
				field,
				meta_key
			)}) like '%${search_params}%'`;
		} else {
			return "1=1";
		}
	}
	getSearchWorkAvailability(field, av_month, av_year) {
		if (typeof av_month === "undefined" || typeof av_year === "undefined") {
			return "1=1";
		}

		return `CONCAT((${this.selectMetaMain(field, UserMeta.AVAILABLE_YEAR)}),
                (${this.selectMetaMain(field, UserMeta.AVAILABLE_MONTH)}))
                <= '${av_year}${av_month}'`;
	}

	getSearchLookingFor(field, search_params) {
		return this.getSearchMeta(field, search_params, UserMeta.LOOKING_FOR);
	}

	getSearchUniversity(field, search_params) {
		return this.getSearchMeta(field, search_params, UserMeta.UNIVERSITY);
	}

	getSearchMajor(field, search_params) {
		return this.getSearchMeta(field, search_params, UserMeta.MAJOR);
	}

	getSearchStudyPlace(field, search_params) {
		return this.getSearchMeta(field, search_params, UserMeta.STUDY_PLACE);
	}

	getSearchMinor(field, search_params) {
		return this.getSearchMeta(field, search_params, UserMeta.MINOR);
	}

	getSearchName(field, search_params) {
		// return `CONCAT((${this.selectMetaMain(field, UserMeta.FIRST_NAME)}),
		//             (${this.selectMetaMain(field, UserMeta.LAST_NAME)}))
		//             like '%${search_params}%'`;
		return `CONCAT((${this.selectSingleMain(field, "first_name")}),
                  (${this.selectSingleMain(field, "last_name")}))
                  like '%${search_params}%'`;
	}

	getSearchEmail(field, search_params) {
		return `(${this.selectUserField(
			field,
			User.EMAIL
		)} limit 0,1) like '%${search_params}%'`;
	}

	getSearchNameOrEmail(field, search_name, search_email) {
		var name =
			typeof search_name === "undefined" ?
				"" :
				this.getSearchName(field, search_name);
		var email =
			typeof search_email === "undefined" ?
				"" :
				this.getSearchEmail(field, search_email);
		if (name == "" && email == "") {
			return `1=1`;
		} else if (name == "" && email != "") {
			return email;
		} else if (name != "" && email == "") {
			return name;
		} else {
			return `(${name} or ${email})`;
		}
	}

	getSearchQuery(params) {
		var query = "";

		// external search query ------------------------------------------
		// both is injected
		var name =
			typeof params.search_user === "undefined" ?
				"" :
				`CONCAT((${this.selectMetaMain("u.ID", UserMeta.FIRST_NAME)}),' ',
            (${this.selectMetaMain("u.ID", UserMeta.LAST_NAME)}))
            like '%${params.search_user}%'`;

		var email =
			typeof params.search_user === "undefined" ?
				"" :
				`u.${User.EMAIL} like '%${params.search_user}%'`;

		if (name != "" && email != "") {
			query += `and (${name} or ${email})`;
		}

		// has feedback?
		if (typeof params.has_feedback !== "undefined" && params.has_feedback) {
			var feedbackMeta = `(${this.selectMetaMain("u.ID", UserMeta.FEEDBACK)})`;
			query += `and (${feedbackMeta} != '' AND ${feedbackMeta} IS NOT NULL)`;
		}

		// search degree
		query +=
			typeof params.search_degree === "undefined" ?
				"" :
				` and CONCAT((${this.selectMetaMain("u.ID", UserMeta.MAJOR)}),
            (${this.selectMetaMain("u.ID", UserMeta.MINOR)}))
            like '%${params.search_degree}%'`;

		// search university
		query +=
			typeof params.search_university === "undefined" ?
				"" :
				` and (${this.selectMetaMain("u.ID", UserMeta.UNIVERSITY)}) like '%${params.search_university
				}%'`;

		return query;
	}
	// meta_cons = {
	//  key: "value"
	//  }
	getUser(field, params, meta_cons) {
		//// console.log(params);
		// create basic conditions
		var id_condition =
			typeof params.ID !== "undefined" ? `u.ID = ${params.ID}` : `1=1`;

		var email_condition =
			typeof params.user_email !== "undefined" ?
				`u.user_email = '${params.user_email}'` :
				`1=1`;

		// @kpt_validation
		var kpt_condition =
			typeof params.kpt !== "undefined" ?
				`(${this.selectSingleMain("u.ID", UserMeta.KPT)}) = '${params.kpt}' ` :
				`1=1`;

		// @id_utm_validation
		var id_utm_condition =
			typeof params.id_utm !== "undefined" ?
				`(${this.selectSingleMain("u.ID", getIdUtmKey(params.cf))}) = '${params.id_utm}' ` :
				`1=1`;

		var role_condition =
			typeof params.role !== "undefined" ?
				`(${this.selectMetaMain("u.ID", UserMeta.ROLE)}) LIKE '%${params.role
				}%' ` :
				`1=1`;
		var order_by =
			typeof params.order_by !== "undefined" ?
				`order by u.${params.order_by}` :
				`order by u.${User.ID} desc`;

		var cf_where =
			typeof params.cf === "undefined" ?
				"1=1" :
				`(${DB.cfMapSelect("user", "u.ID", params.cf)}) = '${params.cf}'`;

		// var new_only_where = (typeof params.new_only === "undefined" || !params.new_only) ? "1=1" :
		//     `u.ID in (SELECT distinct l.user_id
		//         FROM logs l, wp_cf_users ux
		//         where 1=1
		//         and l.user_id = ux.ID
		//         and l.event = 'login'
		//         and ux.user_email not like '%test%')`;

		var new_only_where =
			typeof params.new_only === "undefined" || !params.new_only ?
				"1=1" :
				`u.user_email not like '%test.%'`;

		// add meta condition
		var meta_condition = " 1=1 ";
		var i = 0;
		if (typeof meta_cons !== "undefined") {
			meta_condition = "";
			for (var key in meta_cons) {
				if (i > 0) {
					meta_condition += " AND ";
				}
				meta_condition += `(${this.selectMetaMain("u.ID", key)}) = '${meta_cons[key]
					}' `;
				i++;
			}
		}

		// set limit
		var limit = DB.prepareLimit(params.page, params.offset);

		// create meta selection
		var meta_sel = "\n";
		for (var k in UserMeta) {
			var meta_key = k.toLowerCase();
			if (typeof field[meta_key] !== "undefined") {
				// KALAU TAKDE DALAM SINGLE BARU AMIK DARI META NI
				if (typeof Single[meta_key] === "undefined") {
					meta_sel += `, ${this.selectMeta("u.ID", UserMeta[k], meta_key)} \n`;
				}
			}
		}

		// create single selection
		for (var k in Single) {
			var key_input = Single[k];
			if (typeof field[key_input] !== "undefined") {
				meta_sel += `, (${this.selectSingleMain(
					"u.ID",
					key_input
				)}) as ${key_input} \n`;
			}
		}

		// @kpt_validation
		let is_kpt_jpa_sel = "";
		if (field["is_kpt_jpa"]) {
			is_kpt_jpa_sel = `, (select rkj.val from ref_kpt_jpa rkj 
					where val = (${this.selectSingleMain("u.ID", "kpt")})
				) as is_kpt_jpa `
		}

		// @id_utm_validation
		let is_id_utm_sel = "";
		if (field["is_id_utm"]) {
			is_id_utm_sel = `, (select rkj.val from ${getIdUtmTable(params.cf_to_check_id_utm)} rkj 
					where val = (${this.selectSingleMain("u.ID", getIdUtmKey(params.cf_to_check_id_utm))})
				) as is_id_utm `
		}

		let cf_register_at_sel = "";
		if (params["cf_to_check_registration"]) {
			cf_register_at_sel = `
			, (
				SELECT CONCAT( DATE_FORMAT( CONVERT_TZ( cm.created_at, 'SYSTEM', '+08:00'), '%Y-%m-%d %H:%i:%s'), " (MYT)")
				FROM cf_map cm
				WHERE 1=1
				AND cm.cf = "${params["cf_to_check_registration"]}"
				AND cm.entity = 'user'
				AND cm.entity_id = u.ID
			) as cf_registered_at
			`
		}

		// @kpt_validation
		var sql = `SELECT u.* ${meta_sel} ${is_kpt_jpa_sel} ${is_id_utm_sel} ${cf_register_at_sel}
           FROM wp_cf_users u WHERE 1=1 ${this.getSearchQuery(params)}
		   AND ${id_condition} AND ${meta_condition} AND ${kpt_condition} AND ${id_utm_condition}
           AND ${email_condition} AND ${role_condition} 
           AND ${cf_where} AND ${new_only_where}
           ${order_by} ${limit} `;

		// // console.log(sql);
		// // console.log(sql);
		// // console.log(sql);

		return sql;
	}



	selectRole(user_id, meta_key, as) {
		return `(select SUBSTRING_INDEX(SUBSTRING_INDEX((${this.selectMetaMain(
			user_id,
			meta_key
		)}),'\"',2),'\"',-1)) as ${as}`;
	}

	selectUserField(user_id, field) {
		return `select u.${field} from wp_cf_users u where u.ID = ${user_id}`;
	}

	selectMetaMain(user_id, meta_key) {
		return `select m.meta_value from wp_cf_usermeta m where m.user_id = ${user_id} and m.meta_key = '${meta_key}' order by umeta_id desc limit 0,1`;
	}

	selectMeta(user_id, meta_key, as) {
		as = typeof as === "undefined" ? meta_key : as;

		if (meta_key === UserMeta.ROLE) {
			return this.selectRole(user_id, meta_key, as);
		}

		return `(${this.selectMetaMain(user_id, meta_key)}) as ${as}`;
	}
}
UserQuery = new UserQuery();

class UserExec {
	hasFeedback(user_id) {
		var sql = `select 
		(${UserQuery.selectMetaMain(user_id, "feedback")}) as feedback,
		(${UserQuery.selectMetaMain(user_id, "has_feedback_external")}) as has_feedback_external`;
		return DB.query(sql).then(res => {
			try {
				var feedback = res[0].feedback;
				if (
					feedback != "" &&
					feedback != null &&
					typeof feedback !== "undefined"
				) {
					return 1;
				}

				var has_feedback_external = res[0].has_feedback_external;
				if (
					has_feedback_external != "" &&
					has_feedback_external != null &&
					typeof has_feedback_external !== "undefined"
				) {
					return 1;
				}

			} catch (err) { }
			return 0;
		});
	}

	updateUserMeta(user_id, data) {
		var meta_key_in = "";
		var meta_pair_case = "";

		//to check not exist user meta
		var meta_key = [];

		for (var k in data) {
			meta_key.push(k);
			meta_key_in += `'${k}',`;
			meta_pair_case += ` WHEN '${k}' THEN '${DB.escStr(data[k])}' `;
		}

		var where = `WHERE meta_key IN (${meta_key_in.slice(
			0,
			-1
		)}) and user_id = '${user_id}'`;

		var check_sql = `SELECT * FROM wp_cf_usermeta ${where}`;

		var update_sql = `UPDATE wp_cf_usermeta
            SET meta_value = CASE meta_key 
            ${meta_pair_case} 
            END ${where}`;

		//check what does not exist
		return DB.query(check_sql).then(res => {
			var key_check = res.map((d, i) => d["meta_key"]);

			//insert what does not exist
			var insert_val = "";
			meta_key.map((d, i) => {
				if (key_check.indexOf(d) <= -1) {
					insert_val += `('${user_id}','${d}','${DB.escStr(data[d])}'),`;
				}
			});

			if (insert_val !== "") {
				var insert_sql = `INSERT INTO wp_cf_usermeta (user_id,meta_key,meta_value) VALUES ${insert_val.slice(
					0,
					-1
				)}`;

				return DB.query(insert_sql).then(res => {
					//only then update what's left
					return DB.query(update_sql);
				});
			}
			// if not need to insert just update
			else {
				return DB.query(update_sql);
			}
		});
	}

	// @kpt_validation
	isKptJpa(kpt) {
		let sql = `select rkj.val from ref_kpt_jpa rkj where val = "${kpt}"`;
		return DB.query(sql).then((res) => {
			try {
				if (res[0].val) {
					return 1;
				}
			} catch (err) { };
			return 0;
		});
	}

	// @id_utm_validation
	isIdUtm(v, cf) {
		let sql = `select xx.val from ${getIdUtmTable(cf)} xx where xx.val = "${v}"`;
		return DB.query(sql).then((res) => {
			try {
				if (res[0].val) {
					return 1;
				}
			} catch (err) { };
			return 0;
		});
	}

	editUser(arg) {
		var ID = arg.ID;

		//update User table
		var updateUser = {
			trigger_update: new Date().getTime() // this is needed to trigger updated at
		};
		var updateUserMeta = {};
		//// console.log(arg);

		var userVal = Object.keys(User).map(function (key) {
			return User[key];
		});

		var userMetaVal = Object.keys(UserMeta).map(function (key) {
			return UserMeta[key];
		});

		for (var k in arg) {
			var v = arg[k];

			//change key here
			//handle for image props
			if (k === "img_url") {
				k = UserMeta.IMG_URL;
			}
			if (k === "img_size") {
				k = UserMeta.IMG_SIZE;
			}
			if (k === "img_pos") {
				k = UserMeta.IMG_POS;
			}

			if (userVal.indexOf(k) > -1) {
				updateUser[k] = v;
			}

			if (userMetaVal.indexOf(k) > -1) {
				updateUserMeta[k] = v;
			}

			if (k == "wp_cf_capabilities") {
				if (v == "recruiter") {
					v = "a:1:{s:9:\"recruiter\";b:1;}";
				}
				updateUserMeta[k] = v;
			}
		}

		// //update both
		// // console.log("update both");
		return DB.update(User.TABLE, updateUser).then(res => {
			if (Object.keys(updateUserMeta).length >= 1) {
				return this.updateUserMeta(ID, updateUserMeta);
			} else {
				return res;
			}
		});
	}
	getUserHelper(type, params, field, metaCons) {
		const {
			CompanyExec
		} = require("./company-query.js");
		const {
			QueueExec
		} = require("./queue-query.js");
		const {
			PrescreenExec
		} = require("./prescreen-query.js");
		const {
			ZoomExec
		} = require("./zoom-query.js");
		const {
			SessionExec
		} = require("./session-query.js");
		const {
			SessionRequestExec
		} = require("./session-request-query.js");
		const {
			GroupSessionExec
		} = require("./group-session-query.js");
		const {
			AvailabilityExec
		} = require("./availability-query.js");
		const {
			MultiExec
		} = require("./multi-query.js");
		const {
			VideoExec
		} = require("./video-query.js");
		const {
			InterestedExec
		} = require("./interested-query.js");
		const {
			VacancyExec
		} = require("./vacancy-query");
		// const {
		// 	SingleExec
		// } = require("./single-query");

		// extra field that need role value to find
		if (
			field["sessions"] !== "undefined" ||
			field["queues"] !== "undefined" ||
			field["prescreens"] !== "undefined" ||
			field["registered_prescreens"] !== "undefined"
		) {
			field["role"] = 1;
			field["rec_company"] = 1;
		}

		if (field["is_active"] !== "undefined") {
			field["user_status"] = 1;
		}

		// if (field["is_profile_completed"] !== "undefined") {
		//   for (var i in RequiredFieldStudent) {
		//     field[RequiredFieldStudent[i]] = 1;
		//   }
		// }

		var isSingle = type === "single";
		var sql = "";
		if (isSingle) {
			sql = UserQuery.getUser(field, params, metaCons);
		} else {
			sql = UserQuery.getUser(field, params, metaCons);
		}

		// // console.log("[UserExec]", sql);

		var toRet = DB.query(sql).then(function (res) {
			for (var i in res) {
				var user_id = res[i]["ID"];
				var company_id = res[i]["rec_company"];
				var role = res[i]["role"];
				var user_status = res[i]["user_status"];

				// add single field
				// for (var si in Single) {
				//   let key = Single[si];
				//   if (typeof field[key] !== "undefined") {
				//     // console.log("Exec single ", key)
				//     res[i][key] = SingleExec.single(
				//       {
				//         key_input: key,
				//         entity: "user",
				//         entity_id: user_id,
				//         valOnly: true
				//       },
				//       field[key]
				//     );
				//   }
				// }

				// add multi field
				for (var mi in Multi) {
					let key = Multi[mi];
					if (typeof field[key] !== "undefined") {
						res[i][key] = MultiExec.list({
							table_name: key,
							entity: "user",
							entity_id: user_id
						},
							field[key]
						);
					}
				}

				// student_listing_interested ****************************************************
				if (typeof field["student_listing_interested"] !== "undefined") {
					res[i]["student_listing_interested"] = InterestedExec.single({
						user_id: params.company_id,
						entity: "student_listing",
						entity_id: user_id
					},
						field["student_listing_interested"]
					);
				}

				// is_profile_completed ****************************************************
				if (field["is_profile_completed"] !== "undefined") {
					res[i]["is_profile_completed"] = true;
					// kalau ada yang required tak isi trus false
					// for (var j in RequiredFieldStudent) {
					//   var reqKey = RequiredFieldStudent[j];
					//   var reqVal = res[i][reqKey];
					//   if (reqVal == null || reqVal == "") {
					//     //// console.log(reqKey)
					//     res[i]["is_profile_completed"] = false;
					//     break;
					//   }
					// }
				}

				// is_active ****************************************************
				if (field["video_resume"] !== "undefined") {
					let p = {
						entity: "user",
						entity_id: user_id,
						meta_key: VideoEnum.RESUME
					};
					res[i]["video_resume"] = VideoExec.single(p, field["video_resume"]);
				}

				// is_active ****************************************************
				if (field["is_active"] !== "undefined") {
					res[i]["is_active"] = user_status == UserEnum.STATUS_ACT;
				}

				// Cf ****************************************************
				if (typeof field["cf"] !== "undefined") {
					res[i]["cf"] = DB.getCF("user", user_id);
				}

				// group_session_joins ****************************************************
				if (typeof field["group_session_joins"] !== "undefined") {
					var par = {};
					par[GroupSessionJoin.USER_ID] = user_id;
					res[i]["group_session_joins"] = GroupSessionExec.group_session_joins(
						par,
						field["group_session_joins"]
					);
				}

				// group_sessions ****************************************************
				if (typeof field["group_sessions"] !== "undefined") {
					var par = {};
					par["user_id"] = user_id;

					par["discard_removed"] = true;
					par["discard_removed_user_id"] = user_id;

					// order yg join url ada dulu, then by expired
					par["order_by"] =
						"main.is_expired asc, main.is_canceled asc, main.join_url desc";
					res[i]["group_sessions"] = GroupSessionExec.group_sessions(
						par,
						field["group_sessions"]
					);
				}

				// sessions ****************************************************
				if (typeof field["sessions"] !== "undefined") {
					var par = {
						status: [SessionEnum.STATUS_ACTIVE, SessionEnum.STATUS_NEW]
					};
					if (role === UserEnum.ROLE_STUDENT) {
						par["participant_id"] = user_id;
					}
					if (role === UserEnum.ROLE_RECRUITER) {
						par["host_id"] = user_id;
					}

					res[i]["sessions"] = SessionExec.sessions(par, field["sessions"]);
				}

				// zoom_invites ****************************************************
				if (typeof field["zoom_invites"] !== "undefined") {
					var par = {
						is_expired: false,
						user_id: user_id
					};
					res[i]["zoom_invites"] = ZoomExec.zoom_invites(
						par,
						field["zoom_invites"]
					);
				}

				// session_requests ****************************************************
				if (typeof field["session_requests"] !== "undefined") {
					// list all pending and then all rejected
					var par = {
						order_by: `${SessionRequest.STATUS}, ${SessionRequest.CREATED_AT} asc`
					};

					if (role === UserEnum.ROLE_STUDENT) {
						//par["status"] = [SessionRequestEnum.STATUS_PENDING, SessionRequestEnum.STATUS_REJECTED];
						par["status"] = [SessionRequestEnum.STATUS_PENDING];
						par["student_id"] = user_id;
					}
					if (role === UserEnum.ROLE_RECRUITER) {
						par["status"] = [SessionRequestEnum.STATUS_PENDING];
						par["company_id"] = company_id;
					}

					res[i]["session_requests"] = SessionRequestExec.session_requests(
						par,
						field["session_requests"]
					);
				}

				// queues ****************************************************
				if (typeof field["queues"] !== "undefined") {
					var par = {
						status: QueueEnum.STATUS_QUEUING
					};
					if (role === UserEnum.ROLE_STUDENT) {
						par["student_id"] = user_id;
					}
					if (role === UserEnum.ROLE_RECRUITER) {
						par["company_id"] = company_id;
					}

					res[i]["queues"] = QueueExec.queues(par, field["queues"]);
				}

				// booked_at ****************************************************
				if (
					typeof field["booked_at"] !== "undefined" &&
					typeof params.company_id !== "undefined"
				) {
					var par = {};
					// this company_id come from student-listing exec
					par[Availability.COMPANY_ID] = params.company_id;
					par[Availability.IS_BOOKED] = 1;
					par[Availability.USER_ID] = user_id;
					par["is_for_booked_at"] = true;
					par["order_by"] = "av.timestamp desc";
					res[i]["booked_at"] = AvailabilityExec.availabilities(
						par,
						field["booked_at"]
					);
				}

				// prescreens_by_company ****************************************************
				if (
					typeof field["prescreens_for_student_listing"] !== "undefined" &&
					typeof params.company_id !== "undefined"
				) {
					var par = {
						status: PrescreenEnum.STATUS_WAIT_CONFIRM,
						status_2: PrescreenEnum.STATUS_APPROVED,
						status_3: PrescreenEnum.STATUS_STARTED,
						order_by: `${Prescreen.STATUS} asc, ${Prescreen.APPNMENT_TIME} asc`,
						discard_removed: true,
						discard_removed_user_id: user_id,
						student_id: user_id,
						company_id: params.company_id
					};
					res[i]["prescreens_for_student_listing"] = PrescreenExec.prescreens(
						par,
						field["prescreens_for_student_listing"]
					);
				}

				// interested_vacancies_by_company ****************************************************
				if (
					typeof field["interested_vacancies_by_company"] !== "undefined" &&
					typeof params.company_id !== "undefined"
				) {
					res[i]["interested_vacancies_by_company"] = VacancyExec.vacancies({
						interested_user_id: user_id,
						company_id: params.company_id
					},
						field["interested_vacancies_by_company"]
					);
				}

				// prescreens ****************************************************
				if (typeof field["prescreens"] !== "undefined") {
					// New SI Flow
					var par = {
						status: PrescreenEnum.STATUS_WAIT_CONFIRM,
						status_2: PrescreenEnum.STATUS_APPROVED,
						status_3: PrescreenEnum.STATUS_REJECTED,
						status_4: PrescreenEnum.STATUS_STARTED,
						status_5: PrescreenEnum.STATUS_ENDED,
						status_6: PrescreenEnum.STATUS_RESCHEDULE,
						status_7: PrescreenEnum.STATUS_CANCEL,
						// order_by: `${Prescreen.STATUS} asc, ${Prescreen.APPNMENT_TIME} asc`,
						discard_removed: true,
						discard_removed_user_id: user_id
					};
					
					if (role === UserEnum.ROLE_STUDENT) {
						par["student_id"] = user_id;
						par["order_by"] = `${Prescreen.STATUS} asc, ${Prescreen.APPNMENT_TIME} asc`
					}
					if (role === UserEnum.ROLE_RECRUITER) {
						par["company_id"] = company_id;
						par["order_by"] = `${Prescreen.APPNMENT_TIME} desc`
					}

					res[i]["prescreens"] = PrescreenExec.prescreens(
						par,
						field["prescreens"]
					);
				}

				// registered_prescreens ****************************************************
				if (typeof field["registered_prescreens"] !== "undefined") {
					var par = {};
					if (role === UserEnum.ROLE_STUDENT) {
						par["student_id"] = user_id;
					}
					if (role === UserEnum.ROLE_RECRUITER) {
						par["company_id"] = company_id;
					}

					res[i]["registered_prescreens"] = PrescreenExec.prescreens(
						par,
						field["registered_prescreens"]
					);
				}

				// company ****************************************************
				if (typeof field["company"] !== "undefined") {
					res[i]["company"] = CompanyExec.company(company_id, field["company"]);
				}

				// doc_links ****************************************************
				if (typeof field["doc_links"] !== "undefined") {
					res[i]["doc_links"] = DocLinkExec.doc_links({
						user_id: user_id,
						order_by: "label"
					},
						field["doc_links"]
					);
				}

				// skills ****************************************************
				if (typeof field["skills"] !== "undefined") {
					res[i]["skills"] = SkillExec.skills({
						user_id: user_id
					},
						field["skills"]
					);
				}
			}

			if (type === "single") {
				return res[0];
			} else {
				return res;
			}
		});

		return toRet;
	}
	recruiters(company_id, field) {
		var metaCons = {};
		metaCons[UserMeta.REC_COMPANY] = company_id;
		return this.getUserHelper(false, {}, field, metaCons);
	}

	user(params, field) {
		return this.getUserHelper("single", params, field);
	}

	users(params, field) {
		return this.getUserHelper(false, params, field);
	}
}
UserExec = new UserExec();

module.exports = {
	UserExec,
	UserQuery
};