//import all type
const {
	DistinctType,
	FilterType,
	BrowseStudentType,
	UserType,
	CompanyType,
	QueueType,
	ResumeDropType,
	VacancyType,
	DashboardType,
	PrescreenType,
	SessionType,
	GlobalDatasetType,
	GlobalDatasetItemType,
	SessionRatingType,
	SessionNoteType,
	MessageType,
	AuditoriumType,
	EventType,
	PasswordResetType,
	MetaType,
	SupportSessionType,
	LogType,
	ForumCommentType,
	ForumReplyType,
	FeedbackQsType,
	SessionRequestType,
	ZoomInviteType,
	AvailabilityType,
	StudentListingType,
	GroupSessionJoinType,
	GroupSessionType,
	HallGalleryType,
	HallLobbyType,
	DocLinkType,
	VacancySuggestionType,
	CfsType,
	QsPopupType,
	QsPopupAnswerType,
	NotificationType,
	MultiType,
	SingleType,
	RefType,
	LocationType,
	InterestedType,
	CountType,
	VideoType,
	ZoomMeetingType,
	GroupCallType,
	GroupCallUserType,
	TagType,
	AnnouncementType,
	CompanyEmailType,
	ResumeDropLimitByCfType,
	QrCheckInType,
	QrScanType
} = require("./all-type.js");

const graphqlFields = require("graphql-fields");
//const { CFExec } = require('../model/cf-query.js');

//import all action for type
const {
	UserExec
} = require("../model/user-query.js");
const {
	Queue,
	QueueExec
} = require("../model/queue-query.js");
const {
	DashboardExec
} = require("../model/dashboard-query.js");
const {
	CompanyExec
} = require("../model/company-query.js");
const {
	PrescreenExec
} = require("../model/prescreen-query.js");
const {
	VacancyExec
} = require("../model/vacancy-query.js");
const {
	AvailabilityExec
} = require("../model/availability-query.js");
const {
	MetaExec
} = require("../model/meta-query.js");
const {
	LogExec
} = require("../model/log-query.js");
const {
	FeedbackQsExec
} = require("../model/feedback-qs-query.js");
const {
	SessionRequestExec
} = require("../model/session-request-query.js");
const {
	SupportSessionExec
} = require("../model/support-session-query.js");
const {
	ZoomExec
} = require("../model/zoom-query.js");
const {
	AuditoriumExec
} = require("../model/auditorium-query");
const {
	PasswordResetExec
} = require("../model/reset-password-query.js");
const {
	SessionExec,
	SessionNoteExec,
	SessionRatingExec
} = require("../model/session-query.js");
const {
	MessageExec
} = require("../model/message-query.js");
const {
	ResumeDropExec
} = require("../model/resume-drop-query.js");
const {
	ForumExec
} = require("../model/forum-query.js");
const {
	StudentListingExec
} = require("../model/student-listing-query.js");
const {
	GroupSessionExec
} = require("../model/group-session-query.js");
const {
	GlobalDatasetExec
} = require("../model/global-dataset-query.js");
const {
	GlobalDatasetItemExec
} = require("../model/global-dataset-item-query.js");
const {
	QsPopupExec
} = require("../model/qs-popup-query.js");
const {
	CFExec
} = require("../model/cf-query.js");
const {
	NotificationExec
} = require("../model/notification-query");
const {
	HallGalleryExec
} = require("../model/hall-gallery-query");
const {
	HallLobbyExec
} = require("../model/hall-lobby-query");
const {
	InterestedExec
} = require("../model/interested-query");
const {
	VideoExec
} = require("../model/video-query.js");
const {
	TagExec
} = require("../model/tag-query.js");
const {
	VacancySuggestionExec
} = require("../model/vacancy-suggestion-query.js");
const DB = require("../model/DB.js");
const {
	MultiExec
} = require("../model/multi-query.js");
const {
	SingleExec
} = require("../model/single-query.js");
const {
	RefExec
} = require("../model/ref-query.js");
const {
	LocationExec
} = require("../model/location-query.js");
const {
	EventExec
} = require("../model/event-query.js");
const {
	BrowseStudentExec
} = require("../model/browse-student-query.js");
const {
	ZoomMeetingExec
} = require("../model/zoom-meeting-query.js");
const {
	__
} = require("../../config/graphql-config");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLNonNull
} = require("graphql");
const { cfCustomFunnel } = require("../../config/cf-custom-config.js");
const { AnnouncementExec } = require("../model/announcement-query.js");
const { CompanyEmailExec } = require("../model/company-email-query.js");
const { GroupCallExec } = require("../model/group-call-query.js");
const { QrCheckInExec } = require("../model/qr-check-in-query.js");
const { QrScanExec } = require("../model/qr-scan-query.js");

