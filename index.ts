import postgres from "postgres";
import {
  createMilitaryIDsForEmployees,
  createOptionalForeignPassportsForEmployees,
  createPassportsForEmployees,
  createRandomEmployee,
  createSupplier,
} from "./helpers";
import type { Employee } from "./mdls";
import { fakerRU as faker } from "@faker-js/faker";
import { Pa, CR, Pricing } from "./models";
import type { week_days } from "./types";

const sql = postgres("postgresql://gen_user:{qz3Kq7rG}B*n!@194.87.226.194:5432/magnit");

const EXECUTE_ONLY_LAST_STEP = true;

const steps: (() => Promise<unknown>)[] = [];

steps.push(async () => {
  // -- insert employees
  const emps = faker.helpers.multiple(createRandomEmployee, { count: 100 });
  const result = await sql`
    insert into personnel_accounting.employees ${sql(emps)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  // -- insert passports for employees
  const resultEmps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;
  const passports = createPassportsForEmployees(resultEmps);
  const result = await sql`
    insert into passport ${sql(passports)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  // -- insert foreign passports for employees
  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;
  const passports = createOptionalForeignPassportsForEmployees(emps);
  const result = await sql`
    insert into personnel_accounting.foreign_passport ${sql(passports)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  // -- insert military ids for male employees
  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees e where e.gender = true
  `;
  const ids = createMilitaryIDsForEmployees(emps);
  const result = await sql`
    insert into personnel_accounting.military_id ${sql(ids)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  // -- insert suppliers
  const suppliers = faker.helpers.multiple(createSupplier, { count: 40 });
  const result = await sql`
  insert into personnel_accounting.suppliers ${sql(suppliers)}
`;
  console.log(result.count);
});

steps.push(async () => {
  // -- create accounts for employees
  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;

  type Entity = Pa.AccountInput;

  const entities: Entity[] = [];
  for (const emp of emps) {
    entities.push({
      employee_id: emp.employee_id,
      system_login: emp.email,
      system_password: faker.internet.password(),
    });
  }

  const result = await sql`
  insert into personnel_accounting.account ${sql(entities)}
`;
  console.log(result.count);
});

steps.push(async () => {
  // -- create absence_reasons_dictionary
  type Entity = Pa.AbsenceReasonsDictionaryInput;

  const entities: Entity[] = [
    {
      reason_name: "Отпуск",
      reason_description: "За свой счет",
    },
    {
      reason_name: "Отпуск",
      reason_description: "Ординарный",
    },
    {
      reason_name: "Болезнь",
      reason_description: "Отпуск в связи с больничным",
    },
    {
      reason_name: "Прогул",
      reason_description: "Прогул по неуважительной причине",
    },
    {
      reason_name: "Отгул",
      reason_description: "Отгул в связи с командировками и тд",
    },
  ];

  const result = await sql`
  insert into personnel_accounting.absence_reasons_dictionary ${sql(entities)}
`;
  console.log(result.count);
});

steps.push(async () => {
  // -- create employee_absence
  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;
  const reasons = await sql<Pa.AbsenceReasonsDictionary[]>`
    select * from personnel_accounting.absence_reasons_dictionary
  `;
  type Entity = Pa.EmployeeAbsenceInput;
  const entities: Entity[] = [];
  for (const emp of emps) {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      const r = faker.helpers.arrayElement(reasons);
      entities.push({
        employee_id: emp.employee_id,
        absence_duration: faker.number.int({ min: 10, max: 300, multipleOf: 15 }),
        additional_document_available: faker.datatype.boolean({ probability: 0.5 }),
        reason_id: r.reason_id,
        comment: `${r.reason_name} (${r.reason_description})`,
        start_date: faker.date.past({ years: 1 }),
      });
    }
  }

  const result = await sql`
  insert into personnel_accounting.employee_absence ${sql(entities)}
`;
  console.log(result.count);
});

steps.push(async () => {
  // -- create employee_schedule
  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;
  const weekDays: week_days[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",

    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  type Entity = Pa.EmployeeScheduleInput;
  const entities: Entity[] = [];
  for (const emp of emps) {
    const firstDayIdx = weekDays.indexOf(faker.helpers.arrayElement(weekDays));
    const attendance_days = weekDays.slice(firstDayIdx, firstDayIdx + 5);
    entities.push({
      employee_id: emp.employee_id,
      attendance_days,
      shift_start_time: "08:00",
      shift_end_time: "16:00",
    });
  }

  const result = await sql`
  insert into personnel_accounting.employee_schedule ${sql(entities)}
`;
  console.log(result.count);
});

steps.push(async () => {
  // -- create positions
  type Entity = Pa.PositionsInput;
  const entities: Entity[] = [];
  for (let i = 0; i < 10; ++i) {
    entities.push({
      position_name: faker.person.jobTitle(),
      salary: faker.number.int({ min: 20_000, max: 200_000, multipleOf: 500 }),
    });
  }

  const result = await sql`
  insert into personnel_accounting.positions ${sql(entities)}
`;
  console.log(result.count);
});

steps.push(async () => {
  type Entity = CR.CountriesInput;
  const createEntity = (): Entity => {
    return {
      id_country: Number(faker.location.countryCode("numeric")),
      country_name: faker.location.country(),
    };
  };

  const entities = faker.helpers.multiple(createEntity, { count: 20 });
  const result = await sql`
    insert into commodity_research.countries ${sql(entities)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  type Entity = CR.CategoriesOfGoodsInput;

  const categories = faker.helpers.uniqueArray(faker.commerce.department, 50);
  const entities: Entity[] = [];
  for (let i = 0; i < 20; ++i) {
    entities.push({
      category_name: categories[i],
      max_fluctuation_in_perc: faker.number.int({ min: 0, max: 1000 }) / 100,
    });
  }
  const result = await sql`
    insert into commodity_research.categories_of_goods ${sql(entities)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  type Entity = CR.CompanyHeadOfficesInput;

  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;

  const entities: Entity[] = [];
  for (let i = 0; i < 50; ++i) {
    const [emp] = emps.splice(faker.number.int({ min: 0, max: emps.length - 1 }), 1);
    entities.push({
      office_name: faker.company.name(),
      address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
      id_director: emp.employee_id,
    });
  }

  const result = await sql`
    insert into commodity_research.company_head_offices ${sql(entities)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  type Entity = CR.DistributionCentresInput;

  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;

  const entities: Entity[] = [];
  for (let i = 0; i < 50; ++i) {
    const [emp] = emps.splice(faker.number.int({ min: 0, max: emps.length - 1 }), 1);
    entities.push({
      id_centre_director: emp.employee_id,
      centre_address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
      centre_name: faker.company.name(),
      loader_amount: faker.number.int({ min: 2000, max: 10000 }),
      merchandiser_amount: faker.number.int({ min: 2000, max: 10000 }),
      refrigerator_amount: faker.number.int({ min: 2000, max: 10000 }),
      shelf_amount: faker.number.int({ min: 2000, max: 10000 }),
      storeman_amount: faker.number.int({ min: 2000, max: 10000 }),
      total_area: faker.number.int({ min: 200, max: 500 }),
      total_spaces: faker.number.int({ min: 2000, max: 10000 }),
    });
  }

  const result = await sql`
    insert into commodity_research.distribution_centres ${sql(entities)}
  `;
  console.log(result.count);
});

steps.push(async () => {
  type Entity = CR.StoresInput;

  const emps = await sql<Employee[]>`
    select * from personnel_accounting.employees
  `;

  const entities: Entity[] = [];
  for (let i = 0; i < 50; ++i) {
    const [emp] = emps.splice(faker.number.int({ min: 0, max: emps.length - 1 }), 1);
    entities.push({
      id_store_director: emp.employee_id,
      merchandiser_amount: faker.number.int({ min: 10, max: 20 }),
      seller_amount: faker.number.int({ min: 10, max: 20 }),
      store_address: `Россия, г. ${faker.location.city()}, ${faker.location.street()}, д. ${faker.location.buildingNumber()}`,
      store_name: faker.company.name(),
      storeman_amount: faker.number.int({ min: 10, max: 20 }),
    });
  }

  const result = await sql`
    insert into commodity_research.stores ${sql(entities)}
  `;
  console.log(result.count);
});

// Execution
if (EXECUTE_ONLY_LAST_STEP) {
  const step = steps[steps.length - 1];
  if (step) {
    await step();
  }
} else {
  for (const idx in steps) {
    const step = steps[idx];
    await step();
    console.log("step ", idx);
  }
}

console.log("done");

await sql.end();
process.exit(0);
