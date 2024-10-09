import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm, teamMembers } from "../types";


export async function findUserByEmail({ formData, projectId }: {projectId: Project['_id'], formData:TeamMemberForm}) {
    try {

        const { data } = await api.post(`/projects/${projectId}/team/find`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }

    }
}


export async function AddUserToProject({ projectId, id }: {projectId: Project['_id'], id:TeamMember['_id']}) {
    try {

        const { data } = await api.post(`/projects/${projectId}/team`, {id})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }

    }
}

export async function getProjectTeam(projectId: Project['_id']) {
    try {
        const { data } = await api.get(`/projects/${projectId}/team`)
        const response = teamMembers.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }

    }
}


export async function RemoveUserFromProject({ projectId, userId }: {projectId: Project['_id'], userId:TeamMember['_id']}) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectId}/team/${userId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }

    }
}