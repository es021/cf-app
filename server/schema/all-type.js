/* eslint-disable no-use-before-define */
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
	GraphQLBoolean
} = require("graphql");
const { cfCustomFunnel } = require("../../config/cf-custom-config");

const {
	__
} = require("../../config/graphql-config");

const Props = require("./props");

const CountType = new GraphQLObjectType({
	name: "Count",
	fields: () => ({
		total: __.Int
	})
});

const LocationType = new GraphQLObjectType({
	name: "Location",
	fields: () => ({
		city: __.String,
		state: __.String,
		country: __.String,
		city_id: __.Int,
		state_id: __.Int,
		country_id: __.Int,
		val: __.String
	})
});

const SingleType = new GraphQLObjectType({
	name: "Single",
	fields: () => ({
		ID: __.Int,
		entity: __.String,
		entity_id: __.Int,
		key_input: __.String,
		val: __.String,
		created_at: __.String,
		updated_at: __.String
	})
});
const MultiType = new GraphQLObjectType({
	name: "Multi",
	fields: () => ({
		ID: __.Int,
		entity: __.String,
		entity_id: __.Int,
		val: __.String,
		created_at: __.String
	})
});

const RefType = new GraphQLObjectType({
	name: "Ref",
	fields: () => ({
		table_name: __.String,
		ID: __.Int,
		val: __.String,
		category: __.String,
		slug: __.String,
		multi: __.IsType(MultiType)
	})
});

const RefGeneral = new GraphQLObjectType({
	name: "RefGeneral",
	fields: () => ({
		ID: __.Int,
		val: __.String,
	})
});


const NotificationType = new GraphQLObjectType({
	name: "Notification",
	fields: () => ({
		ttl: __.Int,
		ID: __.Int,
		user_id: __.Int,
		type: __.String,
		param: __.String,
		cf: __.String,
		is_read: __.Int,
		img_entity: __.String,
		img_id: __.Int,
		created_at: __.String,
		img_obj: __.IsType(UserType)
	})
});

const VideoType = new GraphQLObjectType({
	name: "Video",
	fields: () => ({
		ID: __.Int,
		entity: __.String,
		entity_id: __.Int,
		meta_key: __.String,
		url: __.String,
		created_at: __.String,
		updated_at: __.String
	})
});

const SkillType = new GraphQLObjectType({
	name: "Skill",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		label: __.String
	})
});

