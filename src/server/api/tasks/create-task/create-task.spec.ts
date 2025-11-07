import {
  generateDummyUserData,
  rethrowKnownPrismaError,
} from '@fhss-web-team/backend-utils';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';
import { throwError } from 'rxjs';

describe('Create task', () => {
  let requestingUser: User;
  let createTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['createTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks'],
      }),
    });
    createTask = appRouter.createCaller({ userId: requestingUser.id }).tasks
      .createTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('creates a task', async () => {
    let title = faker.company.buzzPhrase();
    let descript = faker.hacker.ingverb();
    let task;
    await prisma.task.deleteMany();
    try {
      task = await createTask({
        title,
        description: descript,
      });
      const num_tasks = await prisma.task.count();
      const database_task = await prisma.task.findUnique({
        where: {
          id: task.id,
        },
      });
      expect(num_tasks).toBe(1);
      expect(database_task);
    } catch (err) {
      rethrowKnownPrismaError(err);
      throw err;
    } finally {
      await prisma.task.deleteMany();
    }
  });
});
