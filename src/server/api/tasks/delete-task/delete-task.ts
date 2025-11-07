import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const deleteTaskInput = z.object({
  id: z.string(),
});

const deleteTaskOutput = z.void();

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async opts => {
    const task = await prisma.task.findUnique({
      where: {
        id: opts.input.id,
      },
    });
    if (task && task.userId === opts.ctx.userId) {
      await prisma.task.delete({
        where: {
          id: opts.input.id,
          userId: opts.ctx.userId
        },
      });
    } else {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  });
