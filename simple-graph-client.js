// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { Client } = require('@microsoft/microsoft-graph-client');

/**
 * This class is a wrapper for the Microsoft Graph API.
 * See: https://developer.microsoft.com/en-us/graph for more information.
 */
class SimpleGraphClient {
    constructor(token) {
        if (!token || !token.trim()) {
            throw new Error('SimpleGraphClient: Invalid token received.');
        }

        this._token = token;

        // Get an Authenticated Microsoft Graph client using the token issued to the user.
        this.graphClient = Client.init({
            authProvider: (done) => {
                done(null, this._token); // First parameter takes an error if you can't get an access token.
            }
        });
    }

    /**
     * Creates event on the calendar.
     * @param {string} toAddress Email address of the email's recipient.
     * @param {string} subject Subject of the email to be sent to the recipient.
     * @param {string} content Email message to be sent to the recipient.
     */
    async createEvent(toAddress, subject, content) {
        if (!toAddress || !toAddress.trim()) {
            throw new Error('SimpleGraphClient.createEvent(): Invalid `toAddress` parameter received.');
        }
        if (!subject || !subject.trim()) {
            throw new Error('SimpleGraphClient.createEvent(): Invalid `subject`  parameter received.');
        }
        if (!content || !content.trim()) {
            throw new Error('SimpleGraphClient.createEvent(): Invalid `content` parameter received.');
        }

        //Create the event.
        const newEvent = {
            subject: "Lunch",
            body: {
                contentType: "HTML",
                content: "I will be taking everyone to lunch as a reward for your hardwork."
            },
            start: {
                dateTime: "2019-01-21T20:00:00",
                timeZone: "UTC"
            },
            end: {
                dateTime: "2019-01-21T21:00:00",
                timeZone: "UTC"
            },
            location: {
                displayName: "Nando's Pizza"
            },
            attendees: [
                {
                    emailAddress: {
                        address: "jidoe@44321.onmicrosoft.com",
                        name: "Jim Doe"
                    },
                    type: "required"
                },
                {
                    emailAddress: {
                        address: "jdoe@44321.onmicrosoft.com",
                        name: "John Doe"
                    },
                    type: "required"
                },
                {
                    emailAddress: {
                        address: "jadoe@44321.onmicrosoft.com",
                        name: "Jane Doe"
                    },
                    type: "required"
                },
                {
                    emailAddress: {
                        address: "bthomas@44321.onmicrosoft.com",
                        name: "Bob Thomas"
                    },
                    type: "required"
                }
            ]
        }

        //// Create the email.
        //const mail = {
        //    body: {
        //        content: content, // `Hi there! I had this message sent from a bot. - Your friend, ${ graphData.displayName }!`,
        //        contentType: 'Text'
        //    },
        //    subject: subject, // `Message from a bot!`,
        //    toRecipients: [{
        //        emailAddress: {
        //            address: toAddress
        //        }
        //    }]
        //};

        //Send the event.
        return await this.graphClient
            .api(`/me/events`)
            .post(newEvent, (error, result) => {
                console.log("--- Successfully created an event on each user's calendar...")
                if (error) {
                    throw error;
                } else {
                    return result;
            }
     });
        

        //// Send the message.
        //return await this.graphClient
        //    .api('/me/sendMail')
        //    .post({ message: mail }, (error, res) => {
        //        if (error) {
        //            throw error;
        //        } else {
        //            return res;
        //        }
        //    });
    }

    /**
     * Gets recent mail the user has received within the last hour and displays up to 5 of the emails in the bot.
     */
    async getRecentMail() {
        return await this.graphClient
            .api('/me/messages')
            .version('beta')
            .top(5)
            .get().then((res) => {
                return res;
            });
    }

    /**
     * Collects information about the user in the bot.
     */
    async getMe() {
        return await this.graphClient
            .api('/me')
            .get().then((res) => {
                return res;
            });
    }

    /**
     * Collects the user's manager in the bot.
     */
    async getManager() {
        return await this.graphClient
            .api('/me/manager')
            .version('beta')
            .select('displayName')
            .get().then((res) => {
                return res;
            });
    }
}

exports.SimpleGraphClient = SimpleGraphClient;
