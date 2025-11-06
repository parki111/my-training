import { createTasks } from "./functions/create-tasks";
import { deleteTasks } from "./functions/delete-tasks";
import {
  cleanJwts,
  createUsers,
  deleteUsers,
  type AnyDummyFunction,
} from '@fhss-web-team/backend-utils';

export const dummyFunctions: AnyDummyFunction[] = [
  createUsers,
  deleteUsers,
  cleanJwts,
	deleteTasks,
	createTasks,
];
