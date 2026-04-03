export type Teacher = {
  id: string;
  username: string;
  email: string;
  isTeacher: boolean;
  name: string | null;
  lastName: string | null;
  dob: string | null;
  picture: string | null;
  quote: string | null;
  bio: string | null;
  favoriteTricks: string | null;
  areaOfFocus: string | null;
  contact: string | null;
};

export type TeacherPayload = {
  username: string;
  email: string;
  password?: string;
  name: string;
  lastName: string;
  dob: string;
  picture?: File | File[] | null;
  quote?: string;
  bio?: string;
  favoriteTricks?: string;
  areaOfFocus?: string;
  contact?: string;
};

export type TeacherContactFields = {
  whatsapp: string;
  instagram: string;
  tiktok: string;
};

export type TeacherFormState = Omit<TeacherPayload, 'contact' | 'favoriteTricks'> & TeacherContactFields & {
  picture: File | File[] | null;
  quote: string;
  bio: string;
  favoriteTricks: string[];
  areaOfFocus: string;
};
