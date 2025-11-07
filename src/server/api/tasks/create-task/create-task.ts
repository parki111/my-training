import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const createTaskInput = z.object({
  title: z.string(),
  description: z.string().optional(),
});

const createTaskOutput = z.object({
  id: z.string(),
});

export const createTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(createTaskInput)
  .output(createTaskOutput)
  .mutation(async opts => {
    return await prisma.task.create({
      data: {
        title: opts.input.title,
        description: opts.input.description,
        userId: opts.ctx.userId,
      },
    });
  });
