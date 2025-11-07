import {
  generateDummyUserData,
  rethrowKnownPrismaError,
} from '@fhss-web-team/backend-utils';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';

describe('Delete task', () => {
  let requestingUser: User;
  let deleteTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['deleteTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks'],
      }),
    });
    deleteTask = appRouter.createCaller({ userId: requestingUser.id }).tasks
      .deleteTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('deletes a task', async () => {
    const task = await prisma.task.create({
      data: {
        userId: requestingUser.id,
        title: 'task to be deleted',
      },
    });

    try {
      await deleteTask({ id: task.id });
    } catch (err) {
      rethrowKnownPrismaError(err);
      throw err;
    }
    expect(await prisma.task.findUnique({ where: { id: task.id } })).toBe(null);
  });

  it('throws an error if user does not own task', async () => {
    const user = await prisma.user.create({
      data:generateDummyUserData({
        permissions: ['manage-tasks'],
      })
    })
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: 'task to be deleted',
      },
    });
    let error
    try {
      await deleteTask({ id: task.id });
    } catch (err) {
      error=err
    }
    expect(error).toHaveProperty('code', 'BAD_REQUEST')
  });
});
