import { prisma } from '../../db/prisma.ts';

export class historyService {

  async uniqueHistory(id: string,page:number,limit:number) {
    page = page ?? 1;
    limit = limit ?? 4;
    return await prisma.statusHistory.findMany({
      where:{
        ticketId: id
      },
      skip:(page - 1)*limit,
      take:limit
    });
  }
}
