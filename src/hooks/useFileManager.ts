import useStageConfigStore from "@/stores/StageConfigStore"
import { useCallback } from "react"
import { gzip, ungzip } from "pako"
import { ProjectDataSchema, type ProjectData } from "@/types/projectData"

const useFileManager = () => {
  const stageConfigStore = useStageConfigStore()

  const saveProject = useCallback(async () => {
    const {backgroundColor, backgroundScale, backgroundTextureUrl, resolution} = stageConfigStore
    const data: ProjectData = {
      backgroundColor, backgroundScale, backgroundTextureUrl, resolution
    }
    const projectData = ProjectDataSchema.parse(data)
    try {
      const json = JSON.stringify(projectData, null, 2);
      const gzipped = gzip(json);

      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: "project.json.gz",
        types: [
          {
            description: "Gzipped JSON File",
            accept: { "application/gzip": [".gz"] }
          }
        ]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(new Blob([gzipped], { type: "application/gzip" }));
      await writable.close();
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("User cancelled save dialog.");
      } else {
        console.error("Error saving project:", err);
      }
    }
  }, [stageConfigStore])

  
  const loadProject = useCallback(async () => {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: "Gzipped JSON File",
            accept: { "application/gzip": [".gz"] }
          }
        ]
      });

      const file = await handle.getFile();
      const arrayBuffer = await file.arrayBuffer();

      const jsonText = new TextDecoder().decode(ungzip(new Uint8Array(arrayBuffer)));
      const data = JSON.parse(jsonText);
      const projectData = ProjectDataSchema.parse(data) 

      // set stage config
      const {setBackgroundColor, setBackgroundScale, setBackgroundTextureUrl, setResolution} = stageConfigStore
      setBackgroundColor(projectData.backgroundColor)
      setBackgroundScale(projectData.backgroundScale)
      if (projectData.backgroundTextureUrl) {
        setBackgroundTextureUrl(projectData.backgroundTextureUrl)
      }
      setResolution(projectData.resolution)

    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("User cancelled open dialog.");
        return null;
      }
      console.error("Error loading project:", err);
      return null;
    }
  }, []);

  return {
    saveProject,
    loadProject
  }
}

export default useFileManager