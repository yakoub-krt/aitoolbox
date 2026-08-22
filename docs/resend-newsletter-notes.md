# Resend Newsletter Integration Notes

## Verified official requirements

Resend requires an API key and a sender address for email delivery. The send-email endpoint requires `from`, `to`, and `subject`; it accepts both HTML and plain-text content. The sender may include a friendly display name in the form `Name <email@example.com>`.

Resend requires a domain owned by the sender to be added and verified before live delivery. Its documentation recommends sending newsletters from a dedicated subdomain, such as `updates.example.com`, to isolate the reputation of newsletter delivery from other message types.

## Implementation decision

AIToolBox will retain subscription consent and status in its own database. When an administrator changes a new article from unpublished to published, the backend will enqueue/send a newsletter through Resend only after a verified API key and sender address have been supplied. The feature should never reveal whether an email is already stored to a public visitor.

For a newsletter to all subscribers, Resend Broadcasts are preferable to exposing a multi-recipient email list. A Broadcast requires a `segmentId`, a verified `from` sender, and a subject; it can include HTML and plain text. Setting `send` to `true` sends the Broadcast immediately. Contacts are created with an email and can be marked globally unsubscribed, which excludes them from Broadcasts.

Resend can create a dedicated segment with a name through `POST /segments`. A subscriber can then be associated with that segment by its email or contact ID; the association request requires the newsletter segment ID. AIToolBox will create this dedicated segment during initial setup and store its identifier as a protected server configuration value.

When a local subscriber revokes consent, AIToolBox will update the matching Resend contact using its email and set the contact as unsubscribed. Resend documents that globally unsubscribed contacts do not receive Broadcasts.

For AIToolBox, delivery will use separate, individually addressed emails batched through Resend. This preserves an individual unsubscribe URL for each recipient. Resend documents that the batch API supports up to 100 emails in one API call; the server will divide larger subscriber lists into groups of 100.

## Official references

- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/docs/api-reference/broadcasts/create-broadcast
- https://resend.com/docs/api-reference/contacts/create-contact
- https://resend.com/docs/api-reference/segments/create-segment
- https://resend.com/docs/api-reference/contacts/add-contact-to-segment
- https://resend.com/docs/api-reference/contacts/update-contact
- https://resend.com/docs/api-reference/emails/send-batch-emails
