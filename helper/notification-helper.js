import axios from 'axios';
import { getCF } from '../app/redux/actions/auth-actions';
import * as hallAction from '../app/redux/actions/hall-actions';
import { emitHallActivity } from '../app/socket/socket-client';
import { getAxiosGraphQLQuery } from "./api-helper";
import obj2arg from "graphql-obj2arg";
import {
	AppConfig
} from '../config/app-config';

function sendSms(user_id, to_number, type, param = {}) {
	// @sms_notification_before_deploy
	// return;

	axios.post(AppConfig.Api + "/nexmo/send-sms", {
		user_id: user_id,
		to_number: to_number,
		type: type,
		param: param
	})
}


export function addNotification({
	user_id,
	param,
	type,
	user_role,
	img_entity,
	img_id,
	successHandler
}) {
	console.log("addNotification", user_id);
	console.log("addNotification", user_id);
	console.log("addNotification", param);
	console.log("addNotification", param);
	console.log("addNotification", param);

	if (typeof param !== "object") {
		param = {};
	}

	let p = {
		user_id: user_id,
		cf: getCF(),
		param: JSON.stringify(param),
		type: type,
	};

	if (img_entity) {
		p["img_entity"] = img_entity;
	}
	if (img_id) {
		p["img_id"] = img_id;
	}
	if (user_role) {
		p["user_role"] = user_role;
	}

	var query = `mutation{
	  add_notification(${obj2arg(p, { noOuterBraces: true })}){
		ID
	  }
	}`;

	getAxiosGraphQLQuery(query).then(res => {
		if (successHandler) {
			successHandler(res.data.data.add_notification);
		}
		if (user_id) {
			emitHallActivity(hallAction.ActivityType.NOTIFICATION_COUNT, user_id, null);
		}
	});
}


export function sendSmsByUserId(user_id, type, param = {}) {
	sendSms(user_id, null, type, param);
}

export function sendSmsByPhoneNumber(phone_number, type, param = {}) {
	sendSms(null, phone_number, type, param);
}
