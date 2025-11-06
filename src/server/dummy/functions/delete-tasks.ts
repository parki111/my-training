import { dummy } from '@fhss-web-team/backend-utils';
import { prisma } from '../../../../prisma/client';

export const deleteTasks = dummy
  .name('Delete tasks')
  .description('Deletes all tasks, returns number deleted')
  .handler(async () => {
    const { count } = await prisma.task.deleteMany({});
    return `Deleted ${count} tasks`;
  });