__.String;
//------------------------------------------------------------------------------
// START CREATE FIELDS
var fields = {};

/*******************************************/
/*****  tag  **************/
fields["tags"] = {
	type: new GraphQLList(TagType),
	args: {
		entity: __.String,
		entity_id: __.Int,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return TagExec.list(arg, graphqlFields(info));
	}
};

fields["tag"] = {
	type: TagType,
	args: {
		ID: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return TagExec.single(arg, graphqlFields(info));
	}
};

/*******************************************/
/**** videos ***************/
fields["videos"] = {
	type: new GraphQLList(VideoType),
	args: {
		entity: __.String,
		entity_id: __.Int,
		meta_key: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return VideoExec.list(arg, graphqlFields(info));
	}
};

fields["video"] = {
	type: VideoType,
	args: {
		ID: __.Int,
		entity: __.String,
		entity_id: __.Int,
		meta_key: __.String
	},
	resolve(parentValue, arg, context, info) {
		return VideoExec.single(arg, graphqlFields(info));
	}
};

/*******************************************/
/* locations ******************/
fields["locations"] = {
	type: new GraphQLList(LocationType),
	args: {
		val: __.String,
		location_suggestion: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		// todo
		return LocationExec.list(arg, graphqlFields(info));
	}
};

/*******************************************/
/* refs ******************/
fields["refs"] = {
	type: new GraphQLList(RefType),
	args: {
		lang: __.String,
		table_name: __.StringNonNull,
		val: __.String,
		category: __.String,
		entity_id: __.Int,
		entity: __.String,

		// filter
		filter_raw: __.String,
		filter_column: __.String,
		filter_val: __.String,
		filter_find_id: __.Boolean,

		// get attribute multi/single
		multi_table_name: __.String,
		single_table_name: __.String,

		// pagination
		page: __.Int,
		offset: __.Int,
		order_by: __.String,

		// untuk dapatkan suggestion guna table refmap_suggestion
		location_suggestion: __.String,
		search_by_ref: __.String,
		search_by_val: __.String
	},
	resolve(parentValue, arg, context, info) {
		if (arg.table_name == "location_malaysia") {
			return LocationExec.list_malaysia(arg, graphqlFields(info));
		}
		else if (arg.table_name == "location") {
			return LocationExec.list(arg, graphqlFields(info));
		} else {
			return RefExec.list(arg, graphqlFields(info));
		}
	}
};
/*******************************************/
/* global_dataset ******************/
fields["global_dataset"] = {
	type: new GraphQLList(GlobalDatasetType),
	args: {
		ID: __.Int,
		cf: __.String,
		search: __.String,
		page: __.Int,
		offset: __.Int,
	},
	resolve(parentValue, arg, context, info) {
		return GlobalDatasetExec.list(arg, graphqlFields(info));
	}
};
/*******************************************/
/* global_dataset_item ******************/
fields["global_dataset_item"] = {
	type: new GraphQLList(GlobalDatasetItemType),
	args: {
		ID: __.Int,
		source: __.String,
		val: __.String,
		page: __.Int,
		offset: __.Int,
		order_by: __.String,
	},
	resolve(parentValue, arg, context, info) {
		return GlobalDatasetItemExec.list(arg, graphqlFields(info));
	}
};

/*******************************************/
/* interested ******************/
fields["interested_list"] = {
	type: new GraphQLList(InterestedType),
	args: {
		entity: __.String,
		current_user_id: __.Int, // to get is_seen
		entity_id: __.Int,
		is_interested: __.Int,
		user_cf: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return InterestedExec.list(arg, graphqlFields(info));
	}
};
fields["interested_count"] = {
	type: CountType,
	args: {
		is_interested: __.Int,
		entity: __.String,
		user_cf: __.String,
		entity_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return InterestedExec.count(arg, graphqlFields(info));
	}
};

/*******************************************/
/* multi ******************/
fields["single"] = {
	type: SingleType,
	args: {
		key_input: __.String,
		entity: __.String,
		entity_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return SingleExec.single(arg, graphqlFields(info));
	}
};

/*******************************************/
/* multi ******************/
fields["multis"] = {
	type: new GraphQLList(MultiType),
	args: {
		table_name: __.StringNonNull,
		ref_table_name: __.String,

		entity: __.String,
		entity_id: __.Int,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return MultiExec.list(arg, graphqlFields(info));
	}
};

