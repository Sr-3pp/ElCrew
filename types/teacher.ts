export type Teacher = {
  id: string;
  username: string;
  email: string;
  isTeacher: boolean;
  name: string | null;
  lastName: string | null;
  dob: string | null;
  contact: string | null;
};

export type TeacherPayload = {
  username: string;
  email: string;
  password?: string;
  name: string;
  lastName: string;
  dob: string;
  contact?: string;
};
