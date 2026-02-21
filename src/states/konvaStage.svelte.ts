import type { Stage } from "svelte-konva";

export class KonvaStage {
  stage: Stage | undefined = $state(undefined);
}

export const konvaStageState = new KonvaStage();