const AvailabilityType = new GraphQLObjectType({
	name: "Availability",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		timestamp: __.Int,
		is_booked: __.Boolean,
		company_id: __.Int,
		prescreen_id: __.Int,
		company: __.IsType(CompanyType),
		prescreen: __.IsType(PrescreenType)
	})
});

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => {
		let r = {
			ID: __.Int,
			user_email: __.String,
			user_pass: __.String,

			img_url: __.String,
			img_pos: __.String,
			img_size: __.String,
			feedback: __.String,
			has_feedback_external: __.String,
			user_status: __.String,
			activation_key: __.String,
			role: __.String,
			cf: __.StringList,
			user_registered: __.String,
			cf_registered_at: __.String,

			// @kpt_validation
			kpt: __.String,

			//active activity
			queues: __.ListOf(QueueType),
			session_requests: __.ListOf(SessionRequestType),
			registered_prescreens: __.ListOf(PrescreenType),
			prescreens: __.ListOf(PrescreenType),
			sessions: __.ListOf(SessionType),
			zoom_invites: __.ListOf(ZoomInviteType),
			group_sessions: __.ListOf(GroupSessionType),
			group_session_joins: __.ListOf(GroupSessionJoinType),

			// student listing
			// need to provide company_id
			booked_at: __.ListOf(AvailabilityType),
			prescreens_for_student_listing: __.ListOf(PrescreenType),
			interested_vacancies_by_company: __.ListOf(VacancyType),

			// 3. @custom_user_info_by_cf
			field_study_main: __.String,
			field_study_secondary: __.String,
			unemployment_period: __.String,
			monash_student_id: __.String,
			monash_school: __.String,
			sunway_faculty: __.String,
			sunway_program: __.String,
			local_or_oversea_study: __.String,
			local_or_oversea_location: __.String,
			work_experience_year: __.String,
			gender: __.String,
			birth_date: __.String,
			kpt: __.String,
			id_unisza: __.String,
			unisza_faculty: __.String,
			unisza_course: __.String,
			current_semester: __.String,
			course_status: __.String,
			employment_status: __.String,

			// @id_utm_validation
			id_utm: __.String,

			// default
			first_name: __.String,
			last_name: __.String,
			country_study: __.String,
			university: __.String,
			qualification: __.String,
			graduation_month: __.String,
			graduation_year: __.String,
			working_availability_month: __.String,
			working_availability_year: __.String,
			grade: __.String,
			phone_number: __.String,
			sponsor: __.String,
			description: __.String,
			field_study: __.ListOf(MultiType),
			looking_for_position: __.ListOf(MultiType),
			interested_role: __.ListOf(MultiType),
			where_in_malaysia: __.String,
			interested_job_location: __.ListOf(MultiType),
			doc_links: __.ListOf(DocLinkType),
			skill: __.ListOf(MultiType),
			extracurricular: __.ListOf(MultiType),
			degree_level: __.String,
			skills: __.ListOf(SkillType),
			available_month: __.String,
			available_year: __.String,
			cgpa: __.String,
			study_field: __.String,
			major: __.String,
			minor: __.String,
			gender: __.String,
			mas_state: __.String,
			mas_postcode: __.String,
			relocate: __.String,
			study_place: __.String,
			looking_for: __.String,

			video_resume: __.IsType(VideoType),
			student_listing_interested: __.IsType(InterestedType),
			student_note: __.IsType(UserNoteType),

			// rec only
			rec_company: __.Int,
			rec_position: __.String,
			company: __.IsType(CompanyType),

			// DERIVED ATTRIBUTE -
			is_active: __.Boolean,
			is_profile_completed: __.Boolean,
			is_profile_custom_order_completed: __.Boolean,
			is_kpt_jpa: __.Boolean, // @kpt_validation
			is_id_utm: __.Boolean, // @id_utm_validation
		};

		let keySingle = cfCustomFunnel({ action: "get_keys_single" });
		for (let k of keySingle) {
			r[k] = __.String;
		}
		let keyMulti = cfCustomFunnel({ action: "get_keys_multi" });
		for (let k of keyMulti) {
			r[k] = __.ListOf(MultiType);
		}
		return r;
	}
	// fields: () => ({
	// 	// @add_new_user_meta
	// 	// all roles
	// 	ID: __.Int,
	// 	user_email: __.String,
	// 	user_pass: __.String,

	// 	img_url: __.String,
	// 	img_pos: __.String,
	// 	img_size: __.String,
	// 	feedback: __.String,
	// 	has_feedback_external: __.String,
	// 	user_status: __.String,
	// 	activation_key: __.String,
	// 	role: __.String,
	// 	cf: __.StringList,
	// 	user_registered: __.String,

	// 	// @kpt_validation
	// 	kpt: __.String,



	// 	//active activity
	// 	queues: __.ListOf(QueueType),
	// 	session_requests: __.ListOf(SessionRequestType),
	// 	registered_prescreens: __.ListOf(PrescreenType),
	// 	prescreens: __.ListOf(PrescreenType),
	// 	sessions: __.ListOf(SessionType),
	// 	zoom_invites: __.ListOf(ZoomInviteType),
	// 	group_sessions: __.ListOf(GroupSessionType),
	// 	group_session_joins: __.ListOf(GroupSessionJoinType),

	// 	// student listing
	// 	// need to provide company_id
	// 	booked_at: __.ListOf(AvailabilityType),
	// 	prescreens_for_student_listing: __.ListOf(PrescreenType),
	// 	interested_vacancies_by_company: __.ListOf(VacancyType),

	// 	// 3. @custom_user_info_by_cf
	// 	field_study_main: __.String,
	// 	field_study_secondary: __.String,
	// 	unemployment_period: __.String,
	// 	monash_student_id: __.String,
	// 	monash_school: __.String,
	// 	sunway_faculty: __.String,
	// 	sunway_program: __.String,
	// 	local_or_oversea_study: __.String,
	// 	local_or_oversea_location: __.String,
	// 	work_experience_year: __.String,
	// 	gender: __.String,
	// 	birth_date: __.String,
	// 	kpt: __.String,
	// 	id_unisza: __.String,
	// 	unisza_faculty: __.String,
	// 	unisza_course: __.String,
	// 	current_semester: __.String,
	// 	course_status: __.String,
	// 	employment_status: __.String,

	// 	// @id_utm_validation
	// 	id_utm: __.String,

	// 	// default
	// 	first_name: __.String,
	// 	last_name: __.String,
	// 	country_study: __.String,
	// 	university: __.String,
	// 	qualification: __.String,
	// 	graduation_month: __.String,
	// 	graduation_year: __.String,
	// 	working_availability_month: __.String,
	// 	working_availability_year: __.String,
	// 	grade: __.String,
	// 	phone_number: __.String,
	// 	sponsor: __.String,
	// 	description: __.String,
	// 	field_study: __.ListOf(MultiType),
	// 	looking_for_position: __.ListOf(MultiType),
	// 	interested_role: __.ListOf(MultiType),
	// 	where_in_malaysia: __.String,
	// 	interested_job_location: __.ListOf(MultiType),
	// 	doc_links: __.ListOf(DocLinkType),
	// 	skill: __.ListOf(MultiType),
	// 	extracurricular: __.ListOf(MultiType),
	// 	degree_level: __.String,
	// 	skills: __.ListOf(SkillType),
	// 	available_month: __.String,
	// 	available_year: __.String,
	// 	cgpa: __.String,
	// 	study_field: __.String,
	// 	major: __.String,
	// 	minor: __.String,
	// 	gender: __.String,
	// 	mas_state: __.String,
	// 	mas_postcode: __.String,
	// 	relocate: __.String,
	// 	study_place: __.String,
	// 	looking_for: __.String,

	// 	video_resume: __.IsType(VideoType),
	// 	student_listing_interested: __.IsType(InterestedType),


	// 	// rec only
	// 	rec_company: __.Int,
	// 	rec_position: __.String,
	// 	company: __.IsType(CompanyType),

	// 	// DERIVED ATTRIBUTE -
	// 	is_active: __.Boolean,
	// 	is_profile_completed: __.Boolean,
	// 	is_kpt_jpa: __.Boolean, // @kpt_validation
	// 	is_id_utm: __.Boolean, // @id_utm_validation

	// 	// OLD ONE
	// 	// //student only
	// 	// first_name: __.String,
	// 	// last_name: __.String,
	// 	// description: __.String,
	// 	// university: __.String,
	// 	// phone_number: __.String,
	// 	// graduation_month: __.String,
	// 	// graduation_year: __.String,
	// 	// sponsor: __.String,
	// 	// /// ####
	// 	// deprecated will return null only
	// })
});

