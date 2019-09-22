import DataLoader from 'dataloader'

import models from '../models'
import batchUsers from './user'

export const userLoader = new DataLoader((keys: string[]) => batchUsers(keys, models))
