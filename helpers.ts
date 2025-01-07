// const result = await sql`
//   insert into employees (last_name, first_name, middle_name, birth_date, department_id, role_id, work_phone, personal_phone, email, inn, snils, hire_date, medical_check_date) VALUES ()

import { fakerRU as faker } from "@faker-js/faker";
import type { Employee, ForeignPassport, MilitaryID, Passport, Supplier } from "./mdls";
import { addYears, startOfToday, startOfDay } from "date-fns";

export const createRandomEmployee = (): Employee => {
  const sex = faker.helpers.arrayElement(["female", "male"]);
  const last_name = faker.person.lastName(sex);
  const first_name = faker.person.firstName(sex);
  const middle_name = faker.person.middleName(sex);
  return {
    last_name,
    first_name,
    middle_name,
    birth_date: faker.date.birthdate(),
    department_id: null,
    role_id: null,
    work_phone: faker.phone.number({ style: "international" }),
    personal_phone: faker.phone.number({ style: "international" }),
    email: faker.internet.email({ firstName: first_name, lastName: last_name }),
    inn: Number(faker.string.numeric({ length: 12, allowLeadingZeros: false })),
    snils: Number(faker.string.numeric({ length: 11, allowLeadingZeros: false })),
    hire_date: faker.date.past({ years: 4 }),
    medical_check_date: faker.date.past({ years: 1 }),
    gender: sex === "male",
  };
};

export const createPassportsForEmployees = (emps: Employee[]): Passport[] => {
  const passports: Passport[] = [];
  for (const emp of emps) {
    if (emp.employee_id) {
      passports.push({
        employee_id: emp.employee_id,
        birth_date: emp.birth_date,
        department_code: Number(faker.string.numeric({ length: 6, allowLeadingZeros: false })),
        first_name: emp.first_name,
        last_name: emp.last_name,
        middle_name: emp.middle_name,
        gender: emp.gender,
        issue_date: startOfDay(faker.date.between({ from: addYears(emp.birth_date, 14), to: startOfToday() })),
        number: Number(faker.string.numeric({ length: 6, allowLeadingZeros: false })),
        series: Number(faker.string.numeric({ length: 4, allowLeadingZeros: false })),
        registration_address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
      });
    }
  }
  return passports;
};

export const createOptionalForeignPassportsForEmployees = (emps: Employee[]): ForeignPassport[] => {
  const passports: ForeignPassport[] = [];
  for (const emp of emps) {
    if (emp.employee_id && Math.random() > 0.7) {
      const issue_date = startOfDay(faker.date.between({ from: addYears(emp.birth_date, 14), to: startOfToday() }));
      passports.push({
        employee_id: emp.employee_id,
        birth_date: emp.birth_date,
        department_code: Number(faker.string.numeric({ length: 6, allowLeadingZeros: false })),
        first_name: emp.first_name,
        last_name: emp.last_name,
        middle_name: emp.middle_name,
        gender: emp.gender,
        issue_date,
        number: Number(faker.string.numeric({ length: 6, allowLeadingZeros: false })),
        citizenship: "Россия",
        expiry_date: addYears(issue_date, 10),
      });
    }
  }
  return passports;
};

export const createMilitaryIDsForEmployees = (emps: Employee[]): MilitaryID[] => {
  const ids: MilitaryID[] = [];
  for (const emp of emps) {
    if (emp.employee_id) {
      ids.push({
        military_id_number: Number(faker.string.numeric({ length: 7, allowLeadingZeros: false })),
        employee_id: emp.employee_id,
        category: faker.helpers.arrayElement(["A", "B", "C", "D", "E"]),
        commissariat_address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
        education: faker.helpers.arrayElement(["Шарага", "Университет", "Десткий сад", "Неначатое вышее"]),
        first_name: emp.first_name,
        last_name: emp.last_name,
        middle_name: emp.middle_name,
        place_of_birth: `Россия, г. ${faker.location.city()}`,
      });
    }
  }
  return ids;
};

export const createSupplier = (): Supplier => {
  const name = faker.company.name();
  return {
    email: faker.internet.email({ firstName: name }),
    actual_address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
    legal_address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
    manager_phone: faker.phone.number({ style: "international" }),
    mobile_phone: faker.phone.number({ style: "international" }),
    registration_id: faker.string.numeric({ length: 13, allowLeadingZeros: false }),
    supplier_name: name,
    taxpayer_id: faker.string.numeric({ length: 12, allowLeadingZeros: false }),
  };
};