const FeedbackQsType = new GraphQLObjectType({
	name: "FeedbackQs",
	fields: () => ({
		ID: __.Int,
		user_role: __.String,
		question: __.String,
		is_disabled: __.Int,
		created_by: __.Int,
		created_at: __.String,
		updated_by: __.Int,
		updated_at: __.String
	})
});

const CfsType = new GraphQLObjectType({
	name: "CfsType",
	fields: () => (Props.Cfs)
});

const SessionNoteType = new GraphQLObjectType({
	name: "SessionNote",
	fields: () => ({
		ID: __.Int,
		session_id: __.Int,
		rec_id: __.Int,
		student_id: __.Int,
		note: __.String,
		created_at: __.String,
		updated_at: __.String
	})
});

const SessionRatingType = new GraphQLObjectType({
	name: "SessionRating",
	fields: () => ({
		ID: __.Int,
		session_id: __.Int,
		rec_id: __.Int,
		student_id: __.Int,
		category: __.String,
		rating: __.Int,
		created_at: __.String,
		updated_at: __.String
	})
});

const SessionType = new GraphQLObjectType({
	name: "Session",
	fields: () => ({
		ID: __.Int,
		host_id: __.Int,
		participant_id: __.Int,
		company_id: __.Int,
		status: __.String,

		created_at: __.String,
		updated_at: __.String,
		started_at: __.Int,
		ended_at: __.Int,

		session_notes: __.ListOf(SessionNoteType),
		session_ratings: __.ListOf(SessionRatingType),
		recruiter: __.IsType(UserType),
		student: __.IsType(UserType),
		company: __.IsType(CompanyType)
	})
});

