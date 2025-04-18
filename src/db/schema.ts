import { index, int, varchar, mysqlTableCreator } from "drizzle-orm/mysql-core";

const mySqlSchema = mysqlTableCreator((name) => `${name}_open-cdn`);

export const files = mySqlSchema(
	"files",
	{
		// file id
		id: int("id").autoincrement().primaryKey(),
		// file name
		file_name: varchar("file_name", { length: 255 }).notNull(),
		// file size in bytes
		byte_size: int("byte_size").notNull(),
		// file url
		remote_url: varchar("remote_url", { length: 255 }).notNull(),
		// file hash
		file_hash: varchar("hash", { length: 255 }).notNull(),
		// file mime type
		mime_type: varchar("mime_type", { length: 255 }).notNull(),
		// file extension
		file_extension: varchar("file_extension", { length: 255 }).notNull(),
		// file base64
		file_base64: varchar("file_base64", { length: 15000 }).notNull(),
		// file width
		file_width: int("file_width").notNull(),
		// file height
		file_height: int("file_height").notNull(),
		// file quality
		file_quality: int("file_quality").notNull(),
		// file created at
		createdAt: int("created_at").notNull(),
	},
	(table) => [
		index("id").on(table.id),
		index("file_name").on(table.file_name),
		index("file_hash").on(table.file_hash),
		index("remote_url").on(table.remote_url),
	]
);
