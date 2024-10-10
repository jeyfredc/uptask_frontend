import { ChangeEvent, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updatedStatus } from '@/api/TaskAPI';
import { Project,  TaskStatus } from '@/types/index';
import { toast } from 'react-toastify';
import { formatData } from '@/utils/utils';
import { statusTransalations } from "@/locales/es";


export default function TaskModalDetails() {

    const params = useParams()
    const projectId: Project['_id'] = params.projectId!
    const navigate = useNavigate()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!
    const show = taskId ? true : false
    
    const {data, isError, error}= useQuery({
        queryKey: ['task', taskId],
        queryFn: ()=> getTaskById({projectId, taskId}),
        enabled: !!taskId,
        retry: false
    })

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: updatedStatus,
        onError: (error)=>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ["editProject", { projectId }]})
            queryClient.invalidateQueries({queryKey: ["task", { taskId }]})

        }
    })

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>{
        const status = e.target.value as TaskStatus
        const data = {
        projectId,
        taskId,
        status
        }

        mutate(data)
        
    }
    
    if(isError) {
        toast.error(error.message, {toastId: 'error'})
        return <Navigate  to={`/projects/${projectId}`} />
    }

    if (data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10"  onClose={() => navigate(location.pathname, { replace: true })}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el: {formatData(data.createdAt)}</p>
                                    <p className='text-sm text-slate-400'>Última actualización: {formatData(data.updatedAt)}</p>
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.name}
                                    </DialogTitle>
                                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>
                                    <p className="text-2xl text-slate-500 mb-2">Historial de cambios</p>
                                    <ul className='list-decimal'>
                                    {data.completedBy.map((activityLog)=>(
                                        <li key={activityLog._id}>
                                            <span className='font-bold text-slate-600'>{statusTransalations[activityLog.status]}</span>
                                            {' '} por: {activityLog.user.name}
                                        </li>

                                    ))
                                    }

                                    </ul>
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual: 
                                        <select className='w-full p-3 bg-white border border-gray-300'
                                        defaultValue={data.status}
                                            onChange={handleChange}
                                        >
                                        {Object.entries(statusTransalations).map(([key,value])=>
                                            <option value={key} key={key}>{value}</option>
                                        )}
                                        </select>

                                        </label>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}