const LogType = new GraphQLObjectType({
	name: "Log",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		event: __.String,
		data: __.String,
		created_at: __.String
	})
});

const DashboardType = new GraphQLObjectType({
	name: "Dashboard",
	fields: () => ({
		ID: __.Int,
		cf: __.String,
		title: __.String,
		content: __.String,
		type: __.String,
		updated_at: __.String,
		created_at: __.String
	})
});

const MessageType = new GraphQLObjectType({
	name: "Message",
	fields: () => ({
		id_message_number: __.String,
		from_user_id: __.Int,
		message: __.String,
		has_read: __.Int,
		recruiter_id: __.Int,
		recruiter: __.IsType(UserType),
		created_at: __.String,
		total_unread: __.Int
	})
});

const SessionRequestType = new GraphQLObjectType({
	name: "SessionRequest",
	fields: () => ({
		ID: __.Int,
		student_id: __.Int,
		company_id: __.Int,
		status: __.String,
		created_at: __.String,
		student: __.IsType(UserType),
		company: __.IsType(CompanyType)
	})
});

const QueueType = new GraphQLObjectType({
	name: "Queue",
	fields: () => ({
		ID: __.Int,
		student_id: __.Int,
		company_id: __.Int,
		status: __.String,
		created_at: __.String,
		queue_num: __.Int,

		student: __.IsType(UserType),
		company: __.IsType(CompanyType)
	})
});

const PrescreenType = new GraphQLObjectType({
	name: "PreScreen",
	fields: () => ({
		ID: __.Int,
		student_id: __.Int,
		recruiter_id: __.Int,
		company_id: __.Int,
		status: __.String,
		pic: __.String,
		note: __.String,
		cancel_reason: __.String,
		special_type: __.String,
		cf: __.StringList,
		appointment_time: __.Int,
		reschedule_time: __.Int,

		join_url: __.String,
		start_url: __.String,
		is_expired: __.Int,
		is_onsite_call: __.Int,

		updated_at: __.String,
		created_at: __.String,
		created_by: __.Int,
		updated_by: __.Int,

		student: __.IsType(UserType),
		company: __.IsType(CompanyType),
		recruiter: __.IsType(UserType),
	})
});

const CompanyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		active_queues: __.ListOf(QueueType),
		active_queues_count: __.Int,
		active_prescreens: __.ListOf(PrescreenType),
		active_prescreens_count: __.Int,
		vacancies: __.ListOf(VacancyType),
		vacancies_count: __.Int,

		active_sessions: __.ListOf(SessionType),
		pending_requests: __.ListOf(SessionRequestType),
		recruiters: __.ListOf(UserType),
		tags: __.ListOf(TagType),
		doc_links: __.ListOf(DocLinkType),
		interested: __.IsType(InterestedType),

		ID: __.Int,
		cf: __.StringList,
		name: __.String,
		tagline: __.String,
		description: __.String,
		more_info: __.String,

		img_url: __.String,
		img_size: __.String,
		img_position: __.String,
		img_pos: __.String,

		banner_url: __.String,
		banner_size: __.String,
		banner_position: __.String,
		message_drop_resume: __.String,
		status: __.String,
		rec_privacy: __.Int,
		sponsor_only: __.Int,
		type: __.Int,
		accept_prescreen: __.Int,
		group_url: __.String,
		priviledge: __.String,
		priority: __.Int,
		created_at: __.String,
		updated_at: __.String
	})
});

// const CFType = new GraphQLObjectType({
//     name: 'CF',
//     fields: () => ({
//         ID: { type: GraphQLString },
//         start: { type: GraphQLString },
//         end: { type: GraphQLString },
//         banner_url: { type: GraphQLString },
//         flag: { type: GraphQLString },
//         can_register: { type: GraphQLInt },
//         can_login: { type: GraphQLInt },
//         organizer: { type: GraphQLString },
//         collaborator: { type: GraphQLString }
//     })
// });

const PasswordResetType = new GraphQLObjectType({
	name: "PasswordReset",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		token: __.String,
		is_expired: __.Int
	})
});

const DocLinkType = new GraphQLObjectType({
	name: "DocLink",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		company_id: __.Int,
		type: __.String,
		label: __.String,
		url: __.String,
		description: __.String
	})
});

