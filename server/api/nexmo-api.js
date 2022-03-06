
const Nexmo = require('nexmo');
const { graphql } = require('../../helper/api-helper');
const notificationConfig = require('../../config/notification-config');
const { Domain, AppConfig } = require('../../config/app-config');
const {
  Secret
} = require("../secret/secret");
const axios = require('axios');
const { LogEnum } = require('../../config/db-config');
const isProd = (process.env.NODE_ENV === "production");

const twilio = require('twilio');



class NexmoAPI {
  generateText(type, param, finishHandler) {

    let url = this.loginUrl(param.cf);

    if (type == notificationConfig.Type.COMPANY_SCHEDULE_INTERVIEW) {
      this.loadCompanyName(param.company_id, (company_name) => {
        let text = `Congratulations! ${company_name} has scheduled an interview with you. To respond, please login at ${url}`
        finishHandler(text);
      })
    }
    if (type == notificationConfig.Type.COMPANY_START_CHAT) {
      this.loadCompanyName(param.company_id, (company_name) => {
        let text = `You have a new message from ${company_name}. To reply, please login at ${url}`;
        finishHandler(text);
      })
    }
    if (type == notificationConfig.Type.INTERVIEW_REMINDER) {
      /**
       { ID: '39',
          student_id: '136',
          company_id: '12',
          status: '2_Approved',
          special_type: 'New',
          appointment_time: '1602493918',
          is_expired: '0',
          is_onsite_call: '0',
          cf: "TEST",
          created_at: '2020-10-12 15:22:37',
          updated_at: '2020-10-12 15:59:05',
          updated_by: '137' }
      */
      this.loadCompanyName(param.company_id, (company_name) => {
        // let text = `Your interview with ${company_name} will start soon.`
        let text = `Your interview with ${company_name} is in 30 minutes. Please log in early at ${url} and click "Join Video Call" when prompted`
        finishHandler(text);
      })
    }
    if (type == notificationConfig.Type.INTERVIEW_REMINDER_1DAY) {
      this.loadCompanyName(param.company_id, (company_name) => {
        let text = `You have an interview with ${company_name} tomorrow. Please log in early at ${url} and click "Join Video Call" when prompted`
        finishHandler(text);
      })
    }
    if (type == notificationConfig.Type.INTERVIEW_PENDING_REMINDER_1DAY) {
      this.loadCompanyName(param.company_id, (company_name) => {
        let text = `You have a pending interview with ${company_name} tomorrow - ${param.appointment_time_str}. Please log in at ${url} to accept the interview`
        finishHandler(text);
      })
    }
    if (type == notificationConfig.Type.INTERVIEW_PENDING_REMINDER_2DAY) {
      this.loadCompanyName(param.company_id, (company_name) => {
        let text = `You have a pending interview with ${company_name} in 2 days - ${param.appointment_time_str}. Please log in at ${url} to accept the interview`
        finishHandler(text);
      })
    }
  }
  loadCompanyName(company_id, finishHandler) {
    graphql(`query { company(ID : ${company_id}) { name } } `).then((res) => {
      let company_name = res.data.data.company.name;
      finishHandler(company_name);
    });
  }
  sendSms(user_id, to_number, type, param, finishHandler) {

    console.log("SEND SMS")
    console.log("user_id", user_id)
    console.log("type", type)
    console.log("param", param)
    user_id = Number.parseInt(user_id);
  
    this.generateText(type, param, text => {
      if (to_number) {
        this.twilioSendSms(to_number, text, finishHandler, null);
      } else if (user_id) {

        graphql(`query{ user (ID:${user_id}) { phone_number } }`).then(res => {
          let phoneNumber = res.data.data.user.phone_number;
          console.log("phoneNumber", user_id, phoneNumber)
          this.twilioSendSms(phoneNumber, text, finishHandler, user_id);
        })
      }
    })

  }
  loginUrl(cf) {
    return `${Domain}/cf/auth/login/?cf=${cf}`;
  }
  // addLoginAtText(cf) {
  //   if (!cf) {
  //     return "";
  //   }
  //   var loginUrl = `${Domain}/cf/auth/login/?cf=${cf}`;
  //   return ` Login at ${loginUrl} for more details.`;
  // }
  twilioSendSms(phoneNumber, text, finishHandler, user_id = null) {
    phoneNumber = this.fixPhoneNumber(phoneNumber);
    if (phoneNumber) {
      console.log("twilioSendSms :: send message", "____", phoneNumber, "____", text)
      if (!isProd) {
        console.log("skip SEND SMS")
        finishHandler("skip SEND SMS");
        return;
      }

      var client = new twilio(Secret.TWILIO_SID, Secret.TWILIO_TOKEN);
      client.messages.create({
        body: text,
        to: phoneNumber,
        from: Secret.TWILIO_NO
      }).then((res) => {
        axios.post(AppConfig.Api + "/add-log", {
          event: LogEnum.EVENT_TWILIO_SMS,
          data: JSON.stringify({ from: from, to: phoneNumber, text: text }),
          user_id: user_id
        });
        console.log("done----")
        finishHandler("DONE");
      });
    } else {
      finishHandler("Phone number invalid");
    }
  }
  nexmoSendSms(phoneNumber, text, finishHandler, user_id = null) {
    const nexmo = new Nexmo({
      apiKey: Secret.NEXMO_API_KEY,
      apiSecret: Secret.NEXMO_API_SECRET,
    });
    const from = 'Seeds';
    phoneNumber = this.fixPhoneNumber(phoneNumber)
    if (phoneNumber) {
      console.log("nexmoSendSms send message", "____", phoneNumber, "____", text)
      if (!isProd) {
        console.log("skip SEND SMS")
        return;
      }
      
      nexmo.message.sendSms(from, phoneNumber, text);
      axios.post(AppConfig.Api + "/add-log", {
        event: LogEnum.EVENT_NEXMO_SMS,
        data: JSON.stringify({ from: from, to: phoneNumber, text: text }),
        user_id: user_id
      });
      finishHandler("DONE");
      console.log("done----")
    }
    finishHandler("Phone number invalid");
  }
  fixPhoneNumber(phoneNumber) {
    try {
      if(!phoneNumber){
        return null;
      }

      if(isNaN(Number.parseInt(phoneNumber))){
        return null;
      }

      if (phoneNumber[0] == "0") {
        phoneNumber = "6" + phoneNumber;
      }
      if (phoneNumber.indexOf("+") <= -1) {
        phoneNumber = "+" + phoneNumber;
      }
      return phoneNumber
    } catch (err) {
      return null;
    }
  }

}

NexmoAPI = new NexmoAPI();
module.exports = { NexmoAPI };
