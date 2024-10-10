import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatData } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailProps = {
  note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth();

  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = params.projectId!;
  const taskId = queryParams.get("viewTask")!
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleDelete = () => {

    mutate({projectId, taskId, noteId:note._id});
  };
  if (isLoading) return "Cargando...";
  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p className="text-black">
          {note.content}
          <span className="font-bold text-xs"> por {note.createdBy.name} </span>
        </p>
        <p className="text-xs text-slate-500">{formatData(note.createdAt)}</p>
      </div>
      {canDelete && (
        <button
          type="button"
          className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transtion-colors"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
