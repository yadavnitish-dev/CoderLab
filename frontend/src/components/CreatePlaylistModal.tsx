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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5">
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
              className="input input-bordered w-full bg-base-300/30 border-white/10 focus:border-primary/50 focus:bg-base-300/50 transition-all"
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
              className="textarea textarea-bordered h-28 bg-base-300/30 border-white/10 focus:border-primary/50 focus:bg-base-300/50 transition-all resize-none"
              placeholder="What kind of problems will this playlist contain?"
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-ghost flex-1 hover:bg-white/5 font-medium"
            >
              Cancel
            </button>
            <button 
                type="submit" 
                className="btn btn-primary flex-1 shadow-lg shadow-primary/20"
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