import { sql } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

type PersonFieldOptions = {
  required?: boolean;
  dobRequired?: boolean;
};

export const personFields = ({ required = true, dobRequired = false }: PersonFieldOptions = {}) => {
  const name = text('name');
  const lastName = text('last_name');
  const dob = text('dob');
  const picture = text('picture');

  return {
    name: required ? name.notNull() : name,
    lastName: required ? lastName.notNull() : lastName,
    dob: dobRequired ? dob.notNull() : dob,
    picture
  };
};

export const timestampFields = {
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`),
};