const VacancySuggestionType = new GraphQLObjectType({
	name: "VacancySuggestion",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		vacancy_id: __.Int,
		vacancy: __.IsType(VacancyType),
		relevance: __.Int
	})
});


// @custom_vacancy_info
const VacancyType = new GraphQLObjectType({
	name: "Vacancy",
	fields: () => ({
		ID: __.Int,
		company_id: __.Int,
		specialization: __.String,
		title: __.String,
		description: __.String,
		requirement: __.String,
		type: __.String,
		open_position: __.Int,
		application_url: __.String,
		location: __.String,
		updated_at: __.String,
		created_at: __.String,
		company: __.IsType(CompanyType),
		interested: __.IsType(InterestedType),
	})
});

// @new_student_tag
const IsSeenType = new GraphQLObjectType({
	name: "IsSeen",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		type: __.String,
		entity_id: __.String,
		is_seen: __.Int,
		updated_at: __.String,
		created_at: __.String,
	})
});

const InterestedType = new GraphQLObjectType({
	name: "Interested",
	fields: () => ({
		ID: __.Int,
		entity: __.String,
		entity_id: __.String,
		user_id: __.String,
		is_interested: __.Int,
		// recruiter_id: __.Int,
		application_status: __.String,
		created_at: __.String,
		updated_at: __.String,
		user: __.IsType(UserType),
		is_seen: __.IsType(IsSeenType)
	})
});

const UserNoteType = new GraphQLObjectType({
	name: "UserNote",
	fields: () => ({
		ID: __.Int,
		company_id: __.Int,
		note: __.String,
		created_at: __.String,
		updated_at: __.String,
		created_by: __.Int,
		updated_by: __.Int,
	})
});

const TagType = new GraphQLObjectType({
	name: "Tag",
	fields: () => ({
		ID: __.Int,
		entity: __.String,
		entity_id: __.String,
		label: __.String,
		created_at: __.String,
		updated_at: __.String
	})
});

const ResumeDropType = new GraphQLObjectType({
	name: "ResumeDrop",
	fields: () => ({
		ID: __.Int,
		student_id: __.Int,
		company_id: __.Int,
		cf: __.String,
		message: __.String,
		created_at: __.String,
		updated_at: __.String,
		doc_links: __.ListOf(DocLinkType),
		student: __.IsType(UserType),
		company: __.IsType(CompanyType)
	})
});

const ResumeDropLimitByCfType = new GraphQLObjectType({
	name: "ResumeDropLimitByCf",
	fields: () => ({
		current: __.Int,
		limit_drop: __.Int,
		is_over_limit: __.Int,
	})
});

const GroupSessionType = new GraphQLObjectType({
	name: "GroupSession",
	fields: () => ({
		ID: __.Int,
		company_id: __.Int,
		company: __.IsType(CompanyType),
		title: __.String,

		start_time: __.Int,
		join_url: __.String,
		start_url: __.String,
		limit_join: __.Int,
		is_expired: __.Int,
		is_canceled: __.Int,
		join_id: __.Int,

		joiners: __.ListOf(GroupSessionJoinType),

		created_at: __.String,
		created_by: __.Int,
		updated_at: __.String,
		updated_by: __.Int
	})
});

const GroupSessionJoinType = new GraphQLObjectType({
	name: "GroupSessionJoin",
	fields: () => ({
		ID: __.Int,
		group_session_id: __.Int,
		group_session: __.IsType(GroupSessionType),
		is_canceled: __.Int,
		user_id: __.Int,
		user: __.IsType(UserType),
		created_at: __.String
	})
});

const BrowseStudentType = new GraphQLObjectType({
	name: "BrowseStudent",
	fields: () => ({
		student_id: __.Int,
		student: __.IsType(UserType),
		is_seen: __.IsType(IsSeenType),
	})
});


const StudentListingType = new GraphQLObjectType({
	name: "StudentListing",
	fields: () => ({
		// all roles
		student_id: __.Int,
		created_at: __.String,
		student: __.IsType(UserType),
		company: __.IsType(CompanyType)
	})
});

const MetaType = new GraphQLObjectType({
	name: "Meta",
	fields: () => ({
		ID: __.Int,
		meta_key: __.String,
		meta_value: __.String,
		source: __.String,
		created_at: __.String
	})
});