/*******************************************/
/* vacancy_suggestions ******************/
fields["vacancy_suggestions"] = {
	type: new GraphQLList(VacancySuggestionType),
	args: {
		user_id: __.IntNonNull,
		cf: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return VacancySuggestionExec.list(arg, graphqlFields(info));
	}
};

/*******************************************/
/* hall_lobbies ******************/
const hallLobbyParam = {
	ID: __.Int,
	is_active: __.Int,
	cf: __.String,
	order_by: __.String,
	page: __.Int,
	offset: __.Int
}
fields["hall_lobbies"] = {
	type: new GraphQLList(HallLobbyType),
	args: hallLobbyParam,
	resolve(parentValue, arg, context, info) {
		return HallLobbyExec.hall_lobbies(arg, graphqlFields(info));
	}
};

fields["hall_lobbies_count"] = {
	type: GraphQLInt,
	args: hallLobbyParam,
	resolve(parentValue, arg, context, info) {
		return HallLobbyExec.hall_lobbies(arg, graphqlFields(info), {
			count: true
		});
	}
};
/*******************************************/
/* hall_galleries ******************/
fields["hall_galleries"] = {
	type: new GraphQLList(HallGalleryType),
	args: {
		ID: __.Int,
		is_active: __.Int,
		cf: __.String,
		order_by: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return HallGalleryExec.hall_galleries(arg, graphqlFields(info));
	}
};

/*******************************************/
/* notifications ******************/
fields["notifications"] = {
	type: new GraphQLList(NotificationType),
	args: {
		ID: __.Int,
		user_id: __.Int,
		user_role: __.String,
		is_read: __.Int,
		cf: __.String,
		order_by: __.String,
		page: __.Int,
		offset: __.Int,
		ttl: __.Boolean
	},
	resolve(parentValue, arg, context, info) {
		return NotificationExec.notifications(arg, graphqlFields(info));
	}
};

/*******************************************/
/* announcement ******************/
fields["announcement"] = {
	type: AnnouncementType,
	args: {
		ID: __.Int,
	},
	resolve(parentValue, arg, context, info) {
		return AnnouncementExec.announcements(arg, graphqlFields(info), { single: true });
	}
};

fields["announcements"] = {
	type: new GraphQLList(AnnouncementType),
	args: {
		ID: __.Int,
		cf: __.String,
		order_by: __.String,
		page: __.Int,
		offset: __.Int,
		ttl: __.Boolean
	},
	resolve(parentValue, arg, context, info) {
		return AnnouncementExec.announcements(arg, graphqlFields(info));
	}
};

/*******************************************/
/* qs_popup ******************/
fields["qs_popups"] = {
	type: new GraphQLList(QsPopupType),
	args: {
		for_student: __.Int,
		for_rec: __.Int,
		order_by: __.String,
		is_disabled: __.Int,
		page: __.Int,
		type: __.String,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return QsPopupExec.qs_popups(arg, graphqlFields(info));
	}
};

fields["qs_popup"] = {
	type: QsPopupType,
	args: {
		ID: __.Int,
		user_id: __.Int,
		for_student: __.Int,
		for_rec: __.Int,
		type: __.String,
		is_disabled: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return QsPopupExec.qs_popup(arg, graphqlFields(info));
	}
};

fields["qs_popup_answers"] = {
	type: new GraphQLList(QsPopupAnswerType),
	args: {
		qs_popup_id: __.Int,
		user_role: __.String,
		order_by: __.String,
		page: __.Int,
		type: __.String,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return QsPopupExec.qs_popup_answers(arg, graphqlFields(info));
	}
};

/*******************************************/
/* group_sessions ******************/
fields["group_session"] = {
	type: GroupSessionType,
	args: {
		ID: __.IntNonNull
	},
	resolve(parentValue, arg, context, info) {
		return GroupSessionExec.group_session(arg, graphqlFields(info));
	}
};

fields["group_sessions"] = {
	type: new GraphQLList(GroupSessionType),
	args: {
		company_id: __.Int,
		user_id: __.Int,
		discard_expired: __.Boolean,
		discard_canceled: __.Boolean,
		discard_removed: __.Boolean,
		discard_removed_user_id: __.Int,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return GroupSessionExec.group_sessions(arg, graphqlFields(info));
	}
};

fields["group_session_joins"] = {
	type: new GraphQLList(GroupSessionJoinType),
	args: {
		user_id: __.Int,
		group_session_id: __.Int,
		is_canceled: __.Int,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return GroupSessionExec.group_session_joins(arg, graphqlFields(info));
	}
};


/*******************************************/
/* browse_student ******************/

