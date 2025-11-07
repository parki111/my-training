import { generateDummyUserData } from '@fhss-web-team/backend-utils';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';

describe('Update task', () => {
  let requestingUser: User;
  let updateTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['updateTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks'],
      }),
    });
    updateTask = appRouter.createCaller({ userId: requestingUser.id }).tasks
      .updateTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('updates title, description, and status of task that the user owns', async () => {
    const old_task = await prisma.task.create({
      data: {
        title: 'Hey there delilah',
        description: "what's it like in New York City",
        userId: requestingUser.id,
      },
    });
    await updateTask({
      id: old_task.id,
      new_title: "I'm a thousand miles away",
      new_description: 'But girl tonight you look so pretty',
      new_status: 'Complete',
    });
    const updated_task = await prisma.task.findUnique({
      where: { id: old_task.id },
    });
    expect(updated_task?.title).toBe("I'm a thousand miles away");
    expect(updated_task?.description).toBe(
      'But girl tonight you look so pretty'
    );
    expect(updated_task?.status).toBe('Complete');

    await prisma.task.delete({ where: { id: old_task?.id } });
  });

  it("attempts to update a task that the user doesn't own", async () => {
    let error;
    try {
      const user = await prisma.user.create({
        data: generateDummyUserData({
          permissions: ['manage-tasks'],
        }),
      });
      const old_task = await prisma.task.create({
        data: {
          title: 'Hey there delilah',
          description: "what's it like in New York City",
          userId: user.id,
          status: 'Incomplete'
        },
      });

      await updateTask({
        id: old_task.id,
        new_title: "I'm a thousand miles away",
        new_description: 'But girl tonight you look so pretty',
        new_status: 'Complete',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toHaveProperty('code', 'NOT_FOUND');
  });

    it('updates title, description, and status of task that the user owns', async () => {
    const old_task = await prisma.task.create({
      data: {
        title: 'Hey there delilah',
        description: "what's it like in New York City",
        userId: requestingUser.id,
        status: 'Complete'
      },
    });
    await updateTask({
      id: old_task.id,
      new_description: 'But girl tonight you look so pretty',
      new_status: 'Incomplete',
    });
    const updated_task = await prisma.task.findUnique({
      where: { id: old_task.id },
    });
    expect(updated_task?.title).toBe('Hey there delilah');
    expect(updated_task?.description).toBe(
      'But girl tonight you look so pretty'
    );
    expect(updated_task?.status).toBe('Incomplete');
    expect(updated_task?.completedDate).toBe(null)

    await prisma.task.delete({ where: { id: old_task?.id } });
  });
});