const EventType = new GraphQLObjectType({
	name: "Event",
	fields: () => ({
		ID: __.Int,
		is_ended: __.Int,
		company_id: __.Int,
		cf: __.StringList,
		type: __.String,
		title: __.String,
		pic: __.String,
		description: __.String,
		location: __.String,
		url_recorded: __.String,
		url_join: __.String,
		url_rsvp: __.String,
		start_time: __.Int,
		end_time: __.Int,
		created_by: __.Int,
		updated_by: __.Int,
		created_at: __.String,
		updated_at: __.String,
		interested: __.IsType(InterestedType),
		company: __.IsType(CompanyType)
	})
});

const AuditoriumType = new GraphQLObjectType({
	name: "Auditorium",
	fields: () => ({
		ID: __.Int,
		cf: __.String,
		company_id: __.Int,
		type: __.String,
		title: __.String,
		link: __.String,
		recorded_link: __.String,
		moderator: __.String,
		start_time: __.Int,
		end_time: __.Int,
		created_by: __.Int,
		updated_by: __.Int,
		created_at: __.String,
		updated_at: __.String,

		interested: __.IsType(InterestedType),
		company: __.IsType(CompanyType)
	})
});

// Recruiter invite other recruiter for panel interview
const ZoomInviteType = new GraphQLObjectType({
	name: "ZoomInvite",
	fields: () => ({
		ID: __.Int,
		zoom_meeting_id: __.String,
		join_url: __.String,
		session_id: __.Int,
		host_id: __.Int,
		participant_id: __.Int,
		created_at: __.String,

		is_expired: __.Boolean,

		// participant
		student: __.IsType(UserType),
		//host
		recruiter: __.IsType(UserType)
	})
});

const ForumCommentType = new GraphQLObjectType({
	name: "ForumComment",
	fields: () => ({
		ID: __.Int,
		forum_id: __.String,
		user_id: __.Int,
		content: __.String,
		is_deleted: __.Boolean,
		is_owner: __.Boolean,
		created_at: __.String,
		updated_at: __.String,

		user: __.IsType(UserType),
		replies_count: __.Int,
		replies: __.ListOf(ForumReplyType)
	})
});

const ForumReplyType = new GraphQLObjectType({
	name: "ForumReply",
	fields: () => ({
		ID: __.Int,
		comment_id: __.Int,
		user_id: __.Int,
		content: __.String,
		is_deleted: __.Boolean,
		is_owner: __.Boolean,
		created_at: __.String,
		updated_at: __.String,
		user: __.IsType(UserType)
	})
});

const SupportSessionType = new GraphQLObjectType({
	name: "SupportSession",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		support_id: __.Int,

		order_key: __.String,

		message_count_id: __.String,

		// the updated time in message count id
		last_message_time: __.String,

		// the message content
		last_message: __.String,

		// the message sender
		last_rec_name: __.String,

		total_unread: __.Int,

		created_at: __.String,
		user: __.IsType(UserType),
		company: __.IsType(CompanyType),
		support: __.IsType(UserType)
	})
});

const QsPopupType = new GraphQLObjectType({
	name: "QsPopup",
	fields: () => ({
		ID: __.Int,
		type: __.String,
		for_student: __.Int,
		for_rec: __.Int,
		is_disabled: __.Int,
		label: __.String,
		answers: __.String
	})
});

const QsPopupAnswerType = new GraphQLObjectType({
	name: "QsPopupAnswer",
	fields: () => ({
		ID: __.Int,
		user_id: __.Int,
		qs_popup_id: __.Int,
		answer: __.String
	})
});

const EntityRemovedType = new GraphQLObjectType({
	name: "EntityRemoved",
	fields: () => ({
		ID: __.Int,
		entity: __.String,
		entity_id: __.Int,
		user_id: __.Int
	})
});


const DistinctType = new GraphQLObjectType({
	name: "Distinct",
	fields: () => ({
		_category: __.String,
		_key: __.String,
		_val: __.String,
		_label: __.String,
	})
});

const FilterType = new GraphQLObjectType({
	name: "Filter",
	fields: () => ({
		_key: __.String,
		_key_label: __.String,
		_val: __.String,
		_val_label: __.String,
		_total: __.Int
	})
});

