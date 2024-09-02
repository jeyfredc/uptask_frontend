import { getTaskById } from "@/api/TaskAPI"
import { Project } from "@/types/index"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"


export default function EditTaskData() {
  const params = useParams()
  const projectId: Project['_id'] = params.projectId!
  
  const location = useLocation()
  /* Retona el path actual en el que se encuentra */
  const queryParams = new URLSearchParams(location.search)
  
  const taskId= queryParams.get('editTask')!
  const {data, isError} = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({projectId, taskId}),
    /* Evalua si una condición existe o no para hacer la consulta al backend */
    enabled: !!taskId
  })
  
  if(isError) return <Navigate to={'/404'}/>
  if(data) return <EditTaskModal data={data} taskId={taskId}/>
}
