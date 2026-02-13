import type { Stage } from "svelte-konva";

function createState() {
  let stage: Stage | undefined = $state(undefined);

  return {
    get stage(): Stage | undefined {
      return stage;
    },
    set stage(newStage: Stage) {
      stage = newStage;
    },
  };
}

export const konvaStageState = createState();