// 5. @custom_user_info_by_cf
let argBrowseStudent = {
	override_pivot: __.Boolean,

	custom_filter_single: __.String,
	custom_filter_multi: __.String,

	discard_filter: __.String,

	lang: __.String,
	role: __.String,

	current_user_id: __.Int, // to get is_seen
	company_id: __.Int,


	interested_only: __.String,

	// favourited_only_recruiter_id: __.String,
	favourited_only: __.String,

	like_job_post_only: __.String,
	drop_resume_only: __.String,
	with_attachment_only: __.String,
	with_note_only: __.String,

	current_cf: __.String,

	page: __.Int,
	offset: __.Int,

	name: __.String,
	// cv/events (delimeter '::')
	cf: __.String,

	// single (delimeter '::')
	country_study: __.String,
	university: __.String,
	where_in_malaysia: __.String,
	monash_student_id: __.String,
	monash_school: __.String,
	sunway_faculty: __.String,
	sunway_program: __.String,
	local_or_oversea_study: __.String,
	local_or_oversea_location: __.String,
	work_experience_year: __.String,
	gender: __.String,
	id_unisza: __.String,
	unisza_faculty: __.String,
	unisza_course: __.String,
	current_semester: __.String,
	course_status: __.String,
	employment_status: __.String,

	// multi (delimeter '::')
	field_study_main: __.String,
	field_study_secondary: __.String,
	field_study: __.String,
	looking_for_position: __.String,
	interested_job_location: __.String,
	skill: __.String,

	working_availability_month_from: __.String,
	working_availability_year_from: __.String,
	working_availability_month_to: __.String,
	working_availability_year_to: __.String,
	graduation_month_from: __.String,
	graduation_year_from: __.String,
	graduation_month_to: __.String,
	graduation_year_to: __.String,
};

let keys = cfCustomFunnel({ action: "get_keys_single" });
for (let k of keys) {
	argBrowseStudent[k] = __.String;
}

fields["browse_student_filter"] = {
	type: new GraphQLList(FilterType),
	args: argBrowseStudent,
	resolve(parentValue, arg, context, info) {
		return BrowseStudentExec.filter(arg, graphqlFields(info));
	}
};

fields["browse_student_count"] = {
	type: GraphQLInt,
	args: argBrowseStudent,
	resolve(parentValue, arg, context, info) {
		return BrowseStudentExec.count(arg, graphqlFields(info));
	}
};

fields["browse_student"] = {
	type: new GraphQLList(BrowseStudentType),
	args: argBrowseStudent,
	resolve(parentValue, arg, context, info) {
		return BrowseStudentExec.list(arg, graphqlFields(info));
	}
};


/*******************************************/
/* student_listing ******************/

let argStudentListing = {
	company_id: __.IntNonNull,
	cf: __.StringNonNull,
	page: __.Int,
	offset: __.Int,
	search_student: __.String,
	// search_major: __.String,
	// search_study_place: __.String,

	search_university: __.String,
	search_field_study: __.String,
	search_country_study: __.String,
	search_work_av_month: __.String,
	search_work_av_year: __.String,
	search_looking_for: __.String,
	search_favourite_student: __.String,
	search_graduation_year: __.String,
	search_grade_category: __.String,
};

fields["student_listing_count"] = {
	type: GraphQLInt,
	args: argStudentListing,
	resolve(parentValue, arg, context, info) {
		let isCount = true;
		return StudentListingExec.student_listing(arg, graphqlFields(info), isCount);
	}
};

fields["student_listing"] = {
	type: new GraphQLList(StudentListingType),
	args: argStudentListing,
	resolve(parentValue, arg, context, info) {
		return StudentListingExec.student_listing(arg, graphqlFields(info));
	}
};

/*******************************************/
/* feedback_qs ******************/
fields["feedback_qs"] = {
	type: new GraphQLList(FeedbackQsType),
	args: {
		ID: __.Int,
		is_disabled: __.Int,
		user_role: __.String,
		order_by: __.String,

		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return FeedbackQsExec.feedback_qs(arg, graphqlFields(info));
	}
};

/*******************************************/
/* is_kpt_jpa ******************/
// @kpt_validation
fields["is_kpt_jpa"] = {
	type: GraphQLInt,
	args: {
		kpt: __.StringNonNull
	},
	resolve(parentValue, arg, context, info) {
		return UserExec.isKptJpa(arg.kpt);
	}
};


/*******************************************/
/* is_id_utm ******************/
// @id_utm_validation
fields["is_id_utm"] = {
	type: GraphQLInt,
	args: {
		id_utm: __.StringNonNull,
		cf: __.StringNonNull,
	},
	resolve(parentValue, arg, context, info) {
		return UserExec.isIdUtm(arg.id_utm, arg.cf);
	}
};

