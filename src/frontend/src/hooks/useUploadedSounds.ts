import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type UploadedSound,
  deleteUploadedSound,
  getUploadedSounds,
  saveUploadedSound,
  uploadAudioFile,
} from "../utils/audioUpload";

export function useUploadedSounds() {
  return useQuery<UploadedSound[]>({
    queryKey: ["uploadedSounds"],
    queryFn: getUploadedSounds,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useUploadAudioFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const sound = await uploadAudioFile(file);
      await saveUploadedSound(sound);
      return sound;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploadedSounds"] });
    },
  });
}

export function useDeleteUploadedSound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUploadedSound(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploadedSounds"] });
    },
  });
}
