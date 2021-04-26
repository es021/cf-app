const AuthUserKey = ["ID",
	"user_email",
	"user_pass",
	"user_status",
	"first_name",
	"last_name",
	"role",
	"rec_company",
	"cf",
	"img_url",
	"img_pos",
	"img_size",

	"kpt",// @kpt_validation
	"is_kpt_jpa",// @kpt_validation

	"id_utm",// @id_utm_validation
	"is_id_utm"// @id_utm_validation
];

const AuthAPIErr = {
	USERNAME_EXIST : "Sorry, that username already exists!",

	WRONG_PASS: "WRONG_PASS",
	INVALID_EMAIL: "INVALID_EMAIL",
	NOT_ACTIVE: "NOT_ACTIVE",
	INVALID_ACTIVATION: "INVALID_ACTIVATION",
	INVALID_CF: "INVALID_CF",
	TOKEN_INVALID: "TOKEN_INVALID",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
	USER_CANNOT_LOGIN: "USER_CANNOT_LOGIN",

	// @kpt_validation
	JPA_OVER_LIMIT: "JPA_OVER_LIMIT",
	KPT_NOT_JPA: "KPT_NOT_JPA",
	KPT_ALREADY_EXIST: "KPT_ALREADY_EXIST",
	KPT_NOT_FOUND_IN_USER_RECORD: "KPT_NOT_FOUND_IN_USER_RECORD",

	// @id_utm_validation
	ID_UTM_NOT_FOUND_IN_USER_RECORD: "ID_UTM_NOT_FOUND_IN_USER_RECORD",
	ID_UTM_NOT_VALID: "ID_UTM_NOT_VALID",
	ID_UTM_ALREADY_EXIST: "ID_UTM_ALREADY_EXIST"
};

module.exports = {
	AuthUserKey,
	AuthAPIErr
};