import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { getDataCenterUrl } from 'src/utils';
import { CreateTaskTimeLog } from './dto/create-task-timelog.dto';

@Injectable()
export class PortalsService {
  private readonly baseUrl = 'https://projectsapi.zoho.com.location/restapi';
  constructor(private readonly httpService: HttpService) {}

  async getTaskTimeLogs(
    user: any,
    portalId,
    projectId: string,
    taskId: string,
  ): Promise<AxiosResponse<any>> {
    try {
      const url = `${
        getDataCenterUrl(user.location).api
      }/portal/${portalId}/projects/${projectId}/tasks/${taskId}/logs/`;
      const headers = { Authorization: `Bearer ${user.accessToken}` };
      const response = await this.httpService.axiosRef.get(url, {
        headers,
      });
      return response.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async addTaskTimeLog(
    user: any,
    portalId,
    projectId: string,
    task: CreateTaskTimeLog,
  ): Promise<AxiosResponse<any>> {
    try {
      const url = `${
        getDataCenterUrl(user.location).api
      }/portal/${portalId}/projects/${projectId}/tasks/${
        task.name ? '?name=' + task.name : ''
      }`;
      const headers = { Authorization: `Bearer ${user.accessToken}` };
      const tasks: any = await this.httpService.axiosRef.post(
        url,
        {},
        {
          headers,
        },
      );
      if (tasks?.tasks?.length > 0) {
        let tasksId = tasks.tasks[0].id_string;
        const url = `${
          getDataCenterUrl(user.location).api
        }/portal/${portalId}/projects/${projectId}/tasks/${tasksId}/logs/`;
        const headers = { Authorization: `Bearer ${user.accessToken}` };
        const [year, month, day] = task.date.split('-');
        const formData = new FormData();
        formData.append('date', `${month}-${day}-${year}`);
        formData.append('bill_status', task.bill_status);
        formData.append('hours', task.hours || '00:00');
        formData.append('notes', task.notes || '');
        const response = await this.httpService.axiosRef.post(
          url,
          formData,
          {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      }

      return tasks.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }
  async addTimeEntry(
    user: any,
    portalId,
    projectId: string,
    taskId: string,
    timeEntry: any,
  ): Promise<AxiosResponse<any>> {
    try {
      const url = `${
        getDataCenterUrl(user.location).api
      }/portal/${portalId}/projects/${projectId}/tasks/${taskId}/logs/`;
      console.log(
        '🚀 ~ file: portals.service.ts:92 ~ PortalsService ~ url:',
        url,
      );
      const headers = { Authorization: `Bearer ${user.accessToken}` };
      const [year, month, day] = timeEntry.date.split('-');
      const formData = new FormData();
      formData.append('date', `${month}-${day}-${year}`);
      formData.append('bill_status', timeEntry.bill_status);
      formData.append('hours', timeEntry.hours || '00:00');
      formData.append('notes', timeEntry.notes || '');
      const response = await this.httpService.axiosRef.post(
        url,
        formData,
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }
  async getTasks(user: any, portalId, projectId: string): Promise<any> {
    try {
      const url = `${
        getDataCenterUrl(user.location).api
      }/portal/${portalId}/projects/${projectId}/tasks/`;
      const headers = { Authorization: `Bearer ${user.accessToken}` };
      console.log(
        '🚀 ~ file: portals.service.ts:71 ~ PortalsService ~ url:',
        url,
        headers,
      );
      const response = await this.httpService.axiosRef.get(url, {
        headers,
      });
      return response.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async getProjects(user: any, portalId: any): Promise<AxiosResponse<any>> {
    const url = `${
      getDataCenterUrl(user.location).api
    }/portal/${portalId}/projects/`;
    const headers = { Authorization: `Bearer ${user.accessToken}` };
    const response = await this.httpService.axiosRef.get(url, {
      headers,
    });
    return response.data;
  }

  async getPortals(user: any): Promise<AxiosResponse<any>> {
    const url = `${getDataCenterUrl(user.location).api}/portals/`;
    const headers = { Authorization: `Bearer ${user.accessToken}` };
    const response = await this.httpService.axiosRef.get(url, {
      headers,
    });
    return response.data;
  }
}
