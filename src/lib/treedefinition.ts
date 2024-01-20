import type {
  RecursiveTreeView,
  RecursiveTreeViewItem,
} from "@skeletonlabs/skeleton";

export interface TreeViewNode {
  /** Nodes Unique ID */
  id: string;
  /** Main content. accepts HTML or svelte component. */
  content: string;
  /** Main content props. only used when the Content is a svelte component. */
  contentProps?: object;
  /** Lead content. accepts HTML or svelte component. */
  lead?: string;
  /** lead props. only used when the Lead is a svelte component. */
  leadProps?: object;
  /** children nodes. */
  children?: TreeViewNode[];
  /** Set the input's value. */
  value?: unknown;
}

export const nodesIn: TreeViewNode[] = [
  {
    id: "RecordService",
    content: "<h3>RecordService</h3>",
    value: "RecordService",
    children: [
      {
        id: "crud",
        content: "<h3>crud</h3>",
        value: "crud",
        children: [
          {
            id: "getList",
            content: `
                        <h3>getList</h3>
						// Returns a paginated records list.<br />
                        🔓 pb.collection(collectionIdOrName).getList(page = 1, perPage = 30, options = {});`,
            value: "getList",
          },
          {
            id: "getFullList",
            content: `
			<h3>getFullList</h3>
			// Returns a list with all records batch fetched at once
// (by default 200 items per request; to change it set the 'batch' param).<br />
🔓 pb.collection(collectionIdOrName).getFullList(options = {});`,
            value: "getFullList",
          },
          {
            id: "getFirstListItem",
            content: `<h3>getFirstListItem</h3>
			// Returns the first found record matching the specified filter.<br />
🔓 pb.collection(collectionIdOrName).getFirstListItem(filter, options = {});`,
            value: "getFirstListItem",
          },
          {
            id: "getOne",
            content: `<h3>getOne</h3>
			// Returns a single record by its id.<br />
🔓 pb.collection(collectionIdOrName).getOne(recordId, options = {});`,
            value: `getOne`,
          },
          {
            id: `create`,
            content: `<h3>create</h3>
			// Creates (aka. register) a new record.<br />
🔓 pb.collection(collectionIdOrName).create(bodyParams = {}, options = {});`,
            value: `create`,
          },
          {
            id: `update`,
            content: `<h3>update</h3>
			// Updates an existing record by its id.<br />
🔓 pb.collection(collectionIdOrName).update(recordId, bodyParams = {}, options = {});`,
            value: `update`,
          },
          {
            id: `delete`,
            content: `<h3>delete</h3>
			// Deletes a single record by its id.<br />
🔓 pb.collection(collectionIdOrName).delete(recordId, options = {});`,
            value: `delete`,
          },
        ],
      },
      {
        id: "Realtime handlers",
        content: "<h3>Realtime handlers</h3>",
        value: "Realtime handlers",
        children: [
          {
            id: `subscribe`,
            content: `<h3>subscribe</h3>
			// Subscribe to realtime changes to the specified topic ("*" or recordId).<br />
//<br />
// It is safe to subscribe multiple times to the same topic.<br />
//<br />
// You can use the returned UnsubscribeFunc to remove a single registered subscription.<br />
// If you want to remove all subscriptions related to the topic use unsubscribe(topic).<br />
🔓 pb.collection(collectionIdOrName).subscribe(topic, callback, options = {});`,
            value: `subscribe`,
          },
          {
            id: `unsubscribe`,
            content: `<h3>unsubscribe</h3>
			// Unsubscribe from all registered subscriptions to the specified topic ("*" or recordId).<br />
// If topic is not set, then it will remove all registered collection subscriptions.<br />
🔓 pb.collection(collectionIdOrName).unsubscribe([topic]);`,
            value: `unsubscribe`,
          },
        ],
      },
      {
        id: "Auth handlers",
        content: "<h3>Auth handlers</h3>",
        value: "Auth handlers",
        children: [
          {
            id: `listAuthMethods`,
            content: `<h3>listAuthMethods</h3>
			// Returns all available application auth methods.
🔓 pb.collection(collectionIdOrName).listAuthMethods(options = {});`,
            value: `listAuthMethods`,
          },
          {
            id: `authWithPassword`,
            content: `<h3>authWithPassword</h3>
			// Authenticates a record with their username/email and password.
🔓 pb.collection(collectionIdOrName).authWithPassword(usernameOrEmail, password, options = {});`,
            value: `authWithPassword`,
          },
          {
            id: `authWithOAuth2`,
            content: `<h3>authWithOAuth2</h3>
			/// Authenticates a record with OAuth2 provider without custom redirects, deeplinks or even page reload.
🔓 pb.collection(collectionIdOrName).authWithOAuth2(authConfig);`,
            value: `authWithOAuth2`,
          },
          {
            id: `authWithOAuth2Code`,
            content: `<h3>authWithOAuth2Code</h3>
			// Authenticates a record with OAuth2 code.
🔓 pb.collection(collectionIdOrName).authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData = {}, options = {});`,
            value: `authWithOAuth2Code`,
          },
          {
            id: `authRefresh`,
            content: `<h3>authRefresh</h3>
			// Refreshes the current authenticated record model and auth token.
🔐 pb.collection(collectionIdOrName).authRefresh(options = {});`,
            value: `authRefresh`,
          },
          {
            id: `requestPasswordReset`,
            content: `<h3>requestPasswordReset</h3>
			// Sends a user password reset email.
🔓 pb.collection(collectionIdOrName).requestPasswordReset(email, options = {});`,
            value: `requestPasswordReset`,
          },
          {
            id: `confirmPasswordReset`,
            content: `<h3>confirmPasswordReset</h3>
			// Confirms a record password reset request.
🔓 pb.collection(collectionIdOrName).confirmPasswordReset(resetToken, newPassword, newPasswordConfirm, options = {});`,
            value: `confirmPasswordReset`,
          },
          {
            id: `requestVerification`,
            content: `<h3>requestVerification</h3>
			// Sends a record verification email request.
🔓 pb.collection(collectionIdOrName).requestVerification(email, options = {});`,
            value: `requestVerification`,
          },
          {
            id: `confirmVerification`,
            content: `<h3>confirmVerification</h3>
			// Confirms a record email verification request.
🔓 pb.collection(collectionIdOrName).confirmVerification(verificationToken, options = {});`,
            value: `confirmVerification`,
          },
          {
            id: `requestEmailChange`,
            content: `<h3>requestEmailChange</h3>
			// Sends a record email change request to the provider email.
🔐 pb.collection(collectionIdOrName).requestEmailChange(newEmail, options = {});`,
            value: `requestEmailChange`,
          },
          {
            id: `confirmEmailChange`,
            content: `<h3>confirmEmailChange</h3>
			// Confirms record new email address.
🔓 pb.collection(collectionIdOrName).confirmEmailChange(emailChangeToken, userPassword, options = {});`,
            value: `confirmEmailChange`,
          },
          {
            id: `listExternalAuths`,
            content: `<h3>listExternalAuths</h3>
			// Lists all linked external auth providers for the specified record.
🔐 pb.collection(collectionIdOrName).listExternalAuths(recordId, options = {});`,
            value: `listExternalAuths`,
          },
          {
            id: `unlinkExternalAuth`,
            content: `<h3>unlinkExternalAuth</h3>
			// Unlinks a single external auth provider relation from the specified record.
🔐 pb.collection(collectionIdOrName).unlinkExternalAuth(recordId, provider, options = {});`,
            value: `unlinkExternalAuth`,
          },
        ],
      },
      {
        id: "AdminService",
        content: "<h3>Auth handlers</h3>",
        value: "Auth handlers",
        children: [
          {
            id: `authWithPassword`,
            content: `<h3>authWithPassword</h3>
			/// Authenticates an admin account by its email and password.
🔓 pb.admins.authWithPassword(email, password, options = {});`,
            value: `authWithPassword`,
          },
          {
            id: `requestPasswordReset`,
            content: `<h3>requestPasswordReset</h3>
			/ Refreshes the current admin authenticated model and token.
🔐 pb.admins.requestPasswordReset(options = {});`,
            value: `requestPasswordReset`,
          },
          {
            id: `confirmPasswordReset`,
            content: `<h3>authWithOAuth2</h3>
			/// Authenticates a record with OAuth2 provider without custom redirects, deeplinks or even page reload.
🔓 pb.collection(collectionIdOrName).authWithOAuth2(authConfig);`,
            value: `authWithOAuth2`,
          },
          {
            id: `authWithOAuth2Code`,
            content: `<h3>authWithOAuth2Code</h3>
			// Authenticates a record with OAuth2 code.
🔓 pb.collection(collectionIdOrName).authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData = {}, options = {});`,
            value: `authWithOAuth2Code`,
          },
          {
            id: `authRefresh`,
            content: `<h3>authRefresh</h3>
			// Refreshes the current authenticated record model and auth token.
🔐 pb.collection(collectionIdOrName).authRefresh(options = {});`,
            value: `authRefresh`,
          },
          {
            id: `requestPasswordReset`,
            content: `<h3>requestPasswordReset</h3>
			// Sends a user password reset email.
🔓 pb.collection(collectionIdOrName).requestPasswordReset(email, options = {});`,
            value: `requestPasswordReset`,
          },
          {
            id: `confirmPasswordReset`,
            content: `<h3>confirmPasswordReset</h3>
			// Confirms a record password reset request.
🔓 pb.collection(collectionIdOrName).confirmPasswordReset(resetToken, newPassword, newPasswordConfirm, options = {});`,
            value: `confirmPasswordReset`,
          },
          {
            id: `requestVerification`,
            content: `<h3>requestVerification</h3>
			// Sends a record verification email request.
🔓 pb.collection(collectionIdOrName).requestVerification(email, options = {});`,
            value: `requestVerification`,
          },
          {
            id: `confirmVerification`,
            content: `<h3>confirmVerification</h3>
			// Confirms a record email verification request.
🔓 pb.collection(collectionIdOrName).confirmVerification(verificationToken, options = {});`,
            value: `confirmVerification`,
          },
          {
            id: `requestEmailChange`,
            content: `<h3>requestEmailChange</h3>
			// Sends a record email change request to the provider email.
🔐 pb.collection(collectionIdOrName).requestEmailChange(newEmail, options = {});`,
            value: `requestEmailChange`,
          },
          {
            id: `confirmEmailChange`,
            content: `<h3>confirmEmailChange</h3>
			// Confirms record new email address.
🔓 pb.collection(collectionIdOrName).confirmEmailChange(emailChangeToken, userPassword, options = {});`,
            value: `confirmEmailChange`,
          },
          {
            id: `listExternalAuths`,
            content: `<h3>listExternalAuths</h3>
			// Lists all linked external auth providers for the specified record.
🔐 pb.collection(collectionIdOrName).listExternalAuths(recordId, options = {});`,
            value: `listExternalAuths`,
          },
          {
            id: `unlinkExternalAuth`,
            content: `<h3>unlinkExternalAuth</h3>
			// Unlinks a single external auth provider relation from the specified record.
🔐 pb.collection(collectionIdOrName).unlinkExternalAuth(recordId, provider, options = {});`,
            value: `unlinkExternalAuth`,
          },
          {
            id: `authWithPassword`,
            content: `<h3>authWithPassword</h3>
          // Authenticates an admin account by its email and password.
          🔓 pb.admins.authWithPassword(email, password, options = {});`,
            value: `authWithPassword`,
          },
          {
            id: `authRefresh`,
            content: `<h3>authRefresh</h3>
          // Refreshes the current admin authenticated model and token.
          🔐 pb.admins.authRefresh(options = {});`,
            value: `authRefresh`,
          },
          {
            id: `requestPasswordReset`,
            content: `<h3>requestPasswordReset</h3>
          // Sends an admin password reset email.
          🔓 pb.admins.requestPasswordReset(email, options = {});`,
            value: `requestPasswordReset`,
          },
          {
            id: `confirmPasswordReset`,
            content: `<h3>confirmPasswordReset</h3>
          // Confirms an admin password reset request.
          🔓 pb.admins.confirmPasswordReset(resetToken, newPassword, newPasswordConfirm, options = {});`,
            value: `confirmPasswordReset`,
          },
          {
            id: `getList`,
            content: `<h3>getList</h3>
          // Returns a paginated admins list.
          🔐 pb.admins.getList(page = 1, perPage = 30, options = {});`,
            value: `getList`,
          },
          {
            id: `getFullList`,
            content: `<h3>getFullList</h3>
          // Returns a list with all admins batch fetched at once
          // (by default 200 items per request; to change it set the \`batch\` query param).
          🔐 pb.admins.getFullList(options = {});`,
            value: `getFullList`,
          },
          {
            id: `getFirstListItem`,
            content: `<h3>getFirstListItem</h3>
          // Returns the first found admin matching the specified filter.
          🔐 pb.admins.getFirstListItem(filter, options = {});`,
            value: `getFirstListItem`,
          },
          {
            id: `getOne`,
            content: `<h3>getOne</h3>
          // Returns a single admin by their id.
          🔐 pb.admins.getOne(id, options = {});`,
            value: `getOne`,
          },
          {
            id: `create`,
            content: `<h3>create</h3>
          // Creates a new admin.
          🔐 pb.admins.create(bodyParams = {}, options = {});`,
            value: `create`,
          },
          {
            id: `update`,
            content: `<h3>update</h3>
          // Updates an existing admin by their id.
          🔐 pb.admins.update(id, bodyParams = {}, options = {});`,
            value: `update`,
          },
          {
            id: `delete`,
            content: `<h3>delete</h3>
          // Deletes a single admin by their id.
          🔐 pb.admins.delete(id, options = {});`,
            value: `delete`,
          },
        ],
      },
      {
        id: "CollectionService",
        content: "<h3>CollectionService</h3>",
        value: "CollectionService",
        children: [
          {
            id: `getList`,
            content: `<h3>getList</h3>
        // Returns a paginated collections list.
        🔐 pb.collections.getList(page = 1, perPage = 30, options = {});`,
            value: `getList`,
          },
          {
            id: `getFullList`,
            content: `<h3>getFullList</h3>
        // Returns a list with all collections batch fetched at once
        // (by default 200 items per request; to change it set the \`batch\` query param).
        🔐 pb.collections.getFullList(options = {});`,
            value: `getFullList`,
          },
          {
            id: `getFirstListItem`,
            content: `<h3>getFirstListItem</h3>
        // Returns the first found collection matching the specified filter.
        🔐 pb.collections.getFirstListItem(filter, options = {});`,
            value: `getFirstListItem`,
          },
          {
            id: `getOne`,
            content: `<h3>getOne</h3>
        // Returns a single collection by its id.
        🔐 pb.collections.getOne(id, options = {});`,
            value: `getOne`,
          },
          {
            id: `create`,
            content: `<h3>create</h3>
        // Creates (aka. register) a new collection.
        🔐 pb.collections.create(bodyParams = {}, options = {});`,
            value: `create`,
          },
          {
            id: `update`,
            content: `<h3>update</h3>
        // Updates an existing collection by its id.
        🔐 pb.collections.update(id, bodyParams = {}, options = {});`,
            value: `update`,
          },
          {
            id: `delete`,
            content: `<h3>delete</h3>
        // Deletes a single collection by its id.
        🔐 pb.collections.delete(id, options = {});`,
            value: `delete`,
          },
          {
            id: `import`,
            content: `<h3>import</h3>
        // Imports the provided collections.
        🔐 pb.collections.import(collections, deleteMissing = false, options = {});`,
            value: `import`,
          },
        ],
      },
      {
        id: "LogService",
        content: "<h3>LogService</h3>",
        value: "LogService",
        children: [
          {
            id: `getList`,
            content: `<h3>getList</h3>
        // Returns a paginated logs list.
        🔐 pb.logs.getList(page = 1, perPage = 30, options = {});`,
            value: `getList`,
          },
          {
            id: `getOne`,
            content: `<h3>getOne</h3>
        // Returns a single log by its id.
        🔐 pb.logs.getOne(id, options = {});`,
            value: `getOne`,
          },
          {
            id: `getStats`,
            content: `<h3>getStats</h3>
        // Returns logs statistics.
        🔐 pb.logs.getStats(options = {});`,
            value: `getStats`,
          },
        ],
      },
      {
        id: "SettingsService",
        content: "<h3>SettingsService</h3>",
        value: "SettingsService",
        children: [
          {
            id: `getAll`,
            content: `<h3>getAll</h3>
        // Returns a map with all available app settings.
        🔐 pb.settings.getAll(options = {});`,
            value: `getAll`,
          },
          {
            id: `update`,
            content: `<h3>update</h3>
        // Bulk updates app settings.
        🔐 pb.settings.update(bodyParams = {}, options = {});`,
            value: `update`,
          },
          {
            id: `testS3`,
            content: `<h3>testS3</h3>
        // Performs a S3 storage connection test.
        🔐 pb.settings.testS3(filesystem = "storage", options = {});`,
            value: `testS3`,
          },
          {
            id: `testEmail`,
            content: `<h3>testEmail</h3>
        // Sends a test email (verification, password-reset, email-change).
        🔐 pb.settings.testEmail(toEmail, template, options = {});`,
            value: `testEmail`,
          },
          {
            id: `generateAppleClientSecret`,
            content: `<h3>generateAppleClientSecret</h3>
        // Generates a new Apple OAuth2 client secret.
        🔐 pb.settings.generateAppleClientSecret(clientId, teamId, keyId, privateKey, duration, options = {} {});`,
            value: `generateAppleClientSecret`,
          },
        ],
      },
      {
        id: "RealtimeService",
        content: "<h3>RealtimeService</h3>",
        value: "RealtimeService",
        children: [
          {
            id: `subscribe`,
            content: `<h3>subscribe</h3>
        // Initialize the realtime connection (if not already) and register the subscription listener.
        //
        // You can subscribe to the \`PB_CONNECT\` event if you want to listen to the realtime connection connect/reconnect events.
        🔓 pb.realtime.subscribe(topic, callback, options = {});`,
            value: `subscribe`,
          },
          {
            id: `unsubscribe`,
            content: `<h3>unsubscribe</h3>
        // Unsubscribe from all subscription listeners with the specified topic.
        🔓 pb.realtime.unsubscribe(topic?);`,
            value: `unsubscribe`,
          },
          {
            id: `unsubscribeByPrefix`,
            content: `<h3>unsubscribeByPrefix</h3>
        // Unsubscribe from all subscription listeners starting with the specified topic prefix.
        🔓 pb.realtime.unsubscribeByPrefix(topicPrefix);`,
            value: `unsubscribeByPrefix`,
          },
          {
            id: `unsubscribeByTopicAndListener`,
            content: `<h3>unsubscribeByTopicAndListener</h3>
        // Unsubscribe from all subscriptions matching the specified topic and listener function.
        🔓 pb.realtime.unsubscribeByTopicAndListener(topic, callback);`,
            value: `unsubscribeByTopicAndListener`,
          },
        ],
      },
      {
        id: "BackupService",
        content: "<h3>BackupService</h3>",
        value: "BackupService",
        children: [
          {
            id: `getFullList`,
            content: `<h3>getFullList</h3>
        // Returns list with all available backup files.
        🔐 pb.backups.getFullList(options = {});`,
            value: `getFullList`,
          },
          {
            id: `create`,
            content: `<h3>create</h3>
        // Initializes a new backup.
        🔐 pb.backups.create(basename = "", options = {});`,
            value: `create`,
          },
          {
            id: `upload`,
            content: `<h3>upload</h3>
        // Upload an existing app data backup.
        🔐 pb.backups.upload({ file: File/Blob }, options = {});`,
            value: `upload`,
          },
          {
            id: `delete`,
            content: `<h3>delete</h3>
        // Deletes a single backup by its name.
        🔐 pb.backups.delete(key, options = {});`,
            value: `delete`,
          },
          {
            id: `restore`,
            content: `<h3>restore</h3>
        // Initializes an app data restore from an existing backup.
        🔐 pb.backups.restore(key, options = {});`,
            value: `restore`,
          },
          {
            id: `getDownloadUrl`,
            content: `<h3>getDownloadUrl</h3>
        // Builds a download url for a single existing backup using an
        // admin file token and the backup file key.
        🔐 pb.backups.getDownloadUrl(token, key);`,
            value: `getDownloadUrl`,
          },
        ],
      },
      {
        id: "HealthService",
        content: "<h3>HealthService</h3>",
        value: "HealthService",
        children: [
          {
            id: `check`,
            content: `<h3>check</h3>
        // Checks the health status of the api.
        🔓 pb.health.check(options = {});`,
            value: `check`,
          },
        ],
      },
      {
        id: "FileService",
        content: "<h3>FileService</h3>",
        value: "FileService",
        children: [
          {
            id: `getUrl`,
            content: `<h3>getUrl</h3>
        // Builds and returns an absolute record file url for the provided filename.
        🔓 pb.files.getUrl(record, filename, options = {});`,
            value: `getUrl`,
          },
          {
            id: `getToken`,
            content: `<h3>getToken</h3>
        // Requests a new private file access token for the current auth model (admin or record).
        🔐 pb.files.getToken(options = {});`,
            value: `getToken`,
          },
        ],
      },
    ],
  },
];