/*******************************************/
/* has_feedback ******************/
fields["has_feedback"] = {
	type: GraphQLInt,
	args: {
		user_id: __.IntNonNull
	},
	resolve(parentValue, arg, context, info) {
		return UserExec.hasFeedback(arg.user_id);
	}
};

/*******************************************/
/* session_requests ******************/
fields["session_requests"] = {
	type: new GraphQLList(SessionRequestType),
	args: {
		company_id: __.Int,
		status: __.String,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return SessionRequestExec.session_requests(arg, graphqlFields(info));
	}
};

/*******************************************/
/* support_sessions ******************/
fields["support_sessions"] = {
	type: new GraphQLList(SupportSessionType),
	args: {
		support_id: __.Int,
		user_id: __.Int,
		offset: __.Int,
		bigger_than_key: __.String,
		smaller_than_key: __.String,
	},
	resolve(parentValue, arg, context, info) {
		return SupportSessionExec.support_sessions(arg, graphqlFields(info));
	}
};

/*******************************************/
/* zoom ******************/
fields["zoom_invites"] = {
	type: new GraphQLList(ZoomInviteType),
	args: {
		user_id: __.Int,
		is_expired: __.Boolean
	},
	resolve(parentValue, arg, context, info) {
		return ZoomExec.zoom_invites(arg, graphqlFields(info));
	}
};


/*******************************************/
/* zoom_meetings ******************/
fields["zoom_meeting"] = {
	type: ZoomMeetingType,
	args: {
		join_url: __.String,
		pre_screen_id: __.Int,
		group_session_id: __.Int,
	},
	resolve(parentValue, arg, context, info) {
		return ZoomMeetingExec.single(arg, graphqlFields(info));
	}
};

/*******************************************/
/* event ******************/
const eventsParam = {
	user_id: __.Int,
	company_id: __.Int,
	page: __.Int,
	offset: __.Int,
	title: __.String,
	cf: __.String,
	order_by: __.String,
}

fields["events"] = {
	type: new GraphQLList(EventType),
	args: eventsParam,
	resolve(parentValue, arg, context, info) {
		return EventExec.events(arg, graphqlFields(info));
	}
};

fields["events_count"] = {
	type: GraphQLInt,
	args: eventsParam,
	resolve(parentValue, arg, context, info) {
		return EventExec.events(arg, graphqlFields(info), {
			count: true
		});
	}
};

fields["event"] = {
	type: EventType,
	args: {
		ID: __.IntNonNull
	},
	resolve(parentValue, arg, context, info) {
		return EventExec.events(arg, graphqlFields(info), {
			single: true
		});
	}
};



/*******************************************/
/* auditorium ******************/
fields["auditoriums"] = {
	type: new GraphQLList(AuditoriumType),
	args: {
		user_id: __.Int,
		page: __.IntNonNull,
		offset: __.IntNonNull,
		now_only: __.Boolean,
		cf: __.String,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return AuditoriumExec.auditoriums(arg, graphqlFields(info));
	}
};

fields["auditorium"] = {
	type: AuditoriumType,
	args: {
		ID: __.IntNonNull
	},
	resolve(parentValue, arg, context, info) {
		return AuditoriumExec.auditoriums(arg, graphqlFields(info), {
			single: true
		});
	}
};

/*******************************************/
/* dashboards ******************/
fields["password_reset"] = {
	type: PasswordResetType,
	args: {
		user_id: __.IntNonNull,
		token: __.StringNonNull
	},
	resolve(parentValue, arg, context, info) {
		return PasswordResetExec.password_reset(arg, graphqlFields(info), {
			single: true
		});
	}
};

/*******************************************/
/* dashboards ******************/
fields["dashboard"] = {
	type: DashboardType,
	args: {
		ID: __.IntNonNull
	},
	resolve(parentValue, arg, context, info) {
		return DashboardExec.dashboards(arg, graphqlFields(info), {
			single: true
		});
	}
};

fields["dashboards"] = {
	type: new GraphQLList(DashboardType),
	args: {
		cf: __.String,
		type: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return DashboardExec.dashboards(arg, graphqlFields(info));
	}
};

/*******************************************/
/* messages ******************/
fields["messages"] = {
	type: new GraphQLList(MessageType),
	args: {
		user_1: __.IntNonNull,
		user_2: __.IntNonNull,
		which_company: __.String,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return MessageExec.messages(arg, graphqlFields(info));
	}
};

fields["messages_count"] = {
	type: MessageType,
	args: {
		user_id: __.Int,
		company_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return MessageExec.messages_count(arg, graphqlFields(info));
	}
};

