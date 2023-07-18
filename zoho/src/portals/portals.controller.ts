import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PortalsService } from './portals.service';
import { JwtAuthGuard } from 'src/auths/guard/jwt.auth.guard';
import { CreateTimeLog } from './dto/create-timelog.dto';
import { CreateTaskTimeLog } from './dto/create-task-timelog.dto';

@Controller('portals')
@UseGuards(JwtAuthGuard)
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @Get('')
  async getPortals(@Req() req) {
    return this.portalsService.getPortals(req.user);
  }

  @Get('projects/all')
  async getAllProjects(@Req() req) {
    const portals: any = await this.portalsService.getPortals(req.user);
    let projectsResponse = [];
    if (!portals.portals) return projectsResponse;
    for (const portal of portals.portals) {
      const projects: any = await this.portalsService.getProjects(
        req.user,
        portal.id,
      );
      if (!projects.projects) continue;
      projects.projects.forEach((project) => {
        project.portal_id = portal.id_string;
      });
      projectsResponse = [...projectsResponse, ...projects.projects];
    }
    return projectsResponse;
  }

  @Get(':portalId/projects')
  async getProjects(@Req() req) {
    return this.portalsService.getProjects(req.user, req.params.portalId);
  }

  @Get(':portalId/projects/:projectId/tasks')
  async getTasks(@Req() req) {
    return this.portalsService.getTasks(
      req.user,
      req.params.portalId,
      req.params.projectId,
    );
  }

  @Post(':portalId/projects/:projectId/tasks')
  async addTaskTimeLog(@Req() req, @Body() tasks: CreateTaskTimeLog) {
    return this.portalsService.addTaskTimeLog(
      req.user,
      req.params.portalId,
      req.params.projectId,
      tasks,
    );
  }

  @Post(':portalId/projects/:projectId/tasks/:taskId/logs')
  async addTimeEntry(@Body() timeEntry: CreateTimeLog, @Req() req) {
    return this.portalsService.addTimeEntry(
      req.user,
      req.params.portalId,
      req.params.projectId,
      req.params.taskId,
      timeEntry,
    );
  }
}
