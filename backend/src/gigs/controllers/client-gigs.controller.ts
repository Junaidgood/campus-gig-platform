import { Controller, Get, Param, Query } from '@nestjs/common';
import { GigsService } from '../gigs.service.js';
import { ClientQueryGigsDto } from '../dto/client/client-query-gigs.dto.js';

@Controller('gigs/client')
export class ClientGigsController {
  constructor(private readonly gigsService: GigsService) {}

  // 1. Clients and public users: View only APPROVED gigs -> GET /gigs/client/all
  @Get('all')
  async getAllGigsWithAction(@Query() query: ClientQueryGigsDto) {
    return this.gigsService.getAllApprovedGigs(query.search);
  }

  // Support GET /gigs/client as well
  @Get()
  async getAllGigs(@Query() query: ClientQueryGigsDto) {
    return this.gigsService.getAllApprovedGigs(query.search);
  }

  // 2. View specific gig details -> GET /gigs/client/:id
  @Get(':id')
  async getGigById(@Param('id') id: string) {
    return this.gigsService.getGigById(id);
  }
}
