import { cleanJwtBlacklist } from '@fhss-web-team/backend-utils';
import { CronJob } from 'cron';

export const cronJobs: CronJob[] = [cleanJwtBlacklist];
