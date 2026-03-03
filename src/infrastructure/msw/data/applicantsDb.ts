import type {
  Applicant
} from "@/domain/applicants/applicant.model";

const d = (offset = 0) =>
  new Date(Date.now() - offset * 24 * 60 * 60 * 1000).toISOString();

const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 1,
    fullName: "Иванов Иван Иванович",
    phone: "+7 900 111-11-11",
    status: "new",
    createdAt: d(19),
  },
  {
    id: 2,
    fullName: "Петров Пётр Петрович",
    phone: "+7 900 222-22-22",
    status: "in_work",
    createdAt: d(18),
  },
  {
    id: 3,
    fullName: "Сидорова Анна Сергеевна",
    phone: "+7 900 333-33-33",
    status: "done",
    createdAt: d(17),
  },
  {
    id: 4,
    fullName: "Кузнецов Алексей Дмитриевич",
    phone: "+7 901 444-44-44",
    status: "new",
    createdAt: d(16),
  },
  {
    id: 5,
    fullName: "Новикова Мария Андреевна",
    phone: "+7 902 555-55-55",
    status: "in_work",
    createdAt: d(15),
  },
  {
    id: 6,
    fullName: "Морозов Дмитрий Олегович",
    phone: "+7 903 666-66-66",
    status: "done",
    createdAt: d(14),
  },
  {
    id: 7,
    fullName: "Волкова Елена Викторовна",
    phone: "+7 904 777-77-77",
    status: "new",
    createdAt: d(13),
  },
  {
    id: 8,
    fullName: "Соколов Николай Павлович",
    phone: "+7 905 888-88-88",
    status: "in_work",
    createdAt: d(12),
  },
  {
    id: 9,
    fullName: "Лебедева Ольга Ивановна",
    phone: "+7 906 999-99-99",
    status: "done",
    createdAt: d(11),
  },
  {
    id: 10,
    fullName: "Козлов Сергей Михайлович",
    phone: "+7 907 100-10-10",
    status: "new",
    createdAt: d(10),
  },
  {
    id: 11,
    fullName: "Попова Наталья Александровна",
    phone: "+7 908 200-20-20",
    status: "in_work",
    createdAt: d(9),
  },
  {
    id: 12,
    fullName: "Лазарев Андрей Юрьевич",
    phone: "+7 909 300-30-30",
    status: "done",
    createdAt: d(8),
  },
  {
    id: 13,
    fullName: "Захарова Светлана Геннадьевна",
    phone: "+7 910 400-40-40",
    status: "new",
    createdAt: d(7),
  },
  {
    id: 14,
    fullName: "Орлов Владимир Степанович",
    phone: "+7 911 500-50-50",
    status: "in_work",
    createdAt: d(6),
  },
  {
    id: 15,
    fullName: "Федотова Ирина Борисовна",
    phone: "+7 912 600-60-60",
    status: "done",
    createdAt: d(5),
  },
  {
    id: 16,
    fullName: "Никитин Евгений Романович",
    phone: "+7 913 700-70-70",
    status: "new",
    createdAt: d(4),
  },
  {
    id: 17,
    fullName: "Макарова Татьяна Вячеславовна",
    phone: "+7 914 800-80-80",
    status: "in_work",
    createdAt: d(3),
  },
  {
    id: 18,
    fullName: "Борисов Константин Игоревич",
    phone: "+7 915 900-90-90",
    status: "done",
    createdAt: d(2),
  },
  {
    id: 19,
    fullName: "Тихонова Валентина Петровна",
    phone: "+7 916 010-01-01",
    status: "new",
    createdAt: d(1),
  },
  {
    id: 20,
    fullName: "Громов Артём Дмитриевич",
    phone: "+7 917 020-02-02",
    status: "in_work",
    createdAt: d(0),
  },
];

let nextId = INITIAL_APPLICANTS.length + 1;

export const applicants: Applicant[] = [...INITIAL_APPLICANTS];

export const createApplicant = (
  data: Omit<Applicant, "id" | "createdAt">
): Applicant => {
  const applicant: Applicant = {
    ...data,
    id: nextId++,
    createdAt: new Date().toISOString(),
  };

  applicants.push(applicant);

  return applicant;
};

export const updateApplicant = (
  id: number,
  data: Partial<Omit<Applicant, "id" | "createdAt">>
): Applicant | null => {
  const index = applicants.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const current = applicants[index];
  if (!current) {
    return null;
  }

  const updated: Applicant = {
    ...current,
    ...data,
  };

  applicants[index] = updated;

  return updated;
};

export const deleteApplicant = (id: number): boolean => {
  const index = applicants.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  applicants.splice(index, 1);

  return true;
};
