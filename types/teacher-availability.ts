export type TeacherAvailability = {
  id: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeacherAvailabilityPayload = {
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
};
