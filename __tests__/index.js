const flat2hier = require('../index')

describe('nest correctly', () => {
    it('should work', () => {
        const IN = [{
            $query_id: '13',
            $query_queryMetadata_id: '18',
            $query_queryMetadata_title: 'Title 1',
            $query_queryMetadata_sender_id: 's1',
            $query_queryMetadata_sender_name: 'debjyoti-in',
            $query_queryMetadata_sender_profileImageUrl: 'https://ppics.in/debjyoti-in-155x155.png',
            $query_queryMetadata_sender_phoneNo: '+91 xxxxxxxxxx',
            $query_queryMetadata_createdAt: 1502110354464,
            $query_queryMetadata_expiresAt: 1502110754464,
            $query_queryMetadata_lastChatAt: '13',
            $query_$threads_thread_id: '130',
            $query_$threads_$inboxItems_id: '120',
            $query_$threads_$inboxItems_isReply: false,
            $query_$threads_$inboxItems_createdAt: 1502110354464,
            $query_$threads_$inboxItems_deliveredAt: 1502110274464,
            $query_$threads_$inboxItems_delivered: true,
            $query_$threads_$inboxItems_readAt: -1,
            $query_$threads_$inboxItems_read: false,
            $query_$threads_$inboxItems_deletedAt: -1,
            $query_$threads_$inboxItems_chat_id: '8723',
            $query_$threads_$inboxItems_chat_form_id: '31',
            $query_$threads_$inboxItems_chat_declined: false,
            $query_$threads_$inboxItems_chat_$requestedFormOptions_id: '13',
            $query_$threads_$inboxItems_chat_message_id: '1332',
            $query_$threads_$inboxItems_chat_message_bodyJson: {}
        }]
        const expected = {
            "$query": [
                {
                    "id": "13",
                    "queryMetadata": {
                        "id": "18",
                        "title": "Title 1",
                        "sender": {
                            "id": "s1", "name": "debjyoti-in",
                            "profileImageUrl": "https://ppics.in/debjyoti-in-155x155.png", "phoneNo": "+91 xxxxxxxxxx"
                        },
                        "createdAt": 1502110354464, "expiresAt": 1502110754464, "lastChatAt": "13"
                    },
                    "$threads": [
                        {
                            "thread": { "id": "130" },
                            "$inboxItems": [
                                {
                                    "id": "120",
                                    "isReply": false,
                                    "createdAt": 1502110354464,
                                    "deliveredAt": 1502110274464,
                                    "delivered": true,
                                    "readAt": -1,
                                    "read": false,
                                    "deletedAt": -1,
                                    "chat": { "id": "8723", "form": { "id": "31" }, "declined": false, "$requestedFormOptions": [{ "id": "13" }], "message": { "id": "1332", "bodyJson": {} } }
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        // console.log(JSON.stringify(flat2hier(IN), null, 2))

        expect(flat2hier(IN)).toEqual(expected)
    })
})
