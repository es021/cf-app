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
	"img_size"
];

const AuthAPIErr = {
	WRONG_PASS: "WRONG_PASS",
	INVALID_EMAIL: "INVALID_EMAIL",
	NOT_ACTIVE: "NOT_ACTIVE",
	INVALID_ACTIVATION: "INVALID_ACTIVATION",
	INVALID_CF: "INVALID_CF",
	TOKEN_INVALID: "TOKEN_INVALID",
	TOKEN_EXPIRED: "TOKEN_EXPIRED"
};

module.exports = {
    AuthUserKey,
    AuthAPIErr
};