/*******************************************/
/* user ******************/
fields["user"] = {
	type: UserType,
	args: {
		ID: __.Int,
		company_id: __.Int,
		kpt: __.String, // @kpt_validation
		id_utm: __.String, // @id_utm_validation
		cf: __.String, // @id_utm_validation
		cf_to_check_id_utm: __.String, // @id_utm_validation
		cf_to_check_registration: __.String, // @id_utm_validation
		cf_to_check_profile_complete: __.String, // @id_utm_validation
		user_email: __.String
	},
	resolve(parentValue, arg, context, info) {
		return UserExec.user(arg, graphqlFields(info));
	}
};

fields["users"] = {
	type: new GraphQLList(UserType),
	args: {
		role: __.String,
		rec_company_id: __.Int,
		page: __.Int,
		offset: __.Int,
		order_by: __.String,
		cf: __.String,
		new_only: __.Int,
		has_feedback: __.Int,
		//search query
		search_user: __.String, // name and email
		search_degree: __.String, // major and minor
		search_university: __.String
	},
	resolve(parentValue, arg, context, info) {
		return UserExec.users(arg, graphqlFields(info));
	}
};

/*******************************************/
/* queues ******************/
fields["queues"] = {
	type: new GraphQLList(QueueType),
	args: {
		student_id: __.Int,
		status: __.String
	},
	resolve(parentValue, arg, context, info) {
		return QueueExec.queues(arg, graphqlFields(info));
	}
};

/*******************************************/
/* CF ******************/
fields["cfs"] = {
	type: new GraphQLList(CfsType),
	args: {
		is_active: __.Int,
		is_load: __.Int,
		page: __.Int,
		offset: __.Int,
		order_by: __.String,
		name: __.String
	},
	resolve(parentValue, arg, context, info) {
		return CFExec.cfs(arg, graphqlFields(info), {});
	}
};

fields["cf"] = {
	type: CfsType,
	args: {
		name: __.String
	},
	resolve(parentValue, arg, context, info) {
		return CFExec.cfs(arg, graphqlFields(info), {
			single: true
		});
	}
};

/*******************************************/
/* company ******************/
fields["company"] = {
	type: CompanyType,
	args: {
		ID: __.IntNonNull,
		user_id: __.Int,
		cf: __.String,
	},
	resolve(parentValue, arg, context, info) {
		return CompanyExec.company(arg, graphqlFields(info));
	}
};
const companies_param = {
	user_id: __.Int,
	type: __.Int,
	page: __.Int,
	offset: __.Int,
	cf: __.String,
	ignore_priv: __.String, // (delimeter '::')
	search_name: __.String,
	accept_prescreen: __.Int,
	include_sponsor: __.Int,
	ignore_type: __.String,
	order_by: __.String
}
fields["companies"] = {
	type: new GraphQLList(CompanyType),
	args: companies_param,
	resolve(parentValue, arg, context, info) {
		return CompanyExec.companies(arg, graphqlFields(info));
	}
};

fields["companies_count"] = {
	type: GraphQLInt,
	args: companies_param,
	resolve(parentValue, arg, context, info) {
		return CompanyExec.companies(arg, graphqlFields(info), {
			count: true
		});
	}
};


/*******************************************/
/* session ******************/
fields["session"] = {
	type: SessionType,
	args: {
		ID: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return SessionExec.sessions(
			arg,
			graphqlFields(info),
			(extra = {
				single: true
			})
		);
	}
};

fields["sessions"] = {
	type: new GraphQLList(SessionType),
	args: {
		company_id: __.Int,
		participant_id: __.Int,
		status: __.String,
		distinct: __.String,
		page: __.Int,
		offset: __.Int,
		order_by: __.String,
		search_student: __.String,
		search_university: __.String
		//search_company: __.String
	},
	resolve(parentValue, arg, context, info) {
		return SessionExec.sessions(arg, graphqlFields(info));
	}
};

/*******************************************/
/* session_notes ******************/
fields["session_notes"] = {
	type: new GraphQLList(SessionNoteType),
	args: {
		session_id: __.Int,
		page: __.Int,
		offset: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return SessionNoteExec.session_notes(arg, graphqlFields(info), {});
	}
};

fields["session_note"] = {
	type: SessionNoteType,
	args: {
		ID: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return SessionNoteExec.session_notes(arg, graphqlFields(info), {
			single: true
		});
	}
};

/*******************************************/
/* session_notes ******************/
fields["session_ratings"] = {
	type: new GraphQLList(SessionRatingType),
	args: {
		session_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return SessionRatingExec.session_ratings(arg, graphqlFields(info), {});
	}
};