const HallLobbyType = new GraphQLObjectType({
	name: "HallLobby",
	fields: () => ({
		ID: __.Int,
		cf: __.String,
		item_order: __.Int,
		is_active: __.Int,
		title: __.String,
		color: __.String,
		url: __.String,
		created_at: __.String,
		created_by: __.Int,
		updated_at: __.String,
		updated_by: __.Int
	})
});

const HallGalleryType = new GraphQLObjectType({
	name: "HallGallery",
	fields: () => ({
		ID: __.Int,
		cf: __.String,
		item_order: __.Int,
		is_active: __.Int,
		title: __.String,
		description: __.String,
		type: __.String,
		img_url: __.String,
		img_size: __.String,
		img_pos: __.String,
		video_url: __.String,
		click_url: __.String,
		is_open_new_tab: __.Int,
		created_at: __.String,
		created_by: __.Int,
		updated_at: __.String,
		updated_by: __.Int
	})
});

const ZoomMeetingType = new GraphQLObjectType({
	name: "ZoomMeeting",
	fields: () => ({
		ID: __.Int,
		session_id: __.Int,
		group_session_id: __.Int,
		pre_screen_id: __.Int,
		chat_user_id: __.Int,
		host_id: __.Int,
		zoom_host_id: __.String,
		zoom_meeting_id: __.String,
		start_url: __.String,
		join_url: __.String,
		created_at: __.String,
		started_at: __.Int,
		is_expired: __.String
	})
});

const CompanyEmailType = new GraphQLObjectType({
	name: "CompanyEmail",
	fields: () => ({
		ID: __.Int,
		company_id: __.Int,
		email: __.String,
		created_at: __.String,
		updated_at: __.String,
		created_by: __.Int,
		updated_by: __.Int,
	})
});

const GroupCallType = new GraphQLObjectType({
	name: "GroupCall",
	fields: () => ({
		ID: __.Int,
		company_id: __.Int,
		name: __.String,
		cf: __.String,
		appointment_time: __.Int,
		url: __.String,
		is_canceled: __.Int,

		company: __.IsType(CompanyType),
		user_count: __.Int,
		users: __.ListOf(GroupCallUserType),


		created_at: __.String,
		updated_at: __.String,
		created_by: __.Int,
		updated_by: __.Int,
	})
});

const GroupCallUserType = new GraphQLObjectType({
	name: "GroupCallUser",
	fields: () => ({
		ID: __.Int,
		group_call_id: __.Int,
		user_id: __.Int,
		user: __.IsType(UserType),
		created_at: __.String,
		updated_at: __.String,
		created_by: __.Int,
		updated_by: __.Int,
	})
});


const AnnouncementType = new GraphQLObjectType({
	name: "Announcement",
	fields: () => ({
		ttl: __.Int,
		ID: __.Int,
		cf: __.String,
		title: __.String,
		body: __.String,
		created_by: __.Int,
		created_at: __.String,
		creator: __.IsType(UserType)
	})
});


module.exports = {
	CompanyEmailType,
	AnnouncementType,
	DistinctType,
	FilterType,
	BrowseStudentType,
	CountType,
	QsPopupType,
	QsPopupAnswerType,
	UserType,
	ForumCommentType,
	ForumReplyType,
	ZoomMeetingType,
	ZoomInviteType,
	CompanyType,
	ResumeDropLimitByCfType,
	QueueType,
	MessageType,
	PrescreenType,
	DocLinkType,
	VacancyType,
	SkillType,
	SessionType,
	DashboardType,
	SessionNoteType,
	SessionRatingType,
	PasswordResetType,
	ResumeDropType,
	MetaType,
	EventType,
	AuditoriumType,
	SessionRequestType,
	LogType,
	FeedbackQsType,
	SupportSessionType,
	AvailabilityType,
	StudentListingType,
	GroupSessionType,
	GroupSessionJoinType,
	CfsType,
	EntityRemovedType,
	NotificationType,
	HallGalleryType,
	HallLobbyType,
	VacancySuggestionType,
	InterestedType,
	LocationType,
	SingleType,
	MultiType,
	RefType,
	VideoType,
	TagType,
	RefGeneral,
	IsSeenType,
	UserNoteType,
	GroupCallType,
	GroupCallUserType
	//, CFType
};