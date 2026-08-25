import type { AuthUser } from '../../types/auth.ts';
import {
  NotFoundError
} from '../../utils/errors.ts';
import { Commentsrepository } from './comments.repostiory.ts';



const repository = new Commentsrepository();

 class commentservices {
  async createComment(currentUser: AuthUser, input: any,id:string) {

    return repository.create({
      title: input.title,
      commentBody: input.commentBody,
      userId: currentUser.userId,
      ticketId: id
    });
  }

  async getCommentById(ticketId: string) {
    const comment = await repository.findById(ticketId);

    if (!comment) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    return comment;
  }

  
}

export const commentservice = new commentservices();