/*******************************************/
/* logs ******************/
fields["logs"] = {
	type: new GraphQLList(LogType),
	args: {
		event: __.StringNonNull,
		start: __.Int,
		end: __.Int,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return LogExec.logs(arg, graphqlFields(info));
	}
};

/*******************************************/
/* metas ******************/
fields["metas"] = {
	type: new GraphQLList(MetaType),
	args: {
		meta_key: __.String,
		meta_value: __.String,
		page: __.Int,
		offset: __.Int,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return MetaExec.metas(arg, graphqlFields(info));
	}
};

/*******************************************/
/* availability ******************/
fields["availabilities"] = {
	type: new GraphQLList(AvailabilityType),
	args: {
		user_id: __.Int,
		timestamp: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return AvailabilityExec.availabilities(arg, graphqlFields(info));
	}
};

/*******************************************/
/* vacancy ******************/
fields["vacancy"] = {
	type: VacancyType,
	args: {
		ID: __.Int,
		user_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return VacancyExec.vacancy(arg, graphqlFields(info));
	}
};


// @custom_vacancy_info
const vacancies_param = {
	cf: __.String,
	title: __.String,
	type: __.String,
	user_id: __.Int,
	show_applied_only: __.Boolean,
	company_id: __.Int,
	specialization: __.String,
	location: __.String,
	page: __.Int,
	offset: __.Int,
	order_by: __.String,
	text_company: __.String,
}
fields["vacancies"] = {
	type: new GraphQLList(VacancyType),
	args: vacancies_param,
	resolve(parentValue, arg, context, info) {
		return VacancyExec.vacancies(arg, graphqlFields(info));
	}
};
fields["vacancies_count"] = {
	type: GraphQLInt,
	args: vacancies_param,
	resolve(parentValue, arg, context, info) {
		return VacancyExec.vacancies(arg, graphqlFields(info), {
			count: true
		});
	}
};
fields["vacancies_distinct"] = {
	type: new GraphQLList(DistinctType),
	args: vacancies_param,
	resolve(parentValue, arg, context, info) {
		return VacancyExec.vacancies(arg, graphqlFields(info), {
			distinct: true
		});
	}
};


/*******************************************/
/* company_email ******************/
fields["company_email"] = {
	type: CompanyEmailType,
	args: {
		ID: __.Int,
		user_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return CompanyEmailExec.single(arg, graphqlFields(info));
	}
};
const company_email_param = {
	company_id: __.Int,
	page: __.Int,
	offset: __.Int
}
fields["company_emails"] = {
	type: new GraphQLList(CompanyEmailType),
	args: company_email_param,
	resolve(parentValue, arg, context, info) {
		return CompanyEmailExec.list(arg, graphqlFields(info));
	}
};
fields["company_emails_count"] = {
	type: GraphQLInt,
	args: company_email_param,
	resolve(parentValue, arg, context, info) {
		return CompanyEmailExec.count(arg, graphqlFields(info));
	}
};

/*******************************************/
/* resume_drop ******************/
fields["prescreen"] = {
	type: PrescreenType,
	args: {
		ID: __.IntNonNull
	},
	resolve(parentValue, arg, context, info) {
		return PrescreenExec.prescreens(arg, graphqlFields(info), {
			single: true
		});
	}
};

var prescreenParam = {
	company_id: __.Int,
	student_id: __.Int,
	recruiter_id: __.Int,
	appointment_time: __.Int,

	// New SI Flow - used in user-query (to get more than one type)
	status: __.String,
	status_2: __.String,
	status_3: __.String,
	status_4: __.String,
	status_5: __.String,

	is_onsite_call: __.Int,
	special_type: __.String,
	page: __.Int,
	offset: __.Int,
	not_prescreen: __.Int,
	order_by: __.String,
	cf: __.String,

	discard_removed: __.Boolean,
	discard_removed_user_id: __.Int,

	//search query
	student_name: __.String,
	student_email: __.String,
	student_university: __.String
}
fields["prescreens"] = {
	type: new GraphQLList(PrescreenType),
	args: prescreenParam,
	resolve(parentValue, arg, context, info) {
		return PrescreenExec.prescreens(arg, graphqlFields(info));
	}
};
fields["prescreens_count"] = {
	type: GraphQLInt,
	args: prescreenParam,
	resolve(parentValue, arg, context, info) {
		return PrescreenExec.prescreens(arg, graphqlFields(info), {
			count: true
		});
	}
};

