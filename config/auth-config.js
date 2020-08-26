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
	// @kpt_validation
	"kpt",
	"is_kpt_jpa"
];

const AuthAPIErr = {
	WRONG_PASS: "WRONG_PASS",
	INVALID_EMAIL: "INVALID_EMAIL",
	NOT_ACTIVE: "NOT_ACTIVE",
	INVALID_ACTIVATION: "INVALID_ACTIVATION",
	INVALID_CF: "INVALID_CF",
	TOKEN_INVALID: "TOKEN_INVALID",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",

	// @kpt_validation
	JPA_OVER_LIMIT : "JPA_OVER_LIMIT",
	KPT_NOT_JPA: "KPT_NOT_JPA",
	KPT_ALREADY_EXIST: "KPT_ALREADY_EXIST",
	KPT_NOT_FOUND_IN_USER_RECORD: "KPT_NOT_FOUND_IN_USER_RECORD"
};

module.exports = {
	AuthUserKey,
	AuthAPIErr
};