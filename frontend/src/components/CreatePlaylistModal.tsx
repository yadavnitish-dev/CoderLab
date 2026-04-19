import React from 'react'
import {useForm} from "react-hook-form";
import {X, ListMusic, Plus} from "lucide-react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({isOpen , onClose , onSubmit}) => {
    const {register , handleSubmit , formState:{errors} , reset} = useForm<{ name: string; description: string }>();

    const handleFormSubmit = async (data: { name: string; description: string })=>{
        await onSubmit(data);
        reset()
        onClose()
    }

    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-[#0d0d0d] border border-zinc-800 w-full max-w-md rounded-sm shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <ListMusic className="w-5 h-5 text-primary" />
            Create Playlist
          </h3>
          <button 
            onClick={onClose} 
            className="btn btn-ghost btn-sm btn-circle hover:bg-white/10 text-base-content/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          <div className="form-control">
            <label className="text-sm font-semibold text-base-content/70 mb-2 block uppercase tracking-wide">
              Playlist Name
            </label>
            <input
              type="text"
              className="w-full bg-black border border-zinc-800 rounded-sm px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
              placeholder="e.g. Dynamic Programming Patterns"
              {...register('name', { required: 'Playlist name is required' })}
            />
            {errors.name && (
              <span className="text-xs text-error mt-2 block font-medium">{errors.name.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="text-sm font-semibold text-base-content/70 mb-2 block uppercase tracking-wide">
              Description
            </label>
            <textarea
              className="w-full bg-black border border-zinc-800 rounded-sm px-4 py-2.5 text-sm text-white h-28 focus:outline-none focus:border-emerald-500/50 transition-all resize-none placeholder:text-zinc-700"
              placeholder="What kind of problems will this playlist contain?"
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-sm font-medium text-sm flex-1 transition-colors"
            >
              Cancel
            </button>
            <button 
                type="submit" 
                className="bg-white text-black px-6 py-2.5 rounded-sm font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 flex-1 shadow-lg shadow-white/5"
            >
              <Plus className="w-4 h-4" />
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlaylistModal