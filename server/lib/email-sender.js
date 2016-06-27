'use strict';

var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var nodemailer = require('nodemailer');

class EmailSender {
    constructor(config) {
        this.config = config;
    }

    meetingCreated(meeting, organization) {
        var date = moment(meeting.date).format('lll');
        var requester = `${meeting.email} , ${meeting.phone}`;
        return this._sendEmail({
            to: organization.user,
            subject: `Запрос на ${date} от ${requester}  #${meeting._id}`,
            body:
            `Здравствуйте!
             
             Создан новый запрос на запись. Детали по ссылке: https://${this.config.hostName}/app/#/my-service/meetings/

             Запрос от: ${requester},
             Время: ${date},
             Услуга: ${meeting.service}
             Текст сообщения: 
             ${meeting.messages[0].text}


             С уважением,
             moreongo

             Это сообщение сгенерировано автоматически. Отвечать на него не нужно.
             `
        });
    }

    meetingChanged(meeting, organization) {
        var date = moment(meeting.date).format('lll');
        var status = {
            accepted: 'принята',
            rejected: 'отклонена',
            cancelled: 'отменена'
        };
        return this._sendEmail({
            to: meeting.email,
            subject: `Статус записи на услугу '${meeting.service}' ${date} #${meeting._id}`,
            body:
            `Здравствуйте!
            
            Ваша заявка ${status[meeting.status]}.
            История заявки: 
            ${_.map(meeting.messages, message => {
                return `${message.text}
                
                `;
            }).join('')}

            С уважением,
            moreongo

            Это сообщение сгенерировано автоматически. Отвечать на него не нужно.
            `
        });
    }

    _sendEmail(message) {
        var connection = {
            host: this.config.smtpHost,
            port: this.config.smtpPort,
            secure: true,
            auth: {
                user: this.config.emailAccount,
                pass: this.config.emailPassword
            }
        };

        var transporter = nodemailer.createTransport(connection);
        var mailOptions = {
            from: this.config.emailAccount,
            to: message.to,
            subject: message.subject,
            text: message.body
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
}

module.exports = EmailSender;