/*******************************************/
/* forum ******************/
fields["forum_comments"] = {
	type: new GraphQLList(ForumCommentType),
	args: {
		forum_id: __.String,
		page: __.Int,
		offset: __.Int,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return ForumExec.forum_comments(arg, graphqlFields(info));
	}
};

fields["forum_replies"] = {
	type: new GraphQLList(ForumReplyType),
	args: {
		comment_id: __.String,
		page: __.Int,
		offset: __.Int,
		order_by: __.String
	},
	resolve(parentValue, arg, context, info) {
		return ForumExec.forum_replies(arg, graphqlFields(info));
	}
};

/*******************************************/
/* resume_drop ******************/

// return limit if feedback is empty
// return null if still not over limit or feedback is filled
fields["resume_drops_limit"] = {
	type: GraphQLString,
	args: {
		user_id: __.IntNonNull,
		is_job_apply: __.Int,
	},
	resolve(parentValue, arg, context, info) {
		return ResumeDropExec.resume_drops_limit(arg, graphqlFields(info));
	}
};

// if over limit, return limit
// return null if still not over limit
fields["resume_drops_limit_by_cf"] = {
	type: ResumeDropLimitByCfType,
	args: {
		user_id: __.IntNonNull,
		cf: __.StringNonNull,
	},
	resolve(parentValue, arg, context, info) {
		return ResumeDropExec.resume_drops_limit_by_cf(arg, graphqlFields(info));
	}
};

fields["resume_drop"] = {
	type: ResumeDropType,
	args: {
		ID: __.Int,
		company_id: __.Int,
		student_id: __.Int
	},
	resolve(parentValue, arg, context, info) {
		return ResumeDropExec.resume_drops(arg, graphqlFields(info), {
			single: true
		});
	}
};

fields["resume_drops"] = {
	type: new GraphQLList(ResumeDropType),
	args: {
		ID: __.Int,
		company_id: __.Int,
		student_id: __.Int,
		page: __.Int,
		offset: __.Int,
		order_by: __.String,
		search_student: __.String
	},
	resolve(parentValue, arg, context, info) {
		return ResumeDropExec.resume_drops(arg, graphqlFields(info));
	}
};



/*******************************************/
/* company_email ******************/
fields["group_call"] = {
	type: GroupCallType,
	args: {
		ID: __.Int,
	},
	resolve(parentValue, arg, context, info) {
		return GroupCallExec.single(arg, graphqlFields(info));
	}
};
const group_call_param = {
	company_id: __.Int,
	is_canceled: __.Int,
	cf: __.String,
	order_by: __.String,
	company_name: __.String,
	user_id: __.Int,
	page: __.Int,
	offset: __.Int
}
fields["group_calls"] = {
	type: new GraphQLList(GroupCallType),
	args: group_call_param,
	resolve(parentValue, arg, context, info) {
		return GroupCallExec.list(arg, graphqlFields(info));
	}
};
fields["group_calls_count"] = {
	type: GraphQLInt,
	args: group_call_param,
	resolve(parentValue, arg, context, info) {
		return GroupCallExec.count(arg, graphqlFields(info));
	}
};

/*******************************************/
/* qr_check_in ******************/
var qrCheckInParam = {
	cf: __.StringNonNull,
	page: __.Int,
	offset: __.Int,
}
fields["qr_check_ins"] = {
	type: new GraphQLList(QrCheckInType),
	args: qrCheckInParam,
	resolve(parentValue, arg, context, info) {
		return QrCheckInExec.list(arg, graphqlFields(info));
	}
};
fields["qr_check_ins_count"] = {
	type: GraphQLInt,
	args: qrCheckInParam,
	resolve(parentValue, arg, context, info) {
		return QrCheckInExec.count(arg, graphqlFields(info));
	}
};
/*******************************************/
/* qr_scan ******************/
var qrCheckInParam = {
	cf: __.StringNonNull,
	type: __.StringNonNull,
	start: __.StringNonNull,
	end: __.StringNonNull,
	company_id: __.Int,
	scanned_by_company_id: __.Int,
	page: __.Int,
	offset: __.Int,
}
fields["qr_scans"] = {
	type: new GraphQLList(QrScanType),
	args: qrCheckInParam,
	resolve(parentValue, arg, context, info) {
		return QrScanExec.list(arg, graphqlFields(info));
	}
};
fields["qr_scans_count"] = {
	type: GraphQLInt,
	args: qrCheckInParam,
	resolve(parentValue, arg, context, info) {
		return QrScanExec.count(arg, graphqlFields(info));
	}
};

// ##############################################################
// EXPORT TYPE
//Root Query
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: fields
});
module.exports = {
	RootQuery
};