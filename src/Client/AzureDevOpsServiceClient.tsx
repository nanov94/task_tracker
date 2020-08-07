import axios from 'axios';
import { username, password } from '../Configuration/Configuration';
import { azureDevOpsHist } from '../Constants';
import { QueryWorkItemsDto } from './DTOs/QueryWorkItemsDto';
import { WorkItemDto } from './DTOs/WorkItemDto';

export async function getWorkTasks(organization: string, project: string): Promise<QueryWorkItemsDto> {
    const url = `${azureDevOpsHist}${organization}/${project}/_apis/wit/wiql?api-version=5.1`;
    const body = {
        query: "Select [System.Id], [System.WorkItemType], [System.Title], [System.State] From WorkItems"
    };

    const res = await axios.post(url, body, { auth: { username, password } });

    return res.data;
}

export async function getWorkItemsByID(organization: string, project: string, ids: number[]): Promise<WorkItemDto[]> {
    const url = `${azureDevOpsHist}${organization}/${project}/_apis/wit/workitems?ids=${ids.join()}&$expand=all&api-version=5.1`;

    const res = await axios.get(url, {
        auth: { username, password }
    });

    return res.data.value;
}

export async function removeWorkTaskByID(organization: string, project: string, id: number): Promise<boolean> {
    const url = `${azureDevOpsHist}${organization}/${project}/_apis/wit/workitems/${id}?api-version=5.1`;
    const res = await axios.delete(url, {
        auth: { username, password }
    });

    return res.status === 200;
}