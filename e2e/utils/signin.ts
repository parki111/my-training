import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ByuAccountType, Prisma, prisma } from '../../prisma/client';
import { Permission, Role } from '../../src/security';

export async function signInTestUser(
  page: Page,
  permissions: Permission[]
): Promise<string> {
  const dummyUser = generateDummyUserData({ permissions });
  const createdUser = await prisma.user.create({ data: dummyUser });

  await page.goto(`http://localhost:4200/proxy?net_id=${createdUser.netId}`);
  return createdUser.id;
}

type ByuAccount = {
  accountType: ByuAccountType;
  netId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  preferredFirstName: string;
  preferredLastName: string;
  byuId?: string;
  workerId?: string;
};

function generateDummyAccountData(accountType: ByuAccountType): ByuAccount {
  const base = {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    suffix: faker.person.suffix(),
    byuId:
      accountType === 'NonByu' ? undefined : faker.finance.accountNumber(9),
    accountType,
  };
  return {
    ...base,
    netId: `${base.firstName.toLowerCase()}${faker.number.int(100)}dummy`,
    preferredFirstName: base.firstName,
    preferredLastName: base.lastName,
    workerId: accountType === 'Employee' ? base.byuId : undefined,
  };
}

function getRandomAccountType() {
  const accountTypes = Object.values(ByuAccountType);
  return accountTypes[faker.number.int(accountTypes.length - 1)];
}

function generateDummyUserData(opts?: {
  accountType?: ByuAccountType;
  roles?: Role[];
  permissions?: Permission[];
}): Prisma.UserCreateInput {
  const acct = generateDummyAccountData(
    opts?.accountType ?? getRandomAccountType()
  );
  return {
    ...acct,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    lastLogin: faker.date.past(),
    roles: opts?.roles ?? [],
    permissions: opts?.permissions ?? [],
  };
}
