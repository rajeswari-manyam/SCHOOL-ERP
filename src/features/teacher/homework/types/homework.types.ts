export interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  createdAt: string;
}

export interface CreateHomeworkInput {
  title: string;
  description: string;
  dueDate: string;
  className: string;
}

export interface UpdateHomeworkInput extends Partial<CreateHomeworkInput> {}
