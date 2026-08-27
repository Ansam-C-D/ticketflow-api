import { Role } from '@prisma/client';
import type { AuthUser } from '../../types/auth';
import type { CreateComment } from './comment.schemas';
import { CommentRepository } from './comment.repository';
import { AppError } from '../../utils/errors';

const repository = new CommentRepository();

export class CommentService {
  async createComment(currentUser: AuthUser, input: CreateComment) {
    if (currentUser.role === Role.USER) {
      console.log('Injecting authorId from', currentUser);
      const comment = await repository.create({
        ...input,
        ...{ authorId: currentUser.userId }
      });
      if (!comment)
        throw new AppError(500, 'DB Insert failed', 'Failed to add a comment');
    }
  }
}
