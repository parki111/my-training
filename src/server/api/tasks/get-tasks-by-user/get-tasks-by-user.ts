import { z } from 'zod/v4';
import { prisma, Status } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const getTasksByUserInput = z.object({
  pageSize: z.number(),
  pageOffset: z.number(),
});

const getTasksByUserOutput = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      title: z.string(),
      description: z.string().nullable(),
      completedDate: z.date().nullable(),
      userId: z.string(),
      status: z.literal(Object.values(Status)),
    })
  ),
  totalCount: z.number(),
});

export const getTasksByUser = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(getTasksByUserInput)
  .output(getTasksByUserOutput)
  .mutation(async opts => {
    const total = await prisma.task.count({
      where: { userId: opts.ctx.userId },
    });
    if (total<=opts.input.pageOffset && total !=0) {
      throw new TRPCError({
        message: 'It was too long',
        code:'BAD_REQUEST'
      })
    }
    const tasks = await prisma.task.findMany({
      where: { userId: opts.ctx.userId },
      orderBy: { createdAt: 'desc' },
      take: opts.input.pageSize,
      skip: opts.input.pageOffset,
    });
    return { data: tasks, totalCount: total };
  });
