import axios from 'axios';
import { getCF } from '../app/redux/actions/auth-actions';
import { Domain } from '../config/app-config'
import {
	AppConfig
} from '../config/app-config';

function sendSms(user_id, to_number, type, param = {}) {
	// @sms_notification_before_deploy (remove line below)
	return;
	
	axios.post(AppConfig.Api + "/nexmo/send-sms", {
		user_id: user_id,
		to_number: to_number,
		type: type,
		param: param
	})
}

export function sendSmsByUserId(user_id, type, param = {}) {
	sendSms(user_id, null, type, param);
}

export function sendSmsByPhoneNumber(phone_number, type, param = {}) {
	sendSms(null, phone_number, type, param);
}
