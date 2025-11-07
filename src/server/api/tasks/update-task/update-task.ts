import { z } from 'zod/v4';
import { prisma, Status } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const updateTaskInput = z.object({
  id: z.string(),
  new_title: z.string().optional(),
  new_description: z.string().optional(),
  new_status: z.literal(Object.values(Status)).optional(),
});

const updateTaskOutput = z.void();

export const updateTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(updateTaskInput)
  .output(updateTaskOutput)
  .mutation(async opts => {
    try {
      const task = await prisma.task.findUniqueOrThrow({
        where: {
          id: opts.input.id,
          userId: opts.ctx.userId,
        },
      });

      let completedDate: Date | undefined | null;
      if (opts.input.new_status === 'Complete' && task.status !== 'Complete') {
        completedDate = new Date();
      } else if (
        opts.input.new_status !== 'Complete' &&
        task.status === 'Complete'
      ) {
        completedDate = null;
      }
      await prisma.task.update({
        where: {
          id: opts.input.id,
          userId: opts.ctx.userId,
        },
        data: {
          title: opts.input.new_title,
          description: opts.input.new_description,
          status: opts.input.new_status,
          completedDate,
        },
      });
    } catch (e) {
      rethrowKnownPrismaError(e);
      throw e;
    }
  });
