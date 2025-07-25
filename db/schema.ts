import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const requestStatusEnum = pgEnum('request_status', ['pending', 'approved', 'denied']);

export const user = pgTable("user", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
	image: text('image'),
	role: roleEnum('role').$defaultFn(() => 'user').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const session = pgTable("session", {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const services = pgTable("services", {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description').notNull(),
	priceStatus: text('price_status').notNull(), // "open" | "invite-only" | "by-request"
	joinLink: text('join_link'),
	enabled: boolean('enabled').$defaultFn(() => true).notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const serviceRequests = pgTable("service_requests", {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
	reason: text('reason'),
	status: requestStatusEnum('status').$defaultFn(() => 'pending').notNull(),
	adminNotes: text('admin_notes'),
	reviewedBy: text('reviewed_by').references(() => user.id),
	reviewedAt: timestamp('reviewed_at'),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const userServices = pgTable("user_services", {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
	grantedBy: text('granted_by').references(() => user.id),
	grantedAt: timestamp('granted_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});
